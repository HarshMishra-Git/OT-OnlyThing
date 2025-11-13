import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Trash2 } from 'lucide-react';

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

export function CartPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

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
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      fetchCartItems();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-black mb-12 tracking-tight">
          YOUR CART
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-6">Your cart is empty</p>
            <Button onClick={() => window.location.href = '/shop'}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 border-2 border-gray-200 p-6"
                >
                  <img
                    src={item.products.image_url}
                    alt={item.products.name}
                    className="w-24 h-24 object-cover border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">
                      {item.products.name}
                    </h3>
                    <p className="text-xl font-black mb-4">
                      ₹{item.products.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border-2 border-black">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 font-bold hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 font-bold border-x-2 border-black">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.min(item.products.stock_quantity, item.quantity + 1)
                            )
                          }
                          className="px-3 py-1 font-bold hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-500 hover:text-black transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="border-2 border-black p-8 space-y-6 sticky top-24">
                <h2 className="text-2xl font-black">ORDER SUMMARY</h2>
                <div className="space-y-3 border-t-2 border-gray-200 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-bold">Calculated at checkout</span>
                  </div>
                </div>
                <div className="border-t-2 border-black pt-6">
                  <div className="flex justify-between text-xl font-black mb-6">
                    <span>Total</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <Button
                    onClick={() => window.location.href = '/checkout'}
                    className="w-full"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
