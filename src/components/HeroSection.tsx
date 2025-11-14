import { useState, useEffect, useRef } from 'react';
import { Button } from './Button';

export default function HeroSection() {
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Gradient Overlays for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
      
      {/* Animated Particles/Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-600/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full mb-8 border border-white/20 animate-fade-in-up">
          <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>
          <span className="text-sm font-semibold tracking-wide">Science-Backed Skincare</span>
        </div>

        <h1 
          ref={titleRef}
          className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-tight animate-fade-in-up"
        >
          THE FUTURE OF
          <br />
          <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
            SKINCARE
          </span>
          {' '}IS
          <br />
          <span className="text-accent-400">INTELLIGENT</span>
        </h1>
        
        <p 
          className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          Personalized, science-backed solutions for radiant skin and holistic wellness
        </p>
        
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          <button
            onClick={() => window.location.href = '/shop'}
            className="group relative px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Shop Now
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
          <button
            onClick={() => window.location.href = '/quiz'}
            className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
          >
            Take Assessment
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>4.8★ Average Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Clinically Proven</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>10,000+ Happy Customers</span>
          </div>
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

// 3D Floating Product Component - KEEP AS IS
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