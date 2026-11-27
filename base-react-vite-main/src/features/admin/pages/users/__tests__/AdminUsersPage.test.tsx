import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminUsersPage } from '../AdminUsersPage';
import * as usersApi from '@features/admin/api/admin-users.api';
import * as theatersApi from '@features/admin/api/admin-theaters.api';

vi.mock('@features/admin/api/admin-users.api', () => ({
  getAdminUsersApi: vi.fn(),
  getAdminUserDetailApi: vi.fn(),
  createAdminStaffApi: vi.fn(),
  updateUserRoleApi: vi.fn(),
  toggleUserStatusApi: vi.fn(),
  resetUserPasswordApi: vi.fn(),
}));

vi.mock('@features/admin/api/admin-theaters.api', () => ({
  getAdminTheatersApi: vi.fn(),
}));

const renderWithQuery = (ui: React.ReactElement) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
};

describe('AdminUsersPage & StaffFormModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('user_role', 'ADMIN');
    vi.mocked(theatersApi.getAdminTheatersApi).mockResolvedValue([]);
    vi.mocked(usersApi.getAdminUsersApi).mockResolvedValue({
      data: [
        {
          id: 'u1',
          fullName: 'Nguyễn Văn Admin',
          email: 'admin@phimbook.vn',
          phone: '0901234567',
          role: 'ADMIN',
          status: 'ACTIVE',
          membershipTier: 'PLATINUM',
          loyaltyPoints: 5000,
          createdAt: '2026-01-01T00:00:00Z',
        },
      ],
      metaData: { page: 1, pageSize: 10, total: 1, totalPage: 1 },
    });
  });

  it('renders users list and resets search filter when clicking Đặt Lại', async () => {
    renderWithQuery(<AdminUsersPage />);

    expect(await screen.findByText('Nguyễn Văn Admin')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Tên, email hoặc số điện thoại...');
    fireEvent.change(searchInput, { target: { value: 'abc' } });
    expect(searchInput).toHaveValue('abc');

    fireEvent.click(screen.getByRole('button', { name: /Đặt Lại/i }));
    expect(searchInput).toHaveValue('');
  });

  it('validates required fields in StaffFormModal before calling API', async () => {
    renderWithQuery(<AdminUsersPage />);

    fireEvent.click(screen.getByRole('button', { name: /Thêm Nhân Viên/i }));
    expect(await screen.findByText('Thêm Tài Khoản Nhân Viên')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Tạo Tài Khoản' }));

    await waitFor(() => {
      expect(screen.getByText('Vui lòng nhập họ và tên')).toBeInTheDocument();
      expect(screen.getByText('Vui lòng nhập email')).toBeInTheDocument();
    });

    expect(usersApi.createAdminStaffApi).not.toHaveBeenCalled();
  });

  it('opens ResetPasswordModal and validates password rules before calling API', async () => {
    renderWithQuery(<AdminUsersPage />);

    expect(await screen.findByText('Nguyễn Văn Admin')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Đặt lại mật khẩu' }));

    expect(await screen.findByText('Đặt Lại Mật Khẩu')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cập Nhật Mật Khẩu' }));

    await waitFor(() => {
      expect(screen.getByText('Vui lòng nhập mật khẩu mới')).toBeInTheDocument();
      expect(screen.getByText('Vui lòng xác nhận mật khẩu mới')).toBeInTheDocument();
    });

    expect(usersApi.resetUserPasswordApi).not.toHaveBeenCalled();
  });
});
