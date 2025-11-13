import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Check, CreditCard, MapPin, Package, ChevronRight } from 'lucide-react';

interface CartItem {
  id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
}

type Step = 'shipping' | 'payment' | 'review';

export function CheckoutPage() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('shipping');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    fetchCartItems();
  }, [user]);

  async function fetchCartItems() {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('id, quantity, products(id, name, price, image_url)')
        .eq('user_id', user!.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const steps = [
    { id: 'shipping' as Step, label: 'Shipping', icon: MapPin },
    { id: 'payment' as Step, label: 'Payment', icon: CreditCard },
    { id: 'review' as Step, label: 'Review', icon: Package },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  function validateShipping() {
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode) {
      alert('Please fill in all shipping information');
      return false;
    }
    return true;
  }

  function handleNext() {
    if (currentStep === 'shipping' && validateShipping()) setCurrentStep('payment');
    else if (currentStep === 'payment') setCurrentStep('review');
  }

  function handleBack() {
    if (currentStep === 'payment') setCurrentStep('shipping');
    else if (currentStep === 'review') setCurrentStep('payment');
  }

  async function handlePlaceOrder() {
    setPlacing(true);
    try {
      const orderNumber = `OT${Date.now()}`;
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user!.id,
          order_number: orderNumber,
          total_amount: total,
          shipping_address: shippingInfo,
          status: 'pending',
          payment_status: 'pending',
          payment_method: paymentMethod,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.products.id,
        quantity: item.quantity,
        price_at_purchase: item.products.price,
      }));

      await supabase.from('order_items').insert(orderItems);
      await supabase.from('cart_items').delete().eq('user_id', user!.id);

      window.location.href = `/order-confirmation?order=${orderNumber}`;
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to place order');
    } finally {
      setPlacing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-6">Your cart is empty</h1>
          <Button onClick={() => (window.location.href = '/shop')}>Go Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-6xl font-black mb-12">CHECKOUT</h1>

        {/* Progress Steps */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStepIndex;
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-2 ${isActive ? 'bg-black text-white' : 'bg-white border-gray-300'}`}>
                      {index < currentStepIndex ? <Check size={20} /> : <Icon size={20} />}
                    </div>
                    <span className={`text-sm font-bold ${isActive ? 'text-black' : 'text-gray-400'}`}>{step.label}</span>
                  </div>
                  {index < steps.length - 1 && <div className={`h-0.5 flex-1 mx-4 ${index < currentStepIndex ? 'bg-black' : 'bg-gray-300'}`} />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border-2 border-black rounded-xl p-8">
            {currentStep === 'shipping' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black flex items-center gap-3"><MapPin size={28} />Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" value={shippingInfo.fullName} onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })} className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none font-bold" />
                  <input type="email" placeholder="Email" value={shippingInfo.email} onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })} className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none font-bold" />
                  <input type="tel" placeholder="Phone" value={shippingInfo.phone} onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })} className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none font-bold md:col-span-2" />
                  <input type="text" placeholder="Address" value={shippingInfo.address} onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })} className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none font-bold md:col-span-2" />
                  <input type="text" placeholder="City" value={shippingInfo.city} onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })} className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none font-bold" />
                  <input type="text" placeholder="State" value={shippingInfo.state} onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })} className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none font-bold" />
                  <input type="text" placeholder="ZIP Code" value={shippingInfo.zipCode} onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })} className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none font-bold md:col-span-2" />
                </div>
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black flex items-center gap-3"><CreditCard size={28} />Payment Method</h2>
                <div className="grid grid-cols-3 gap-4">
                  {(['card', 'upi', 'cod'] as const).map((method) => (
                    <button key={method} onClick={() => setPaymentMethod(method)} className={`p-4 border-2 rounded-lg font-bold ${paymentMethod === method ? 'border-black bg-black text-white' : 'border-gray-300'}`}>
                      {method === 'card' ? 'Card' : method === 'upi' ? 'UPI' : 'COD'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 'review' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black flex items-center gap-3"><Package size={28} />Review Order</h2>
                <div className="border-2 border-gray-200 rounded-lg p-4 space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.products.image_url} alt={item.products.name} className="w-16 h-16 object-cover border-2 rounded" />
                      <div className="flex-1">
                        <p className="font-bold text-sm">{item.products.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold">₹{(item.products.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-8 pt-6 border-t-2 border-gray-200">
              {currentStep !== 'shipping' && <Button variant="secondary" onClick={handleBack} className="flex-1">Back</Button>}
              {currentStep !== 'review' ? (
                <Button onClick={handleNext} className="flex-1">Next <ChevronRight size={20} className="ml-2" /></Button>
              ) : (
                <Button onClick={handlePlaceOrder} disabled={placing} className="flex-1">{placing ? 'Placing...' : 'Place Order'}</Button>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-black rounded-xl p-6 sticky top-24">
              <h3 className="text-xl font-black mb-4">ORDER SUMMARY</h3>
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>₹{tax.toFixed(2)}</span></div>
              </div>
              <div className="border-t-2 border-black pt-4">
                <div className="flex justify-between text-xl font-black"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
