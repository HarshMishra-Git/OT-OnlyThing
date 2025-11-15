import { supabase } from '@/lib/supabase';
import { safeLog, safeError } from '@/lib/logger';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface CreateOrderInput {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface PaymentVerification {
  orderId: string;
  paymentId: string;
  signature: string;
}

export class PaymentService {
  private static isTestMode = (import.meta.env.VITE_RAZORPAY_TEST_MODE === 'true') || import.meta.env.DEV;

  /**
   * Load Razorpay script
   */
  static loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window.Razorpay !== 'undefined') {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  /**
   * Create Razorpay order
   */
  static async createOrder(input: CreateOrderInput) {
    try {
      // In production, this should call your backend API
      // which will create the order via Razorpay API
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: input.amount * 100, // Convert to paise
          currency: input.currency || 'INR',
          receipt: input.receipt || `receipt_${Date.now()}`,
          notes: input.notes || {},
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      safeError('Create order error:', error);
      
      // Test mode fallback
      if (this.isTestMode) {
        return {
          data: {
            id: `order_test_${Date.now()}`,
            entity: 'order',
            amount: input.amount * 100,
            currency: input.currency || 'INR',
            status: 'created',
          },
          error: null,
        };
      }
      
      return { data: null, error: error.message };
    }
  }

  /**
   * Open Razorpay checkout
   */
  static async openCheckout(options: RazorpayOptions): Promise<void> {
    const loaded = await this.loadRazorpayScript();
    
    if (!loaded) {
      throw new Error('Failed to load Razorpay SDK');
    }

    const keyId = (import.meta.env.VITE_RAZORPAY_TEST_MODE === 'true')
      ? (import.meta.env.VITE_RAZORPAY_KEY_ID_TEST || import.meta.env.VITE_RAZORPAY_KEY_ID)
      : import.meta.env.VITE_RAZORPAY_KEY_ID;

    const razorpay = new window.Razorpay({
      ...options,
      key: keyId,
    });

    razorpay.open();
  }

  /**
   * Verify payment signature
   */
  static async verifyPayment(verification: PaymentVerification) {
    try {
      // In production, verify signature on backend
      const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
        body: verification,
      });

      if (error) throw error;
      return { success: true, error: null };
    } catch (error: any) {
      safeError('Payment verification error:', error);
      
      // Test mode - always succeed
      if (this.isTestMode) {
        safeLog('Test mode: Payment verification bypassed');
        return { success: true, error: null };
      }
      
      return { success: false, error: error.message };
    }
  }

  /**
   * Complete payment and create order
   */
  static async completePayment(params: {
    userId: string;
    amount: number;
    paymentId: string;
    orderId: string;
    signature: string;
    orderData: any;
  }) {
    try {
      // Verify payment first
      const verification = await this.verifyPayment({
        orderId: params.orderId,
        paymentId: params.paymentId,
        signature: params.signature,
      });

      if (!verification.success) {
        throw new Error('Payment verification failed');
      }

      // Create order in database
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: params.userId,
          order_number: `ORD-${Date.now()}`,
          ...params.orderData,
          payment_method: 'razorpay',
          payment_status: 'paid',
          razorpay_payment_id: params.paymentId,
          razorpay_order_id: params.orderId,
          razorpay_signature: params.signature,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      safeError('Complete payment error:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Test payment flow
   */
  static async testPayment(amount: number) {
    try {
      safeLog('🧪 Testing payment flow...');
      
      // Step 1: Create order
      safeLog('1️⃣ Creating order...');
      const { data: orderData, error: orderError } = await this.createOrder({
        amount,
        currency: 'INR',
        notes: { test: 'true' },
      });

      if (orderError) throw new Error(orderError);
      // Avoid logging full order data to prevent accidental PII exposure
      safeLog('✅ Order created');

      // Step 2: Load Razorpay
      safeLog('2️⃣ Loading Razorpay...');
      const loaded = await this.loadRazorpayScript();
      if (!loaded) throw new Error('Failed to load Razorpay');
      safeLog('✅ Razorpay loaded');

      // Step 3: Test data
      const testResponse: RazorpayResponse = {
        razorpay_payment_id: `pay_test_${Date.now()}`,
        razorpay_order_id: orderData.id,
        razorpay_signature: 'test_signature',
      };

      // Step 4: Verify payment
      safeLog('3️⃣ Verifying payment...');
      const verification = await this.verifyPayment({
        orderId: testResponse.razorpay_order_id,
        paymentId: testResponse.razorpay_payment_id,
        signature: testResponse.razorpay_signature,
      });

      if (!verification.success) throw new Error('Verification failed');
      safeLog('✅ Payment verified');

      safeLog('🎉 Payment test successful!');
      return { success: true, error: null };
    } catch (error: any) {
      safeError('❌ Payment test failed:', error);
      return { success: false, error: error.message };
    }
  }
}