import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { generateSEOTags, updateMetaTags } from '@/lib/seo';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Products',
    question: 'How are your products different from others?',
    answer: 'Our products are formulated using clinically-proven ingredients at optimal concentrations, backed by peer-reviewed research. We focus on efficacy, transparency, and personalization rather than marketing trends.',
  },
  {
    category: 'Products',
    question: 'Are your products suitable for sensitive skin?',
    answer: 'Yes, all our products are formulated to be gentle and suitable for sensitive skin. We avoid common irritants and conduct extensive safety testing. However, we recommend doing a patch test before full application.',
  },
  {
    category: 'Usage',
    question: 'How long does it take to see results?',
    answer: 'Results vary depending on the product and skin concern. Most users notice improvements within 4-6 weeks of consistent use. Some products, like moisturizers, show immediate effects, while treatments for aging or pigmentation may take longer.',
  },
  {
    category: 'Usage',
    question: 'Can I use multiple products together?',
    answer: 'Yes, our products are designed to work synergistically. Our assessment quiz will recommend a complete routine that\'s safe and effective when used together. If you\'re combining products from different brands, consult with a dermatologist.',
  },
  {
    category: 'Usage',
    question: 'How should I store my products?',
    answer: 'Store products in a cool, dry place away from direct sunlight. Some products with active ingredients should be kept in their original packaging to maintain stability. Always check individual product labels for specific storage instructions.',
  },
  {
    category: 'Assessment',
    question: 'What is the skin assessment quiz?',
    answer: 'Our assessment is a comprehensive questionnaire that analyzes your skin type, concerns, lifestyle, and environmental factors to create a personalized product recommendation based on your unique needs.',
  },
  {
    category: 'Ethics',
    question: 'Do you test on animals?',
    answer: 'Absolutely not. We are proudly cruelty-free and never test our products or ingredients on animals. We use alternative testing methods that are both ethical and scientifically rigorous.',
  },
  {
    category: 'Policy',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day satisfaction guarantee. If you\'re not completely satisfied with your purchase, you can return unused products within 30 days for a full refund.',
  },
];

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];
  const filteredFaqs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  useEffect(() => {
    const tags = generateSEOTags({
      title: 'FAQ | ONLY THING HEALTH AND WELLNESS LLP',
      description: 'Find answers to common questions about our products, approach, and policies.',
      keywords: 'faq, questions, support, skincare, wellness, OnlyThing',
      image: `${window.location.origin}/og-default.jpg`,
      url: window.location.href,
      type: 'website',
    });
    updateMetaTags(tags);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header - Black Background */}
      <section className="relative bg-black text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-600 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HelpCircle className="w-16 h-16 mx-auto mb-6 text-green-500" />
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              <span className="text-green-500">FAQ</span>
            </h1>
            <p className="text-xl md:text-2xl font-light text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions about our products, approach, and policies
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-gradient-to-br from-green-50 to-white border-b-2 border-green-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setOpenIndex(null);
                }}
                className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-600 hover:text-green-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? 'border-green-600 shadow-lg'
                    : 'border-gray-200 hover:border-green-400'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 md:px-8 py-6 flex justify-between items-center hover:bg-green-50 transition-colors"
                >
                  <div className="flex items-start gap-4 text-left">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      openIndex === index ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-bold text-gray-900 text-lg">{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={`flex-shrink-0 ml-4 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180 text-green-600' : 'text-gray-400'
                    }`}
                    size={24}
                  />
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 md:px-8 pb-6 pt-2 border-t-2 border-green-100 bg-green-50/50">
                        <div className="pl-12">
                          <p className="text-gray-700 leading-relaxed text-justify">{faq.answer}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <MessageCircle className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Can't find what you're looking for? Our team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-green-600 font-bold text-lg rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
