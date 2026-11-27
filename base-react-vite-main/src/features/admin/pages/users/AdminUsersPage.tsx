import type { FC } from 'react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  Input,
  Select,
  Button,
  Card,
  Space,
  Avatar,
  Tag,
  Popconfirm,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Search, Plus, RotateCcw, Eye, Lock, Unlock, KeyRound, User as UserIcon } from 'lucide-react';
import { AdminPageHeader } from '@features/admin/components/AdminPageHeader';
import { StatusBadge } from '@features/admin/components/StatusBadge';
import { adminPrimaryButtonStyle } from '@features/admin/styles/adminUi';
import { getCurrentAdminRole } from '@features/admin/guards/adminRole.utils';
import {
  getAdminUsersApi,
  toggleUserStatusApi,
  updateUserRoleApi,
} from '@features/admin/api/admin-users.api';
import type { UserAdminDto, UserRole } from '@features/admin/types/admin.types';
import { UserDetailDrawer } from './components/UserDetailDrawer';
import { StaffFormModal } from './components/StaffFormModal';
import { ResetPasswordModal } from './components/ResetPasswordModal';

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'red',
  MANAGER: 'gold',
  STAFF: 'cyan',
  CUSTOMER: 'default',
};

export const AdminUsersPage: FC = () => {
  const queryClient = useQueryClient();
  const currentRole = getCurrentAdminRole();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [detailUserId, setDetailUserId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<UserAdminDto | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'users', { search, role: roleFilter, status: statusFilter, page, pageSize }],
    queryFn: () =>
      getAdminUsersApi({
        search: search.trim() || undefined,
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        page,
        pageSize,
      }),
  });

  const users: UserAdminDto[] = data?.data ?? [];
  const totalItems = data?.metaData?.total ?? users.length;

  const statusMutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: 'ACTIVE' | 'LOCKED' }) =>
      toggleUserStatusApi(id, {
        status: nextStatus,
        reason: nextStatus === 'LOCKED' ? 'Khóa bởi quản trị viên' : undefined,
      }),
    onSuccess: (_, vars) => {
      message.success(vars.nextStatus === 'LOCKED' ? 'Đã khóa tài khoản!' : 'Đã mở khóa tài khoản!');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (err: unknown) => {
      message.error(err instanceof Error ? err.message : 'Không thể cập nhật trạng thái tài khoản');
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => updateUserRoleApi(id, { role }),
    onSuccess: () => {
      message.success('Đã cập nhật vai trò phân quyền!');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (err: unknown) => {
      message.error(err instanceof Error ? err.message : 'Không thể cập nhật vai trò');
    },
  });

  const handleReset = () => {
    setSearch('');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
    setPage(1);
  };

  const columns: ColumnsType<UserAdminDto> = [
    {
      title: 'Người Dùng',
      key: 'user',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            size={40}
            src={record.avatarUrl}
            icon={<UserIcon size={18} />}
            style={{ background: '#262C3D', color: '#FFB955', flexShrink: 0 }}
          />
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{record.fullName}</div>
            <div style={{ color: '#CBD5E1', fontSize: 12 }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone?: string) => <span style={{ color: '#CBD5E1' }}>{phone || '—'}</span>,
    },
    {
      title: 'Vai Trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: UserRole, record) =>
        currentRole === 'ADMIN' ? (
          <Select
            size="small"
            value={role}
            style={{ width: 130 }}
            loading={roleMutation.isPending}
            onChange={(nextRole) => roleMutation.mutate({ id: record.id, role: nextRole })}
            options={[
              { value: 'CUSTOMER', label: 'CUSTOMER' },
              { value: 'STAFF', label: 'STAFF' },
              { value: 'MANAGER', label: 'MANAGER' },
              { value: 'ADMIN', label: 'ADMIN' },
            ]}
          />
        ) : (
          <Tag color={ROLE_COLORS[role] || 'default'}>{role}</Tag>
        ),
    },
    {
      title: 'Hạng & Điểm',
      key: 'loyalty',
      render: (_, record) => (
        <div>
          <div style={{ color: '#FFB955', fontWeight: 600, fontSize: 12 }}>
            {record.membershipTier || 'STANDARD'}
          </div>
          <div style={{ color: '#94A3B8', fontSize: 12 }}>
            {(record.loyaltyPoints ?? 0).toLocaleString('vi-VN')} điểm
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => <StatusBadge status={st} />,
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      fixed: 'right',
      width: 170,
      align: 'center',
      render: (_, record) => {
        const isLocked = record.status === 'LOCKED';
        return (
          <Space size={6}>
            <Button
              type="text"
              icon={<Eye size={15} />}
              onClick={() => {
                setDetailUserId(record.id);
                setIsDetailOpen(true);
              }}
              style={{ color: '#FFB955' }}
            >
              Chi Tiết
            </Button>

            {currentRole === 'ADMIN' && (
              <Button
                type="text"
                aria-label="Đặt lại mật khẩu"
                title="Đặt lại mật khẩu"
                icon={<KeyRound size={15} />}
                onClick={() => setResetPasswordUser(record)}
                style={{ color: '#38BDF8' }}
              />
            )}

            <Popconfirm
              title={isLocked ? 'Mở khóa tài khoản?' : 'Khóa tài khoản này?'}
              description={
                isLocked
                  ? `Cho phép "${record.fullName}" đăng nhập lại?`
                  : `Tài khoản "${record.fullName}" sẽ bị thu hồi phiên đăng nhập hiện tại.`
              }
              onConfirm={() =>
                statusMutation.mutate({
                  id: record.id,
                  nextStatus: isLocked ? 'ACTIVE' : 'LOCKED',
                })
              }
              okText={isLocked ? 'Mở Khóa' : 'Khóa'}
              cancelText="Hủy"
              okButtonProps={{ danger: !isLocked }}
            >
              <Button
                type="text"
                danger={!isLocked}
                icon={isLocked ? <Unlock size={15} /> : <Lock size={15} />}
                style={isLocked ? { color: '#52C41A' } : undefined}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Quản Lý Tài Khoản & Phân Quyền"
        subtitle="Tra cứu khách hàng, hạng thành viên, cấp tài khoản nhân viên và kiểm soát trạng thái truy cập"
        action={
          currentRole === 'ADMIN' ? (
            <Button
              type="primary"
              className="admin-btn-primary"
              icon={<Plus size={16} />}
              onClick={() => setIsStaffModalOpen(true)}
              style={adminPrimaryButtonStyle}
            >
              Thêm Nhân Viên
            </Button>
          ) : undefined
        }
      />

      <Card
        style={{
          background: '#161922',
          borderColor: '#2E3548',
          borderRadius: 10,
          marginBottom: 20,
        }}
        styles={{ body: {} }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <div style={{ minWidth: 260, flex: 1.5 }}>
            <span style={{ fontSize: 12, color: '#CBD5E1', display: 'block', marginBottom: 4 }}>
              Tìm Kiếm:
            </span>
            <Input
              placeholder="Tên, email hoặc số điện thoại..."
              prefix={<Search size={15} color="#CBD5E1" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={() => setPage(1)}
              allowClear
            />
          </div>

          <div style={{ minWidth: 160, flex: 1 }}>
            <span style={{ fontSize: 12, color: '#CBD5E1', display: 'block', marginBottom: 4 }}>
              Vai Trò:
            </span>
            <Select
              value={roleFilter}
              onChange={(val) => {
                setRoleFilter(val);
                setPage(1);
              }}
              style={{ width: '100%' }}
              options={[
                { value: 'ALL', label: 'Tất cả vai trò' },
                { value: 'CUSTOMER', label: 'Khách hàng (CUSTOMER)' },
                { value: 'STAFF', label: 'Nhân viên (STAFF)' },
                { value: 'MANAGER', label: 'Quản lý (MANAGER)' },
                { value: 'ADMIN', label: 'Quản trị (ADMIN)' },
              ]}
            />
          </div>

          <div style={{ minWidth: 160, flex: 1 }}>
            <span style={{ fontSize: 12, color: '#CBD5E1', display: 'block', marginBottom: 4 }}>
              Trạng Thái:
            </span>
            <Select
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
              style={{ width: '100%' }}
              options={[
                { value: 'ALL', label: 'Tất cả trạng thái' },
                { value: 'ACTIVE', label: 'Hoạt Động' },
                { value: 'LOCKED', label: 'Đã Khóa' },
              ]}
            />
          </div>

          <div style={{ alignSelf: 'flex-end' }}>
            <Button
              type="primary"
              className="admin-btn-primary"
              icon={<RotateCcw size={15} />}
              onClick={handleReset}
              style={adminPrimaryButtonStyle}
            >
              Đặt Lại
            </Button>
          </div>
        </div>
      </Card>

      <Card
        style={{
          background: '#161922',
          borderColor: '#2E3548',
          borderRadius: 10,
        }}
        styles={{ body: {} }}
      >
        <Table<UserAdminDto>
          size="small"
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: page,
            pageSize,
            total: totalItems,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
            showTotal: (total) => `Tổng số ${total} tài khoản`,
          }}
        />
      </Card>

      <UserDetailDrawer
        userId={detailUserId}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <StaffFormModal
        open={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        onSuccess={() => refetch()}
      />

      <ResetPasswordModal
        open={Boolean(resetPasswordUser)}
        user={resetPasswordUser}
        onClose={() => setResetPasswordUser(null)}
      />
    </div>
  );
};

export default AdminUsersPage;
