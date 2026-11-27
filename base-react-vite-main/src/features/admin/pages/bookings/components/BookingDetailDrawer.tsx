import type { FC } from 'react';
import { useState } from 'react';
import {
  Drawer,
  Spin,
  Descriptions,
  Tag,
  Button,
  Modal,
  Input,
  message,
  Table,
  Space,
  QRCode,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RotateCcw, User, Film, Ticket, Coffee, CreditCard, ShieldCheck } from 'lucide-react';
import dayjs from 'dayjs';
import { StatusBadge } from '@features/admin/components/StatusBadge';
import { getAdminBookingDetailApi, refundBookingApi } from '@features/admin/api/admin-bookings.api';
import type { BookingDetailAdminDto } from '@features/admin/types/admin.types';
import {
  adminDrawerStyles,
  adminDangerButtonStyle,
} from '@features/admin/styles/adminUi';

interface BookingDetailDrawerProps {
  bookingId: string | null;
  open: boolean;
  onClose: () => void;
  onRefundSuccess?: () => void;
}

export const BookingDetailDrawer: FC<BookingDetailDrawerProps> = ({
  bookingId,
  open,
  onClose,
  onRefundSuccess,
}) => {
  const queryClient = useQueryClient();
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  const { data: booking, isLoading, refetch } = useQuery<BookingDetailAdminDto>({
    queryKey: ['admin', 'booking-detail', bookingId],
    queryFn: () => getAdminBookingDetailApi(bookingId!),
    enabled: Boolean(open && bookingId),
  });

  const refundMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => refundBookingApi(id, reason),
    onSuccess: () => {
      message.success('Đã hoàn tiền và hủy đơn vé thành công!');
      setIsRefundModalOpen(false);
      setRefundReason('');
      refetch();
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      if (onRefundSuccess) onRefundSuccess();
    },
    onError: (err: unknown) => {
      let errMsg = 'Không thể thực hiện hoàn tiền đơn vé này';
      if (err && typeof err === 'object' && 'response' in err) {
        const errResp = err as { response?: { data?: { message?: string } } };
        if (errResp.response?.data?.message) {
          errMsg = errResp.response.data.message;
        }
      }
      message.error(errMsg);
    },
  });

  const handleRefundSubmit = () => {
    if (!bookingId) return;
    if (!refundReason.trim()) {
      message.warning('Vui lòng nhập lý do hoàn tiền');
      return;
    }
    refundMutation.mutate({ id: bookingId, reason: refundReason.trim() });
  };

  const concessionColumns: ColumnsType<{ name: string; quantity: number; unitPrice: number }> = [
    { title: 'Tên món', dataIndex: 'name', key: 'name' },
    { title: 'SL', dataIndex: 'quantity', key: 'quantity', width: 60, align: 'center' },
    {
      title: 'Đơn giá',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (val: number) => `${(val ?? 0).toLocaleString('vi-VN')} đ`,
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_, r) => `${((r.quantity ?? 0) * (r.unitPrice ?? 0)).toLocaleString('vi-VN')} đ`,
    },
  ];

  const canRefund = booking?.status === 'PAID';

  return (
    <>
      <Drawer
        className="admin-panel-drawer"
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>
              Chi Tiết Đơn Vé: {booking?.passCode || bookingId}
            </span>
            {booking && <StatusBadge status={booking.status} />}
          </div>
        }
        placement="right"
        size={560}
        onClose={onClose}
        open={open}
        destroyOnHidden
        styles={adminDrawerStyles}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {canRefund ? (
              <Button
                danger
                className="admin-btn-danger"
                icon={<RotateCcw size={16} />}
                onClick={() => setIsRefundModalOpen(true)}
                style={adminDangerButtonStyle}
              >
                Hoàn Tiền & Hủy Vé
              </Button>
            ) : (
              <span style={{ fontSize: 12, color: '#94A3B8' }}>
                {booking?.status === 'REFUNDED'
                  ? 'Đơn vé đã hoàn tiền'
                  : booking?.status === 'CHECKED_IN'
                    ? 'Vé đã soát vào rạp, không thể hoàn'
                    : 'Trạng thái không hỗ trợ hoàn tiền'}
              </span>
            )}
            <Button
              danger
              className="admin-btn-danger"
              onClick={onClose}
              style={adminDangerButtonStyle}
            >
              Đóng
            </Button>
          </div>
        }
      >
        <Spin spinning={isLoading}>
          {booking && (
            <div>
              {/* QR Code and Passcode hero banner */}
              <div
                style={{
                  background: '#13151B',
                  border: '1px solid #252A36',
                  borderRadius: 12,
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  marginBottom: 20,
                }}
              >
                <div style={{ background: '#FFF', padding: 8, borderRadius: 8, display: 'inline-block' }}>
                  {booking.qrCodeBase64 ? (
                    <img
                      src={booking.qrCodeBase64}
                      alt="QR Code"
                      style={{ width: 100, height: 100, objectFit: 'contain', display: 'block' }}
                    />
                  ) : (
                    <QRCode value={booking.passCode || booking.bookingId} size={100} />
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#A0A6B8', textTransform: 'uppercase' }}>
                    Mã Check-in / Soát Vé
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: '#FFB955',
                      letterSpacing: '1px',
                      marginTop: 4,
                    }}
                  >
                    {booking.passCode}
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>
                    Mã đơn: {booking.bookingId}
                  </div>
                  {booking.checkedInAt && (
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, color: '#52C41A', fontSize: 12 }}>
                      <ShieldCheck size={14} />
                      Đã soát vé lúc: {dayjs(booking.checkedInAt).format('HH:mm DD/MM/YYYY')}
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Information */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, color: '#FFB955', fontWeight: 600 }}>
                  <User size={16} /> Thông Tin Khách Hàng
                </div>
                <Descriptions
                  bordered
                  size="small"
                  column={1}
                  styles={{
                    label: { background: '#13151B', color: '#A0A6B8', width: 130 },
                    content: { background: '#0B0C0E', color: '#FFFFFF' },
                  }}
                >
                  <Descriptions.Item label="Họ tên">{booking.customerName}</Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">{booking.customerPhone}</Descriptions.Item>
                  <Descriptions.Item label="Email">{booking.customerEmail}</Descriptions.Item>
                </Descriptions>
              </div>

              {/* Movie and Showtime */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, color: '#FFB955', fontWeight: 600 }}>
                  <Film size={16} /> Thông Tin Suất Chiếu
                </div>
                <Descriptions
                  bordered
                  size="small"
                  column={1}
                  styles={{
                    label: { background: '#13151B', color: '#A0A6B8', width: 130 },
                    content: { background: '#0B0C0E', color: '#FFFFFF' },
                  }}
                >
                  <Descriptions.Item label="Tên phim">
                    <span style={{ fontWeight: 600, color: '#FFF' }}>{booking.movieTitle}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Cụm rạp">{booking.theaterName}</Descriptions.Item>
                  <Descriptions.Item label="Suất chiếu">
                    {booking.startTime} • Ngày {booking.showtimeDate}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ghế đã chọn">
                    <Space wrap>
                      {booking.seatLabels?.map((seat) => (
                        <Tag key={seat} color="gold" style={{ fontWeight: 600, margin: '2px 4px' }}>
                          <Ticket size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                          {seat}
                        </Tag>
                      ))}
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              </div>

              {/* Concessions / F&B items */}
              {booking.concessions && booking.concessions.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, color: '#FFB955', fontWeight: 600 }}>
                    <Coffee size={16} /> Bắp Nước & Combo
                  </div>
                  <Table
                    columns={concessionColumns}
                    dataSource={booking.concessions}
                    rowKey="name"
                    pagination={false}
                    size="small"
                  />
                </div>
              )}

              {/* Payment Details */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, color: '#FFB955', fontWeight: 600 }}>
                  <CreditCard size={16} /> Thanh Toán
                </div>
                <Descriptions
                  bordered
                  size="small"
                  column={1}
                  styles={{
                    label: { background: '#13151B', color: '#A0A6B8', width: 130 },
                    content: { background: '#0B0C0E', color: '#FFFFFF' },
                  }}
                >
                  <Descriptions.Item label="Phương thức">{booking.paymentMethod}</Descriptions.Item>
                  <Descriptions.Item label="Thời gian tạo">
                    {dayjs(booking.createdAt).format('HH:mm:ss DD/MM/YYYY')}
                  </Descriptions.Item>
                  {booking.discountAmount > 0 && (
                    <Descriptions.Item label="Mã giảm giá">
                      <span style={{ color: '#52C41A' }}>
                        {booking.voucherCode || 'Ưu đãi'}: -{booking.discountAmount.toLocaleString('vi-VN')} đ
                      </span>
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="Tổng thanh toán">
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#FFB955' }}>
                      {(booking.totalAmount ?? 0).toLocaleString('vi-VN')} đ
                    </span>
                  </Descriptions.Item>
                  {booking.refundReason && (
                    <Descriptions.Item label="Lý do hoàn tiền">
                      <span style={{ color: '#FF535A' }}>{booking.refundReason}</span>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </div>
            </div>
          )}
        </Spin>
      </Drawer>

      {/* Refund Reason Dialog Modal */}
      <Modal
        title={<span style={{ color: '#FF535A', fontWeight: 700 }}>Xác Nhận Hoàn Tiền Vé</span>}
        open={isRefundModalOpen}
        onCancel={() => {
          setIsRefundModalOpen(false);
          setRefundReason('');
        }}
        onOk={handleRefundSubmit}
        confirmLoading={refundMutation.isPending}
        okText="Xác Nhận Hoàn Tiền"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
      >
        <div style={{ marginTop: 12 }}>
          <p style={{ color: '#E2E8F0', fontSize: 14 }}>
            Hành động này sẽ hủy đơn vé <b>{booking?.passCode}</b> và trả tiền lại cho khách hàng. Vui
            lòng nhập lý do hoàn tiền để lưu nhật ký:
          </p>
          <Input.TextArea
            rows={3}
            placeholder="VD: Khách yêu cầu đổi lịch / Rạp bảo trì kỹ thuật..."
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            style={{ background: '#0B0C0E', borderColor: '#252A36', color: '#FFF' }}
          />
        </div>
      </Modal>
    </>
  );
};

export default BookingDetailDrawer;
