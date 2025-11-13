import { useEffect, useRef } from 'react';

/**
 * Hook to observe elements and add animation classes when they enter viewport
 */
export function useScrollAnimation() {
  const elementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observe all elements with fade-in-observer class
    const elements = document.querySelectorAll('.fade-in-observer');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return elementsRef;
}

/**
 * Hook for parallax scroll effects
 */
export function useParallax(speed: number = 0.5) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;
      
      const scrolled = window.scrollY;
      const rect = elementRef.current.getBoundingClientRect();
      const elementTop = rect.top + scrolled;
      const windowHeight = window.innerHeight;
      
      if (scrolled + windowHeight > elementTop && scrolled < elementTop + rect.height) {
        const yPos = -(scrolled - elementTop) * speed;
        elementRef.current.style.transform = `translate3d(0, ${yPos}px, 0)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return elementRef;
}

/**
 * Hook for mouse parallax effect
 */
export function useMouseParallax(intensity: number = 20) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPos = (clientX / innerWidth - 0.5) * intensity;
      const yPos = (clientY / innerHeight - 0.5) * intensity;
      
      elementRef.current.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity]);

  return elementRef;
}
