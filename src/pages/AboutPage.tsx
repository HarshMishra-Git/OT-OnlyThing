import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Microscope, Brain, Sparkles, TrendingUp, Shield, Rocket, BarChart3, Fingerprint, Heart, Leaf, FlaskConical, Layers } from 'lucide-react';
import { generateSEOTags, updateMetaTags } from '@/lib/seo';

export function AboutPage() {
  useEffect(() => {
    const tags = generateSEOTags({
      title: `About | ONLY THING HEALTH AND WELLNESS LLP`,
      description:
        "India's first science‑backed, data‑driven wellness company creating intelligent skincare and smart nutrition.",
      keywords: 'about, ONLY THING, wellness, intelligent skincare, science, K CONNECT',
      image: `${window.location.origin}/about/hero.png`,
      url: window.location.href,
      type: 'website',
    });
    updateMetaTags(tags);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0a0d14] via-[#0b111b] to-[#0a0d14]">
      {/* decorative background grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden>
        <div className="w-full h-full bg-[linear-gradient(0deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      {/* Hero / Header */}
      <section className="relative py-16 md:py-24 px-4 bg-black text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-white drop-shadow-sm text-4xl md:text-6xl font-extrabold tracking-tight leading-tight md:leading-[1.1]">
              ONLY THING HEALTH AND WELLNESS LLP
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-3xl md:max-w-4xl">
              India's first science‑backed, data‑driven wellness company. We create intelligent skincare and
              smart nutrition that listen to your biology and respond to change — designed for the gut–brain–skin
              axis and built for real‑life consistency.
            </p>
            <div className="mt-8 flex flex-nowrap gap-3 md:gap-4 overflow-x-auto">
              <span className="inline-flex items-center bg-white text-black border-2 border-white px-3 py-2 rounded-md text-sm font-semibold">
                <Microscope className="w-4 h-4 mr-2" /> Bioscience First
              </span>
              <span className="inline-flex items-center bg-white text-black border-2 border-white px-3 py-2 rounded-md text-sm font-semibold">
                <Brain className="w-4 h-4 mr-2" /> Data-Driven Decisions
              </span>
              <span className="inline-flex items-center bg-white text-black border-2 border-white px-3 py-2 rounded-md text-sm font-semibold">
                <Sparkles className="w-4 h-4 mr-2" /> Intelligent Skincare
              </span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="hidden md:block">
            <img
              src="/about/hero.png"
              alt="Hero illustration: science‑backed wellness"
              className="w-full md:h-[520px] h-[380px] object-contain md:scale-110"
            />
          </motion.div>
        </div>
      </section>

      {/* Our Story — White Background with Futuristic Elements */}
      <section className="relative py-20 bg-white text-black overflow-hidden">
        {/* Subtle gradient overlays */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-cyan-200/30 to-transparent rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 bg-clip-text text-transparent">
              Our Story
            </h2>
            <p className="mt-6 text-2xl md:text-3xl font-semibold text-blue-800">It is the beginning of Intelligent Wellness!</p>
          </motion.div>

          {/* Story Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-3xl p-8 md:p-12 shadow-xl border border-blue-200">
              <div className="space-y-6 text-gray-800 leading-relaxed text-lg text-justify">
                <p>
                  In a world full with flimsy promises, shortcuts, and trends, we posed the straightforward question: <span className="text-blue-700 font-bold">What if wellness could think for itself?</span>
                </p>
                <p>
                  That was the question that lit the fire behind Only Thing Health &amp; Wellness — India's pioneer company that specializes in developing evidence-based, data-driven smart solutions for health, beauty, and ageless longevity.
                </p>
                <p>
                  Born out of a conviction that mind and body are not different entities, but intertwined systems, we developed our philosophy of intelligence — the ability to listen, adapt, and evolve.
                </p>
                <p>
                  Formulas that incorporate clinical science, biotechnology, and real time data to provide measurable, meaningful, and personal results.
                </p>
                <p>
                  Every drop, every ingredient, and every innovation we craft is driven by one goal — to enable people to <span className="text-blue-700 font-bold">live smarter, look younger, and feel stronger</span>, from cell to soul.
                </p>
                <p className="text-blue-800 font-semibold text-xl">Because at the end of the day, there's really only one thing that matters — science driven by truth.</p>
              </div>

              {/* Seoul to Soul section */}
              <div className="mt-12 pt-8 border-t-2 border-blue-300">
                <h3 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">FROM SEOUL TO SOUL</h3>
                <p className="mt-4 text-blue-700 text-xl font-bold">Born from Korean wisdom, perfected by science.</p>
                <div className="mt-6 space-y-5 text-gray-800 text-lg leading-relaxed text-justify">
                  <p>
                    At The Only Thing, we believe true beauty begins with balance — between skin, body, and mind. Our journey started with a vision to bring intelligent wellness and skincare solutions inspired by Korea's most advanced philosophies in self-care.
                  </p>
                  <p>
                    In collaboration with leading Korean experts and laboratories, each of our products is conceptualised, curated, and validated in Korea, combining time-honoured Korean rituals with modern dermatological innovation. From formulation to testing, every step reflects Korea's deep respect for skin harmony and holistic wellness.
                  </p>
                  <p>
                    Our philosophy is simple — to create intelligent, clinically-driven formulations that don't just treat the surface, but transform skin health from within. Each product embodies the meticulous precision, purity, and sensorial artistry that define Korean skincare — made for those who seek authenticity, efficacy, and mindful luxury.
                  </p>
                  <p className="text-blue-800 font-bold text-xl">Because for us, there's only one thing that truly matters — YOU.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4P Approach - White Background */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-200/40 to-transparent rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
              Our 4P Approach: The Future of Intelligent Wellness
            </h3>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { Icon: Shield, title: 'Preventive', text: 'Wellness begins before illness does. Our science-driven products strengthen your system, supporting your body\'s inherent intelligence.', color: 'from-blue-600 to-blue-800', bg: 'from-blue-50 to-gray-50' },
              { Icon: Rocket, title: 'Proactive', text: 'We empower people to take charge with real data, biofeedback, and science-based solutions for well-informed wellness decisions.', color: 'from-blue-700 to-blue-900', bg: 'from-blue-50 to-gray-50' },
              { Icon: BarChart3, title: 'Predictive', text: 'Using data, AI, and biological insights to forecast needs before symptoms manifest, creating a predictive model of wellbeing.', color: 'from-blue-500 to-blue-700', bg: 'from-blue-50 to-gray-50' },
              { Icon: Fingerprint, title: 'Personalized', text: 'Every body is unique. We develop smart, flexible products tailored to your biology, lifestyle, and environment.', color: 'from-blue-800 to-black', bg: 'from-blue-50 to-gray-50' },
            ].map(({ Icon, title, text, color, bg }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className={`bg-gradient-to-br ${bg} rounded-2xl p-8 shadow-lg border-2 border-white hover:shadow-2xl transition-all duration-300`}
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${color} shadow-lg mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-black text-2xl text-gray-900 mb-3">{title}</h4>
                <p className="text-gray-700 text-base leading-relaxed text-justify">{text}</p>
              </motion.div>
            ))}
          </div>
          
          <p className="mt-12 text-center text-gray-700 text-lg font-medium max-w-5xl mx-auto">
            These four pillars work together to establish our foundation, a combination of human intelligence, science, and technology that will shape the next phase of health and beauty.
          </p>
        </div>
      </section>

      {/* Korean Wellness — White Background with Cards */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 bg-clip-text text-transparent">
              Six Core Pillars of Korean Wellness
            </h3>
            <p className="mt-4 text-gray-700 text-lg max-w-3xl mx-auto">
              The core pillars of Korean wellness — the ideas that shape both skincare and overall lifestyle philosophy. These help anchor The Only Thing brand narrative authentically.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { Icon: Heart, title: 'Holistic Harmony: Body + Mind + Skin', text: 'Beauty is inner balance. Skin connects with nutrition, sleep, emotions, and environment — aiming for harmony, not just perfect skin.', color: 'from-blue-600 to-blue-800', bg: 'from-blue-50 to-gray-50' },
              { Icon: Shield, title: 'Prevention over correction', text: 'Prioritise daily care and protection. Gentle actives and consistent rituals maintain youthfulness instead of chasing quick fixes.', color: 'from-blue-700 to-blue-900', bg: 'from-blue-50 to-gray-50' },
              { Icon: Leaf, title: 'Rituals Rooted in Nature', text: 'Traditional botanicals like ginseng, green tea, and centella support inner vitality. Fermented, bio‑transformed ingredients improve tolerance and efficacy.', color: 'from-blue-500 to-blue-700', bg: 'from-blue-50 to-gray-50' },
              { Icon: FlaskConical, title: 'Science Meets Sensibility', text: 'Dermatological innovation meets heritage wisdom. Smart delivery and biomimetic design ensure high efficacy with skin‑friendly tolerance.', color: 'from-blue-800 to-black', bg: 'from-blue-50 to-gray-50' },
              { Icon: Sparkles, title: 'Sensorial & Emotional Well‑being', text: 'Texture, scent, and ritual turn routine into self‑care. Wellness includes emotional resilience and confidence, not just outcomes.', color: 'from-blue-600 to-blue-800', bg: 'from-blue-50 to-gray-50' },
              { Icon: Layers, title: 'Consistency & Respect for Skin', text: 'Daily commitment over aggression — gentle layers, hydration, and barrier repair that respect the skin over time.', color: 'from-blue-700 to-blue-900', bg: 'from-blue-50 to-gray-50' },
            ].map(({ Icon, title, text, color, bg }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-br ${bg} rounded-2xl p-6 shadow-lg border-2 border-white hover:shadow-2xl transition-all duration-300`}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 leading-tight mb-3">{title}</h4>
                <p className="text-gray-700 text-sm leading-relaxed text-justify">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Experts */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-gray-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-200/30 to-transparent rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 bg-clip-text text-transparent">
              Meet Our Experts
            </h3>
            <p className="mt-4 text-gray-700 text-lg">The visionaries behind Only Thing Health and Wellness</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Founder */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-600 shadow-lg mb-6 bg-white">
                  <img
                    src="/about/founder.png"
                    alt="Akhilesh Yadav - Founder"
                    className="w-full h-full object-contain scale-110"
                  />
                </div>
                <h4 className="text-3xl font-black text-gray-900 mb-2">
                  Akhilesh Yadav
                </h4>
                <p className="text-xl font-semibold text-blue-700 mb-4">Founder</p>
                <div className="w-20 h-1 bg-blue-600 rounded-full" />
              </div>
            </motion.div>

            {/* Co-Founder */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-600 shadow-lg mb-6 bg-gradient-to-br from-blue-100 to-gray-100 flex items-center justify-center">
                  <span className="text-6xl font-black text-blue-700">NC</span>
                </div>
                <h4 className="text-3xl font-black text-gray-900 mb-2">
                  Nitesh Chauhan
                </h4>
                <p className="text-xl font-semibold text-blue-700 mb-4">Co-Founder</p>
                <div className="w-20 h-1 bg-blue-600 rounded-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
