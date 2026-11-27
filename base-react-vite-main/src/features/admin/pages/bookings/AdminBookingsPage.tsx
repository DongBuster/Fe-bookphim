import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Input, Select, DatePicker, Button, Card, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Search, QrCode, Calendar, Eye, CheckCircle2, RotateCcw } from 'lucide-react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { AdminPageHeader } from '@features/admin/components/AdminPageHeader';
import { StatusBadge } from '@features/admin/components/StatusBadge';
import { adminPrimaryButtonStyle } from '@features/admin/styles/adminUi';
import { BookingDetailDrawer } from './components/BookingDetailDrawer';
import { CheckInModal } from './components/CheckInModal';
import { getAdminBookingsApi } from '@features/admin/api/admin-bookings.api';
import type { BookingAdminDto } from '@features/admin/types/admin.types';

export const AdminBookingsPage: FC = () => {
  // Filter States
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modals & Drawers
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState<boolean>(false);
  const [checkInPassCode, setCheckInPassCode] = useState<string>('');

  const dateParam = selectedDate ? selectedDate.format('YYYY-MM-DD') : undefined;

  const {
    data: bookingsResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'bookings', 'list', search, status, dateParam, page, pageSize],
    queryFn: () =>
      getAdminBookingsApi({
        search: search.trim() || undefined,
        status,
        date: dateParam,
        page,
        pageSize,
      }),
  });

  const bookings: BookingAdminDto[] = bookingsResponse?.data || [];
  const totalItems = bookingsResponse?.metaData?.total || bookings.length;

  const handleOpenDetail = (id: string) => {
    setSelectedBookingId(id);
    setIsDrawerOpen(true);
  };

  const handleQuickCheckIn = (code: string) => {
    setCheckInPassCode(code);
    setIsCheckInModalOpen(true);
  };

  const columns: ColumnsType<BookingAdminDto> = [
    {
      title: 'Mã Đặt Vé',
      dataIndex: 'passCode',
      key: 'passCode',
      render: (code: string, record: BookingAdminDto) => (
        <span
          onClick={() => handleOpenDetail(record.bookingId)}
          style={{
            color: '#FFB955',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'monospace',
            letterSpacing: '0.5px',
          }}
        >
          {code || record.bookingId}
        </span>
      ),
    },
    {
      title: 'Khách Hàng',
      key: 'customer',
      render: (_, record) => (
        <div>
          <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{record.customerName}</div>
          <div style={{ color: '#A0A6B8', fontSize: 12 }}>{record.customerPhone}</div>
        </div>
      ),
    },
    {
      title: 'Phim & Suất Chiếu',
      key: 'movieShowtime',
      render: (_, record) => (
        <div>
          <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{record.movieTitle}</div>
          <div style={{ color: '#A0A6B8', fontSize: 12 }}>
            {record.startTime} • {record.showtimeDate}
          </div>
        </div>
      ),
    },
    {
      title: 'Cụm Rạp & Ghế',
      key: 'theaterSeats',
      render: (_, record) => (
        <div>
          <div style={{ color: '#E2E8F0' }}>{record.theaterName}</div>
          <Space wrap size={4} style={{ marginTop: 2 }}>
            {record.seatLabels?.map((seat) => (
              <Tag key={seat} color="gold" style={{ fontSize: 11, padding: '0 4px', margin: 0 }}>
                {seat}
              </Tag>
            ))}
          </Space>
        </div>
      ),
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (val: number) => (
        <span style={{ color: '#FFB955', fontWeight: 600 }}>
          {(val ?? 0).toLocaleString('vi-VN')} đ
        </span>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => <StatusBadge status={st} />,
    },
    {
      title: 'Thời Gian Đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (val: string) => (
        <span style={{ color: '#A0A6B8', fontSize: 12 }}>
          {val ? dayjs(val).format('HH:mm DD/MM/YYYY') : '-'}
        </span>
      ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      fixed: 'right',
      width: 110,
      align: 'center',
      render: (_, record) => (
        <Space size={8}>
          <Button
            type="text"
            icon={<Eye size={15} />}
            onClick={() => handleOpenDetail(record.bookingId)}
            style={{ color: '#FFB955' }}
          >
            Chi Tiết
          </Button>
          {record.status === 'PAID' && (
            <Button
              type="text"
              icon={<CheckCircle2 size={15} color="#52C41A" />}
              onClick={() => handleQuickCheckIn(record.passCode)}
              style={{ color: '#52C41A' }}
            >
              Soát Vé
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Quản Lý Đơn Vé"
        subtitle="Tra cứu đơn đặt vé theo mã vé, số điện thoại khách hàng, thông tin thanh toán và soát vé tại quầy"
        action={
          <Button
            type="primary"
            icon={<QrCode size={16} />}
            onClick={() => {
              setCheckInPassCode('');
              setIsCheckInModalOpen(true);
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
            Soát Vé Tại Quầy
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <Card
        style={{
          background: '#161922',
          borderColor: '#2E3548',
          borderRadius: 10,
          marginBottom: 20,
        }}
        bodyStyle={{ padding: '16px 20px' }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ minWidth: 260, flex: 1.5 }}>
            <span style={{ fontSize: 12, color: '#CBD5E1', display: 'block', marginBottom: 4 }}>
              Tìm Kiếm:
            </span>
            <Input
              placeholder="Mã vé, SĐT, Email hoặc Tên khách..."
              prefix={<Search size={15} color="#CBD5E1" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={() => setPage(1)}
              allowClear
              style={{ width: '100%' }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: 180, flex: 1 }}>
            <span style={{ fontSize: 12, color: '#CBD5E1', display: 'block', marginBottom: 4 }}>
              Trạng Thái:
            </span>
            <Select
              placeholder="Tất cả trạng thái"
              allowClear
              value={status}
              onChange={(val) => {
                setStatus(val);
                setPage(1);
              }}
              style={{ width: '100%' }}
              options={[
                { value: 'PAID', label: 'Đã Thanh Toán (PAID)' },
                { value: 'CHECKED_IN', label: 'Đã Soát Vé (CHECKED_IN)' },
                { value: 'PENDING_PAYMENT', label: 'Chờ Thanh Toán' },
                { value: 'CANCELLED', label: 'Đã Hủy (CANCELLED)' },
                { value: 'REFUNDED', label: 'Đã Hoàn Tiền (REFUNDED)' },
              ]}
            />
          </div>

          {/* Date Filter */}
          <div style={{ minWidth: 160 }}>
            <span style={{ fontSize: 12, color: '#CBD5E1', display: 'block', marginBottom: 4 }}>
              Ngày Suất Chiếu:
            </span>
            <DatePicker
              value={selectedDate}
              onChange={(d) => {
                setSelectedDate(d);
                setPage(1);
              }}
              format="DD/MM/YYYY"
              allowClear
              style={{ width: '100%' }}
              prefix={<Calendar size={14} color="#CBD5E1" style={{ marginRight: 6 }} />}
            />
          </div>

          {/* Reset Filters */}
          <div style={{ alignSelf: 'flex-end' }}>
            <Button
              type="primary"
              className="admin-btn-primary"
              icon={<RotateCcw size={15} />}
              onClick={() => {
                setSearch('');
                setStatus(undefined);
                setSelectedDate(null);
                setPage(1);
              }}
              style={adminPrimaryButtonStyle}
            >
              Đặt Lại
            </Button>
          </div>
        </div>
      </Card>

      {/* Bookings Table */}
      <Card
        style={{
          background: '#161922',
          borderColor: '#2E3548',
          borderRadius: 10,
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Table<BookingAdminDto>
          size="small"
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={bookings}
          rowKey="bookingId"
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
            showTotal: (total) => `Tổng số ${total} đơn vé`,
          }}
        />
      </Card>

      {/* Booking Detail Drawer */}
      <BookingDetailDrawer
        bookingId={selectedBookingId}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onRefundSuccess={() => refetch()}
      />

      {/* Check In Modal */}
      <CheckInModal
        open={isCheckInModalOpen}
        initialPassCode={checkInPassCode}
        onClose={() => setIsCheckInModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default AdminBookingsPage;
