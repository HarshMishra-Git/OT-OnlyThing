import { supabase } from '@/lib/supabase';
import type { CustomerQuery, QueryFilters, CreateQueryDTO } from '@/types';

export const QueryService = {
  // Submit query
  async submitQuery(queryData: CreateQueryDTO, userId?: string) {
    try {
      const { data, error } = await supabase
        .from('customer_queries')
        .insert({
          user_id: userId || null,
          name: queryData.name,
          email: queryData.email,
          phone: queryData.phone,
          subject: queryData.subject,
          message: queryData.message,
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Get user queries
  async getUserQueries(userId: string) {
    try {
      const { data, error } = await supabase
        .from('customer_queries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data as CustomerQuery[], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },

  // ADMIN: Get all queries
  async getAllQueries(filters?: QueryFilters) {
    try {
      let query = supabase
        .from('customer_queries')
        .select(`
          *,
          user:profiles(*),
          assigned_admin:profiles!customer_queries_assigned_to_fkey(*)
        `, { count: 'exact' });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,subject.ilike.%${filters.search}%`);
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      return { data: data as CustomerQuery[], count: count || 0, error: null };
    } catch (error: any) {
      return { data: [], count: 0, error: error.message };
    }
  },

  // ADMIN: Get query by ID
  async getQueryById(queryId: string) {
    try {
      const { data, error } = await supabase
        .from('customer_queries')
        .select(`
          *,
          user:profiles(*),
          assigned_admin:profiles!customer_queries_assigned_to_fkey(*)
        `)
        .eq('id', queryId)
        .single();

      if (error) throw error;

      return { data: data as CustomerQuery, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // ADMIN: Update query status
  async updateQueryStatus(queryId: string, status: string) {
    try {
      const { data, error } = await supabase
        .from('customer_queries')
        .update({ status })
        .eq('id', queryId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // ADMIN: Update query priority
  async updateQueryPriority(queryId: string, priority: string) {
    try {
      const { data, error } = await supabase
        .from('customer_queries')
        .update({ priority })
        .eq('id', queryId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // ADMIN: Assign query
  async assignQuery(queryId: string, adminId: string) {
    try {
      const { data, error } = await supabase
        .from('customer_queries')
        .update({ 
          assigned_to: adminId,
          status: 'in_progress'
        })
        .eq('id', queryId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // ADMIN: Respond to query
  async respondToQuery(queryId: string, response: string) {
    try {
      const { data, error } = await supabase
        .from('customer_queries')
        .update({ 
          admin_response: response,
          responded_at: new Date().toISOString(),
          status: 'resolved'
        })
        .eq('id', queryId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // ADMIN: Get query statistics
  async getQueryStats() {
    try {
      const { data, error } = await supabase
        .from('customer_queries')
        .select('status, priority, created_at');

      if (error) throw error;

      const stats = {
        total: data.length,
        open: data.filter(q => q.status === 'open').length,
        in_progress: data.filter(q => q.status === 'in_progress').length,
        resolved: data.filter(q => q.status === 'resolved').length,
        closed: data.filter(q => q.status === 'closed').length,
        urgent: data.filter(q => q.priority === 'urgent').length,
      };

      return { data: stats, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};