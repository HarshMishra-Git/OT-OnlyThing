import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function HeroSection() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncHeights = () => {
      if (!leftRef.current || !rightRef.current) return;
      const isDesktop = window.innerWidth >= 1024; // Tailwind lg breakpoint
      if (isDesktop) {
        const leftHeight = leftRef.current.offsetHeight;
        rightRef.current.style.height = `${leftHeight}px`;
      } else {
        rightRef.current.style.height = '';
      }
    };

    syncHeights();
    window.addEventListener('resize', syncHeights);
    return () => window.removeEventListener('resize', syncHeights);
  }, []);
  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient + Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-pink-50" />
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      
      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="py-8 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          {/* Left: Text + CTAs */}
          <div ref={leftRef} className="mx-auto lg:mx-auto flex flex-col justify-center items-center lg:items-center text-center lg:text-center lg:pl-0 lg:max-w-[640px] space-y-6 lg:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                Science-Backed Skincare
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-6xl font-black leading-tight animate-slide-up">
              THE FUTURE OF
              <br />
              SKINCARE IS
              <br />
              <span className="relative inline-block">
                INTELLIGENT
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 400 12" fill="none">
                  <path d="M2 10C133.333 3.33333 266.667 3.33333 398 10" stroke="black" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Science-backed, personalized solutions for radiant skin and holistic wellness
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/shop">
                <Button size="lg" className="min-w-[200px] group">
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/quiz">
                <Button size="lg" variant="outline" className="min-w-[200px]">
                  Take Assessment
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t-2 border-black">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                <div>
                  <div className="text-3xl font-black mb-1">10K+</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-black mb-1">4.9/5</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Average Rating</div>
                </div>
                <div>
                  <div className="text-3xl font-black mb-1">100%</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Clinically Proven</div>
                </div>
                <div>
                  <div className="text-3xl font-black mb-1">50K+</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Products Sold</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Image Mosaic (desktop) */}
          <div ref={rightRef} className="hidden lg:block h-full self-stretch">
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
              <div className="relative w-full h-full flex items-center justify-end">
                <div className="h-full w-auto border-2 border-black bg-white flex items-center justify-center">
                  <img src="/pic1.png" alt="Skincare Visual 1" className="h-full w-auto object-contain" />
                </div>
              </div>
              <div className="relative w-full h-full flex items-center justify-start">
                <div className="h-full w-auto border-2 border-black bg-white flex items-center justify-center">
                  <img src="/pic2.png" alt="Skincare Visual 2" className="h-full w-auto object-contain" />
                </div>
              </div>
              <div className="relative w-full h-full flex items-center justify-end">
                <div className="h-full w-auto border-2 border-black bg-white flex items-center justify-center">
                  <img src="/pic3.png" alt="Skincare Visual 3" className="h-full w-auto object-contain" />
                </div>
              </div>
              <div className="relative w-full h-full flex items-center justify-start">
                <div className="h-full w-auto border-2 border-black bg-white flex items-center justify-center">
                  <img src="/pic4.png" alt="Skincare Visual 4" className="h-full w-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Border removed to avoid overlapping the mosaic */}
    </section>
  );
}