import { supabase } from '@/lib/supabase';
import { STORAGE_BUCKETS } from '@/lib/constants';

export const StorageService = {
  // Upload image
  async uploadImage(bucket: string, file: File, path?: string) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = path ? `${path}/${fileName}` : fileName;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return { url: publicUrl, path: filePath, error: null };
    } catch (error: any) {
      return { url: null, path: null, error: error.message };
    }
  },

  // Upload multiple images
  async uploadMultipleImages(bucket: string, files: File[], path?: string) {
    try {
      const uploadPromises = files.map(file => this.uploadImage(bucket, file, path));
      const results = await Promise.all(uploadPromises);

      const successfulUploads = results.filter(r => r.url !== null);
      const errors = results.filter(r => r.error !== null);

      return { 
        uploads: successfulUploads.map(u => ({ url: u.url!, path: u.path! })),
        errors: errors.map(e => e.error!),
        error: null 
      };
    } catch (error: any) {
      return { uploads: [], errors: [], error: error.message };
    }
  },

  // Delete image
  async deleteImage(bucket: string, path: string) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Get public URL
  getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  },

  // Upload product image
  async uploadProductImage(file: File) {
    return this.uploadImage(STORAGE_BUCKETS.PRODUCTS, file, 'products');
  },

  // Upload blog image
  async uploadBlogImage(file: File) {
    return this.uploadImage(STORAGE_BUCKETS.PRODUCTS, file, 'blog');
  },

  // Upload avatar
  async uploadAvatar(file: File, userId: string) {
    return this.uploadImage(STORAGE_BUCKETS.AVATARS, file, `avatars/${userId}`);
  },
};