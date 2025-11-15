import toast, { ToastOptions } from 'react-hot-toast';
import { safeError } from '@/lib/logger';

const defaultOpts: ToastOptions = {
  duration: 3000,
};

const normalizeErrorMessage = (error: unknown, fallback = 'Something went wrong'): string => {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  if (typeof (error as any).message === 'string') return (error as any).message;
  try {
    return JSON.stringify(error).slice(0, 200);
  } catch {
    return fallback;
  }
};

export const notify = {
  success(message: string, opts?: ToastOptions) {
    toast.success(message, { ...defaultOpts, ...opts });
  },
  info(message: string, opts?: ToastOptions) {
    toast(message, { ...defaultOpts, ...opts });
  },
  error(errorOrMessage: unknown, fallback?: string, opts?: ToastOptions) {
    const msg = normalizeErrorMessage(errorOrMessage, fallback);
    safeError('Notify error:', errorOrMessage);
    toast.error(msg, { ...defaultOpts, ...opts });
  },
  loading(message: string, opts?: ToastOptions): string {
    return toast.loading(message, { ...opts });
  },
  dismiss(id?: string) {
    if (id) toast.dismiss(id);
    else toast.dismiss();
  },
};