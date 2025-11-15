import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';
import { calcShipping, calcTax } from '@/lib/totals';

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number; // effective price, respects variant override when applicable
  variantId?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variantId?: string, unitPriceOverride?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getShipping: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, variantId, unitPriceOverride) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id && item.variantId === variantId
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && item.variantId === variantId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              { product, quantity, variantId, unitPrice: unitPriceOverride ?? product.price },
            ],
          };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.variantId === variantId)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && item.variantId === variantId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        return calcTax(subtotal);
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        return calcShipping(subtotal);
      },

      getTotal: () => {
        return get().getSubtotal() + get().getTax() + get().getShipping();
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);