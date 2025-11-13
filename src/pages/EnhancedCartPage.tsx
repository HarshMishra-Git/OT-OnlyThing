import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Trash2, Heart, Tag, Truck, ShieldCheck, Clock, X } from 'lucide-react';

interface CartItem {
  id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    slug: string;
    stock_quantity: number;
  };
}

export function EnhancedCartPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

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
        .select('id, quantity, products(id, name, price, image_url, slug, stock_quantity)')
        .eq('user_id', user!.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(itemId: string, newQuantity: number) {
    if (newQuantity < 1) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) throw error;
      fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }

  async function removeItem(itemId: string) {
    setRemovingId(itemId);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      // Animate out before removing
      setTimeout(() => {
        fetchCartItems();
        setRemovingId(null);
      }, 300);
    } catch (error) {
      console.error('Error removing item:', error);
      setRemovingId(null);
    }
  }

  async function saveForLater(itemId: string) {
    setSavingId(itemId);
    // Placeholder - would save to wishlist or saved items table
    setTimeout(() => {
      removeItem(itemId);
      setSavingId(null);
    }, 500);
  }

  function applyCoupon(e: React.FormEvent) {
    e.preventDefault();
    // Mock coupon validation
    const validCoupons: Record<string, number> = {
      'SAVE10': 10,
      'WELCOME20': 20,
      'FIRST15': 15,
    };

    if (validCoupons[couponCode.toUpperCase()]) {
      setAppliedCoupon({
        code: couponCode.toUpperCase(),
        discount: validCoupons[couponCode.toUpperCase()],
      });
      setCouponCode('');
    } else {
      alert('Invalid coupon code');
    }
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0
  );

  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            YOUR CART
            <span className="block text-lg font-normal text-gray-500 mt-2">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </h1>
          {cartItems.length > 0 && (
            <button
              onClick={() => window.location.href = '/shop'}
              className="text-sm font-bold border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-all"
            >
              Continue Shopping
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-300 rounded-xl">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Tag size={40} className="text-gray-400" />
            </div>
            <p className="text-xl text-gray-500 mb-8 font-bold">Your cart is empty</p>
            <Button onClick={() => (window.location.href = '/shop')}>Start Shopping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`
                    group relative flex gap-6 bg-white border-2 border-gray-200 p-6 rounded-xl
                    hover:border-black hover:shadow-xl transition-all duration-300
                    ${removingId === item.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
                  `}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'slideInUp 0.5s ease-out',
                  }}
                >
                  <img
                    src={item.products.image_url}
                    alt={item.products.name}
                    className="w-28 h-28 object-cover border-2 border-gray-200 rounded-lg group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg mb-1 hover:underline cursor-pointer">
                          {item.products.name}
                        </h3>
                        <p className="text-sm text-gray-500">In Stock</p>
                      </div>
                      <p className="text-2xl font-black">₹{item.products.price.toFixed(2)}</p>
                    </div>

                    {item.products.stock_quantity < 5 && (
                      <p className="text-xs text-red-600 font-bold mb-3 flex items-center gap-1">
                        <Clock size={14} />
                        Only {item.products.stock_quantity} left!
                      </p>
                    )}

                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center border-2 border-black rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-4 py-2 font-bold hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-6 py-2 font-bold border-x-2 border-black min-w-[60px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.min(item.products.stock_quantity, item.quantity + 1)
                            )
                          }
                          className="px-4 py-2 font-bold hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => saveForLater(item.id)}
                        disabled={savingId === item.id}
                        className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black transition-colors"
                      >
                        <Heart size={18} />
                        {savingId === item.id ? 'Saving...' : 'Save for Later'}
                      </button>

                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={removingId === item.id}
                        className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-red-600 transition-colors ml-auto"
                      >
                        <Trash2 size={18} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Trust Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-black">
                    <Truck size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Free Shipping</p>
                    <p className="text-xs text-gray-600">On orders over ₹999</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-black">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Secure Payment</p>
                    <p className="text-xs text-gray-600">100% Protected</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-black">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Fast Delivery</p>
                    <p className="text-xs text-gray-600">2-4 business days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-black p-8 rounded-xl space-y-6 sticky top-24 shadow-xl">
                <h2 className="text-2xl font-black border-b-2 border-gray-200 pb-4">
                  ORDER SUMMARY
                </h2>

                {/* Coupon Code */}
                <div className="border-2 border-gray-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag size={18} />
                    <span className="font-bold text-sm">Have a coupon?</span>
                  </div>
                  <form onSubmit={applyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm font-bold"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors text-sm"
                    >
                      Apply
                    </button>
                  </form>
                  {appliedCoupon && (
                    <div className="mt-3 flex items-center justify-between text-sm bg-green-50 border border-green-200 rounded px-3 py-2">
                      <span className="text-green-700 font-bold">
                        {appliedCoupon.code} applied! ({appliedCoupon.discount}% off)
                      </span>
                      <button onClick={() => setAppliedCoupon(null)}>
                        <X size={16} className="text-green-700" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t-2 border-gray-200 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount ({appliedCoupon.discount}%)</span>
                      <span className="font-bold text-green-600">-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-bold">
                      {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {subtotal < 999 && (
                    <p className="text-xs text-gray-500">
                      Add ₹{(999 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  )}
                </div>

                <div className="border-t-2 border-black pt-6">
                  <div className="flex justify-between text-2xl font-black mb-6">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <Button onClick={() => (window.location.href = '/checkout')} className="w-full">
                    Proceed to Checkout
                  </Button>
                  <p className="text-xs text-center text-gray-500 mt-4">
                    Estimated delivery: 2-4 business days
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
