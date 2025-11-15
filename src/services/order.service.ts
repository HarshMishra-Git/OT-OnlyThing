import { supabase } from '@/lib/supabase';
import type { Order, OrderWithItems, OrderFilters, CreateOrderDTO } from '@/types';
import { generateOrderNumber } from '@/lib/utils';
import { calcTax, calcShipping } from '@/lib/totals';

export const OrderService = {
  // Create order
  async createOrder(userId: string, orderData: CreateOrderDTO) {
    try {
      const orderNumber = generateOrderNumber();

      // Calculate totals
      const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = calcTax(subtotal);
      const shipping = calcShipping(subtotal);
      const total = subtotal + tax + shipping;

      // Get shipping address
      const { data: address } = await supabase
        .from('addresses')
        .select('*')
        .eq('id', orderData.shipping_address_id)
        .single();

      // Create order with confirmed status for online payments
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: userId,
          subtotal,
          tax,
          shipping_cost: shipping,
          total,
          shipping_address_id: orderData.shipping_address_id,
          shipping_full_name: address?.full_name,
          shipping_phone: address?.phone,
          shipping_address: `${address?.address_line1}, ${address?.city}, ${address?.state} ${address?.postal_code}`,
          customer_notes: orderData.customer_notes,
          payment_method: orderData.payment_method,
          status: orderData.payment_method === 'razorpay' ? 'confirmed' : 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Get product names for order items
      const productIds = orderData.items.map(item => item.product_id);
      const { data: products } = await supabase
        .from('products')
        .select('id, name')
        .in('id', productIds);

      const productMap = new Map(products?.map(p => [p.id, p.name]) || []);

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        product_name: productMap.get(item.product_id) || 'Unknown Product',
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return { data: order, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Get user orders
  async getUserOrders(userId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data as OrderWithItems[], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },

  // Get order by ID
  async getOrderById(orderId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*),
          profiles!user_id(full_name,email,phone)
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;

      return { data: data as OrderWithItems, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Get order by number
  async getOrderByNumber(orderNumber: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('order_number', orderNumber)
        .single();

      if (error) throw error;

      return { data: data as OrderWithItems, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // ADMIN: Get all orders
  async getAllOrders(filters?: OrderFilters) {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*),
          profiles!user_id(full_name,email,phone)
        `, { count: 'exact' });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.paymentStatus) {
        query = query.eq('payment_status', filters.paymentStatus);
      }

      if (filters?.search) {
        query = query.or(`order_number.ilike.%${filters.search}%,shipping_full_name.ilike.%${filters.search}%`);
      }

      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      return { data: data as OrderWithItems[], count: count || 0, error: null };
    } catch (error: any) {
      return { data: [], count: 0, error: error.message };
    }
  },

  // Update order status (users can cancel their own orders)
  async updateOrderStatus(orderId: string, status: string) {
    try {
      const updates: any = { status };

      if (status === 'shipped') {
        updates.shipped_at = new Date().toISOString();
      } else if (status === 'delivered') {
        updates.delivered_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // ADMIN: Update payment status
  async updatePaymentStatus(orderId: string, paymentStatus: string, paymentDetails?: any) {
    try {
      const updates: any = { payment_status: paymentStatus };

      if (paymentDetails) {
        updates.razorpay_payment_id = paymentDetails.razorpay_payment_id;
        updates.razorpay_signature = paymentDetails.razorpay_signature;
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // ADMIN: Add tracking number
  async addTrackingNumber(orderId: string, trackingNumber: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ tracking_number: trackingNumber })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // ADMIN: Get order statistics
  async getOrderStats() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status, total, created_at');

      if (error) throw error;

      const stats = {
        total: data.length,
        pending: data.filter(o => o.status === 'pending').length,
        confirmed: data.filter(o => o.status === 'confirmed').length,
        shipped: data.filter(o => o.status === 'shipped').length,
        delivered: data.filter(o => o.status === 'delivered').length,
        cancelled: data.filter(o => o.status === 'cancelled').length,
        revenue: data.reduce((sum, o) => sum + o.total, 0),
      };

      return { data: stats, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};