import { useQuery } from '@tanstack/react-query';
import { CategoryService } from '@/services/category.service';
import { queryKeys } from '@/lib/react-query';

export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.active,
    queryFn: async () => {
      const { data, error } = await CategoryService.getActiveCategories();
      if (error) throw new Error(error);
      return data;
    },
  });
};