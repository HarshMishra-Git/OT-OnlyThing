import { useWishlistStore } from '@/stores/wishlistStore';
import toast from 'react-hot-toast';
import type { Product } from '@/types';

export const useWishlist = () => {
  const { items, addItem, removeItem, isInWishlist, clearWishlist } = useWishlistStore();

  const handleAddToWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      toast.error('Already in wishlist');
      return;
    }
    addItem(product);
    toast.success('Added to wishlist');
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeItem(productId);
    toast.success('Removed from wishlist');
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      handleRemoveFromWishlist(product.id);
    } else {
      handleAddToWishlist(product);
    }
  };

  return {
    items,
    addToWishlist: handleAddToWishlist,
    removeFromWishlist: handleRemoveFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  };
};