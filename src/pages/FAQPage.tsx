import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How are your products different from others?',
    answer: 'Our products are formulated using clinically-proven ingredients at optimal concentrations, backed by peer-reviewed research. We focus on efficacy, transparency, and personalization rather than marketing trends.',
  },
  {
    question: 'Are your products suitable for sensitive skin?',
    answer: 'Yes, all our products are formulated to be gentle and suitable for sensitive skin. We avoid common irritants and conduct extensive safety testing. However, we recommend doing a patch test before full application.',
  },
  {
    question: 'How long does it take to see results?',
    answer: 'Results vary depending on the product and skin concern. Most users notice improvements within 4-6 weeks of consistent use. Some products, like moisturizers, show immediate effects, while treatments for aging or pigmentation may take longer.',
  },
  {
    question: 'What is the skin assessment quiz?',
    answer: 'Our assessment is a comprehensive questionnaire that analyzes your skin type, concerns, lifestyle, and environmental factors to create a personalized product recommendation based on your unique needs.',
  },
  {
    question: 'Do you test on animals?',
    answer: 'Absolutely not. We are proudly cruelty-free and never test our products or ingredients on animals. We use alternative testing methods that are both ethical and scientifically rigorous.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day satisfaction guarantee. If you\'re not completely satisfied with your purchase, you can return unused products within 30 days for a full refund.',
  },
  {
    question: 'How should I store my products?',
    answer: 'Store products in a cool, dry place away from direct sunlight. Some products with active ingredients should be kept in their original packaging to maintain stability. Always check individual product labels for specific storage instructions.',
  },
  {
    question: 'Can I use multiple products together?',
    answer: 'Yes, our products are designed to work synergistically. Our assessment quiz will recommend a complete routine that\'s safe and effective when used together. If you\'re combining products from different brands, consult with a dermatologist.',
  },
];

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-center">
          FREQUENTLY ASKED QUESTIONS
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Find answers to common questions about our products, approach, and policies.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-2 border-gray-200">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-left font-bold">{faq.question}</span>
                <ChevronDown
                  className={`flex-shrink-0 ml-4 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  size={20}
                />
              </button>
              {openIndex === index && (
                <div className="px-8 pb-6 pt-2 border-t-2 border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 border-2 border-black p-12 text-center">
          <h2 className="text-3xl font-black mb-4">STILL HAVE QUESTIONS?</h2>
          <p className="text-gray-700 mb-6">
            Can't find what you're looking for? Our team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-black text-white font-bold text-sm tracking-wide uppercase hover:bg-gray-900 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
