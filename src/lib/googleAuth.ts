import { supabase } from './supabase';

export interface GoogleAuthOptions {
  redirectTo?: string;
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(options?: GoogleAuthOptions) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: options?.redirectTo || `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Handle OAuth callback
 */
export async function handleOAuthCallback() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    if (session) {
      // Create or update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata.full_name || session.user.user_metadata.name,
          avatar_url: session.user.user_metadata.avatar_url,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id',
        });

      if (profileError) {
        console.error('Profile update error:', profileError);
      }
    }

    return { session, error: null };
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return { session: null, error: error.message };
  }
}