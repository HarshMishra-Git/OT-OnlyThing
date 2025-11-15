import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '@/services/auth.service';
import { mockSupabase } from '@/tests/mocks/supabase';

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getCurrentUser returns session user when present', async () => {
    const user = { id: 'u1', email: 'test@example.com' };
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: { user } }, error: null });

    const result = await AuthService.getCurrentUser();
    expect(result.user).toEqual(user);
    expect(result.session).toEqual({ user });
  });

  it('signIn returns data on success and null on error', async () => {
    const data = { user: { id: 'u2' } } as any;
    // success
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ data, error: null });
    let res = await AuthService.signIn({ email: 'a@b.com', password: 'pass' });
    expect(res.error).toBeNull();
    expect(res.data).toEqual(data);

    // error
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: null, error: { message: 'Invalid' } });
    res = await AuthService.signIn({ email: 'bad', password: 'no' });
    expect(res.data).toBeNull();
    expect(res.error).toBe('Invalid');
  });

  it('signUp sends full_name in options and returns data', async () => {
    const data = { user: { id: 'u3' } } as any;
    mockSupabase.auth.signUp.mockResolvedValue({ data, error: null });
    const res = await AuthService.signUp({ email: 'x@y.com', password: '123456', full_name: 'Tester' });
    expect(res.error).toBeNull();
    expect(res.data).toEqual(data);
    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'x@y.com',
      password: '123456',
      options: { data: { full_name: 'Tester' } },
    });
  });

  it('signOut calls supabase', async () => {
    await AuthService.signOut();
    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
  });
});