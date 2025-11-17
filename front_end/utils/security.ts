// Security utilities for the frontend application

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  return phoneRegex.test(phone);
}

/**
 * Check if password meets security requirements
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  return { valid: true };
}

/**
 * Secure token storage with expiration
 */
export function setSecureToken(key: string, token: string, expiresInHours: number = 24): void {
  if (typeof window === 'undefined') return;
  
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + expiresInHours);
  
  const tokenData = {
    token,
    expiry: expiry.getTime()
  };
  
  localStorage.setItem(key, JSON.stringify(tokenData));
}

/**
 * Get secure token with expiration check
 */
export function getSecureToken(key: string): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    const tokenData = JSON.parse(stored);
    
    // Check if token is expired
    if (Date.now() > tokenData.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return tokenData.token;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Clear all authentication tokens
 */
export function clearAuthTokens(): void {
  if (typeof window === 'undefined') return;
  
  const keysToRemove = [
    'access_token',
    'refresh_token',
    'token',
    'user_role'
  ];
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

/**
 * Rate limiting for API calls
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  canMakeRequest(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const requests = this.requests.get(key)!;
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => time > windowStart);
    this.requests.set(key, validRequests);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Content Security Policy headers for API requests
 */
export function getSecureHeaders(): HeadersInit {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
}

/**
 * Validate tenant ID format
 */
export function isValidTenantId(tenantId: string): boolean {
  // Tenant ID should be alphanumeric with hyphens, 3-50 characters
  const tenantRegex = /^[a-zA-Z0-9-]{3,50}$/;
  return tenantRegex.test(tenantId);
}

/**
 * Generate secure random string for CSRF tokens
 */
export function generateSecureToken(length: number = 32): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback for environments without crypto API
  return Math.random().toString(36).substring(2, length + 2);
}