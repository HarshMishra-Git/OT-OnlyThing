import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PaymentService } from '@/services/payment.service';
import { mockSupabase } from '@/tests/mocks/supabase';

describe('PaymentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure test mode
    (import.meta as any).env = { DEV: true, VITE_RAZORPAY_TEST_MODE: 'true', VITE_RAZORPAY_KEY_ID_TEST: 'test_key' };
    // Mock Razorpay global
    (window as any).Razorpay = vi.fn().mockImplementation((opts: any) => ({ open: vi.fn() }));
  });

  it('createOrder falls back in test mode when backend fails', async () => {
    mockSupabase.functions.invoke.mockRejectedValueOnce(new Error('Net error'));
    const { data, error } = await PaymentService.createOrder({ amount: 123 });
    expect(error).toBeNull();
    expect(data?.status).toBe('created');
    expect(data?.amount).toBe(123 * 100);
  });

  it('verifyPayment succeeds in test mode', async () => {
    mockSupabase.functions.invoke.mockRejectedValueOnce(new Error('No backend'));
    const res = await PaymentService.verifyPayment({ orderId: 'o', paymentId: 'p', signature: 's' });
    expect(res.success).toBe(true);
    expect(res.error).toBeNull();
  });

  it('openCheckout loads Razorpay and opens modal', async () => {
    const openSpy = vi.fn();
    (window as any).Razorpay = vi.fn().mockImplementation(() => ({ open: openSpy }));
    await PaymentService.openCheckout({
      key: 'dummy',
      amount: 500,
      currency: 'INR',
      name: 'OnlyThing',
      description: 'Test',
      order_id: 'order_1',
      handler: vi.fn(),
    });
    expect((window as any).Razorpay).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalled();
  });
});