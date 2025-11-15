import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductService } from '@/services/product.service';
import { mockSupabase } from '@/tests/mocks/supabase';

describe('ProductService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getProductBySlug returns product data', async () => {
    const product = { id: 'p1', slug: 'demo', is_active: true } as any;
    mockSupabase.from('products').single.mockResolvedValue({ data: product, error: null });
    const { data, error } = await ProductService.getProductBySlug('demo');
    expect(error).toBeNull();
    expect(data?.slug).toBe('demo');
  });
});