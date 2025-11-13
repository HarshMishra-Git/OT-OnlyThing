import { useQuery } from '@tanstack/react-query';
import { OrderService } from '@/services/order.service';
import { queryKeys } from '@/lib/react-query';
import { useAuth } from './useAuth';

export const useOrders = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await OrderService.getUserOrders(user.id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!user,
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: async () => {
      const { data, error } = await OrderService.getOrderById(orderId);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!orderId,
  });
};