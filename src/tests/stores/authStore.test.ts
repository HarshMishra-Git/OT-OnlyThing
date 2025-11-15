import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '@/stores/authStore';
import { AuthService } from '@/services/auth.service';
import '@/tests/mocks/supabase';

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // reset store state
    const { setUser, setLoading } = useAuthStore.getState();
    setUser(null);
    setLoading(false);
    // Ensure env looks configured for checkAuth success tests
    (import.meta as any).env = { VITE_SUPABASE_URL: 'https://example.supabase.co' };
  });

  it('login success sets user and flags', async () => {
    const profile = { id: 'u1', email: 't@e.com', full_name: 'Test', role: 'customer' } as any;
    vi.spyOn(AuthService, 'signIn').mockResolvedValue({ data: { user: { id: 'u1' } } as any, error: null });
    vi.spyOn(AuthService, 'getProfile').mockResolvedValue({ data: profile, error: null });

    const res = await useAuthStore.getState().login('t@e.com', 'secret');
    expect(res.error).toBeNull();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(profile);
  });

  it('logout clears user state', async () => {
    useAuthStore.getState().setUser({ id: 'x', role: 'admin' } as any);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    await useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.isAdmin).toBe(false);
  });

  it('checkAuth sets user from current session when available', async () => {
    const basicUser = { id: 'u2', email: 'a@b.com', user_metadata: { full_name: 'Name' } } as any;
    vi.spyOn(AuthService, 'getCurrentUser').mockResolvedValue({ user: basicUser, session: {} as any });
    vi.spyOn(AuthService, 'getProfile').mockResolvedValue({ data: null, error: null });

    await useAuthStore.getState().checkAuth();
    const { isAuthenticated, user } = useAuthStore.getState();
    expect(isAuthenticated).toBe(true);
    expect(user?.id).toBe('u2');
    expect(user?.full_name).toBe('Name');
  });

  it('checkAuth skips when Supabase not configured', async () => {
    (import.meta as any).env = { VITE_SUPABASE_URL: 'placeholder' };
    await useAuthStore.getState().checkAuth();
    const { isAuthenticated, user } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
  });
});