import { Button } from '../components/Button';
import { Heart, Target, Eye, Users, Award, TrendingUp } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-black to-gray-800 text-white flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            ABOUT US
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Redefining skincare through science, transparency, and personalization
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="space-y-12">
          <section className="border-2 border-black p-12">
            <h2 className="text-3xl font-black mb-6">OUR MISSION</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At Only Thing Health & Wellness, we believe skincare should be intelligent,
              personalized, and backed by rigorous science. We're on a mission to transform
              the way people approach skincare by combining cutting-edge research with
              data-driven personalization.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Every product we create is formulated with clinical precision, tested for
              efficacy, and designed to deliver real, measurable results. We believe in
              transparency, quality, and the power of science to unlock your skin's potential.
            </p>
          </section>

          <section className="bg-black text-white p-12">
            <h2 className="text-3xl font-black mb-6">OUR APPROACH</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-3">SCIENCE-FIRST</h3>
                <p className="text-gray-300 leading-relaxed">
                  Every formulation is developed using peer-reviewed research and tested
                  through rigorous clinical trials.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">PERSONALIZED</h3>
                <p className="text-gray-300 leading-relaxed">
                  We use advanced assessments to understand your unique skin profile and
                  recommend products tailored to your needs.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">TRANSPARENT</h3>
                <p className="text-gray-300 leading-relaxed">
                  Full ingredient disclosure with detailed explanations of what each
                  ingredient does and why it's included.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">EFFICACIOUS</h3>
                <p className="text-gray-300 leading-relaxed">
                  We focus on active ingredients at clinically-proven concentrations to
                  ensure real, visible results.
                </p>
              </div>
            </div>
          </section>

          {/* Core Values */}
          <section className="py-16">
            <h2 className="text-4xl font-black mb-12 text-center">OUR VALUES</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 border-2 border-gray-200 hover:border-black transition-colors">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart size={32} />
                </div>
                <h3 className="text-xl font-black mb-3">INTEGRITY</h3>
                <p className="text-gray-600 leading-relaxed">
                  Complete transparency in ingredients, processes, and results. No hidden secrets.
                </p>
              </div>
              <div className="text-center p-8 border-2 border-gray-200 hover:border-black transition-colors">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target size={32} />
                </div>
                <h3 className="text-xl font-black mb-3">EFFICACY</h3>
                <p className="text-gray-600 leading-relaxed">
                  Results-driven formulations backed by clinical research and real data.
                </p>
              </div>
              <div className="text-center p-8 border-2 border-gray-200 hover:border-black transition-colors">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users size={32} />
                </div>
                <h3 className="text-xl font-black mb-3">PERSONALIZATION</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every individual is unique. Our solutions are tailored to your specific needs.
                </p>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="py-16 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-black mb-12 text-center">OUR JOURNEY</h2>
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-black">1</div>
                  <div className="w-0.5 h-full bg-gray-300 mt-4"></div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-2xl font-black mb-2">FOUNDED - 2023</h3>
                  <p className="text-gray-600">Launched with a vision to bring science-backed, personalized skincare to everyone.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-black">2</div>
                  <div className="w-0.5 h-full bg-gray-300 mt-4"></div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-2xl font-black mb-2">FIRST PRODUCTS - 2024</h3>
                  <p className="text-gray-600">Released our core product line after 12+ months of rigorous testing and refinement.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-black">3</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black mb-2">TODAY</h3>
                  <p className="text-gray-600">Serving 50,000+ customers with personalized skincare solutions backed by science.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-16">
            <h2 className="text-4xl font-black mb-12 text-center">OUR TEAM</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 border-4 border-black"></div>
                <h3 className="text-xl font-black mb-1">Dr. Sarah Chen</h3>
                <p className="text-sm text-gray-600 mb-3">Chief Formulation Officer</p>
                <p className="text-sm text-gray-600">PhD in Dermatological Science, 15+ years experience</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 border-4 border-black"></div>
                <h3 className="text-xl font-black mb-1">Arjun Patel</h3>
                <p className="text-sm text-gray-600 mb-3">Founder & CEO</p>
                <p className="text-sm text-gray-600">Former biotech executive, skincare enthusiast</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 border-4 border-black"></div>
                <h3 className="text-xl font-black mb-1">Maya Reddy</h3>
                <p className="text-sm text-gray-600 mb-3">Head of Research</p>
                <p className="text-sm text-gray-600">MSc Biochemistry, clinical research specialist</p>
              </div>
            </div>
          </section>

          <section className="text-center py-16 border-t-4 border-black">
            <h2 className="text-4xl font-black mb-6">JOIN OUR JOURNEY</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Experience the future of intelligent skincare. Take our personalized
              assessment to discover products designed specifically for you.
            </p>
            <Button onClick={() => window.location.href = '/quiz'} className="text-lg">
              Start Your Assessment
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
