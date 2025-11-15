import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML to prevent XSS attacks
 */
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
  });
};

/**
 * Sanitize user input
 */
// For non-HTML inputs, prefer strict validation and encoding at sinks.
// If a plain string needs cleaning, use trim only and validate via schemas.
export const sanitizeInput = (input: string): string => input.trim();

/**
 * Validate email format
 */
// Remove duplicate validators: use implementations in src/lib/utils.ts or zod schemas in validators.ts

/**
 * Check if URL is safe
 */
export const isSafeUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  check(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

/**
 * Generate secure random token
 */
export const generateToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Prevent SQL injection in raw queries
 */
// Removed: escapeSql. Use parameterized queries/APIs; do NOT attempt client-side SQL escaping.

/**
 * Content Security Policy headers
 */
export const getCSPHeaders = () => {
  const dev = import.meta.env.DEV;
  const base = [
    "default-src 'self'",
    // Keep style inline to avoid breaking UI libraries; consider hashing/noncing if needed later
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.razorpay.com"
  ];
  const scriptSrcDev = "script-src 'self' 'unsafe-eval' https://checkout.razorpay.com";
  const scriptSrcProd = "script-src 'self' https://checkout.razorpay.com";
  const csp = [...base, dev ? scriptSrcDev : scriptSrcProd].join('; ');
  return {
    'Content-Security-Policy': csp,
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  } as Record<string, string>;
};

export const getCSPMetaContent = (): string => getCSPHeaders()['Content-Security-Policy'];