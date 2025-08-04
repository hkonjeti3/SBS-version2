import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { decodeToken } from '../utils/jwt-helper';

export interface SessionInfo {
  isActive: boolean;
  lastActivity: Date;
  expiresAt: Date;
  userId: number | null;
  username: string | null;
  role: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class SessionManagerService {

  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout
  private readonly TOKEN_KEY = 'jwtToken';
  private readonly SESSION_KEY = 'sessionInfo';

  private sessionInfo$ = new BehaviorSubject<SessionInfo>(this.getDefaultSessionInfo());
  private sessionTimer: any;
  private warningTimer: any;
  private activityTimer: any;

  constructor(private router: Router) {
    this.initializeSession();
    this.setupActivityListeners();
  }

  /**
   * Gets current session information
   */
  public getSessionInfo(): Observable<SessionInfo> {
    return this.sessionInfo$.asObservable();
  }

  /**
   * Gets current session info synchronously
   */
  public getCurrentSessionInfo(): SessionInfo {
    return this.sessionInfo$.value;
  }

  /**
   * Initializes session from stored token
   */
  private initializeSession(): void {
    const token = this.getStoredToken();
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && this.isTokenValid(decodedToken)) {
        this.startSession(decodedToken);
      } else {
        this.clearSession();
      }
    }
  }

  /**
   * Starts a new session
   */
  public startSession(decodedToken: any): void {
    const sessionInfo: SessionInfo = {
      isActive: true,
      lastActivity: new Date(),
      expiresAt: new Date(decodedToken.exp * 1000),
      userId: decodedToken.userId,
      username: decodedToken.username,
      role: decodedToken.role
    };

    this.sessionInfo$.next(sessionInfo);
    this.storeSessionInfo(sessionInfo);
    this.startSessionTimers();
  }

  /**
   * Updates session activity
   */
  public updateActivity(): void {
    const currentSession = this.sessionInfo$.value;
    if (currentSession.isActive) {
      const updatedSession: SessionInfo = {
        ...currentSession,
        lastActivity: new Date()
      };
      
      this.sessionInfo$.next(updatedSession);
      this.storeSessionInfo(updatedSession);
      this.resetSessionTimers();
    }
  }

  /**
   * Logs out user and clears session
   */
  public logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  /**
   * Extends session (called when user is active)
   */
  public extendSession(): void {
    const currentSession = this.sessionInfo$.value;
    if (currentSession.isActive) {
      const newExpiry = new Date(Date.now() + this.SESSION_TIMEOUT);
      const updatedSession: SessionInfo = {
        ...currentSession,
        expiresAt: newExpiry,
        lastActivity: new Date()
      };
      
      this.sessionInfo$.next(updatedSession);
      this.storeSessionInfo(updatedSession);
      this.resetSessionTimers();
    }
  }

  /**
   * Checks if session is valid
   */
  public isSessionValid(): boolean {
    const session = this.sessionInfo$.value;
    return session.isActive && session.expiresAt > new Date();
  }

  /**
   * Gets stored token securely
   */
  private getStoredToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error accessing stored token:', error);
      return null;
    }
  }

  /**
   * Stores session info securely
   */
  private storeSessionInfo(sessionInfo: SessionInfo): void {
    try {
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionInfo));
    } catch (error) {
      console.error('Error storing session info:', error);
    }
  }

  /**
   * Retrieves stored session info
   */
  private getStoredSessionInfo(): SessionInfo | null {
    try {
      const stored = sessionStorage.getItem(this.SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error retrieving session info:', error);
      return null;
    }
  }

  /**
   * Validates token
   */
  private isTokenValid(decodedToken: any): boolean {
    if (!decodedToken || !decodedToken.exp) return false;
    
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
  }

  /**
   * Clears session data
   */
  private clearSession(): void {
    // Clear timers
    this.clearTimers();
    
    // Clear stored data
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.error('Error clearing session data:', error);
    }
    
    // Reset session info
    this.sessionInfo$.next(this.getDefaultSessionInfo());
  }

  /**
   * Starts session timers
   */
  private startSessionTimers(): void {
    this.resetSessionTimers();
  }

  /**
   * Resets session timers
   */
  private resetSessionTimers(): void {
    this.clearTimers();
    
    const currentSession = this.sessionInfo$.value;
    if (!currentSession.isActive) return;

    const timeUntilExpiry = currentSession.expiresAt.getTime() - Date.now();
    const timeUntilWarning = timeUntilExpiry - this.WARNING_TIME;

    // Set warning timer
    if (timeUntilWarning > 0) {
      this.warningTimer = timer(timeUntilWarning).subscribe(() => {
        this.showSessionWarning();
      });
    }

    // Set session expiry timer
    if (timeUntilExpiry > 0) {
      this.sessionTimer = timer(timeUntilExpiry).subscribe(() => {
        this.handleSessionExpiry();
      });
    }
  }

  /**
   * Clears all timers
   */
  private clearTimers(): void {
    if (this.sessionTimer) {
      this.sessionTimer.unsubscribe();
      this.sessionTimer = null;
    }
    if (this.warningTimer) {
      this.warningTimer.unsubscribe();
      this.warningTimer = null;
    }
    if (this.activityTimer) {
      this.activityTimer.unsubscribe();
      this.activityTimer = null;
    }
  }

  /**
   * Shows session warning
   */
  private showSessionWarning(): void {
    const currentSession = this.sessionInfo$.value;
    if (currentSession.isActive) {
      // Show warning to user (you can implement a modal or notification)
      const shouldExtend = confirm(
        'Your session will expire in 5 minutes. Would you like to extend your session?'
      );
      
      if (shouldExtend) {
        this.extendSession();
      }
    }
  }

  /**
   * Handles session expiry
   */
  private handleSessionExpiry(): void {
    this.clearSession();
    alert('Your session has expired. Please log in again.');
    this.router.navigate(['/login']);
  }

  /**
   * Sets up activity listeners
   */
  private setupActivityListeners(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.updateActivity();
      }, { passive: true });
    });

    // Update activity every minute
    this.activityTimer = timer(60000, 60000).subscribe(() => {
      this.updateActivity();
    });
  }

  /**
   * Gets default session info
   */
  private getDefaultSessionInfo(): SessionInfo {
    return {
      isActive: false,
      lastActivity: new Date(),
      expiresAt: new Date(),
      userId: null,
      username: null,
      role: null
    };
  }

  /**
   * Gets time remaining in session
   */
  public getTimeRemaining(): number {
    const session = this.sessionInfo$.value;
    if (!session.isActive) return 0;
    
    return Math.max(0, session.expiresAt.getTime() - Date.now());
  }

  /**
   * Gets formatted time remaining
   */
  public getFormattedTimeRemaining(): string {
    const timeRemaining = this.getTimeRemaining();
    if (timeRemaining === 0) return 'Expired';
    
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Checks if user has specific role
   */
  public hasRole(role: number): boolean {
    const session = this.sessionInfo$.value;
    return session.isActive && session.role === role;
  }

  /**
   * Gets current user ID
   */
  public getCurrentUserId(): number | null {
    return this.sessionInfo$.value.userId;
  }

  /**
   * Gets current username
   */
  public getCurrentUsername(): string | null {
    return this.sessionInfo$.value.username;
  }
} 