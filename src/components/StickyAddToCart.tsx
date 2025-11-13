import { useState, useEffect } from 'react';
import { ShoppingCart, Minus, Plus } from 'lucide-react';

interface StickyAddToCartProps {
  productName: string;
  productImage: string;
  price: number;
  stockQuantity: number;
  onAddToCart: (quantity: number) => void;
  isAdding: boolean;
}

export function StickyAddToCart({
  productName,
  productImage,
  price,
  stockQuantity,
  onAddToCart,
  isAdding,
}: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when scrolled past 600px
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up">
      <div className="bg-white border-t-2 border-gray-200 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Product Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 shrink-0">
                <img
                  src={productImage}
                  alt={productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-black text-sm sm:text-base truncate">{productName}</h3>
                <p className="text-xl sm:text-2xl font-black">₹{price.toFixed(0)}</p>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Quantity Selector */}
              <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 sm:p-3 hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus size={18} />
                </button>
                <span className="px-3 sm:px-4 font-bold text-sm sm:text-base border-x-2 border-gray-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
                  className="p-2 sm:p-3 hover:bg-gray-100 transition-colors"
                  disabled={quantity >= stockQuantity}
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => onAddToCart(quantity)}
                disabled={isAdding || stockQuantity === 0}
                className="flex items-center gap-2 px-4 sm:px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <ShoppingCart size={20} />
                <span className="hidden sm:inline">
                  {isAdding ? 'Adding...' : stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
