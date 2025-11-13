import { useState } from 'react';
import { PRODUCT_CATALOG } from '../data/products';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  category?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Get product theme for color
  const productTheme = PRODUCT_CATALOG.find(p => p.slug === product.slug);
  const primaryColor = productTheme?.color.primary || '#000000';

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePosition({ x, y });
  };

  return (
    <a
      href={`/product/${product.slug}`}
      className="group block relative transform-gpu hover-lift"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Card Container with 3D effect */}
      <div 
        className="relative overflow-hidden bg-white border-2 transition-all duration-400 ease-luxury"
        style={{
          borderColor: isHovered ? primaryColor : '#e5e7eb',
          transform: isHovered 
            ? `perspective(1000px) rotateX(${-mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg) translateZ(20px)`
            : 'none'
        }}
      >
        {/* Color badge */}
        {product.category && (
          <div 
            className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm"
            style={{ backgroundColor: primaryColor }}
          >
            {product.category.toUpperCase()}
          </div>
        )}
        {/* Image Section with Overlay Effects */}
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-600 ease-smooth group-hover:scale-110"
          />
          
          {/* Glassmorphism overlay on hover */}
          <div className={`absolute inset-0 glass transition-opacity duration-400 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold uppercase tracking-wider text-black px-6 py-3 bg-white/90 backdrop-blur-sm shadow-luxury rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-400 opacity-0 group-hover:opacity-100">
                View Details
              </span>
            </div>
          </div>

          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-600 animate-shimmer"></div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-2 relative z-10 bg-white">
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold transition-colors duration-300 group-hover:text-black">
              {product.category}
            </p>
          )}
          <h3 className="text-lg font-bold transition-all duration-300 group-hover:translate-x-1">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black">
              ₹{product.price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Animated corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[60px] border-r-[60px] border-t-black border-r-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-x-full group-hover:translate-x-0"></div>
        </div>
      </div>

      {/* 3D Shadow */}
      <div 
        className="absolute inset-0 -z-10 bg-black/10 blur-xl transition-all duration-400"
        style={{
          transform: isHovered 
            ? `translateY(10px) scale(0.95)`
            : 'translateY(5px) scale(0.9)',
          opacity: isHovered ? 0.3 : 0.1
        }}
      ></div>
    </a>
  );
}
