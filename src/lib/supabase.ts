import { createClient } from '@supabase/supabase-js';
import { safeLog, safeWarn, safeError } from '@/lib/logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  safeWarn('⚠️ Supabase not configured. Some features will be disabled.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-client-info': 'onlything-web',
    },
  },
  realtime: {
    timeout: 3000,
  },
});

// Test connection with timeout
const testConnection = async () => {
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    safeLog('🔧 Running in development mode without Supabase');
    return;
  }

  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout')), 3000)
    );

    const testPromise = supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });

    await Promise.race([testPromise, timeoutPromise]);
    safeLog('✅ Supabase connected successfully');
  } catch (error: any) {
    safeError('❌ Supabase connection failed:', error.message);
  }
};

testConnection();