import { describe, it, expect } from 'vitest';
import { queryClient } from '@/lib/react-query';

describe('react-query config', () => {
  it('has expected default options', () => {
    const opts = queryClient.getDefaultOptions().queries!;
    expect(opts.staleTime).toBe(1000 * 60 * 5);
    expect(opts.gcTime).toBe(1000 * 60 * 10);
    expect(opts.retry).toBe(1);
    expect(opts.refetchOnWindowFocus).toBe(false);
  });
});