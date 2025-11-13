import { useState } from 'react';
import { signIn } from '../lib/auth';
import { Button } from '../components/Button';
import { CheckCircle, Sparkles, TrendingUp } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      window.location.href = '/account';
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20 flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <h1 className="text-5xl font-black mb-4">WELCOME BACK</h1>
            <p className="text-gray-600 text-lg">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700">Password</label>
                <a href="#" className="text-xs font-bold text-gray-600 hover:text-black">Forgot?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none transition-colors text-lg"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full text-lg py-4">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="font-bold hover:underline text-black">
                Create one now
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Sidebar */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-900 to-pink-900 text-white p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-black mb-8">WHY JOIN US?</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg mb-2">Personalized Recommendations</h3>
                <p className="text-gray-200">Get product suggestions tailored to your unique skin profile</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg mb-2">Track Your Progress</h3>
                <p className="text-gray-200">Monitor your skincare journey and see real results</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg mb-2">Exclusive Access</h3>
                <p className="text-gray-200">Early access to new products and special member discounts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
