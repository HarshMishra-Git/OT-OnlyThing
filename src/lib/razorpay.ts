import { PaymentService } from '@/services/payment.service';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  orderId: string;
  amount: number;
  currency: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (response: RazorpaySuccessResponse) => void;
  onError: (error: any) => void;
}

export interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Load Razorpay script
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      resolve(true);
    };
    
    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

/**
 * Initialize Razorpay payment
 */
export async function initiateRazorpayPayment(options: RazorpayOptions) {
  try {
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay. Please check your internet connection.');
    }

    // Razorpay options
    const keyId = (import.meta.env.VITE_RAZORPAY_TEST_MODE === 'true')
      ? (import.meta.env.VITE_RAZORPAY_KEY_ID_TEST || import.meta.env.VITE_RAZORPAY_KEY_ID)
      : import.meta.env.VITE_RAZORPAY_KEY_ID;

    const razorpayOptions = {
      key: keyId,
      amount: options.amount,
      currency: options.currency,
      name: 'OT-OnlyThing',
      description: `Order #${options.orderNumber}`,
      order_id: options.orderId,
      image: '/L.jpg', // Your logo
      prefill: {
        name: options.customerName,
        email: options.customerEmail,
        contact: options.customerPhone,
      },
      theme: {
        color: '#2563eb', // Your brand color
      },
      handler: async function (response: RazorpaySuccessResponse) {
        try {
          // Verify payment on backend
          const { success } = await PaymentService.verifyPayment({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });

          if (success) {
            options.onSuccess(response);
          } else {
            options.onError(new Error('Payment verification failed'));
          }
        } catch (error) {
          options.onError(error);
        }
      },
      modal: {
        ondismiss: function () {
          options.onError(new Error('Payment cancelled by user'));
        },
      },
      retry: {
        enabled: true,
        max_count: 3,
      },
      timeout: 900, // 15 minutes
    };

    const razorpay = new window.Razorpay(razorpayOptions);

    // Handle payment failure
    razorpay.on('payment.failed', function (response: any) {
      options.onError({
        code: response.error.code,
        description: response.error.description,
        source: response.error.source,
        step: response.error.step,
        reason: response.error.reason,
      });
    });

    // Open Razorpay checkout
    razorpay.open();
  } catch (error) {
    console.error('Razorpay initialization error:', error);
    options.onError(error);
  }
}