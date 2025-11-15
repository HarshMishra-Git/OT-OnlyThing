import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: false, isLoading: false })
}));

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users', () => {
    render(<ProtectedRoute><div>Protected Content</div></ProtectedRoute>);
    // When unauthenticated, Navigate renders nothing here. Ensure protected content not shown.
    expect(screen.queryByText('Protected Content')).toBeNull();
  });

  it('renders children when authenticated', () => {
    vi.doMock('@/hooks/useAuth', () => ({
      useAuth: () => ({ isAuthenticated: true, isLoading: false })
    }));
    // Re-import component to use updated mock
    const { ProtectedRoute: PR } = require('@/components/layout/ProtectedRoute');
    render(<PR><div>Protected Content</div></PR>);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});