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

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: queryKeys.products.featured,
    queryFn: async () => {
      const { data, error } = await ProductService.getFeaturedProducts();
      if (error) throw new Error(error);
      return data;
    },
  });
};