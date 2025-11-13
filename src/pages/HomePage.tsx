import { HeroWithProducts } from '../components/HeroWithProducts';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { Button } from '../components/Button';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { TrustBar } from '../components/TrustBar';
import { CategoryShowcase } from '../components/CategoryShowcase';
import { Star, Users, Award, TrendingUp, Check } from 'lucide-react';

export function HomePage() {
  useScrollAnimation();

  return (
    <div>
      {/* Floating Orbit Hero */}
      <HeroWithProducts />

      {/* Trust Indicators */}
      <TrustBar />

      {/* Featured Products with Magnetic Hover */}
      <FeaturedProducts />

      {/* Color-Coded Category Showcase */}
      <CategoryShowcase />

      {/* Stats Section */}
      <section className="py-24 bg-white border-y-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center fade-in-observer">
              <div className="text-5xl md:text-6xl font-black mb-3">50K+</div>
              <p className="text-sm md:text-base font-bold text-gray-600 uppercase tracking-wide">Happy Customers</p>
            </div>
            <div className="text-center fade-in-observer">
              <div className="text-5xl md:text-6xl font-black mb-3">98%</div>
              <p className="text-sm md:text-base font-bold text-gray-600 uppercase tracking-wide">Satisfaction Rate</p>
            </div>
            <div className="text-center fade-in-observer">
              <div className="text-5xl md:text-6xl font-black mb-3">100+</div>
              <p className="text-sm md:text-base font-bold text-gray-600 uppercase tracking-wide">Products</p>
            </div>
            <div className="text-center fade-in-observer">
              <div className="text-5xl md:text-6xl font-black mb-3">4.9★</div>
              <p className="text-sm md:text-base font-bold text-gray-600 uppercase tracking-wide">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-black mb-16 text-center tracking-tight fade-in-observer">
            HOW IT WORKS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center fade-in-observer">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-xl">1</div>
              <h3 className="text-2xl font-black mb-4">TAKE ASSESSMENT</h3>
              <p className="text-gray-600 leading-relaxed">Answer a few questions about your skin type, concerns, and goals. Our AI-powered quiz analyzes your responses.</p>
            </div>
            <div className="text-center fade-in-observer">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-xl">2</div>
              <h3 className="text-2xl font-black mb-4">GET RECOMMENDATIONS</h3>
              <p className="text-gray-600 leading-relaxed">Receive personalized product recommendations tailored to your unique skin profile and specific needs.</p>
            </div>
            <div className="text-center fade-in-observer">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-xl">3</div>
              <h3 className="text-2xl font-black mb-4">SEE RESULTS</h3>
              <p className="text-gray-600 leading-relaxed">Follow your customized routine and track visible improvements. Our science-backed formulas deliver real results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-16 text-center tracking-tight fade-in-observer">
            CUSTOMER STORIES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Priya Sharma"
              rating={5}
              text="The personalized assessment was spot-on! My skin has never looked better. The products are gentle yet effective."
              delay={0.1}
            />
            <TestimonialCard 
              name="Rahul Mehta"
              rating={5}
              text="Finally, skincare backed by real science. No more guessing what works. The results speak for themselves."
              delay={0.3}
            />
            <TestimonialCard 
              name="Ananya Desai"
              rating={5}
              text="I've tried countless brands, but this is different. The transparency and quality are unmatched. Highly recommend!"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Intelligent Skincare Section */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-10 tracking-tight fade-in-observer">
            INTELLIGENT SKINCARE
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-16 max-w-4xl mx-auto fade-in-observer">
            We combine cutting-edge scientific research with personalized assessments
            to deliver skincare solutions that are as unique as you are. Every product
            is formulated with clinical precision and backed by transparent data.
          </p>
          <div className="fade-in-observer">
            <Button
              variant="secondary"
              onClick={() => window.location.href = '/science'}
              className="shadow-3d-lg hover:shadow-glow-white transform hover:scale-105"
            >
              Our Science
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section with 3D Cards */}
      <section className="py-32 bg-gradient-to-b from-white via-gray-50 to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              }
              title="SCIENCE-BACKED"
              description="Every formulation is developed using clinical research and tested for efficacy"
              delay={0.1}
            />

            <FeatureCard 
              icon={
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              }
              title="PERSONALIZED"
              description="Take our assessment to receive product recommendations tailored to your skin"
              delay={0.3}
            />

            <FeatureCard 
              icon={
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              }
              title="TRANSPARENT"
              description="Full ingredient disclosure with detailed explanations of what each does"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section with Immersive Design */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black to-transparent"></div>
          <div className="absolute top-1/2 left-0 w-1/3 h-px bg-gradient-to-r from-black to-transparent opacity-20"></div>
          <div className="absolute top-1/2 right-0 w-1/3 h-px bg-gradient-to-l from-black to-transparent opacity-20"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl lg:text-display-md font-black mb-10 tracking-tight fade-in-observer">
            FIND YOUR PERFECT<br />ROUTINE
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-16 max-w-3xl mx-auto fade-in-observer">
            Our personalized skin assessment uses advanced algorithms to analyze
            your unique skin profile and recommend the optimal products for your needs.
          </p>
          <div className="fade-in-observer">
            <Button
              variant="primary"
              onClick={() => window.location.href = '/quiz'}
              className="text-base shadow-3d-lg hover:shadow-glow-black transform hover:scale-105"
            >
              Start Assessment
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  delay: number;
}) {
  return (
    <div 
      className="group text-center fade-in-observer hover-lift"
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="relative">
        {/* Icon container with 3D effect */}
        <div className="w-20 h-20 bg-black mx-auto mb-8 flex items-center justify-center rounded-2xl shadow-3d group-hover:shadow-3d-lg transition-all duration-400 transform group-hover:rotate-6 group-hover:scale-110">
          {icon}
        </div>
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-black/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
      </div>
      
      <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-gray-700 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function TestimonialCard({
  name,
  rating,
  text,
  delay
}: {
  name: string;
  rating: number;
  text: string;
  delay: number;
}) {
  return (
    <div 
      className="bg-white text-black p-8 border-2 border-white hover:scale-105 transition-all duration-300 fade-in-observer"
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={20} fill="black" stroke="black" />
        ))}
      </div>
      <p className="text-lg mb-6 leading-relaxed">"{text}"</p>
      <p className="font-black text-sm uppercase tracking-wide">{name}</p>
    </div>
  );
}
