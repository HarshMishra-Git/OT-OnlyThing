import { useEffect, useState, useRef, useMemo } from 'react';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { PRODUCT_CATALOG } from '../data/products';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  category?: string;
  description?: string;
}

export function ProductSpotlight() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { data } = useFeaturedProducts(4);
  const mapped = useMemo(
    () =>
      (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        image_url: p.images?.[0]?.image_url ?? '',
        category: p.category?.name,
        description: p.short_description ?? '',
      })),
    [data]
  );

  useEffect(() => {
    if (mapped.length > 0) {
      setProducts(mapped);
    }
  }, [mapped]);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || products.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, products.length]);

  const handleProductClick = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
  };

  if (products.length === 0) return null;

  const activeProduct = products[activeIndex];
  const productTheme = PRODUCT_CATALOG.find(p => p.slug === activeProduct?.slug);
  const color = productTheme?.color.primary || '#FFFFFF';
  const bgGradient = productTheme?.color.gradient || 'from-gray-100 to-gray-200';

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 sm:py-32"
      style={{
        background: `linear-gradient(180deg, #000000 0%, ${color}08 50%, #000000 100%)`,
      }}
    >
      {/* Spotlight Container */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, ${color}40 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, ${color}30 0%, transparent 50%)`,
          }} />
        </div>

        {/* Stage Lighting - Stronger */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full transition-all duration-1000"
            style={{
              background: `radial-gradient(circle, ${color}25 0%, ${color}10 40%, transparent 70%)`,
              filter: 'blur(100px)',
            }}
          />
        </div>

        {/* Dark Vignette for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />

        {/* Product Spotlight - Alternating Layout */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.map((product, index) => {
            const isActive = index === activeIndex;
            const theme = PRODUCT_CATALOG.find(p => p.slug === product.slug);
            const prodColor = theme?.color.primary || '#FFFFFF';
            const isImageLeft = index % 2 === 0; // Alternate sides
            
            return (
              <div
                key={product.id}
                className="absolute inset-0 transition-all duration-1000"
                style={{
                  opacity: isActive ? 1 : 0,
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[80vh] ${!isImageLeft ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Product Image */}
                  <div 
                    className={`relative flex items-center justify-center h-[400px] sm:h-[500px] lg:h-[600px] ${!isImageLeft ? 'lg:col-start-2' : ''}`}
                    style={{
                      transform: isActive ? 'translateX(0)' : `translateX(${isImageLeft ? '-50px' : '50px'})`,
                      transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                  >
                    <SpotlightProduct3D product={product} color={prodColor} isActive={isActive} />
                  </div>

                  {/* Product Details */}
                  <div 
                    className={`relative text-white flex items-center ${!isImageLeft ? 'lg:col-start-1' : ''}`}
                    style={{
                      transform: isActive ? 'translateX(0)' : `translateX(${isImageLeft ? '50px' : '-50px'})`,
                      transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                  >
                    <div className="space-y-6 lg:space-y-8 max-w-xl">
                      {/* Category Badge */}
                      <div 
                        className="inline-block px-5 py-2.5 rounded-full text-xs font-bold tracking-widest backdrop-blur-sm"
                        style={{
                          background: `${prodColor}25`,
                          color: prodColor,
                          border: `2px solid ${prodColor}60`,
                          boxShadow: `0 4px 20px ${prodColor}40`,
                        }}
                      >
                        {product.category?.toUpperCase()}
                      </div>
                      
                      {/* Product Name */}
                      <h2 
                        className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight"
                        style={{
                          textShadow: `0 4px 20px rgba(0,0,0,0.9), 0 0 40px ${prodColor}50`,
                        }}
                      >
                        {product.name}
                      </h2>
                      
                      {/* Description */}
                      <p 
                        className="text-lg sm:text-xl lg:text-2xl text-gray-100 leading-relaxed"
                        style={{
                          textShadow: '0 2px 15px rgba(0,0,0,0.9)',
                        }}
                      >
                        {theme?.description || 'Experience premium quality skincare'}
                      </p>
                      
                      {/* Price with Background */}
                      <div className="pt-2">
                        <div 
                          className="inline-block px-6 py-3 rounded-2xl backdrop-blur-md"
                          style={{
                            background: `${prodColor}15`,
                            border: `2px solid ${prodColor}40`,
                          }}
                        >
                          <span 
                            className="text-5xl sm:text-6xl lg:text-7xl font-black"
                            style={{ 
                              color: prodColor,
                              textShadow: `0 4px 20px ${prodColor}80`,
                            }}
                          >
                            ₹{product.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <a
                          href={`/product/${product.slug}`}
                          className="px-8 py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 text-center backdrop-blur-sm flex items-center justify-center gap-2"
                          style={{
                            background: prodColor,
                            color: '#FFFFFF',
                            boxShadow: `0 10px 40px ${prodColor}70, inset 0 1px 0 rgba(255,255,255,0.3)`,
                            textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                          }}
                        >
                          View Details
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </a>
                        <button
                          className="px-8 py-4 rounded-full font-bold text-base sm:text-lg border-2 transition-all duration-300 transform hover:scale-105 backdrop-blur-md hover:bg-white/10"
                          style={{
                            borderColor: prodColor,
                            color: prodColor,
                            background: 'rgba(0,0,0,0.4)',
                            boxShadow: `0 4px 20px ${prodColor}40`,
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Progress Indicator */}
        <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-30">
          <div className="flex gap-3 px-6 py-3 rounded-full backdrop-blur-md bg-black/40 border border-white/10">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => handleProductClick(index)}
                className="h-2 rounded-full transition-all duration-500 cursor-pointer hover:opacity-80"
                style={{
                  width: index === activeIndex ? '48px' : '16px',
                  background: index === activeIndex ? color : 'rgba(255,255,255,0.3)',
                  boxShadow: index === activeIndex ? `0 0 20px ${color}60` : 'none',
                }}
                aria-label={`View product ${index + 1}`}
              />
            ))}
          </div>
          <p className="text-center mt-3 text-sm text-gray-400 font-medium">
            {isAutoPlaying ? 'Auto-playing' : 'Click to navigate'} • {activeIndex + 1} of {products.length}
          </p>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => {
            setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
            setIsAutoPlaying(false);
          }}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full backdrop-blur-md bg-black/40 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-black/60"
          style={{ color }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={() => {
            setActiveIndex((prev) => (prev + 1) % products.length);
            setIsAutoPlaying(false);
          }}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full backdrop-blur-md bg-black/40 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-black/60"
          style={{ color }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}

// 3D Product Component for Spotlight
function SpotlightProduct3D({ product, color, isActive }: { product: Product; color: string; isActive: boolean }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setRotation({
        x: Math.sin(Date.now() * 0.001) * 8,
        y: Math.cos(Date.now() * 0.0008) * 15
      });
      setScale(1 + Math.sin(Date.now() * 0.0005) * 0.05);
    }, 30);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div
      className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px]"
      style={{
        perspective: '1500px',
      }}
    >
      <div
        className="absolute inset-0 transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${scale})`,
        }}
      >
        {/* Product Container */}
        <div 
          className="relative w-full h-full rounded-3xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${color}35 0%, ${color}15 50%, rgba(0,0,0,0.9) 100%)`,
            backdropFilter: 'blur(30px)',
            border: `3px solid ${color}70`,
            boxShadow: `0 40px 100px -10px ${color}90, inset 0 0 100px ${color}20, 0 0 60px ${color}40`,
          }}
        >
          {/* Product Image */}
          <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-12">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain filter drop-shadow-2xl"
              style={{
                filter: `drop-shadow(0 20px 40px ${color}60)`,
              }}
            />
          </div>

          {/* Animated Ring Glow */}
          <div 
            className="absolute inset-0 rounded-3xl"
            style={{
              background: `conic-gradient(from 0deg, ${color}00, ${color}90, ${color}00)`,
              animation: 'spin 6s linear infinite',
              filter: 'blur(25px)',
              opacity: 0.5,
            }}
          />

          {/* Inner Glow */}
          <div 
            className="absolute inset-0 rounded-3xl"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${color}30, transparent 70%)`,
            }}
          />
        </div>

        {/* Platform Shadow */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-40 rounded-full blur-3xl -z-10"
          style={{
            background: `radial-gradient(circle, ${color}, transparent 70%)`,
            opacity: 0.8,
          }}
        />

        {/* Reflection */}
        <div 
          className="absolute top-full left-0 right-0 h-32 rounded-b-3xl opacity-20 -z-10"
          style={{
            background: `linear-gradient(180deg, ${color}40, transparent)`,
            transform: 'translateY(-20px) scaleY(-0.5)',
            filter: 'blur(20px)',
          }}
        />
      </div>
    </div>
  );
}
