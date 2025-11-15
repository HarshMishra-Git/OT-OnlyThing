import { describe, it, expect, beforeEach } from 'vitest';
import { calcSubtotal, calcTax, calcShipping, calcTotal } from '@/lib/totals';
import { useCartStore } from '@/stores/cartStore';

describe('Totals consistency', () => {
  beforeEach(() => {
    const { clearCart } = useCartStore.getState();
    clearCart();
  });

  it('store totals match util totals (no discount)', () => {
    const productA = { id: 'a', name: 'A', unitPrice: 250 } as any;
    const productB = { id: 'b', name: 'B', unitPrice: 300 } as any;

    const { addItem, getSubtotal, getTax, getShipping, getTotal } = useCartStore.getState();
    addItem(productA, 1);
    addItem(productB, 1);

    const items = [
      { unitPrice: 250, quantity: 1 },
      { unitPrice: 300, quantity: 1 },
    ];
    const subtotalUtil = calcSubtotal(items);
    const taxUtil = calcTax(subtotalUtil);
    const shippingUtil = calcShipping(subtotalUtil);
    const totalUtil = calcTotal({ subtotal: subtotalUtil, discount: 0 });

    expect(getSubtotal()).toBeCloseTo(subtotalUtil);
    expect(getTax()).toBeCloseTo(taxUtil);
    expect(getShipping()).toBeCloseTo(shippingUtil);
    expect(getTotal()).toBeCloseTo(totalUtil);
  });
});