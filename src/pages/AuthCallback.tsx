import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOAuthCallback } from '@/lib/googleAuth';
import { Spinner } from '@/components/common/Spinner';
import toast from 'react-hot-toast';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    processCallback();
  }, []);

  const processCallback = async () => {
    try {
      const { session, error } = await handleOAuthCallback();

      if (error) {
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
        return;
      }

      if (session) {
        toast.success('Successfully signed in!');
        // Redirect based on user role
        const redirectTo = localStorage.getItem('auth_redirect') || '/';
        localStorage.removeItem('auth_redirect');
        // Clean URL hash
        window.history.replaceState({}, '', redirectTo);
        navigate(redirectTo, { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('Callback processing error:', error);
      toast.error('Something went wrong. Please try again.');
      navigate('/login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing sign in...
        </h2>
        <p className="text-gray-600">
          Please wait while we complete your authentication.
        </p>
      </div>
    </div>
  );
}