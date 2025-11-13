import { useQuery } from '@tanstack/react-query';
import { ReviewService } from '@/services/review.service';
import { queryKeys } from '@/lib/react-query';

export const useReviews = (productId: string) => {
  return useQuery({
    queryKey: queryKeys.reviews.byProduct(productId),
    queryFn: async () => {
      const { data, error } = await ReviewService.getProductReviews(productId);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!productId,
  });
};