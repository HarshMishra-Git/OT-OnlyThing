import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/stores/cartStore';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  slug: 'test-product',
  price: 999,
  stock_quantity: 10,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

describe('CartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  describe('addItem', () => {
    it('should add item to cart', () => {
      const { addItem, items } = useCartStore.getState();
      
      addItem(mockProduct, 1);
      
      expect(items.length).toBe(1);
      expect(items[0].product.id).toBe(mockProduct.id);
      expect(items[0].quantity).toBe(1);
    });

    it('should increment quantity for existing item', () => {
      const { addItem, items } = useCartStore.getState();
      
      addItem(mockProduct, 1);
      addItem(mockProduct, 2);
      
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(3);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const { addItem, removeItem, items } = useCartStore.getState();
      
      addItem(mockProduct, 1);
      removeItem(mockProduct.id);
      
      expect(items.length).toBe(0);
    });
  });

  describe('calculations', () => {
    it('should calculate subtotal correctly', () => {
      const { addItem, getSubtotal } = useCartStore.getState();
      
      addItem(mockProduct, 2);
      
      expect(getSubtotal()).toBe(1998);
    });

    it('should calculate tax correctly', () => {
      const { addItem, getTax } = useCartStore.getState();
      
      addItem(mockProduct, 1);
      const tax = getTax();
      
      expect(tax).toBeCloseTo(999 * 0.18);
    });

    it('should calculate shipping correctly', () => {
      const { addItem, getShipping } = useCartStore.getState();
      
      addItem(mockProduct, 1);
      expect(getShipping()).toBe(50); // Under ₹500
      
      addItem({ ...mockProduct, id: '2' }, 1);
      expect(getShipping()).toBe(0); // Over ₹500
    });
  });
});