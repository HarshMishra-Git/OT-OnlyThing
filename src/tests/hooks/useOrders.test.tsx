import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { useOrders } from '@/hooks/useOrders';
import { OrderService } from '@/services/order.service';

vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: 'u1' } }) }));

describe('useOrders', () => {
  it('fetches user orders when authenticated', async () => {
    vi.spyOn(OrderService, 'getUserOrders').mockResolvedValue({ data: [{ id: 'o1' }] as any, error: null });
    const wrapper = ({ children }: any) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useOrders(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.[0].id).toBe('o1');
  });
});