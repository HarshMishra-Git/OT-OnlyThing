import { useState } from 'react';
import { signUp } from '../lib/auth';
import { Button } from '../components/Button';
import { Shield, Zap, Heart } from 'lucide-react';

export function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signUp(email, password, fullName);
      window.location.href = '/account';
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20 flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <h1 className="text-5xl font-black mb-4">GET STARTED</h1>
            <p className="text-gray-600 text-lg">Create your account and start your skincare journey</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none transition-colors text-lg"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none transition-colors text-lg"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none transition-colors text-lg"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-2">Minimum 6 characters</p>
            </div>

            <Button type="submit" disabled={loading} className="w-full text-lg py-4">
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-bold hover:underline text-black">
                Sign in instead
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Sidebar */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-900 to-teal-900 text-white p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-black mb-8">START YOUR JOURNEY</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg mb-2">Science-Backed Products</h3>
                <p className="text-gray-200">All formulations backed by clinical research and testing</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg mb-2">Fast Results</h3>
                <p className="text-gray-200">See visible improvements in as little as 2-4 weeks</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                <Heart size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg mb-2">Loved by Thousands</h3>
                <p className="text-gray-200">Join 50,000+ happy customers who trust our products</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
