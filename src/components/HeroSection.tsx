import { useState, useEffect, useRef } from 'react';
import { Button } from './Button';

export function HeroSection() {
  const [videoError, setVideoError] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate product positions based on scroll
  const leftProductOpacity = Math.max(0, 1 - scrollY / 400);
  const leftProductTransform = scrollY > 50 ? `translate3d(${scrollY * 0.5}px, ${scrollY * 0.8}px, 0) rotate(${scrollY * 0.1}deg) scale(${Math.max(0.4, 1 - scrollY / 800)})` : 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
  
  const rightProductOpacity = Math.max(0, 1 - scrollY / 400);
  const rightProductTransform = scrollY > 50 ? `translate3d(-${scrollY * 0.5}px, ${scrollY * 0.8}px, 0) rotate(-${scrollY * 0.1}deg) scale(${Math.max(0.4, 1 - scrollY / 800)})` : 'translate3d(0, 0, 0) rotate(0deg) scale(1)';

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black grain-overlay">
      {/* Background Video/Image with Parallax */}
      <div 
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale(1.1)`
        }}
      >
        {!videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-50"
            onError={() => setVideoError(true)}
          >
            <source
              src="https://images.pexels.com/lib/api/pexels.mp4"
              type="video/mp4"
            />
          </video>
        ) : (
          <div
            className="w-full h-full bg-cover bg-center opacity-50"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=1920)'
            }}
          />
        )}
      </div>

      {/* Gradient Overlays for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30"></div>

      {/* Animated Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-white/5 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-white/5 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/3 rounded-full animate-rotate-slow"></div>
      </div>

      {/* LEFT 3D FLOATING PRODUCT */}
      <div 
        className="hidden lg:block absolute left-8 xl:left-20 top-1/2 -translate-y-1/2 w-48 xl:w-64 pointer-events-none z-20 transition-all duration-300"
        style={{
          opacity: leftProductOpacity,
          transform: leftProductTransform,
        }}
      >
        <Floating3DProduct 
          color="#00CED1"
          mouseX={mousePosition.x}
          mouseY={mousePosition.y}
          side="left"
        />
      </div>

      {/* RIGHT 3D FLOATING PRODUCT */}
      <div 
        className="hidden lg:block absolute right-8 xl:right-20 top-1/2 -translate-y-1/2 w-48 xl:w-64 pointer-events-none z-20 transition-all duration-300"
        style={{
          opacity: rightProductOpacity,
          transform: rightProductTransform,
        }}
      >
        <Floating3DProduct 
          color="#FF69B4"
          mouseX={mousePosition.x}
          mouseY={mousePosition.y}
          side="right"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
        <h1 
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-display-lg font-black mb-8 tracking-tighter leading-none animate-fade-in-up"
          style={{
            transform: `translate3d(${-mousePosition.x * 0.5}px, ${-mousePosition.y * 0.5}px, 0)`,
            textShadow: '0 10px 40px rgba(0, 0, 0, 0.8), 0 0 80px rgba(255, 255, 255, 0.1)'
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
            transform: `translate3d(${-mousePosition.x * 0.3}px, ${-mousePosition.y * 0.3}px, 0)`,
            animationDelay: '0.2s'
          }}
        >
          Science-backed, personalized solutions for radiant skin and holistic wellness
        </p>
        
        <div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          <Button
            variant="secondary"
            onClick={() => window.location.href = '/shop'}
            className="text-base shadow-3d-lg hover:shadow-glow-white transform hover:scale-105 transition-all duration-400"
          >
            Shop Now
          </Button>
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/quiz'}
            className="text-base text-white border-2 border-white hover:bg-white hover:text-black shadow-3d hover:shadow-glow-white transform hover:scale-105 transition-all duration-400"
          >
            Take Assessment
          </Button>
        </div>
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
  );
}

// 3D Floating Product Component
function Floating3DProduct({ color, mouseX, mouseY, side }: { color: string; mouseX: number; mouseY: number; side: 'left' | 'right' }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation({
        x: Math.sin(Date.now() * 0.001) * 15,
        y: Math.cos(Date.now() * 0.001) * 15 + (side === 'left' ? -20 : 20)
      });
    }, 30);
    return () => clearInterval(interval);
  }, [side]);

  return (
    <div
      className="relative w-full aspect-[3/4]"
      style={{
        perspective: '1000px',
        transform: `translate3d(${side === 'left' ? mouseX * 0.1 : -mouseX * 0.1}px, ${mouseY * 0.1}px, 0)`
      }}
    >
      <div
        className="absolute inset-0 transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(20px)`,
        }}
      >
        {/* Bottle */}
        <div 
          className="relative w-full h-full rounded-t-3xl overflow-hidden"
          style={{
            background: `linear-gradient(180deg, ${color}30 0%, ${color}10 100%)`,
            boxShadow: `inset 0 0 60px ${color}40, 0 20px 80px -10px ${color}60`,
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Liquid */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-3/4 opacity-50"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${color}50 50%, ${color} 100%)`,
            }}
          >
            <div 
              className="absolute bottom-0 left-0 right-0 h-1/3 animate-wave"
              style={{
                background: color,
                borderRadius: '50% 50% 0 0',
              }}
            />
          </div>

          {/* Shine */}
          <div className="absolute inset-y-0 left-8 w-12 bg-gradient-to-r from-white/40 via-white/20 to-transparent blur-sm" />

          {/* Glow */}
          <div 
            className="absolute inset-0 blur-2xl opacity-40"
            style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }}
          />
        </div>

        {/* Cap */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-12 rounded-t-2xl"
          style={{
            background: `linear-gradient(180deg, ${color} 0%, ${color}dd 100%)`,
            boxShadow: `0 -5px 20px ${color}80`,
            transform: 'translateZ(15px)',
          }}
        />
      </div>

      {/* Platform glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 rounded-full blur-3xl opacity-40"
        style={{ background: color }}
      />

      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-wave {
          animation: wave 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
