import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthService } from '@/services/auth.service';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Spinner } from '@/components/common/Spinner';
import { LockKeyhole } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateSEOTags, updateMetaTags } from '@/lib/seo';

const schema = z
  .object({
    password: z.string().min(6, 'Minimum 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormInput = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const tags = generateSEOTags({
      title: `Reset Password | ${import.meta.env.VITE_APP_NAME || 'OnlyThing'}`,
      description: 'Set a new password to secure your account.',
      keywords: 'reset password, update password, account security, onlything',
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
  } = useForm<FormInput>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormInput) => {
    try {
      setLoading(true);
      const { error } = await AuthService.updatePassword(data.password);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('Password updated. You can now log in.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Set a new password</h1>
          <p className="text-gray-600">Enter and confirm your new password</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  error={errors.password?.message}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <Input
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Updating...
                </>
              ) : (
                <>Update Password</>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Need a new link?{' '}
            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-700">
              Request reset again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}