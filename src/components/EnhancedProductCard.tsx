import { useState, useRef } from 'react';
import { Heart, ShoppingCart, Eye, Sparkles } from 'lucide-react';
import { PRODUCT_CATALOG } from '../data/products';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  category?: string;
  stock_quantity?: number;
}

interface EnhancedProductCardProps {
  product: Product;
}

export function EnhancedProductCard({ product }: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const productTheme = PRODUCT_CATALOG.find(p => p.slug === product.slug);
  const color = productTheme?.color.primary || '#000000';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 15;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -15;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const isNew = Math.random() > 0.7; // Demo: 30% chance of "NEW" badge
  const isLowStock = product.stock_quantity && product.stock_quantity < 10;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.05 : 1})`,
        transition: 'transform 0.3s ease-out',
      }}
      className="group relative bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-black hover:shadow-2xl transition-all duration-300"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {isNew && (
          <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full flex items-center gap-1 animate-fade-in">
            <Sparkles size={12} />
            NEW
          </span>
        )}
        {isLowStock && (
          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
            LOW STOCK
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsWishlisted(!isWishlisted);
        }}
        className={`absolute top-3 right-3 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          isWishlisted
            ? 'bg-red-500 text-white scale-110'
            : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-red-500 hover:text-white'
        }`}
      >
        <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* Product Image */}
      <a href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Color Overlay on Hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          style={{ background: `linear-gradient(135deg, ${color} 0%, transparent 100%)` }}
        />

        {/* Quick View Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-sm">
          <button
            onClick={(e) => {
              e.preventDefault();
              // Quick view modal would open here
              window.location.href = `/product/${product.slug}`;
            }}
            className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-black hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2"
          >
            <Eye size={18} />
            Quick View
          </button>
        </div>
      </a>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p
          className="text-xs font-bold tracking-wider mb-2"
          style={{ color }}
        >
          {product.category?.toUpperCase()}
        </p>

        {/* Product Name */}
        <a
          href={`/product/${product.slug}`}
          className="block font-black text-lg mb-2 line-clamp-2 hover:underline transition-colors"
        >
          {product.name}
        </a>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-2xl font-black" style={{ color }}>
            ₹{product.price.toFixed(0)}
          </p>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic
              window.location.href = `/product/${product.slug}`;
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2.5 bg-black text-white rounded-full hover:scale-110 transform transition-transform duration-300"
          >
            <ShoppingCart size={18} />
          </button>
        </div>

        {/* Rating Stars (placeholder) */}
        <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-4 h-4"
              fill={i < 4 ? 'black' : 'none'}
              stroke="black"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
          <span className="text-xs text-gray-500 ml-1">(24)</span>
        </div>
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
        />
      </div>
    </div>
  );
}
