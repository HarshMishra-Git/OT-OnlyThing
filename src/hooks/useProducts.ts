import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/services/product.service';
import { queryKeys } from '@/lib/react-query';
import type { ProductFilters } from '@/types';

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: queryKeys.products.list(filters || {}),
    queryFn: async () => {
      const { data, error } = await ProductService.getProducts(filters);
      if (error) throw new Error(error);
      return data;
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: async () => {
      const { data, error } = await ProductService.getProductBySlug(slug);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!slug,
  });
};

export const useFeaturedProducts = (limit?: number) => {
  return useQuery({
    queryKey: queryKeys.products.featured(limit),
    queryFn: async () => {
      const { data, error } = await ProductService.getFeaturedProducts(limit);
      if (error) throw new Error(error);
      return data;
    },
  });
};

export const useProductSearch = (query: string) => {
  return useQuery({
    queryKey: queryKeys.products.search(query),
    queryFn: async () => {
      const { data, error } = await ProductService.searchProducts(query);
      if (error) throw new Error(error);
      return data;
    },
    enabled: query.length >= 2,
  });
};

export const useRelatedProducts = (
  categoryId: string,
  excludeProductId?: string,
  limit?: number
) => {
  return useQuery({
    queryKey: queryKeys.products.related(categoryId, excludeProductId, limit),
    queryFn: async () => {
      const { data, error } = await ProductService.getRelatedProducts(
        categoryId,
        excludeProductId,
        limit
      );
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!categoryId,
  });
};