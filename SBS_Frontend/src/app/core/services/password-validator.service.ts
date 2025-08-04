import { Injectable } from '@angular/core';

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordValidatorService {

  private readonly MIN_LENGTH = 8;
  private readonly MAX_LENGTH = 128;
  
  // Banking-specific password requirements
  private readonly REQUIREMENTS = {
    minLength: this.MIN_LENGTH,
    maxLength: this.MAX_LENGTH,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventCommonPasswords: true,
    preventSequentialChars: true,
    preventRepeatingChars: true
  };

  // Common weak passwords to avoid
  private readonly COMMON_PASSWORDS = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey',
    'dragon', 'master', 'hello', 'freedom', 'whatever',
    'qwerty123', 'trustno1', 'jordan', 'harley', 'ranger',
    'joshua', 'maggie', 'guitar', 'rosebud', 'secret',
    'summer', 'bigtits', 'cooper', 'jackson', 'mike',
    'thomas', 'jessica', 'dakota', 'willie', 'winston',
    'apple', 'eagle', 'shelby', 'angel', 'steven',
    'michelle', 'love', 'tiger', 'robert', 'buster',
    'heather', 'michelle', 'charlie', 'andrew', 'matthew',
    'access', 'yankees', '987654321', 'dallas', 'austin',
    'thunder', 'taylor', 'matrix', 'mobilemail', 'mom',
    'monitor', 'monitoring', 'montana', 'moon', 'moscow'
  ];

  /**
   * Validates password according to banking security standards
   */
  public validatePassword(password: string): PasswordValidationResult {
    const errors: string[] = [];
    let score = 0;

    // Check length
    if (password.length < this.REQUIREMENTS.minLength) {
      errors.push(`Password must be at least ${this.REQUIREMENTS.minLength} characters long`);
    } else {
      score += 20;
    }

    if (password.length > this.REQUIREMENTS.maxLength) {
      errors.push(`Password must not exceed ${this.REQUIREMENTS.maxLength} characters`);
    }

    // Check for uppercase letters
    if (this.REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else if (/[A-Z]/.test(password)) {
      score += 15;
    }

    // Check for lowercase letters
    if (this.REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else if (/[a-z]/.test(password)) {
      score += 15;
    }

    // Check for numbers
    if (this.REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    } else if (/\d/.test(password)) {
      score += 15;
    }

    // Check for special characters
    if (this.REQUIREMENTS.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)');
    } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 20;
    }

    // Check for common passwords
    if (this.REQUIREMENTS.preventCommonPasswords && this.isCommonPassword(password)) {
      errors.push('Password is too common. Please choose a more unique password');
      score -= 30;
    }

    // Check for sequential characters
    if (this.REQUIREMENTS.preventSequentialChars && this.hasSequentialChars(password)) {
      errors.push('Password contains sequential characters (e.g., 123, abc)');
      score -= 10;
    }

    // Check for repeating characters
    if (this.REQUIREMENTS.preventRepeatingChars && this.hasRepeatingChars(password)) {
      errors.push('Password contains repeating characters (e.g., aaa, 111)');
      score -= 10;
    }

    // Bonus points for length
    if (password.length >= 12) {
      score += 10;
    }
    if (password.length >= 16) {
      score += 10;
    }

    // Bonus points for complexity
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= 8) {
      score += 10;
    }

    // Determine strength
    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    if (score >= 70) {
      strength = 'strong';
    } else if (score >= 40) {
      strength = 'medium';
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength,
      score: Math.max(0, Math.min(100, score))
    };
  }

  /**
   * Checks if password is a common weak password
   */
  private isCommonPassword(password: string): boolean {
    const normalizedPassword = password.toLowerCase().trim();
    return this.COMMON_PASSWORDS.includes(normalizedPassword);
  }

  /**
   * Checks for sequential characters
   */
  private hasSequentialChars(password: string): boolean {
    const lowerPassword = password.toLowerCase();
    
    // Check for sequential letters
    for (let i = 0; i < lowerPassword.length - 2; i++) {
      const char1 = lowerPassword.charCodeAt(i);
      const char2 = lowerPassword.charCodeAt(i + 1);
      const char3 = lowerPassword.charCodeAt(i + 2);
      
      if (char2 === char1 + 1 && char3 === char2 + 1) {
        return true;
      }
    }
    
    // Check for sequential numbers
    for (let i = 0; i < lowerPassword.length - 2; i++) {
      const char1 = lowerPassword.charCodeAt(i);
      const char2 = lowerPassword.charCodeAt(i + 1);
      const char3 = lowerPassword.charCodeAt(i + 2);
      
      if (char1 >= 48 && char1 <= 57 && // 0-9
          char2 >= 48 && char2 <= 57 &&
          char3 >= 48 && char3 <= 57) {
        if (char2 === char1 + 1 && char3 === char2 + 1) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Checks for repeating characters
   */
  private hasRepeatingChars(password: string): boolean {
    for (let i = 0; i < password.length - 2; i++) {
      if (password[i] === password[i + 1] && password[i] === password[i + 2]) {
        return true;
      }
    }
    return false;
  }

  /**
   * Generates a secure password suggestion
   */
  public generateSecurePassword(): string {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    
    // Ensure at least one of each required character type
    password += this.getRandomChar('abcdefghijklmnopqrstuvwxyz'); // lowercase
    password += this.getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ'); // uppercase
    password += this.getRandomChar('0123456789'); // number
    password += this.getRandomChar('!@#$%^&*()_+-=[]{}|;:,.<>?'); // special
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += this.getRandomChar(charset);
    }
    
    // Shuffle the password
    return this.shuffleString(password);
  }

  /**
   * Gets a random character from a string
   */
  private getRandomChar(chars: string): string {
    return chars.charAt(Math.floor(Math.random() * chars.length));
  }

  /**
   * Shuffles a string
   */
  private shuffleString(str: string): string {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }

  /**
   * Gets password strength color
   */
  public getStrengthColor(strength: 'weak' | 'medium' | 'strong'): string {
    switch (strength) {
      case 'weak': return '#e53e3e';
      case 'medium': return '#d69e2e';
      case 'strong': return '#38a169';
      default: return '#e53e3e';
    }
  }

  /**
   * Gets password strength message
   */
  public getStrengthMessage(strength: 'weak' | 'medium' | 'strong'): string {
    switch (strength) {
      case 'weak': return 'Weak password';
      case 'medium': return 'Medium strength password';
      case 'strong': return 'Strong password';
      default: return 'Weak password';
    }
  }
} 