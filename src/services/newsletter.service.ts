import { supabase } from '@/lib/supabase';

export type NewsletterStatus = 'active' | 'unsubscribed';

export interface NewsletterSubscription {
  id: string;
  email: string;
  name?: string | null;
  status: NewsletterStatus;
  source?: string | null;
  subscribed_at: string;
  unsubscribed_at?: string | null;
}

export const NewsletterService = {
  async subscribe(email: string, name?: string | null, source: string = 'footer'): Promise<NewsletterSubscription> {
    const payload = {
      email: email.toLowerCase().trim(),
      name: name ?? null,
      status: 'active' as NewsletterStatus,
      source,
      subscribed_at: new Date().toISOString(),
    };

    // Upsert by email to avoid duplicates
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .upsert(payload, { onConflict: 'email' })
      .select()
      .single();

    if (error) throw error;
    return data as NewsletterSubscription;
  },

  async unsubscribe(email: string): Promise<NewsletterSubscription> {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
      .eq('email', email.toLowerCase().trim())
      .select()
      .single();

    if (error) throw error;
    return data as NewsletterSubscription;
  },
};