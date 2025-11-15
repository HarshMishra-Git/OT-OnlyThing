import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validators';
import { AuthService } from '@/services/auth.service';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Spinner } from '@/components/common/Spinner';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateSEOTags, updateMetaTags } from '@/lib/seo';

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const tags = generateSEOTags({
      title: `Forgot Password | ${import.meta.env.VITE_APP_NAME || 'OnlyThing'}`,
      description: 'Reset your password securely via email.',
      keywords: 'forgot password, reset, account recovery, onlything',
      image: `${window.location.origin}/L.jpg`,
      url: window.location.href,
      type: 'website',
    });
    updateMetaTags(tags);
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      setLoading(true);
      const { error } = await AuthService.resetPassword(data.email);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('Password reset email sent. Check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset your password</h1>
          <p className="text-gray-600">Enter your email to receive a reset link</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  error={errors.email?.message}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Sending...
                </>
              ) : (
                <>Send Reset Link</>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Remembered your password?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}