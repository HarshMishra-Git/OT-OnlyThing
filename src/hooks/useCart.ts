import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import toast from 'react-hot-toast';
import type { Product } from '@/types';

export const useCart = () => {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    getSubtotal,
    getTax,
    getShipping,
    getTotal,
  } = useCartStore();

  const { openCartDrawer } = useUIStore();

  const handleAddToCart = (product: Product, quantity: number = 1, variantId?: string) => {
    addItem(product, quantity, variantId);
    toast.success('Added to cart');
    openCartDrawer();
  };

  const handleRemoveFromCart = (productId: string, variantId?: string) => {
    removeItem(productId, variantId);
    toast.success('Removed from cart');
  };

  const handleUpdateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity < 1) {
      handleRemoveFromCart(productId, variantId);
    } else {
      updateQuantity(productId, quantity, variantId);
    }
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  return {
    items,
    itemCount: getItemCount(),
    subtotal: getSubtotal(),
    tax: getTax(),
    shipping: getShipping(),
    total: getTotal(),
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
  };
};