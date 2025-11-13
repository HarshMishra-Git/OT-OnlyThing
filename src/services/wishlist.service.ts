import { supabase } from '@/lib/supabase';
import type { WishlistItemWithProduct } from '@/types';

export const WishlistService = {
  // Get user's wishlist items
  async getWishlistItems(userId: string) {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data as WishlistItemWithProduct[], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },

  // Add item to wishlist
  async addToWishlist(userId: string, productId: string) {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .insert({
          user_id: userId,
          product_id: productId,
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Remove item from wishlist
  async removeFromWishlist(wishlistItemId: string) {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', wishlistItemId);

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Check if product is in wishlist
  async isInWishlist(userId: string, productId: string) {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return { isInWishlist: !!data, error: null };
    } catch (error: any) {
      return { isInWishlist: false, error: error.message };
    }
  },
};