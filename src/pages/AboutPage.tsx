import { motion } from 'framer-motion';
import { Microscope, Brain, Sparkles, TrendingUp } from 'lucide-react';
import { COMPANY_INFO, CORE_BELIEFS } from '@/lib/constants';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {COMPANY_INFO.name}
            </h1>
            <p className="text-2xl md:text-3xl text-blue-600 font-semibold mb-8">
              {COMPANY_INFO.tagline}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              At Only Thing Health & Wellness, we know that real beauty and wellness start with <strong>intelligence</strong> — not just intuition.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              We are India's first <strong>science-supported, data-driven wellness business</strong> committed to formulating intelligent solutions that fill the gap between skincare, nutrition, and total well-being.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Our philosophy is straightforward but deep: <strong>every product, every ingredient, and every statement has to be driven by science and supported by facts.</strong> We blend innovative bioscience, AI-driven research, and clinically established actives to create products that listen to your body's changing needs — and act smart.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed">
              Whether Intelligent Skincare that responds to your skin's cellular cycles or Smart Nutrition that nourishes your gut-brain-skin axis, our innovations are designed for the future — where self-care intersects with bio-science.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Beliefs */}
      <section className="py-20 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Our Core Beliefs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CORE_BELIEFS.map((belief, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-lg"
              >
                <div className="text-4xl mb-4">{belief.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {belief.title}
                </h3>
                <p className="text-gray-600">
                  {belief.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              We Don't Follow Trends
            </h2>
            <p className="text-2xl font-light mb-8">
              We translate data from charts, translate biology, and create transformations.
            </p>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mt-12">
              <p className="text-xl italic">
                "We don't just make products; we design smart wellness ecosystems 
                that adapt, personalize, and evolve to future need."
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}