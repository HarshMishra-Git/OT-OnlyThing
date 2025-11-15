import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, X, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '../lib/supabase';

interface CartItem {
  id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    slug: string;
  };
}

export function CartPreview() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (previewRef.current && !previewRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && user) {
      fetchCartItems();
    }
  }, [isOpen, user]);

  const fetchCartItems = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('id, quantity, products(id, name, price, image_url, slug)')
        .eq('user_id', user.id)
        .limit(5);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0);

  return (
    <div ref={previewRef} className="relative">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => window.location.href = '/cart'}
        className="relative p-2.5 rounded-full hover:bg-black hover:text-white transition-all duration-400 ease-luxury transform hover:scale-110 hover:rotate-6 group"
      >
        <ShoppingBag size={20} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300">
            {totalItems}
          </span>
        )}
      </button>

      {/* Cart Preview Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-down z-50">
          {!user ? (
            <div className="p-8 text-center">
              <ShoppingBag className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="font-bold text-gray-700 mb-2">Sign in to view your cart</p>
              <p className="text-sm text-gray-500 mb-6">Save your items and checkout faster</p>
              <a
                href="/login"
                className="inline-block px-6 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors duration-300"
              >
                Sign In
              </a>
            </div>
          ) : loading ? (
            <div className="p-8 text-center">
              <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 mt-3">Loading cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingBag className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="font-bold text-gray-700 mb-2">Your cart is empty</p>
              <p className="text-sm text-gray-500 mb-6">Add some products to get started</p>
              <a
                href="/shop"
                className="inline-block px-6 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors duration-300"
              >
                Shop Now
              </a>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 border-b-2 border-gray-100">
                  <h3 className="font-black text-lg">Your Cart ({totalItems} items)</h3>
                </div>
                <div className="divide-y-2 divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors duration-200 group">
                      <div className="flex items-center gap-3">
                        <a href={`/product/${item.products.slug}`} className="block">
                          <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-100 group-hover:border-black transition-colors duration-300">
                            <img
                              src={item.products.image_url}
                              alt={item.products.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </a>
                        <div className="flex-1 min-w-0">
                          <a
                            href={`/product/${item.products.slug}`}
                            className="font-bold text-sm truncate hover:underline block mb-1"
                          >
                            {item.products.name}
                          </a>
                          <p className="text-xs text-gray-500 mb-2">Qty: {item.quantity}</p>
                          <p className="font-black text-base">₹{(item.products.price * item.quantity).toFixed(0)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="p-4 bg-gray-50 border-t-2 border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-gray-600">Subtotal</span>
                  <span className="text-xl font-black">₹{subtotal.toFixed(0)}</span>
                </div>
                <a
                  href="/cart"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                >
                  View Cart
                  <ArrowRight size={18} />
                </a>
                <p className="text-xs text-center text-gray-500 mt-3">Shipping calculated at checkout</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
