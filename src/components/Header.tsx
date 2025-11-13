import { useState, useEffect } from 'react';
import { User, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SearchBar } from './SearchBar';
import { CartPreview } from './CartPreview';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Calculate scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100 z-[60]">
        <div 
          className="h-full bg-black transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header 
        className={`fixed top-1 left-0 right-0 z-50 transition-all duration-600 ${
          scrolled 
            ? 'glass shadow-luxury py-2' 
            : 'bg-transparent py-4'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between gap-4 h-16">
          <button
            className="md:hidden p-2 hover:bg-black/5 rounded-lg transition-all duration-300 transform hover:scale-110"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <a 
            href="/" 
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-300 relative group shrink-0"
          >
            {/* Logo with Glow Effect */}
            <div className="relative">
              <img 
                src="/L.jpg" 
                alt="Only Thing Logo" 
                className="h-12 lg:h-14 w-auto object-contain relative z-10 transition-all duration-300 group-hover:brightness-110"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const textElement = e.currentTarget.nextElementSibling;
                  if (textElement) textElement.classList.remove('hidden');
                }}
              />
              <div className="absolute inset-0 bg-black/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-2xl font-black tracking-tighter hidden">
              ONLY THING
            </span>
          </a>

          {/* Search Bar - Desktop Only */}
          <div className="hidden lg:flex flex-1 max-w-3xl">
            <SearchBar />
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <NavLink href="/shop">SHOP</NavLink>
            <NavLink href="/quiz">ASSESSMENT</NavLink>
            <NavLink href="/about">ABOUT</NavLink>
            <NavLink href="/science">SCIENCE</NavLink>
            <NavLink href="/blog">BLOG</NavLink>
          </nav>

          <div className="flex items-center space-x-2 shrink-0">
            <CartPreview />
            <IconButton href={user ? "/account" : "/login"}>
              <User size={20} />
            </IconButton>
          </div>
        </div>
      </div>

        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-white/20 animate-fade-in-down">
            {/* Mobile Search */}
            <div className="px-4 pt-4">
              <SearchBar />
            </div>
            
            <nav className="flex flex-col px-4 py-6 space-y-1">
              <MobileNavLink href="/shop">SHOP</MobileNavLink>
              <MobileNavLink href="/quiz">ASSESSMENT</MobileNavLink>
              <MobileNavLink href="/about">ABOUT</MobileNavLink>
              <MobileNavLink href="/science">SCIENCE</MobileNavLink>
              <MobileNavLink href="/blog">BLOG</MobileNavLink>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className="px-4 py-2 text-sm font-bold relative group overflow-hidden rounded-lg transition-all duration-300"
    >
      <span className="relative z-10 group-hover:text-white transition-colors duration-300">{children}</span>
      <span className="absolute inset-0 bg-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400 ease-luxury"></span>
    </a>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className="text-sm font-bold py-3 px-4 hover:bg-black/5 rounded-lg transition-all duration-300 hover:translate-x-2"
    >
      {children}
    </a>
  );
}

function IconButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className="p-2.5 rounded-full hover:bg-black hover:text-white transition-all duration-400 ease-luxury transform hover:scale-110 hover:rotate-6"
    >
      {children}
    </a>
  );
}
