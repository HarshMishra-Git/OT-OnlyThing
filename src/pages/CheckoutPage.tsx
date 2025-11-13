import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  CreditCard, MapPin, ShoppingBag, ArrowRight, 
  Lock, CheckCircle 
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { OrderService } from '@/services/order.service';
import { PaymentService } from '@/services/payment.service';
import { initiateRazorpayPayment } from '@/lib/razorpay';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Spinner } from '@/components/common/Spinner';
import toast from 'react-hot-toast';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone number is required'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(5, 'Postal code is required'),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const { user, profile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    // Redirect if not logged in
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    // Pre-fill form with user data
    if (profile) {
      setValue('fullName', profile.full_name || '');
      setValue('email', profile.email || '');
      setValue('phone', profile.phone || '');
    }
  }, [items, user, profile, navigate, setValue]);

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setLoading(true);

      // Calculate totals
      const subtotal = total;
      const tax = subtotal * 0.18; // 18% GST
      const shippingCost = subtotal > 500 ? 0 : 50;
      const discount = 0;
      const orderTotal = subtotal + tax + shippingCost - discount;

      // Create order in database
      const order = await OrderService.createOrder({
        user_id: user!.id,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping_address: {
          full_name: data.fullName,
          phone: data.phone,
          address_line1: data.addressLine1,
          address_line2: data.addressLine2,
          city: data.city,
          state: data.state,
          postal_code: data.postalCode,
        },
        subtotal,
        tax,
        shipping_cost: shippingCost,
        discount,
        total: orderTotal,
        customer_notes: data.notes,
      });

      // Create Razorpay order
      const razorpayOrder = await PaymentService.createRazorpayOrder(
        orderTotal,
        order.id
      );

      setLoading(false);
      setProcessingPayment(true);

      // Initiate Razorpay payment
      await initiateRazorpayPayment({
        orderId: razorpayOrder.razorpay_order_id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderNumber: order.order_number,
        customerName: data.fullName,
        customerEmail: data.email,
        customerPhone: data.phone,
        onSuccess: async (response) => {
          try {
            // Update order with payment details
            await OrderService.updateOrderPayment(order.id, {
              payment_status: 'paid',
              payment_method: 'razorpay',
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              status: 'confirmed',
            });

            // Clear cart
            clearCart();

            toast.success('Payment successful! Order placed.');
            navigate(`/order-confirmation/${order.id}`);
          } catch (error) {
            console.error('Order update error:', error);
            toast.error('Payment successful but order update failed. Please contact support.');
          }
        },
        onError: async (error) => {
          console.error('Payment error:', error);
          
          // Update order status to failed
          await OrderService.updateOrderPayment(order.id, {
            payment_status: 'failed',
            status: 'cancelled',
          });

          toast.error(error.description || 'Payment failed. Please try again.');
          setProcessingPayment(false);
        },
      });
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to process checkout');
      setLoading(false);
      setProcessingPayment(false);
    }
  };

  const subtotal = total;
  const tax = subtotal * 0.18;
  const shippingCost = subtotal > 500 ? 0 : 50;
  const orderTotal = subtotal + tax + shippingCost;

  if (processingPayment) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Processing Payment
          </h2>
          <p className="text-gray-600">
            Please complete the payment in the Razorpay window
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order securely</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      {...register('fullName')}
                      label="Full Name"
                      placeholder="John Doe"
                      error={errors.fullName?.message}
                    />
                  </div>
                  <Input
                    {...register('email')}
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                  />
                  <Input
                    {...register('phone')}
                    label="Phone"
                    placeholder="+91 9876543210"
                    error={errors.phone?.message}
                  />
                  <div className="md:col-span-2">
                    <Input
                      {...register('addressLine1')}
                      label="Address Line 1"
                      placeholder="Street address"
                      error={errors.addressLine1?.message}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      {...register('addressLine2')}
                      label="Address Line 2 (Optional)"
                      placeholder="Apartment, suite, etc."
                    />
                  </div>
                  <Input
                    {...register('city')}
                    label="City"
                    placeholder="Mumbai"
                    error={errors.city?.message}
                  />
                  <Input
                    {...register('state')}
                    label="State"
                    placeholder="Maharashtra"
                    error={errors.state?.message}
                  />
                  <div className="md:col-span-2">
                    <Input
                      {...register('postalCode')}
                      label="Postal Code"
                      placeholder="400001"
                      error={errors.postalCode?.message}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Notes (Optional)
                    </label>
                    <Textarea
                      {...register('notes')}
                      rows={3}
                      placeholder="Any special instructions for delivery?"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h2>
                <div className="flex items-center gap-3 p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                  <input
                    type="radio"
                    checked
                    readOnly
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Razorpay</p>
                    <p className="text-sm text-gray-600">
                      Pay securely with credit/debit card, UPI, or net banking
                    </p>
                  </div>
                  <img
                    src="https://razorpay.com/assets/razorpay-glyph.svg"
                    alt="Razorpay"
                    className="h-8"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (18% GST)</span>
                    <span className="text-gray-900">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  {subtotal < 500 && (
                    <p className="text-xs text-green-600">
                      Add ₹{(500 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₹{orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                {/* Security Badge */}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Lock className="w-3 h-3" />
                  <span>Secure checkout powered by Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}