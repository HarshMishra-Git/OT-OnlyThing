import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductService } from '@/services/product.service';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({ data: mockProduct, error: null })),
        })),
        order: vi.fn(() => ({ data: [mockProduct], error: null })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({ data: mockProduct, error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({ data: mockProduct, error: null })),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({ error: null })),
      })),
    })),
  },
}));

const mockProduct = {
  id: '1',
  name: 'Test Product',
  slug: 'test-product',
  price: 999,
  stock_quantity: 10,
  is_active: true,
};

describe('ProductService', () => {
  describe('getProductBySlug', () => {
    it('should fetch product by slug', async () => {
      const { data, error } = await ProductService.getProductBySlug('test-product');
      
      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.slug).toBe('test-product');
    });

    it('should handle errors', async () => {
      const { error } = await ProductService.getProductBySlug('non-existent');
      expect(error).toBeDefined();
    });
  });

  describe('getProducts', () => {
    it('should fetch all products', async () => {
      const { data, error } = await ProductService.getProducts({});
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const newProduct = {
        name: 'New Product',
        slug: 'new-product',
        price: 1299,
        stock_quantity: 5,
      };

      const { data, error } = await ProductService.createProduct(newProduct);
      
      expect(error).toBeNull();
      expect(data).toBeDefined();
    });
  });
});