import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { NewsletterService } from '@/services/newsletter.service';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: 'All Products', to: '/shop' },
      { label: 'Skincare', to: '/shop?category=skincare' },
      { label: 'Wellness', to: '/shop?category=wellness' },
      { label: 'Skin Assessment', to: '/quiz' },
    ],
    company: [
      { label: 'About', to: '/about' },
      { label: 'Our Science', to: '/science' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contact', to: '/contact' },
      { label: 'FAQs', to: '/faq' },
    ],
    legal: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Shipping Policy', to: '/shipping' },
      { label: 'Return Policy', to: '/returns' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link to="/" className="inline-flex items-center gap-3 mb-6" aria-label="OnlyThing Home">
                <div className="inline-flex items-center justify-center bg-white border-2 border-black p-2">
                  <img src="/LOGO.png" alt="OnlyThing" className="h-12 w-auto" />
                </div>
                <span className="text-white font-black uppercase tracking-wide text-xl">ONLY THING</span>
              </Link>
              <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                Intelligent, science-backed skincare and wellness solutions for radiant skin and holistic health.
              </p>
              
              {/* Newsletter */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide mb-4">
                  Stay Updated
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Get exclusive offers and skincare insights
                </p>
                <NewsletterForm />
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide mb-6">
                Shop
              </h3>
              <ul className="space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide mb-6">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide mb-6">
                Legal
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-gray-800 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <p className="text-sm text-gray-400">
              © {currentYear} OnlyThing health and wellness LLP. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white text-black border-2 border-black flex items-center justify-center hover:bg-black hover:border-white hover:text-white transition-all group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Contact */}
            <a
              href="mailto:support@onlything.com"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              support@onlything.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error('Please enter your email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      toast.error('Please enter a valid email');
      return;
    }
    setLoading(true);
    try {
      await NewsletterService.subscribe(trimmed, null, 'footer');
      toast.success('Thanks! You are subscribed.');
      setEmail('');
    } catch (err: any) {
      toast.error(err?.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex gap-2" onSubmit={onSubmit}>
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-3 bg-white text-black border-2 border-white focus:outline-none focus:border-gray-300"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-white text-black font-bold uppercase text-sm hover:bg-gray-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
}