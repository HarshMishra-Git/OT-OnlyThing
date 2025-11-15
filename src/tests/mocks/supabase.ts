import { vi } from 'vitest';

type TableChains = Record<string, any>;

const createChain = (table: string, store: TableChains) => {
  const chain: any = {
    _table: table,
    _data: null as any,
    select: vi.fn().mockReturnThis(),
    update: vi.fn().mockImplementation((payload: any) => {
      chain._data = payload;
      return chain;
    }),
    insert: vi.fn().mockImplementation((payload: any) => {
      chain._data = payload;
      return chain;
    }),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
  };
  store[table] = chain;
  return chain;
};

export const tableStore: TableChains = {};

export const mockSupabase = {
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    updateUser: vi.fn(),
    getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u_test' } } }),
  },
  from: vi.fn().mockImplementation((table: string) => createChain(table, tableStore)),
  functions: {
    invoke: vi.fn(),
  },
};

vi.mock('@/lib/supabase', () => ({ supabase: mockSupabase }));