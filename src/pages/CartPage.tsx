import { useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '../components/Button';
import { Trash2 } from 'lucide-react';
import { generateSEOTags, updateMetaTags } from '@/lib/seo';
import { Link } from 'react-router-dom';

export function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();

  useEffect(() => {
    const tags = generateSEOTags({
      title: 'Your Cart | OnlyThing',
      description: 'Review items in your cart and proceed to checkout securely.',
      keywords: ['cart', 'shopping cart', 'OnlyThing'],
      image: items[0]?.product?.images?.[0]?.image_url || '/og-default.jpg',
      url: window.location.href,
      type: 'website',
    });
    updateMetaTags(tags);
  }, [items]);

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-black mb-12 tracking-tight">
          YOUR CART
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-6">Your cart is empty</p>
            <Link to="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.variantId || ''}`}
                  className="flex gap-6 border-2 border-gray-200 p-6"
                >
                  <img
                    src={item.product.images?.[0]?.image_url || '/placeholder.jpg'}
                    alt={item.product.name}
                    loading="lazy"
                    className="w-24 h-24 object-cover border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">
                      {item.product.name}
                    </h3>
                    <p className="text-xl font-black mb-4">
                      ₹{item.unitPrice.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border-2 border-black">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variantId)}
                          className="px-3 py-1 font-bold hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 font-bold border-x-2 border-black">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variantId)}
                          className="px-3 py-1 font-bold hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.variantId)}
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
                  <Link to="/checkout">
                    <Button className="w-full">Proceed to Checkout</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
