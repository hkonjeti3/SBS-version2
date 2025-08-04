import { Injectable } from '@angular/core';

export interface SecureError {
  userMessage: string;
  internalCode?: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  private readonly ERROR_MESSAGES = {
    // Authentication Errors
    'AUTH_001': 'Invalid username or password. Please try again.',
    'AUTH_002': 'Your session has expired. Please log in again.',
    'AUTH_003': 'Account is locked. Please contact support.',
    'AUTH_004': 'Too many failed attempts. Please try again later.',
    'AUTH_005': 'Invalid OTP. Please check your email and try again.',
    
    // Registration Errors
    'REG_001': 'Username already exists. Please choose a different one.',
    'REG_002': 'Email already registered. Please use a different email.',
    'REG_003': 'Password does not meet security requirements.',
    'REG_004': 'Invalid phone number format.',
    'REG_005': 'Registration failed. Please try again.',
    
    // Account Errors
    'ACC_001': 'Account not found.',
    'ACC_002': 'Insufficient funds for this transaction.',
    'ACC_003': 'Account is inactive. Please contact support.',
    'ACC_004': 'Transaction limit exceeded.',
    'ACC_005': 'Invalid account number.',
    
    // Transaction Errors
    'TXN_001': 'Transaction failed. Please try again.',
    'TXN_002': 'Invalid transaction amount.',
    'TXN_003': 'Transaction declined by bank.',
    'TXN_004': 'Daily transaction limit reached.',
    'TXN_005': 'Transaction requires approval.',
    
    // Network Errors
    'NET_001': 'Connection error. Please check your internet and try again.',
    'NET_002': 'Service temporarily unavailable. Please try again later.',
    'NET_003': 'Request timeout. Please try again.',
    
    // General Errors
    'GEN_001': 'An unexpected error occurred. Please try again.',
    'GEN_002': 'Service is currently unavailable. Please try again later.',
    'GEN_003': 'Invalid request. Please check your input and try again.',
    'GEN_004': 'Access denied. Please contact support if you believe this is an error.',
    'GEN_005': 'Data validation failed. Please check your input.',
    
    // Default fallback
    'DEFAULT': 'Something went wrong. Please try again or contact support.'
  };

  /**
   * Sanitizes error messages to prevent information disclosure
   */
  public sanitizeError(error: any): SecureError {
    const timestamp = new Date();
    
    // Log the actual error for debugging (in production, this should go to a secure logging service)
    console.error('Original error:', error);
    
    // Extract error information
    const status = this.extractStatus(error);
    const message = this.extractMessage(error);
    const url = this.extractUrl(error);
    
    // Determine error type and provide user-friendly message
    const userMessage = this.getUserFriendlyMessage(status, message, url);
    
    // Generate internal code for tracking (without exposing sensitive info)
    const internalCode = this.generateInternalCode(status, url);
    
    return {
      userMessage,
      internalCode,
      timestamp
    };
  }

  /**
   * Extracts HTTP status code safely
   */
  private extractStatus(error: any): number | null {
    if (error?.status) return error.status;
    if (error?.error?.status) return error.error.status;
    return null;
  }

  /**
   * Extracts error message safely
   */
  private extractMessage(error: any): string {
    if (error?.error?.message) return error.error.message;
    if (error?.message) return error.message;
    if (typeof error === 'string') return error;
    return '';
  }

  /**
   * Extracts URL safely (for internal use only)
   */
  private extractUrl(error: any): string {
    if (error?.url) return error.url;
    if (error?.config?.url) return error.config.url;
    return '';
  }

  /**
   * Maps technical errors to user-friendly messages
   */
  private getUserFriendlyMessage(status: number | null, message: string, url: string): string {
    // Authentication errors
    if (status === 401) {
      return this.ERROR_MESSAGES['AUTH_001'];
    }
    
    if (status === 403) {
      return this.ERROR_MESSAGES['AUTH_004'];
    }
    
    // Not found errors
    if (status === 404) {
      if (url.includes('login') || url.includes('auth')) {
        return this.ERROR_MESSAGES['AUTH_001'];
      }
      if (url.includes('account')) {
        return this.ERROR_MESSAGES['ACC_001'];
      }
      return this.ERROR_MESSAGES['GEN_003'];
    }
    
    // Validation errors
    if (status === 400) {
      if (message.toLowerCase().includes('password')) {
        return this.ERROR_MESSAGES['REG_003'];
      }
      if (message.toLowerCase().includes('email')) {
        return this.ERROR_MESSAGES['REG_002'];
      }
      if (message.toLowerCase().includes('username')) {
        return this.ERROR_MESSAGES['REG_001'];
      }
      if (message.toLowerCase().includes('phone')) {
        return this.ERROR_MESSAGES['REG_004'];
      }
      return this.ERROR_MESSAGES['GEN_005'];
    }
    
    // Server errors
    if (status && status >= 500) {
      return this.ERROR_MESSAGES['NET_002'];
    }
    
    // Network errors
    if (status === 0 || !status) {
      return this.ERROR_MESSAGES['NET_001'];
    }
    
    // Timeout errors
    if (message.toLowerCase().includes('timeout')) {
      return this.ERROR_MESSAGES['NET_003'];
    }
    
    // Default fallback
    return this.ERROR_MESSAGES['DEFAULT'];
  }

  /**
   * Generates internal error code for tracking
   */
  private generateInternalCode(status: number | null, url: string): string {
    const timestamp = Date.now().toString(36);
    const statusCode = status || 'UNK';
    const endpoint = this.sanitizeEndpoint(url);
    return `${statusCode}_${endpoint}_${timestamp}`;
  }

  /**
   * Sanitizes endpoint for internal tracking
   */
  private sanitizeEndpoint(url: string): string {
    if (!url) return 'UNK';
    
    // Extract only the endpoint path, not the full URL
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 10);
    } catch {
      return 'UNK';
    }
  }

  /**
   * Logs error securely for monitoring
   */
  public logError(secureError: SecureError, originalError?: any): void {
    // In production, this should send to a secure logging service
    // For now, we'll just log to console with sanitized information
    console.error('Secure Error Log:', {
      userMessage: secureError.userMessage,
      internalCode: secureError.internalCode,
      timestamp: secureError.timestamp,
      // Don't log the original error in production
      hasOriginalError: !!originalError
    });
  }
} 