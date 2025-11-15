import { supabase } from '@/lib/supabase';
import type { Product, ProductWithDetails, ProductFilters, CreateProductDTO, UpdateProductDTO } from '@/types';

export const ProductService = {
  // Get all products with filters
  async getProducts(filters?: ProductFilters) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          specifications:product_specifications(*),
          variants:product_variants(*)
        `)
        .eq('is_active', true);

      // Apply filters
      if (filters?.category) {
        query = query.eq('category_id', filters.category);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      // Apply sorting
      switch (filters?.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'name':
          query = query.order('name', { ascending: true });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 12;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return { 
        data: data as ProductWithDetails[], 
        count: count || 0,
        error: null 
      };
    } catch (error: any) {
      return { data: [], count: 0, error: error.message };
    }
  },

  // Get product by slug
  async getProductBySlug(slug: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          specifications:product_specifications(*),
          variants:product_variants(*),
          reviews:reviews(*, user:profiles(*))
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      return { data: data as ProductWithDetails, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Get featured products
  async getFeaturedProducts(limit: number = 8) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(*)
        `)
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { data: data as Product[], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },

  // Get related products by category, excluding current product
  async getRelatedProducts(categoryId: string, excludeProductId?: string, limit: number = 8) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          images:product_images(*)
        `)
        .eq('is_active', true)
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (excludeProductId) {
        query = query.neq('id', excludeProductId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data as Product[], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },

  // Compute counts per category (client-side aggregation)
  async getCategoryCounts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category_id')
        .eq('is_active', true);

      if (error) throw error;

      const counts: Record<string, number> = {};
      (data || []).forEach((row: any) => {
        const key = row.category_id || 'unknown';
        counts[key] = (counts[key] || 0) + 1;
      });

      return { data: counts, error: null };
    } catch (error: any) {
      return { data: {}, error: error.message };
    }
  },

  // Get products by category
  async getProductsByCategory(categoryId: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(*)
        `)
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data as Product[], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },

  // Search products
  async searchProducts(searchTerm: string) {
    try {
      const term = (searchTerm || '').trim();

      let query = supabase
        .from('products')
        .select(`
          *,
          images:product_images(*)
        `)
        .eq('is_active', true)
        .limit(20);

      if (term.length >= 3) {
        // Full-text search on tsvector with websearch syntax
        // Requires migration adding products.search_document
        query = query.textSearch('search_document', term, {
          type: 'websearch',
          config: 'english',
        });
      } else if (term.length > 0) {
        // Fast prefix/trigram match for short queries
        const prefix = term.replace('%', '').replace('_', '');
        query = query.or(
          `name.ilike.${prefix}%,sku.ilike.${prefix}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data: data as Product[], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },

  // ADMIN: Create product
  async createProduct(productData: CreateProductDTO) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // ADMIN: Update product
  async updateProduct(id: string, updates: Partial<UpdateProductDTO>) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // ADMIN: Delete product
  async deleteProduct(id: string) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // ADMIN: Add product image
  async addProductImage(productId: string, imageUrl: string, altText?: string, isPrimary: boolean = false) {
    try {
      const { data, error } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          image_url: imageUrl,
          alt_text: altText,
          is_primary: isPrimary,
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // ADMIN: Delete product image
  async deleteProductImage(imageId: string) {
    try {
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // ADMIN: Add product specification
  async addProductSpecification(productId: string, specKey: string, specValue: string) {
    try {
      const { data, error } = await supabase
        .from('product_specifications')
        .insert({
          product_id: productId,
          spec_key: specKey,
          spec_value: specValue,
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // ADMIN: Delete product specification
  async deleteProductSpecification(specId: string) {
    try {
      const { error } = await supabase
        .from('product_specifications')
        .delete()
        .eq('id', specId);

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // ADMIN: Get all products (including inactive)
  async getAllProducts(filters?: ProductFilters) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `, { count: 'exact' });

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
      }

      if (filters?.category) {
        query = query.eq('category_id', filters.category);
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      return { data: data as Product[], count: count || 0, error: null };
    } catch (error: any) {
      return { data: [], count: 0, error: error.message };
    }
  },

  // ADMIN: Get product statistics
  async getProductStats() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('is_active, is_featured, stock_quantity, low_stock_threshold');

      if (error) throw error;

      const stats = {
        total: data.length,
        active: data.filter((p: any) => p.is_active).length,
        featured: data.filter((p: any) => p.is_featured).length,
        low_stock: data.filter((p: any) => {
          const qty = Number(p.stock_quantity || 0);
          const threshold = Number(p.low_stock_threshold || 0);
          return threshold > 0 && qty <= threshold;
        }).length,
      };

      return { data: stats, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};