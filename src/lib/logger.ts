export const isDev = import.meta.env.DEV;

const maskEmail = (s: string) => s.replace(/([\w.+-])([\w.+-]*)(@[^\s@]+)/g, (_, a, b, c) => `${a}${b ? '***' : ''}${c}`);
const maskPhone = (s: string) => s.replace(/\b(\+?\d{1,3}[\s-]?)?(\d{3})(\d{3})(\d{4})\b/g, (_m, cc, a, b, c) => `${cc || ''}${a}***${b}***${c}`);

const redactValue = (value: any): any => {
  if (value == null) return value;
  if (typeof value === 'string') {
    return maskPhone(maskEmail(value));
  }
  if (typeof value === 'object') {
    const clone: Record<string, any> = Array.isArray(value) ? [...value] : { ...value };
    const piiKeys = ['email', 'phone', 'contact', 'address', 'name'];
    for (const key of Object.keys(clone)) {
      if (piiKeys.includes(key.toLowerCase())) {
        clone[key] = '[redacted]';
      } else {
        clone[key] = redactValue(clone[key]);
      }
    }
    return clone;
  }
  return value;
};

export const safeLog = (...args: any[]) => {
  if (!isDev) return; // No verbose logs in production
  // Redact common PII patterns even in dev
  console.log(...args.map(redactValue));
};

export const safeWarn = (...args: any[]) => {
  if (!isDev) return;
  console.warn(...args.map(redactValue));
};

export const safeError = (...args: any[]) => {
  // Keep errors in production, but redact content
  console.error(...args.map(redactValue));
};