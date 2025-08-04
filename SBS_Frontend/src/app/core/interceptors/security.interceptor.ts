import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add security headers
    const secureRequest = this.addSecurityHeaders(request);
    
    // Add authentication token if available
    const authenticatedRequest = this.addAuthToken(secureRequest);
    
    // Sanitize request body
    const sanitizedRequest = this.sanitizeRequest(authenticatedRequest);

    return next.handle(sanitizedRequest).pipe(
      tap((event) => {
        // Log successful requests (in production, this should be minimal)
        this.logSecureRequest(sanitizedRequest, 'SUCCESS');
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle errors securely
        this.handleSecureError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Adds security headers to requests
   */
  private addSecurityHeaders(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }

  /**
   * Adds authentication token to requests
   */
  private addAuthToken(request: HttpRequest<any>): HttpRequest<any> {
    const token = localStorage.getItem('jwtToken');
    
    if (token && this.shouldAddToken(request.url)) {
      console.log('Adding Authorization header with token:', token.substring(0, 20) + '...');
      return request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
    } else {
      console.log('No token found or URL excluded from token addition:', request.url);
    }
    
    return request;
  }

  /**
   * Determines if token should be added to request
   */
  private shouldAddToken(url: string): boolean {
    // Don't add token to login/register endpoints
    const publicEndpoints = ['/login', '/register', '/validate-otp'];
    return !publicEndpoints.some(endpoint => url.includes(endpoint));
  }

  /**
   * Sanitizes request body to prevent injection attacks
   */
  private sanitizeRequest(request: HttpRequest<any>): HttpRequest<any> {
    if (request.body) {
      const sanitizedBody = this.sanitizeData(request.body);
      return request.clone({ body: sanitizedBody });
    }
    return request;
  }

  /**
   * Sanitizes data to prevent XSS and injection attacks
   */
  private sanitizeData(data: any): any {
    if (typeof data === 'string') {
      return this.sanitizeString(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeData(value);
      }
      return sanitized;
    }
    
    return data;
  }

  /**
   * Sanitizes strings to prevent XSS attacks
   */
  private sanitizeString(str: string): string {
    if (typeof str !== 'string') return str;
    
    // Remove potentially dangerous characters and patterns
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .trim();
  }

  /**
   * Handles errors securely without exposing sensitive information
   */
  private handleSecureError(error: HttpErrorResponse): void {
    // Log error securely (in production, send to secure logging service)
    console.error('Secure Error:', {
      status: error.status,
      statusText: error.statusText,
      url: this.sanitizeUrl(error.url || ''),
      timestamp: new Date().toISOString()
    });

    // Handle authentication errors
    if (error.status === 401) {
      this.handleUnauthorized();
    }
    
    // Handle forbidden errors
    if (error.status === 403) {
      this.handleForbidden();
    }
    
    // Handle server errors
    if (error.status >= 500) {
      this.handleServerError();
    }
  }

  /**
   * Handles unauthorized access
   */
  private handleUnauthorized(): void {
    // Clear invalid token
    localStorage.removeItem('jwtToken');
    
    // Redirect to login
    this.router.navigate(['/login']);
  }

  /**
   * Handles forbidden access
   */
  private handleForbidden(): void {
    // Log access attempt (in production, this should trigger alerts)
    console.warn('Access forbidden - potential security issue');
    
    // Redirect to home or show access denied message
    this.router.navigate(['/home']);
  }

  /**
   * Handles server errors
   */
  private handleServerError(): void {
    // In production, this should trigger monitoring alerts
    console.error('Server error detected');
  }

  /**
   * Sanitizes URL for logging
   */
  private sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    } catch {
      return 'invalid-url';
    }
  }

  /**
   * Logs requests securely
   */
  private logSecureRequest(request: HttpRequest<any>, status: string): void {
    // In production, this should be minimal and secure
    console.log('Secure Request:', {
      method: request.method,
      url: this.sanitizeUrl(request.url),
      status,
      timestamp: new Date().toISOString()
    });
  }
} 