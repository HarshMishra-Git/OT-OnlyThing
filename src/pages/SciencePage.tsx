import { Award, Beaker, CheckCircle, FlaskConical, Microscope, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export function SciencePage() {
  const [activeIngredient, setActiveIngredient] = useState(0);

  const ingredients = [
    {
      name: 'Niacinamide',
      percentage: '5%',
      benefit: 'Reduces hyperpigmentation, controls oil production, strengthens skin barrier',
      research: 'Clinically proven in 20+ peer-reviewed studies',
    },
    {
      name: 'Hyaluronic Acid',
      percentage: '2%',
      benefit: 'Deep hydration, plumps skin, reduces fine lines',
      research: 'Holds up to 1000x its weight in water',
    },
    {
      name: 'Vitamin C',
      percentage: '15%',
      benefit: 'Brightening, antioxidant protection, collagen synthesis',
      research: 'Stabilized form for maximum efficacy',
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <div className="relative h-96 bg-gradient-to-br from-purple-900 to-blue-900 text-white flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Microscope size={40} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            OUR SCIENCE
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto px-4">
            Where rigorous research meets real-world results
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="space-y-12">
          <section className="border-2 border-black p-12">
            <h2 className="text-3xl font-black mb-6">RESEARCH-DRIVEN FORMULATION</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Every product we create begins with extensive research. We analyze hundreds
              of peer-reviewed studies to identify the most effective ingredients and optimal
              concentrations for specific skin concerns.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our formulation process combines dermatological expertise with advanced chemistry
              to ensure maximum efficacy, stability, and skin compatibility.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-2 border-gray-200 p-8 text-center">
              <div className="text-5xl font-black mb-4">100%</div>
              <p className="text-sm font-bold">
                Clinically Tested Formulations
              </p>
            </div>
            <div className="border-2 border-gray-200 p-8 text-center">
              <div className="text-5xl font-black mb-4">0</div>
              <p className="text-sm font-bold">
                Harmful Additives or Fillers
              </p>
            </div>
            <div className="border-2 border-gray-200 p-8 text-center">
              <div className="text-5xl font-black mb-4">12+</div>
              <p className="text-sm font-bold">
                Months of Development Per Product
              </p>
            </div>
          </div>

          <section className="bg-black text-white p-12">
            <h2 className="text-3xl font-black mb-6">KEY PRINCIPLES</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-3">EVIDENCE-BASED INGREDIENTS</h3>
                <p className="text-gray-300 leading-relaxed">
                  We only use ingredients with proven efficacy backed by clinical studies.
                  No trending ingredients without scientific validation.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">OPTIMAL CONCENTRATIONS</h3>
                <p className="text-gray-300 leading-relaxed">
                  Active ingredients are formulated at clinically-proven concentrations
                  to ensure effectiveness while maintaining safety.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">STABILITY & BIOAVAILABILITY</h3>
                <p className="text-gray-300 leading-relaxed">
                  We use advanced delivery systems to ensure ingredients remain stable
                  and can penetrate effectively into the skin.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">COMPREHENSIVE TESTING</h3>
                <p className="text-gray-300 leading-relaxed">
                  Every product undergoes rigorous safety testing, stability testing,
                  and clinical trials before launch.
                </p>
              </div>
            </div>
          </section>

          {/* Ingredient Deep Dive */}
          <section className="py-16 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-black mb-12 text-center">KEY INGREDIENTS</h2>
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-wrap gap-4 justify-center mb-8">
                {ingredients.map((ing, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIngredient(i)}
                    className={`px-6 py-3 font-bold border-2 transition-all ${
                      activeIngredient === i
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-gray-300 hover:border-black'
                    }`}
                  >
                    {ing.name}
                  </button>
                ))}
              </div>
              <div className="bg-white border-2 border-black p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="text-6xl font-black mb-4">
                      {ingredients[activeIngredient].percentage}
                    </div>
                    <h3 className="text-2xl font-black mb-4">
                      {ingredients[activeIngredient].name}
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {ingredients[activeIngredient].benefit}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <FlaskConical size={24} className="text-black flex-shrink-0" />
                      <p className="text-sm text-gray-700">
                        {ingredients[activeIngredient].research}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={24} className="text-black flex-shrink-0" />
                      <p className="text-sm text-gray-700">
                        Formulated at clinically-proven concentration for maximum efficacy
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Certifications */}
          <section className="py-16">
            <h2 className="text-4xl font-black mb-12 text-center">CERTIFICATIONS & TESTING</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center p-6 border-2 border-gray-200">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award size={32} />
                </div>
                <h3 className="font-black text-sm">ISO CERTIFIED</h3>
                <p className="text-xs text-gray-600 mt-2">Manufacturing</p>
              </div>
              <div className="text-center p-6 border-2 border-gray-200">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="font-black text-sm">DERMATOLOGIST</h3>
                <p className="text-xs text-gray-600 mt-2">Tested</p>
              </div>
              <div className="text-center p-6 border-2 border-gray-200">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Beaker size={32} />
                </div>
                <h3 className="font-black text-sm">CLINICALLY</h3>
                <p className="text-xs text-gray-600 mt-2">Validated</p>
              </div>
              <div className="text-center p-6 border-2 border-gray-200">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="font-black text-sm">CRUELTY-FREE</h3>
                <p className="text-xs text-gray-600 mt-2">Certified</p>
              </div>
            </div>
          </section>

          <section className="border-2 border-gray-200 p-12">
            <h2 className="text-3xl font-black mb-6">PERSONALIZATION TECHNOLOGY</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Our assessment algorithm analyzes multiple factors including skin type, concerns,
              age, lifestyle, and environmental conditions to create a comprehensive skin profile.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This data is then matched against our product database to recommend the most
              effective combination of products for your unique needs, ensuring optimal results.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
