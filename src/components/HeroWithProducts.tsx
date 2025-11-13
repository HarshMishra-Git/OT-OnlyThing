import { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { supabase } from '../lib/supabase';
import { PRODUCT_CATALOG } from '../data/products';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  category?: string;
}

export function HeroWithProducts() {
  const [videoError, setVideoError] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [products, setProducts] = useState<Product[]>([]);
  const [orbitRotation, setOrbitRotation] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<number>(0);

  useEffect(() => {
    // Fetch products
    async function fetchProducts() {
      try {
        const { data } = await supabase
          .from('products')
          .select('id, name, slug, price, image_url, category')
          .eq('is_active', true)
          .limit(6);
        
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Orbit animation
  useEffect(() => {
    if (hoveredProduct) return; // Pause when hovering

    const animate = () => {
      orbitRef.current += 0.003;
      setOrbitRotation(orbitRef.current);
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [hoveredProduct]);

  // Calculate orbit positions for products
  const getOrbitPosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2 + orbitRotation;
    const radiusX = 380; // Horizontal radius
    const radiusY = 200; // Vertical radius for ellipse
    const x = Math.cos(angle) * radiusX;
    const y = Math.sin(angle) * radiusY;
    const z = Math.sin(angle) * 100; // Depth
    const scale = 0.7 + (Math.sin(angle) + 1) * 0.15; // Size variation based on position
    
    return { x, y, z, scale, angle };
  };

  return (
    <>
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-black grain-overlay">
        {/* Background with Parallax */}
        <div 
          className="absolute inset-0 transition-transform duration-100 ease-out"
          style={{
            transform: `translate3d(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px, 0) scale(1.1)`
          }}
        >
          {!videoError ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-40"
              onError={() => setVideoError(true)}
            >
              <source
                src="https://images.pexels.com/lib/api/pexels.mp4"
                type="video/mp4"
              />
            </video>
          ) : (
            <div
              className="w-full h-full bg-cover bg-center opacity-40"
              style={{
                backgroundImage: 'url(https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=1920)'
              }}
            />
          )}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80"></div>

        {/* Radial Gradient for Depth */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40"></div>

        {/* 3D ORBIT SYSTEM */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            perspective: '2000px',
            transform: `translate3d(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px, 0)`,
          }}
        >
          {/* Orbit Container */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Orbit Ring Guides */}
            <div className="absolute w-[760px] h-[400px] border border-white/5 rounded-full animate-pulse-slow"></div>
            <div className="absolute w-[680px] h-[350px] border border-white/3 rounded-full animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
            
            {/* Floating Products in Orbit */}
            {products.map((product, index) => {
              const { x, y, z, scale, angle } = getOrbitPosition(index, products.length);
              const productTheme = PRODUCT_CATALOG.find(p => p.slug === product.slug);
              const color = productTheme?.color.primary || '#FFFFFF';
              const isHovered = hoveredProduct === product.id;
              const zIndex = Math.round((Math.sin(angle) + 1) * 50) + 10;
              
              return (
                <div
                  key={product.id}
                  className="absolute pointer-events-auto"
                  style={{
                    transform: `translate3d(${x}px, ${y}px, ${z}px) scale(${isHovered ? scale * 1.3 : scale})`,
                    zIndex,
                    transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <OrbitProduct product={product} color={color} isHovered={isHovered} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-6xl mx-auto">
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-none animate-fade-in-up"
            style={{
              transform: `translate3d(${-mousePosition.x * 0.2}px, ${-mousePosition.y * 0.2}px, 0)`,
              textShadow: '0 10px 60px rgba(0, 0, 0, 1), 0 0 100px rgba(255, 255, 255, 0.1)'
            }}
          >
            THE FUTURE OF<br />
            <span className="inline-block transform hover:scale-105 transition-transform duration-400">SKINCARE</span>
            {' '}IS<br />
            <span className="text-gradient bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              INTELLIGENT
            </span>
          </h1>
          
          <p 
            className="text-lg md:text-2xl text-gray-200 mb-16 max-w-3xl mx-auto font-light tracking-wide leading-relaxed animate-fade-in-up"
            style={{
              transform: `translate3d(${-mousePosition.x * 0.15}px, ${-mousePosition.y * 0.15}px, 0)`,
              animationDelay: '0.2s',
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)'
            }}
          >
            Experience our revolutionary products orbiting in 3D space
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <Button
              variant="secondary"
              onClick={() => window.location.href = '/shop'}
              className="text-base shadow-3d-lg hover:shadow-glow-white transform hover:scale-105 transition-all duration-400 backdrop-blur-sm"
            >
              Explore Products
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/quiz'}
              className="text-base text-white border-2 border-white hover:bg-white hover:text-black shadow-3d hover:shadow-glow-white transform hover:scale-105 transition-all duration-400 backdrop-blur-sm"
            >
              Take Assessment
            </Button>
          </div>
          
          <p className="mt-12 text-sm text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            Hover over products • Click to explore
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/60 text-xs uppercase tracking-widest">Scroll</span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-60"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </section>
    </>
  );
}

// Orbit Product Component - Compact 3D Product Card
function OrbitProduct({ product, color, isHovered }: { product: Product; color: string; isHovered: boolean }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -20;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <a
      href={`/product/${product.slug}`}
      className="block relative group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative w-40 h-52"
        style={{
          perspective: '1000px',
        }}
      >
        {/* 3D Card Container */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${isHovered ? '40px' : '0px'}) scale(${isHovered ? 1.1 : 1})`,
          }}
        >
          {/* Glassmorphism Card */}
          <div 
            className="relative w-full h-full rounded-3xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${color}30 0%, ${color}10 50%, rgba(0,0,0,0.6) 100%)`,
              backdropFilter: 'blur(20px)',
              border: `2px solid ${color}50`,
              boxShadow: `0 20px 60px -10px ${color}70, inset 0 0 60px ${color}15, 0 0 80px ${color}30`,
            }}
          >
            {/* Animated Glow Ring */}
            <div 
              className="absolute inset-0 rounded-3xl opacity-60"
              style={{
                background: `conic-gradient(from 0deg, ${color}00, ${color}80, ${color}00)`,
                animation: isHovered ? 'spin 3s linear infinite' : 'none',
                filter: 'blur(15px)',
              }}
            />

            {/* Product Image */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-500"
                style={{
                  transform: isHovered ? 'scale(1.1) translateZ(20px)' : 'scale(1)',
                }}
              />
            </div>

            {/* Shine Sweep */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{
                transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
                transition: 'transform 0.8s ease-in-out',
              }}
            />

            {/* Product Info - Appears on Hover */}
            <div 
              className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/80 to-transparent transition-all duration-500"
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
              }}
            >
              <p className="text-[10px] font-bold tracking-wider mb-1" style={{ color }}>
                {product.category?.toUpperCase()}
              </p>
              <h3 className="text-xs font-black text-white line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm font-black text-white mt-1">
                ₹{product.price.toFixed(0)}
              </p>
            </div>

            {/* Particle Effects */}
            {isHovered && (
              <>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      background: color,
                      left: `${20 + i * 10}%`,
                      top: `${30 + (i % 3) * 20}%`,
                      animation: `float-particle 2s ease-in-out infinite`,
                      animationDelay: `${i * 0.1}s`,
                      opacity: 0.6,
                    }}
                  />
                ))}
              </>
            )}
          </div>

          {/* 3D Shadow Layer */}
          <div 
            className="absolute inset-0 bg-black/50 blur-2xl -z-10 rounded-3xl"
            style={{
              transform: 'translateZ(-40px) scale(0.85)',
              opacity: isHovered ? 0.8 : 0.5,
              transition: 'opacity 0.5s',
            }}
          />
        </div>

        {/* Glow Halo */}
        <div 
          className="absolute inset-0 blur-3xl rounded-full -z-20"
          style={{
            background: `radial-gradient(circle, ${color}60, transparent 70%)`,
            opacity: isHovered ? 0.8 : 0.4,
            transform: 'scale(1.2)',
            transition: 'opacity 0.5s',
          }}
        />
      </div>

      {/* Floating Keyframes */}
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { transform: translateY(-40px) translateX(15px); opacity: 0.8; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </a>
  );
}
