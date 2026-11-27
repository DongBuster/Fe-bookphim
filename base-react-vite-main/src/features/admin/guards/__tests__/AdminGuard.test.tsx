import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AdminGuard, RoleRouteGuard } from '../AdminGuard';
import tokenManager from '@shared/utils/tokenManager';

vi.mock('@shared/utils/tokenManager', () => ({
  default: {
    getAccessToken: vi.fn(),
  },
}));

describe('AdminGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('redirects to /login when no access token exists', () => {
    vi.mocked(tokenManager.getAccessToken).mockReturnValue('');

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/admin" element={<AdminGuard />}>
            <Route index element={<div>Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders 403 Forbidden for CUSTOMER role', () => {
    vi.mocked(tokenManager.getAccessToken).mockReturnValue('mock-token');
    localStorage.setItem('user_role', 'CUSTOMER');

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<AdminGuard />}>
            <Route index element={<div>Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.getByText(/403/)).toBeInTheDocument();
  });

  it('redirects STAFF from /admin to /admin/bookings and blocks restricted RoleRouteGuard', () => {
    vi.mocked(tokenManager.getAccessToken).mockReturnValue('mock-token');
    localStorage.setItem('user_role', 'STAFF');

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<AdminGuard />}>
            <Route index element={<div>Dashboard</div>} />
            <Route path="bookings" element={<div>Bookings Page</div>} />
            <Route
              path="users"
              element={
                <RoleRouteGuard allowedRoles={['ADMIN', 'MANAGER']}>
                  <div>Users Page</div>
                </RoleRouteGuard>
              }
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Bookings Page')).toBeInTheDocument();
  });

  it('allows ADMIN to access protected Outlet', () => {
    vi.mocked(tokenManager.getAccessToken).mockReturnValue('mock-token');
    localStorage.setItem('user_role', 'ADMIN');

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<AdminGuard />}>
            <Route index element={<div>Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
