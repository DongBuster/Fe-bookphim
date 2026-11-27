import type { FC } from 'react';
import { Drawer, Spin, Descriptions, Table, Tag, Avatar, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useQuery } from '@tanstack/react-query';
import { User, Mail, Phone, Award, Building2 } from 'lucide-react';
import dayjs from 'dayjs';
import { getAdminUserDetailApi } from '@features/admin/api/admin-users.api';
import { StatusBadge } from '@features/admin/components/StatusBadge';
import { adminDrawerStyles, adminDangerButtonStyle } from '@features/admin/styles/adminUi';
import type { BookingAdminDto, UserDetailAdminDto } from '@features/admin/types/admin.types';

export interface UserDetailDrawerProps {
  userId: string | null;
  open: boolean;
  onClose: () => void;
}

export const UserDetailDrawer: FC<UserDetailDrawerProps> = ({ userId, open, onClose }) => {
  const { data: user, isLoading } = useQuery<UserDetailAdminDto>({
    queryKey: ['admin', 'user-detail', userId],
    queryFn: () => getAdminUserDetailApi(userId!),
    enabled: Boolean(open && userId),
  });

  const bookingColumns: ColumnsType<BookingAdminDto> = [
    {
      title: 'Mã Vé',
      dataIndex: 'passCode',
      key: 'passCode',
      render: (code: string) => (
        <span style={{ color: '#FFB955', fontWeight: 700, fontFamily: 'monospace' }}>{code}</span>
      ),
    },
    {
      title: 'Phim',
      dataIndex: 'movieTitle',
      key: 'movieTitle',
      render: (t: string) => <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{t}</span>,
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (val: number) => (
        <span style={{ color: '#FFB955', fontWeight: 600 }}>{(val ?? 0).toLocaleString('vi-VN')} đ</span>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => <StatusBadge status={st} />,
    },
  ];

  return (
    <Drawer
      className="admin-panel-drawer"
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span style={{ color: '#FFFFFF', fontSize: 17, fontWeight: 700 }}>
            Hồ Sơ Tài Khoản
          </span>
          {user && <StatusBadge status={user.status} />}
        </div>
      }
      size={600}
      open={open}
      onClose={onClose}
      destroyOnHidden
      styles={adminDrawerStyles}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button danger className="admin-btn-danger" onClick={onClose} style={adminDangerButtonStyle}>
            Đóng
          </Button>
        </div>
      }
    >
      <Spin spinning={isLoading}>
        {user && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: '#1E222E',
                border: '1px solid #3A4258',
                borderRadius: 10,
                padding: 16,
              }}
            >
              <Avatar
                size={60}
                src={user.avatarUrl}
                icon={<User size={26} />}
                style={{ background: '#FFB955', color: '#0B0C0E', flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF' }}>{user.fullName}</span>
                  <Tag color="gold">{user.role}</Tag>
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 6, color: '#CBD5E1', fontSize: 13, flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Mail size={14} /> {user.email}
                  </span>
                  {user.phone && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <Phone size={14} /> {user.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Descriptions
              column={2}
              bordered
              size="small"
              styles={{
                label: { background: '#1D212D', color: '#CBD5E1', fontWeight: 600 },
                content: { background: '#161922', color: '#FFFFFF' },
              }}
            >
              <Descriptions.Item label="Hạng Thành Viên">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#FFB955', fontWeight: 600 }}>
                  <Award size={14} /> {user.membershipTier || 'STANDARD'}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Điểm Tích Lũy">
                {(user.loyaltyPoints ?? 0).toLocaleString('vi-VN')} điểm
              </Descriptions.Item>
              <Descriptions.Item label="Tổng Đơn Vé">
                {user.totalBookings ?? 0} đơn
              </Descriptions.Item>
              <Descriptions.Item label="Tổng Chi Tiêu">
                <span style={{ color: '#FFB955', fontWeight: 700 }}>
                  {(user.totalSpent ?? 0).toLocaleString('vi-VN')} đ
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Cụm Rạp Phụ Trách" span={2}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Building2 size={14} /> {user.assignedTheaterName || 'Không áp dụng'}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày Tham Gia" span={2}>
                {user.createdAt ? dayjs(user.createdAt).format('HH:mm DD/MM/YYYY') : '-'}
              </Descriptions.Item>
            </Descriptions>

            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
                10 Đơn Vé Gần Nhất
              </h4>
              <Table<BookingAdminDto>
                size="small"
                columns={bookingColumns}
                dataSource={user.recentBookings ?? []}
                rowKey="bookingId"
                pagination={false}
                locale={{ emptyText: 'Chưa có đơn đặt vé nào' }}
              />
            </div>
          </div>
        )}
      </Spin>
    </Drawer>
  );
};

export default UserDetailDrawer;
