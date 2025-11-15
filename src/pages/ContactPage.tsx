import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Mail, Phone, Clock, MapPin, Send, CheckCircle, Instagram, Twitter, Facebook } from 'lucide-react';
import { generateSEOTags, updateMetaTags } from '@/lib/seo';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    const tags = generateSEOTags({
      title: 'Contact Us | OnlyThing',
      description: "We're here to help with any questions about our products.",
      keywords: ['contact', 'support', 'customer service', 'OnlyThing'],
      image: '/og-default.jpg',
      url: window.location.href,
      type: 'website',
    });
    updateMetaTags(tags);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      {/* Hero */}
      <div className="relative h-80 bg-gradient-to-br from-blue-900 to-purple-900 text-white flex items-center justify-center overflow-hidden mb-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Mail size={40} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
            CONTACT US
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto px-4">
            We're here to help with any questions about our products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border-2 border-black rounded-xl p-8">
              <h2 className="text-3xl font-black mb-6">GET IN TOUCH</h2>
              <p className="text-gray-700 leading-relaxed mb-8">
                Have questions about our products or need personalized skincare advice?
                We're here to help.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm mb-1">EMAIL</h3>
                    <a href="mailto:support@onlything.in" className="text-sm text-gray-700 hover:text-black">
                      support@onlything.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm mb-1">PHONE</h3>
                    <p className="text-sm text-gray-700">+91 XXX XXX XXXX</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm mb-1">BUSINESS HOURS</h3>
                    <p className="text-sm text-gray-700">Mon - Fri: 9 AM - 6 PM IST</p>
                    <p className="text-sm text-gray-700">Sat: 10 AM - 4 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm mb-1">LOCATION</h3>
                    <p className="text-sm text-gray-700">Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t-2 border-gray-200">
                <h3 className="font-black text-sm mb-4">FOLLOW US</h3>
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all">
                    <Twitter size={20} />
                  </a>
                  <a href="#" className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all">
                    <Facebook size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-gray-100 border-2 border-gray-200 rounded-xl p-6">
              <h3 className="font-black mb-2">NEED QUICK ANSWERS?</h3>
              <p className="text-sm text-gray-600 mb-4">Check our FAQ page for common questions</p>
              <Button variant="secondary" onClick={() => (window.location.href = '/faq')} className="w-full">
                View FAQs
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white border-2 border-black rounded-xl p-16 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle size={40} className="text-white" />
                </div>
                <h2 className="text-4xl font-black mb-4">MESSAGE RECEIVED!</h2>
                <p className="text-lg text-gray-700 mb-8 max-w-md mx-auto">
                  Thank you for contacting us. We'll get back to you within 24-48 hours.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="secondary">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border-2 border-black rounded-xl p-8 space-y-6">
                <h2 className="text-3xl font-black mb-6">SEND US A MESSAGE</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none transition-colors"
                    placeholder="Product inquiry, Support, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Message *</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                
                <Button type="submit" className="w-full flex items-center justify-center gap-2">
                  <Send size={20} />
                  Send Message
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  We typically respond within 24-48 hours during business days
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
