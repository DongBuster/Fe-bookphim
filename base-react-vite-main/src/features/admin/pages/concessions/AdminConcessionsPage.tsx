import type { FC } from 'react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, Table, Button, Switch, Popconfirm, Tag, Avatar, message, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Plus, Coffee, Ticket, Popcorn, PowerOff, Edit } from 'lucide-react';
import dayjs from 'dayjs';
import { AdminPageHeader } from '@features/admin/components/AdminPageHeader';
import { ConcessionFormModal } from './components/ConcessionFormModal';
import { VoucherFormModal } from './components/VoucherFormModal';
import {
  getAdminConcessionsApi,
  toggleConcessionAvailabilityApi,
  getAdminVouchersApi,
  deactivateAdminVoucherApi,
} from '@features/admin/api/admin-concessions.api';
import type { ConcessionDto, VoucherDto } from '@features/admin/types/admin.types';

export const AdminConcessionsPage: FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'concessions' | 'vouchers'>('concessions');

  // Modal States
  const [isConcessionModalOpen, setIsConcessionModalOpen] = useState(false);
  const [editingConcession, setEditingConcession] = useState<ConcessionDto | null>(null);

  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  // Pagination for vouchers
  const [voucherPage, setVoucherPage] = useState(1);
  const [voucherPageSize, setVoucherPageSize] = useState(10);

  // Queries
  const { data: concessions = [], isLoading: isConcessionsLoading, refetch: refetchConcessions } = useQuery<ConcessionDto[]>({
    queryKey: ['admin', 'concessions'],
    queryFn: getAdminConcessionsApi,
  });

  const { data: vouchersResponse, isLoading: isVouchersLoading, refetch: refetchVouchers } = useQuery({
    queryKey: ['admin', 'vouchers', voucherPage, voucherPageSize],
    queryFn: () => getAdminVouchersApi({ page: voucherPage, pageSize: voucherPageSize }),
  });

  const vouchers: VoucherDto[] = vouchersResponse?.data || [];
  const totalVouchers = vouchersResponse?.metaData?.total || vouchers.length;

  // Toggle Concession Availability Mutation
  const toggleConcessionMutation = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      toggleConcessionAvailabilityApi(id, isAvailable),
    onSuccess: () => {
      message.success('Cập nhật trạng thái món thành công!');
      queryClient.invalidateQueries({ queryKey: ['admin', 'concessions'] });
    },
    onError: () => {
      message.error('Không thể cập nhật trạng thái phục vụ');
    },
  });

  // Deactivate Voucher Mutation
  const deactivateVoucherMutation = useMutation({
    mutationFn: (voucherId: string) => deactivateAdminVoucherApi(voucherId),
    onSuccess: () => {
      message.success('Đã vô hiệu hóa mã voucher thành công!');
      queryClient.invalidateQueries({ queryKey: ['admin', 'vouchers'] });
    },
    onError: () => {
      message.error('Không thể vô hiệu hóa voucher');
    },
  });

  // Concession Columns
  const concessionColumns: ColumnsType<ConcessionDto> = [
    {
      title: 'Món / Combo F&B',
      key: 'item',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            shape="square"
            size={52}
            src={record.imageUrl}
            icon={<Popcorn size={24} />}
            style={{ background: '#252A36', color: '#FFB955' }}
          />
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: 14 }}>{record.name}</div>
            {record.description && (
              <div style={{ color: '#A0A6B8', fontSize: 12, marginTop: 2, maxWidth: 360 }}>
                {record.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Đơn Giá',
      dataIndex: 'price',
      key: 'price',
      render: (val: number) => (
        <span style={{ color: '#FFB955', fontWeight: 700, fontSize: 14 }}>
          {(val ?? 0).toLocaleString('vi-VN')} đ
        </span>
      ),
    },
    {
      title: 'Đã Bán',
      dataIndex: 'soldCount',
      key: 'soldCount',
      render: (val: number) => (
        <span style={{ color: '#E2E8F0', fontWeight: 500 }}>
          {(val ?? 0).toLocaleString('vi-VN')} phần
        </span>
      ),
    },
    {
      title: 'Trạng Thái Phục Vụ',
      key: 'availability',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Switch
            checked={record.isAvailable}
            loading={toggleConcessionMutation.isPending}
            onChange={(checked) =>
              toggleConcessionMutation.mutate({ id: record.itemId, isAvailable: checked })
            }
          />
          <span style={{ fontSize: 12, color: record.isAvailable ? '#52C41A' : '#6B7280' }}>
            {record.isAvailable ? 'Còn Hàng' : 'Tạm Hết'}
          </span>
        </div>
      ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="text"
          icon={<Edit size={15} />}
          onClick={() => {
            setEditingConcession(record);
            setIsConcessionModalOpen(true);
          }}
          style={{ color: '#FFB955' }}
        >
          Sửa
        </Button>
      ),
    },
  ];

  // Voucher Columns
  const voucherColumns: ColumnsType<VoucherDto> = [
    {
      title: 'Mã Ưu Đãi (Code)',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => (
        <span
          style={{
            color: '#FFB955',
            fontWeight: 800,
            fontFamily: 'monospace',
            letterSpacing: '1px',
            fontSize: 14,
          }}
        >
          {code}
        </span>
      ),
    },
    {
      title: 'Mức Giảm',
      key: 'discount',
      render: (_, record) => {
        if (record.discountType === 'PERCENTAGE') {
          return <Tag color="gold">Giảm {record.discountValue}%</Tag>;
        }
        return <Tag color="blue">Giảm {(record.discountValue ?? 0).toLocaleString('vi-VN')} đ</Tag>;
      },
    },
    {
      title: 'Đơn Tối Thiểu',
      dataIndex: 'minOrderAmount',
      key: 'minOrderAmount',
      render: (val: number) =>
        val > 0 ? `${val.toLocaleString('vi-VN')} đ` : <span style={{ color: '#6B7280' }}>Không yêu cầu</span>,
    },
    {
      title: 'Lượt Sử Dụng',
      key: 'usage',
      render: (_, record) => (
        <span style={{ color: '#E2E8F0' }}>
          {record.usedCount ?? 0} / {record.maxUsageCount ?? 0} lượt
        </span>
      ),
    },
    {
      title: 'Hạn Sử Dụng',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      render: (val: string) => {
        const isExpired = dayjs(val).isBefore(dayjs());
        return (
          <span style={{ color: isExpired ? '#FF535A' : '#A0A6B8', fontSize: 12 }}>
            {val ? dayjs(val).format('HH:mm DD/MM/YYYY') : '-'}
            {isExpired && ' (Hết hạn)'}
          </span>
        );
      },
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) =>
        active ? <Tag color="green">Đang Hoạt Động</Tag> : <Tag color="default">Đã Hủy Kích Hoạt</Tag>,
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      render: (_, record) =>
        record.isActive ? (
          <Popconfirm
            title="Vô hiệu hóa Voucher"
            description="Bạn có chắc chắn muốn ngưng kích hoạt voucher này không? Khách hàng sẽ không thể nhập mã này nữa."
            onConfirm={() => deactivateVoucherMutation.mutate(record.voucherId)}
            okText="Vô Hiệu Hóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              type="text"
              icon={<PowerOff size={15} />}
              loading={deactivateVoucherMutation.isPending}
            >
              Khóa
            </Button>
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Quản Lý Dịch Vụ F&B & Khuyến Mãi"
        subtitle="Quản lý menu combo bắp nước, định giá bán kèm và cấu hình các mã giảm giá ưu đãi"
        action={
          activeTab === 'concessions' ? (
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => {
                setEditingConcession(null);
                setIsConcessionModalOpen(true);
              }}
              style={{
                background: '#FFB955',
                borderColor: '#FFB955',
                color: '#000000',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              Thêm Món F&B
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => setIsVoucherModalOpen(true)}
              style={{
                background: '#FFB955',
                borderColor: '#FFB955',
                color: '#000000',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              Tạo Voucher Mới
            </Button>
          )
        }
      />

      <Card
        style={{
          background: '#161922',
          borderColor: '#2E3548',
          borderRadius: 10,
        }}
        styles={{ body: {} }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k as 'concessions' | 'vouchers')}
          items={[
            {
              key: 'concessions',
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                  <Coffee size={16} /> Bắp Nước & Combo F&B ({concessions.length})
                </span>
              ),
              children: (
                <Table<ConcessionDto>
                  size="small"
                  scroll={{ x: 'max-content' }}
                  columns={concessionColumns}
                  dataSource={concessions}
                  rowKey="itemId"
                  loading={isConcessionsLoading}
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: 'vouchers',
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                  <Ticket size={16} /> Mã Giảm Giá / Voucher ({totalVouchers})
                </span>
              ),
              children: (
                <Table<VoucherDto>
                  size="small"
                  scroll={{ x: 'max-content' }}
                  columns={voucherColumns}
                  dataSource={vouchers}
                  rowKey="voucherId"
                  loading={isVouchersLoading}
                  pagination={{
                    current: voucherPage,
                    pageSize: voucherPageSize,
                    total: totalVouchers,
                    showSizeChanger: true,
                    onChange: (p, ps) => {
                      setVoucherPage(p);
                      setVoucherPageSize(ps);
                    },
                  }}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* Concession Modal */}
      <ConcessionFormModal
        open={isConcessionModalOpen}
        initialData={editingConcession}
        onClose={() => {
          setIsConcessionModalOpen(false);
          setEditingConcession(null);
        }}
        onSuccess={() => {
          setIsConcessionModalOpen(false);
          setEditingConcession(null);
          refetchConcessions();
        }}
      />

      {/* Voucher Modal */}
      <VoucherFormModal
        open={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        onSuccess={() => {
          setIsVoucherModalOpen(false);
          refetchVouchers();
        }}
      />
    </div>
  );
};

export default AdminConcessionsPage;
