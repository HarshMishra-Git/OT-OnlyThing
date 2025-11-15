import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Microscope, FlaskConical, Target, Users, Layers, Shield } from 'lucide-react';
import { generateSEOTags, updateMetaTags } from '@/lib/seo';

export function SciencePage() {
  useEffect(() => {
    const tags = generateSEOTags({
      title: 'Our Science | ONLY THING HEALTH AND WELLNESS LLP',
      description: 'Science-backed formulations curated & conceptualised in Korea. Evidence-led, precision-sourced, and clinically informed wellness solutions.',
      keywords: 'science, research, Korean wellness, clinical formulations, OnlyThing',
      image: `${window.location.origin}/science/hero.jpg`,
      url: window.location.href,
      type: 'website',
    });
    updateMetaTags(tags);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header - Black Background with Quote */}
      <section className="relative bg-black text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
              <span className="text-red-600">SCIENCE</span>
            </h1>
            <p className="text-xl md:text-2xl font-light text-gray-300 max-w-4xl mx-auto mb-6 leading-relaxed">
              "Science isn't a claim for us — it's our commitment, our process, and our identity."
            </p>
            <p className="text-lg text-red-500 font-semibold">
              Curated &amp; conceptualised in Korea
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <div className="border-l-4 border-red-600 pl-8 mb-12">
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-relaxed">
                At Only Thing Health &amp; Wellness, every formulation begins with scientific clarity — not trend-driven assumptions.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed text-justify">
                Our development framework combines modern dermatological and nutritional science, clinically validated actives, and the precision-driven wellness philosophy of Korea. Each product is designed to target root-level mechanisms rather than superficial, short-term results.
              </p>
            </div>

            {/* Image Placeholder 1 */}
            <div className="my-12 rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200">
              <img
                src="/science/lab-research.jpg"
                alt="Scientific research and development"
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect fill="%23f3f4f6" width="800" height="400"/%3E%3Ctext fill="%23374151" font-family="Arial" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ELab Research Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4-Pillar Scientific Development Model */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              4-Pillar Scientific Development Model
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                Icon: Target,
                title: 'Evidence-Led Ingredient Selection',
                description: 'Only biomolecules and actives backed by peer-reviewed research, clinical scoring, and measurable outcome data are approved for formulation. We are committed to provide you more stable, most innovative, clinically backed and data driven formulations.',
                color: 'red',
              },
              {
                Icon: Microscope,
                title: 'Engineered with Advanced Korean Philosophy',
                description: 'Through our collaboration with Korean R&amp;D experts, we integrate next-generation health &amp; wellness systems, high-purity actives, and micro-encapsulation technologies engineered for deeper absorption, enhanced bioavailability, and improved skin and gut compatibility.',
                color: 'black',
              },
              {
                Icon: FlaskConical,
                title: 'Human-Centric Functional Testing',
                description: 'Products undergo stability testing, dermatological &amp; safety assessments, and performance evaluation under realistic usage conditions. We continually refine compositions based on data, not assumptions.',
                color: 'red',
              },
              {
                Icon: Layers,
                title: 'Holistic Mechanism Design',
                description: 'Our approach respects the interconnection between gut + mind + skin + lifestyle systems. Korean wellness philosophy emphasizes prevention, balance, and long-term cellular resilience — not aggressive or quick-fix results.',
                color: 'black',
              },
            ].map(({ Icon, title, description, color }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`inline-flex p-4 rounded-xl ${color === 'red' ? 'bg-red-600' : 'bg-black'} shadow-lg mb-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{title}</h3>
                <p className="text-gray-700 leading-relaxed text-justify">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Placeholder 2 - Korean Lab */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-200">
            <img
              src="/science/korean-lab.jpg"
              alt="Korean research laboratory"
              className="w-full h-[500px] object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="500"%3E%3Crect fill="%23f3f4f6" width="1200" height="500"/%3E%3Ctext fill="%23374151" font-family="Arial" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EKorean Laboratory Image%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
        </div>
      </section>

      {/* Core Scientific Values */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Our Core <span className="text-red-600">Scientific Values</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              'Clinically informed, not marketing inflated',
              'Precision-sourced actives with traceable quality standards',
              'Minimalist, functional, efficacy-first formulation thinking',
              'Synergy-based ingredient pairing and mechanism mapping',
              'Future-facing innovation with global R&amp;D insights',
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-black text-white">
                    {idx + 1}
                  </div>
                  <p className="text-gray-200 leading-relaxed">{value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Placeholder 3 - Testing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                Rigorous Testing <span className="text-red-600">Standards</span>
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed text-justify mb-6">
                Every formulation undergoes comprehensive testing protocols including stability assessments, dermatological safety evaluations, and real-world performance validation.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed text-justify">
                Our commitment to scientific integrity means we never compromise on quality, safety, or efficacy — ensuring every product delivers measurable results.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200"
            >
              <img
                src="/science/testing.jpg"
                alt="Product testing and quality control"
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23f3f4f6" width="600" height="400"/%3E%3Ctext fill="%23374151" font-family="Arial" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ETesting Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 to-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Shield className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              Science-Driven. Data-Backed. Results-Focused.
            </h2>
            <p className="text-xl text-gray-200 leading-relaxed">
              Experience the difference that true scientific commitment makes in your wellness journey.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
