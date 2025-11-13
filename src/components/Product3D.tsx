import { useEffect, useRef, useState } from 'react';
import { PRODUCT_CATALOG } from '../data/products';

interface Product3DProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image_url: string;
    category?: string;
  };
}

export function Product3D({ product }: Product3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });

  // Get product theme for color
  const productTheme = PRODUCT_CATALOG.find(p => p.slug === product.slug);
  const primaryColor = productTheme?.color.primary || '#000000';
  const gradient = productTheme?.color.gradient || 'from-gray-100 to-gray-200';

  useEffect(() => {
    if (!isHovered) {
      // Auto-rotate when not hovered
      const interval = setInterval(() => {
        setRotation(prev => ({
          x: Math.sin(Date.now() * 0.001) * 5,
          y: prev.y + 0.3
        }));
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // 3D Tilt Effect
    const x = (e.clientY - rect.top - rect.height / 2) / 10;
    const y = (e.clientX - rect.left - rect.width / 2) / 10;
    setRotation({ x, y });
    
    // Magnetic Effect
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.3;
    const distanceY = (e.clientY - centerY) * 0.3;
    setMagneticOffset({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    setMagneticOffset({ x: 0, y: 0 });
  };

  return (
    <a
      href={`/product/${product.slug}`}
      className="group block relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseLeave();
      }}
      style={{
        transform: `translate(${magneticOffset.x}px, ${magneticOffset.y}px)`,
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative h-[500px] perspective-[1200px]"
        style={{ perspective: '1200px' }}
      >
        {/* 3D Product Container */}
        <div
          className="absolute inset-0 transition-all duration-700 ease-out"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(${isHovered ? '50px' : '0px'})`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Product Stage - Circular Platform */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32">
            <div 
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradient} opacity-30 blur-xl`}
              style={{
                transform: 'rotateX(75deg) translateZ(-50px)',
                boxShadow: `0 0 80px ${primaryColor}40`
              }}
            />
            <div 
              className="absolute inset-0 rounded-full border-2 opacity-20"
              style={{
                borderColor: primaryColor,
                transform: 'rotateX(75deg) translateZ(-40px)',
              }}
            />
          </div>

          {/* Main Product - Bottle/Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="relative w-48 h-80 transition-all duration-500"
              style={{
                transformStyle: 'preserve-3d',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {/* Bottle Base */}
              <div 
                className="absolute inset-x-0 bottom-0 h-4/5 rounded-t-3xl overflow-hidden"
                style={{
                  background: `linear-gradient(180deg, ${primaryColor}20 0%, ${primaryColor}10 100%)`,
                  boxShadow: `inset 0 0 60px ${primaryColor}30, 0 20px 60px -10px ${primaryColor}40`,
                  backdropFilter: 'blur(10px)',
                  transform: 'translateZ(0px)',
                }}
              >
                {/* Liquid Effect */}
                <div 
                  className="absolute inset-0 opacity-40"
                  style={{
                    background: `linear-gradient(180deg, transparent 20%, ${primaryColor}30 80%, ${primaryColor}50 100%)`,
                  }}
                >
                  {/* Liquid Wave Animation */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-32 opacity-60"
                    style={{
                      background: primaryColor,
                      borderRadius: '50% 50% 0 0',
                      animation: 'wave 3s ease-in-out infinite',
                    }}
                  />
                </div>

                {/* Shine Effect */}
                <div 
                  className="absolute inset-y-0 left-4 w-16 bg-gradient-to-r from-white/40 via-white/20 to-transparent blur-sm"
                  style={{
                    transform: 'translateZ(1px)',
                  }}
                />

                {/* Product Image Overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-overlay opacity-40"
                  />
                </div>
              </div>

              {/* Cap/Top */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-12 rounded-t-2xl"
                style={{
                  background: `linear-gradient(180deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
                  boxShadow: `0 -5px 20px ${primaryColor}60, inset 0 -2px 10px rgba(0,0,0,0.3)`,
                  transform: 'translateZ(10px)',
                }}
              >
                <div 
                  className="absolute inset-x-2 top-2 h-3 rounded-full bg-white/20"
                />
              </div>

              {/* Label Strip */}
              <div 
                className="absolute left-0 right-0 top-1/3 h-20 bg-white/90 backdrop-blur-sm flex items-center justify-center"
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transform: 'translateZ(5px)',
                }}
              >
                <div className="text-center px-4">
                  <p className="text-xs font-bold tracking-wider" style={{ color: primaryColor }}>
                    {product.category?.toUpperCase()}
                  </p>
                  <p className="text-sm font-black mt-1 line-clamp-2">
                    {product.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Particles */}
          {isHovered && (
            <>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-float"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 3) * 20}%`,
                    background: primaryColor,
                    opacity: 0.3,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '3s',
                  }}
                />
              ))}
            </>
          )}
        </div>

        {/* Color Glow Background */}
        <div 
          className="absolute inset-0 -z-10 blur-3xl opacity-30 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at center, ${primaryColor} 0%, transparent 70%)`,
            opacity: isHovered ? 0.5 : 0.3,
          }}
        />
      </div>

      {/* Product Info Below */}
      <div className="mt-8 text-center">
        <p 
          className="text-xs font-bold tracking-wider mb-2"
          style={{ color: primaryColor }}
        >
          {product.category?.toUpperCase()}
        </p>
        <h3 className="text-xl font-black mb-2 group-hover:translate-x-1 transition-transform duration-300">
          {product.name}
        </h3>
        <p className="text-2xl font-black">
          ₹{product.price.toFixed(2)}
        </p>
        
        {/* View Details Button */}
        <button 
          className="mt-4 px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
          style={{
            backgroundColor: primaryColor,
            color: 'white',
          }}
        >
          View Details
        </button>
      </div>

      {/* Add keyframes via inline style tag */}
      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-10px) scaleY(1.1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { transform: translateY(-50px) translateX(20px); opacity: 0.6; }
        }
      `}</style>
    </a>
  );
}
