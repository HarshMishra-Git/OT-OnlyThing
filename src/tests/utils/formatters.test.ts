import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, slugify, calculateDiscount } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(999)).toBe('₹999.00');
      expect(formatCurrency(1234.56)).toBe('₹1,234.56');
      expect(formatCurrency(0)).toBe('₹0.00');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = '2024-01-15T10:30:00Z';
      const formatted = formatDate(date);
      
      expect(formatted).toContain('2024');
      expect(formatted).toContain('Jan');
    });
  });

  describe('slugify', () => {
    it('should create valid slugs', () => {
      expect(slugify('Test Product')).toBe('test-product');
      expect(slugify('Product With Special @#$ Chars')).toBe('product-with-special-chars');
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
    });
  });

  describe('calculateDiscount', () => {
    it('should calculate discount percentage', () => {
      expect(calculateDiscount(1000, 800)).toBe(20);
      expect(calculateDiscount(500, 250)).toBe(50);
      expect(calculateDiscount(100, 100)).toBe(0);
    });
  });
});