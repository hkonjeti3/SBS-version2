import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface SecurityEvent {
  type: 'login_attempt' | 'failed_login' | 'suspicious_activity' | 'session_timeout' | 'unauthorized_access' | 'password_change' | 'profile_update';
  timestamp: Date;
  userId?: number;
  username?: string;
  ipAddress?: string;
  userAgent?: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityViolation {
  type: string;
  description: string;
  timestamp: Date;
  userId?: number;
  ipAddress?: string;
  action: 'warn' | 'block' | 'lockout' | 'alert';
}

@Injectable({
  providedIn: 'root'
})
export class SecurityAuditService {

  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  private readonly SUSPICIOUS_PATTERNS = [
    // Only flag obvious attack patterns, not common words
    /(\b(admin|root|system)\b)/i,
    /(123456789|qwertyuiop|asdfghjkl)/i,
    /(password123|admin123)/i
  ];

  private loginAttempts = new Map<string, { count: number; lastAttempt: Date; lockedUntil?: Date }>();
  private securityEvents: SecurityEvent[] = [];
  private violations: SecurityViolation[] = [];

  constructor(private router: Router) {
    this.loadStoredData();
  }

  /**
   * Records a login attempt
   */
  public recordLoginAttempt(username: string, success: boolean, ipAddress?: string): void {
    const key = `${username}_${ipAddress || 'unknown'}`;
    const now = new Date();
    
    if (!this.loginAttempts.has(key)) {
      this.loginAttempts.set(key, { count: 0, lastAttempt: now });
    }
    
    const attempt = this.loginAttempts.get(key)!;
    
    if (success) {
      // Reset on successful login
      this.loginAttempts.delete(key);
      this.recordSecurityEvent({
        type: 'login_attempt',
        timestamp: now,
        username,
        ipAddress,
        details: 'Successful login',
        severity: 'low'
      });
    } else {
      // Increment failed attempts
      attempt.count++;
      attempt.lastAttempt = now;
      
      this.recordSecurityEvent({
        type: 'failed_login',
        timestamp: now,
        username,
        ipAddress,
        details: `Failed login attempt ${attempt.count}`,
        severity: attempt.count >= 3 ? 'high' : 'medium'
      });
      
      // Check for lockout
      if (attempt.count >= this.MAX_LOGIN_ATTEMPTS) {
        this.handleAccountLockout(username, ipAddress);
      }
    }
    
    this.saveStoredData();
  }

  /**
   * Records suspicious activity
   */
  public recordSuspiciousActivity(activity: string, userId?: number, username?: string, ipAddress?: string): void {
    this.recordSecurityEvent({
      type: 'suspicious_activity',
      timestamp: new Date(),
      userId,
      username,
      ipAddress,
      details: activity,
      severity: 'high'
    });
    
    // Check if activity should trigger additional security measures
    if (this.isHighRiskActivity(activity)) {
      this.triggerSecurityAlert(activity, userId, username, ipAddress);
    }
  }

  /**
   * Records unauthorized access attempt
   */
  public recordUnauthorizedAccess(resource: string, userId?: number, username?: string, ipAddress?: string): void {
    this.recordSecurityEvent({
      type: 'unauthorized_access',
      timestamp: new Date(),
      userId,
      username,
      ipAddress,
      details: `Unauthorized access attempt to ${resource}`,
      severity: 'high'
    });
    
    this.recordViolation({
      type: 'unauthorized_access',
      description: `Attempted to access ${resource} without proper authorization`,
      timestamp: new Date(),
      userId,
      ipAddress,
      action: 'alert'
    });
  }

  /**
   * Records password change
   */
  public recordPasswordChange(userId: number, username: string, ipAddress?: string): void {
    this.recordSecurityEvent({
      type: 'password_change',
      timestamp: new Date(),
      userId,
      username,
      ipAddress,
      details: 'Password changed successfully',
      severity: 'medium'
    });
  }

  /**
   * Records profile update
   */
  public recordProfileUpdate(userId: number, username: string, changes: string[], ipAddress?: string): void {
    this.recordSecurityEvent({
      type: 'profile_update',
      timestamp: new Date(),
      userId,
      username,
      ipAddress,
      details: `Profile updated: ${changes.join(', ')}`,
      severity: 'low'
    });
  }

  /**
   * Checks if user is locked out
   */
  public isUserLockedOut(username: string, ipAddress?: string): boolean {
    const key = `${username}_${ipAddress || 'unknown'}`;
    const attempt = this.loginAttempts.get(key);
    
    if (!attempt) return false;
    
    if (attempt.lockedUntil && attempt.lockedUntil > new Date()) {
      return true;
    }
    
    // Clear lockout if expired
    if (attempt.lockedUntil && attempt.lockedUntil <= new Date()) {
      this.loginAttempts.delete(key);
      this.saveStoredData();
      return false;
    }
    
    return false;
  }

  /**
   * Validates input for suspicious patterns
   */
  public validateInput(input: string): { isValid: boolean; reason?: string } {
    // Skip validation for empty or null input
    if (!input || input.trim() === '') {
      return { isValid: true };
    }
    
    // Check for suspicious patterns (only obvious attack patterns)
    for (const pattern of this.SUSPICIOUS_PATTERNS) {
      if (pattern.test(input)) {
        return {
          isValid: false,
          reason: 'Input contains suspicious patterns'
        };
      }
    }
    
    // Check for SQL injection patterns (only obvious ones)
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(--|\/\*|\*\/|;)/,
      /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i
    ];
    
    for (const pattern of sqlPatterns) {
      if (pattern.test(input)) {
        this.recordSuspiciousActivity(`Potential SQL injection attempt: ${input}`);
        return {
          isValid: false,
          reason: 'Input contains invalid characters'
        };
      }
    }
    
    // Check for XSS patterns (only obvious ones)
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
    ];
    
    for (const pattern of xssPatterns) {
      if (pattern.test(input)) {
        this.recordSuspiciousActivity(`Potential XSS attempt: ${input}`);
        return {
          isValid: false,
          reason: 'Input contains invalid characters'
        };
      }
    }
    
    return { isValid: true };
  }

  /**
   * Gets security events for monitoring
   */
  public getSecurityEvents(limit: number = 100): SecurityEvent[] {
    return this.securityEvents
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Gets security violations
   */
  public getSecurityViolations(limit: number = 50): SecurityViolation[] {
    return this.violations
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Records a security event
   */
  private recordSecurityEvent(event: SecurityEvent): void {
    this.securityEvents.push(event);
    
    // Keep only last 1000 events
    if (this.securityEvents.length > 1000) {
      this.securityEvents = this.securityEvents.slice(-1000);
    }
    
    // Log to console in development
    if (!environment.production) {
      console.log('Security Event:', event);
    }
    
    // In production, send to secure logging service
    if (environment.production && environment.logging?.enableRemoteLogging) {
      this.sendToLoggingService(event);
    }
  }

  /**
   * Records a security violation
   */
  private recordViolation(violation: SecurityViolation): void {
    this.violations.push(violation);
    
    // Keep only last 500 violations
    if (this.violations.length > 500) {
      this.violations = this.violations.slice(-500);
    }
    
    // Handle violation based on action
    switch (violation.action) {
      case 'warn':
        this.handleWarning(violation);
        break;
      case 'block':
        this.handleBlock(violation);
        break;
      case 'lockout':
        this.handleLockout(violation);
        break;
      case 'alert':
        this.handleAlert(violation);
        break;
    }
  }

  /**
   * Handles account lockout
   */
  private handleAccountLockout(username: string, ipAddress?: string): void {
    const key = `${username}_${ipAddress || 'unknown'}`;
    const attempt = this.loginAttempts.get(key)!;
    
    attempt.lockedUntil = new Date(Date.now() + this.LOCKOUT_DURATION);
    
    this.recordViolation({
      type: 'account_lockout',
      description: `Account locked due to ${attempt.count} failed login attempts`,
      timestamp: new Date(),
      ipAddress,
      action: 'lockout'
    });
    
    this.saveStoredData();
  }

  /**
   * Checks if activity is high risk
   */
  private isHighRiskActivity(activity: string): boolean {
    const highRiskKeywords = [
      'admin', 'root', 'password', 'sql', 'injection', 'xss', 'script',
      'eval', 'exec', 'system', 'shell', 'command', 'privilege'
    ];
    
    return highRiskKeywords.some(keyword => 
      activity.toLowerCase().includes(keyword)
    );
  }

  /**
   * Triggers security alert
   */
  private triggerSecurityAlert(activity: string, userId?: number, username?: string, ipAddress?: string): void {
    // In production, this would trigger real-time alerts
    console.warn('SECURITY ALERT:', {
      activity,
      userId,
      username,
      ipAddress,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Handles warning action
   */
  private handleWarning(violation: SecurityViolation): void {
    // Log warning
    console.warn('Security Warning:', violation);
  }

  /**
   * Handles block action
   */
  private handleBlock(violation: SecurityViolation): void {
    // Block user access
    console.error('Security Block:', violation);
    // In production, this would block the user's access
  }

  /**
   * Handles lockout action
   */
  private handleLockout(violation: SecurityViolation): void {
    // Lock out user
    console.error('Security Lockout:', violation);
    // In production, this would lock the user's account
  }

  /**
   * Handles alert action
   */
  private handleAlert(violation: SecurityViolation): void {
    // Send alert to security team
    console.error('Security Alert:', violation);
    // In production, this would send real-time alerts
  }

  /**
   * Sends event to logging service
   */
  private sendToLoggingService(event: SecurityEvent): void {
    // In production, implement secure logging service integration
    // For now, just log to console
    console.log('Sending to logging service:', event);
  }

  /**
   * Loads stored data
   */
  private loadStoredData(): void {
    try {
      const storedAttempts = sessionStorage.getItem('security_login_attempts');
      if (storedAttempts) {
        const parsed = JSON.parse(storedAttempts);
        this.loginAttempts = new Map(Object.entries(parsed).map(([key, value]: [string, any]) => [
          key,
          { ...value, lastAttempt: new Date(value.lastAttempt), lockedUntil: value.lockedUntil ? new Date(value.lockedUntil) : undefined }
        ]));
      }
    } catch (error) {
      console.error('Error loading security data:', error);
    }
  }

  /**
   * Saves stored data
   */
  private saveStoredData(): void {
    try {
      const attemptsObj = Object.fromEntries(this.loginAttempts);
      sessionStorage.setItem('security_login_attempts', JSON.stringify(attemptsObj));
    } catch (error) {
      console.error('Error saving security data:', error);
    }
  }
} 