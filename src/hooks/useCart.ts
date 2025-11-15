import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import toast from 'react-hot-toast';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

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
    // Enforce variant selection when variants exist
    const variants = (product as any)?.variants as Array<{ id: string; price?: number; stock_quantity?: number; is_active?: boolean }> | undefined;
    if (variants && variants.length > 0) {
      if (!variantId) {
        toast.error('Please select a variant');
        return;
      }
      const variant = variants.find((v) => v.id === variantId);
      if (!variant || (variant.is_active === false)) {
        toast.error('Selected variant is unavailable');
        return;
      }
      if (typeof variant.stock_quantity === 'number' && variant.stock_quantity < 1) {
        toast.error('Selected variant is out of stock');
        return;
      }
      const unitPrice = typeof variant.price === 'number' && variant.price > 0 ? variant.price : product.price;
      addItem(product, quantity, variantId, unitPrice);
    } else {
      addItem(product, quantity, variantId, product.price);
    }

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