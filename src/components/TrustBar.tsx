import { useEffect, useState, useRef } from 'react';
import { Users, Star, Award, Microscope } from 'lucide-react';

interface TrustStat {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

export function TrustBar() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats: TrustStat[] = [
    {
      icon: <Users size={32} />,
      value: 10000,
      suffix: '+',
      label: 'Happy Customers',
      color: '#FFD700' // Gold
    },
    {
      icon: <Star size={32} />,
      value: 4.8,
      suffix: '★',
      label: 'Average Rating',
      color: '#FF8C00' // Orange
    },
    {
      icon: <Award size={32} />,
      value: 100,
      suffix: '%',
      label: 'Clinically Proven',
      color: '#40E0D0' // Turquoise
    },
    {
      icon: <Microscope size={32} />,
      value: 7,
      suffix: '+',
      label: 'Science-Backed Products',
      color: '#9370DB' // Purple
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="bg-luxury-gradient py-16 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <TrustStatItem 
              key={index} 
              stat={stat} 
              isVisible={isVisible}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustStatItem({ 
  stat, 
  isVisible, 
  delay 
}: { 
  stat: TrustStat; 
  isVisible: boolean; 
  delay: number;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);
      
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = stat.value / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setCount(Math.min(increment * currentStep, stat.value));
        } else {
          setCount(stat.value);
          clearInterval(timer);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, hasAnimated, stat.value]);

  const formatNumber = (num: number) => {
    if (stat.suffix === '★') {
      return num.toFixed(1);
    }
    return Math.floor(num).toLocaleString();
  };

  return (
    <div 
      className="text-center group transform transition-all duration-600 hover:scale-105"
      style={{ 
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
      }}
    >
      {/* Icon with color accent */}
      <div 
        className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full transition-all duration-400 group-hover:scale-110"
        style={{ 
          backgroundColor: `${stat.color}15`,
          color: stat.color 
        }}
      >
        {stat.icon}
      </div>

      {/* Animated number */}
      <div className="mb-2">
        <span 
          className="text-4xl md:text-5xl font-black text-white transition-all duration-400"
          style={{
            textShadow: `0 0 20px ${stat.color}50`
          }}
        >
          {formatNumber(count)}
        </span>
        <span 
          className="text-3xl md:text-4xl font-black ml-1"
          style={{ color: stat.color }}
        >
          {stat.suffix}
        </span>
      </div>

      {/* Label */}
      <p className="text-sm md:text-base text-gray-300 uppercase tracking-wider font-bold">
        {stat.label}
      </p>

      {/* Hover glow effect */}
      <div 
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-400 blur-xl -z-10"
        style={{ 
          background: `radial-gradient(circle, ${stat.color}30 0%, transparent 70%)` 
        }}
      ></div>
    </div>
  );
}
