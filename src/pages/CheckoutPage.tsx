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
import { AddressService } from '@/services/address.service';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Spinner } from '@/components/common/Spinner';
import { notify } from '@/lib/notify';
import { generateSEOTags, updateMetaTags } from '@/lib/seo';

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
  const { items, clearCart, getSubtotal, getTax, getShipping, getTotal } = useCartStore();
  const { user, profile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('cod');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    const tags = generateSEOTags({
      title: 'Checkout | OnlyThing',
      description: 'Complete your order securely with fast, reliable checkout.',
      keywords: ['checkout', 'payment', 'OnlyThing'],
      image: '/og-default.jpg',
      url: window.location.href,
      type: 'website',
    });
    updateMetaTags(tags);
  }, []);

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      notify.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    // Redirect if not logged in
    if (!user) {
      notify.error('Please login to continue');
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

      // Calculate totals using centralized util via store
      const subtotal = getSubtotal();
      const tax = getTax();
      const shippingCost = getShipping();
      const discount = 0;
      const orderTotal = getTotal();

      // Create or reuse shipping address
      const { data: address } = await AddressService.createAddress(user!.id, {
        full_name: data.fullName,
        phone: data.phone,
        address_line1: data.addressLine1,
        address_line2: data.addressLine2 || null,
        city: data.city,
        state: data.state,
        postal_code: data.postalCode,
        country: 'India',
        address_type: 'home',
        is_default: true,
      });
      if (!address) throw new Error('Failed to save shipping address');

      if (paymentMethod === 'cod') {
        // COD - Create order directly
        const { data: createdOrder } = await OrderService.createOrder(user!.id, {
          items: items.map(item => ({
            product_id: item.product.id,
            variant_id: item.variantId || undefined,
            quantity: item.quantity,
            price: item.unitPrice,
          })),
          shipping_address_id: address.id,
          customer_notes: data.notes,
          payment_method: 'cod',
        });
        if (!createdOrder) throw new Error('Failed to create order');

        clearCart();
        notify.success('Order placed successfully!');
        navigate(`/order-confirmation/${createdOrder.id}`);
      } else {
        // Razorpay - Use test mode
        setLoading(false);
        setProcessingPayment(true);

        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy';
        
        const options = {
          key: razorpayKey,
          amount: Math.round(orderTotal * 100),
          currency: 'INR',
          name: 'OnlyThing',
          description: 'Order Payment',
          image: window.location.origin + '/vite.svg',
          handler: async function (response: any) {
            try {
              const { data: createdOrder, error: orderError } = await OrderService.createOrder(user!.id, {
                items: items.map(item => ({
                  product_id: item.product.id,
                  variant_id: item.variantId || undefined,
                  quantity: item.quantity,
                  price: item.unitPrice,
                })),
                shipping_address_id: address.id,
                customer_notes: data.notes,
                payment_method: 'razorpay',
              });
              if (orderError || !createdOrder) {
                console.error('Order creation error:', orderError);
                throw new Error(orderError || 'Failed to create order');
              }

              clearCart();
              setProcessingPayment(false);
              notify.success('Payment successful! Order placed.');
              navigate(`/order-confirmation/${createdOrder.id}`);
            } catch (error: any) {
              console.error('Handler error:', error);
              setProcessingPayment(false);
              notify.error(error.message || 'Order creation failed');
            }
          },
          prefill: {
            name: data.fullName,
            email: data.email,
            contact: data.phone,
          },
          theme: {
            color: '#000000',
          },
          modal: {
            ondismiss: function() {
              setProcessingPayment(false);
              notify.error('Payment cancelled');
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      notify.error(error.message || 'Failed to process checkout');
      setLoading(false);
      setProcessingPayment(false);
    }
  };

  const subtotal = getSubtotal();
  const tax = getTax();
  const shippingCost = getShipping();
  const orderTotal = getTotal();

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

        {paymentError && (
          <div className="mb-6 p-4 rounded-md border border-red-200 bg-red-50 text-red-700">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <span>{paymentError}</span>
            </div>
          </div>
        )}

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
                <div className="space-y-3">
                  <div 
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'razorpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Online Payment</p>
                      <p className="text-sm text-gray-600">
                        Pay securely with card, UPI, or net banking
                      </p>
                    </div>
                  </div>
                  <div 
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">
                        Pay when you receive your order
                      </p>
                    </div>
                  </div>
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
                    <div key={`${item.product.id}-${item.variantId || ''}`} className="flex gap-3">
                      <img
                        src={item.product.images?.[0]?.image_url || '/placeholder.jpg'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ₹{(item.unitPrice * item.quantity).toFixed(2)}
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
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}