import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './Button';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email });

      if (error) throw error;

      setMessage('Successfully subscribed to newsletter');
      setEmail('');
    } catch (error: any) {
      setMessage(error.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Top Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/L.jpg" 
                alt="Only Thing Logo" 
                className="h-12 w-auto object-contain"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
              <h3 className="text-3xl font-black tracking-tighter hover:scale-105 transition-transform duration-300 inline-block">
                ONLY THING
              </h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Intelligent, science-backed skincare and wellness solutions.
            </p>
            {/* Social Icons Placeholder */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-110">
                <span className="sr-only">Instagram</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-bold mb-6 tracking-widest uppercase">SHOP</h4>
            <ul className="space-y-3">
              {['All Products', 'Skincare', 'Wellness', 'Skin Assessment'].map((item, i) => (
                <li key={i}>
                  <a 
                    href={item === 'Skin Assessment' ? '/quiz' : `/shop${item !== 'All Products' ? `?category=${item.toLowerCase()}` : ''}`}
                    className="text-sm text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-bold mb-6 tracking-widest uppercase">COMPANY</h4>
            <ul className="space-y-3">
              {[
                { label: 'About', href: '/about' },
                { label: 'Our Science', href: '/science' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact' },
                { label: 'FAQs', href: '/faq' },
              ].map((link, i) => (
                <li key={i}>
                  <a 
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold mb-6 tracking-widest uppercase">NEWSLETTER</h4>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              Stay updated with science-backed insights and exclusive offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 focus:outline-none focus:border-white/40 rounded-lg text-sm placeholder-gray-400 transition-all duration-300"
                />
              </div>
              <Button
                type="submit"
                variant="secondary"
                disabled={loading}
                className="w-full shadow-3d hover:shadow-glow-white transform hover:scale-105"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
              {message && (
                <p className={`text-xs ${message.includes('Success') ? 'text-green-300' : 'text-red-300'}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Only Thing Health & Wellness LLP. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Shipping Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
