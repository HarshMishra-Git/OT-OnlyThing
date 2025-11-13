import { supabase } from '@/lib/supabase';
import type { CartItem, CartItemWithProduct } from '@/types';

export const CartService = {
  // Get user's cart items
  async getCartItems(userId: string) {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*),
          variant:product_variants(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data as CartItemWithProduct[], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },

  // Add item to cart
  async addToCart(userId: string, productId: string, quantity: number = 1, variantId?: string) {
    try {
      // Check if item already exists
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .eq('variant_id', variantId || null)
        .single();

      if (existingItem) {
        // Update quantity
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } else {
        // Insert new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: productId,
            variant_id: variantId || null,
            quantity,
          })
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      }
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Update cart item quantity
  async updateCartQuantity(cartItemId: string, quantity: number) {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Remove item from cart
  async removeFromCart(cartItemId: string) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Clear cart
  async clearCart(userId: string) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Get cart total
  async getCartTotal(userId: string) {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          quantity,
          product:products(price)
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const total = data.reduce((sum, item: any) => {
        return sum + (item.product.price * item.quantity);
      }, 0);

      return { total, error: null };
    } catch (error: any) {
      return { total: 0, error: error.message };
    }
  },
};