import { supabase } from '@/lib/supabase';
import type { Review, ReviewWithUser, CreateReviewDTO } from '@/types';

export const ReviewService = {
  // Get product reviews
  async getProductReviews(productId: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:profiles(*)
        `)
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data as ReviewWithUser[], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },

  // Get user's review for a product
  async getUserReview(userId: string, productId: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Create review
  async createReview(userId: string, reviewData: CreateReviewDTO) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: userId,
          product_id: reviewData.product_id,
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment,
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Update review
  async updateReview(reviewId: string, updates: Partial<CreateReviewDTO>) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Delete review
  async deleteReview(reviewId: string) {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Get average rating for product
  async getAverageRating(productId: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', productId)
        .eq('is_approved', true);

      if (error) throw error;

      if (data.length === 0) {
        return { average: 0, count: 0, error: null };
      }

      const sum = data.reduce((acc, review) => acc + review.rating, 0);
      const average = sum / data.length;

      return { average: Math.round(average * 10) / 10, count: data.length, error: null };
    } catch (error: any) {
      return { average: 0, count: 0, error: error.message };
    }
  },

  // ADMIN: Get all reviews
  async getAllReviews(includeUnapproved: boolean = true) {
    try {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          user:profiles(*),
          product:products(name, slug)
        `)
        .order('created_at', { ascending: false });

      if (!includeUnapproved) {
        query = query.eq('is_approved', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data: data as ReviewWithUser[], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },

  // ADMIN: Approve review
  async approveReview(reviewId: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({ is_approved: true })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // ADMIN: Unapprove review
  async unapproveReview(reviewId: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({ is_approved: false })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};