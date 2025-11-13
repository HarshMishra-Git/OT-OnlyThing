import { supabase } from '@/lib/supabase';
import type { Address, AddressInput } from '@/types';

export const AddressService = {
  // Get user addresses
  async getUserAddresses(userId: string) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data as Address[], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },

  // Get address by ID
  async getAddressById(addressId: string) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('id', addressId)
        .single();

      if (error) throw error;

      return { data: data as Address, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Create address
  async createAddress(userId: string, addressData: AddressInput) {
    try {
      // If setting as default, unset other defaults
      if (addressData.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', userId);
      }

      const { data, error } = await supabase
        .from('addresses')
        .insert({
          user_id: userId,
          ...addressData,
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Update address
  async updateAddress(addressId: string, updates: Partial<AddressInput>, userId?: string) {
    try {
      // If setting as default, unset other defaults
      if (updates.is_default && userId) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', userId);
      }

      const { data, error } = await supabase
        .from('addresses')
        .update(updates)
        .eq('id', addressId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Delete address
  async deleteAddress(addressId: string) {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Set default address
  async setDefaultAddress(addressId: string, userId: string) {
    try {
      // Unset all defaults
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);

      // Set new default
      const { data, error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Get default address
  async getDefaultAddress(userId: string) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .eq('is_default', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return { data: data as Address | null, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};