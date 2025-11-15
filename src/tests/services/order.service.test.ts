import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OrderService } from '@/services/order.service';
import { tableStore, mockSupabase } from '@/tests/mocks/supabase';

describe('OrderService.createOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset table chains
    Object.keys(tableStore).forEach(k => delete tableStore[k]);
  });

  it('calculates subtotal, tax, shipping, total and inserts order', async () => {
    // Mock address
    const address = { id: 'addr1', full_name: 'John', phone: '9999999999', address_line1: '123 St', city: 'Delhi', state: 'DL', postal_code: '110001' };
    // Setup addresses chain to return address
    mockSupabase.from('addresses').single.mockResolvedValue({ data: address, error: null });

    // Setup orders insert to return order with id
    mockSupabase.from('orders').single.mockResolvedValue({ data: { id: 'ord1' }, error: null });
    // order_items insert ok
    mockSupabase.from('order_items').insert.mockResolvedValue({ error: null });

    const items = [
      { product_id: 'p1', price: 200, quantity: 1 },
      { product_id: 'p2', price: 150, quantity: 2 },
    ];

    const { data, error } = await OrderService.createOrder('user1', {
      items: items as any,
      shipping_address_id: 'addr1',
      customer_notes: '',
      payment_method: 'razorpay',
    } as any);

    expect(error).toBeNull();
    expect(data?.id).toBe('ord1');

    // Verify computed totals were part of insert payload
    const inserted = tableStore['orders']._data;
    const subtotal = 200 * 1 + 150 * 2; // 500
    const tax = Math.round(subtotal * 0.18 * 100) / 100; // calcTax uses percentage, assume rounding
    const shipping = subtotal >= 500 ? 0 : 50; // free shipping threshold 500
    const total = subtotal + tax + shipping;

    expect(inserted.subtotal).toBe(subtotal);
    expect(inserted.tax).toBe(tax);
    expect(inserted.shipping_cost).toBe(shipping);
    expect(inserted.total).toBe(total);
  });
});