import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Input, Button, Alert, Space, Typography, message } from 'antd';
import { QrCode, CheckCircle2, AlertCircle } from 'lucide-react';
import { checkInTicketApi } from '@features/admin/api/admin-bookings.api';
import { AdminBaseModal } from '@features/admin/components/AdminBaseModal';

const { Text, Title } = Typography;

interface CheckInModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialPassCode?: string;
}

export const CheckInModal: FC<CheckInModalProps> = ({
  open,
  onClose,
  onSuccess,
  initialPassCode = '',
}) => {
  const [passCode, setPassCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    status: 'success' | 'error' | null;
    message: string;
  }>({ status: null, message: '' });

  useEffect(() => {
    if (open) {
      setPassCode(initialPassCode);
      setResult({ status: null, message: '' });
    }
  }, [open, initialPassCode]);

  const handleCheckIn = async () => {
    const trimmed = passCode.trim().toUpperCase();
    if (!trimmed) {
      message.warning('Vui lòng nhập mã vé hoặc passCode để soát vé');
      return;
    }

    setLoading(true);
    setResult({ status: null, message: '' });

    try {
      const res = await checkInTicketApi(trimmed);
      setResult({
        status: 'success',
        message: res?.message || `Mã vé ${trimmed} đã được soát thành công! Khách hàng có thể vào phòng chiếu.`,
      });
      message.success('Soát vé thành công!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      let errMsg = 'Mã vé không tồn tại, chưa thanh toán hoặc đã được soát trước đó.';
      if (err && typeof err === 'object' && 'response' in err) {
        const errResp = err as { response?: { data?: { message?: string } } };
        if (errResp.response?.data?.message) {
          errMsg = errResp.response.data.message;
        }
      }
      setResult({
        status: 'error',
        message: errMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetForNext = () => {
    setPassCode('');
    setResult({ status: null, message: '' });
  };

  return (
    <AdminBaseModal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <QrCode size={22} color="#FFB955" />
          <span style={{ color: '#FFFFFF', fontSize: 17, fontWeight: 700 }}>
            Soát Vé Tại Quầy (Check-in)
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={520}
    >
      <div style={{ marginTop: 20 }}>
        <Text style={{ color: '#A0A6B8', fontSize: 13, display: 'block', marginBottom: 12 }}>
          Nhập mã đặt vé (passCode), mã đơn hoặc quét từ đầu đọc mã vạch / QR của khách:
        </Text>

        <Space orientation="vertical" style={{ width: '100%' }} size={16}>
          <div style={{ display: 'flex', gap: 10 }}>
            <Input
              size="large"
              placeholder="VD: PB-981245 hoặc passCode"
              value={passCode}
              onChange={(e) => setPassCode(e.target.value.toUpperCase())}
              onPressEnter={handleCheckIn}
              style={{
                background: '#0B0C0E',
                borderColor: '#252A36',
                color: '#FFFFFF',
                fontSize: 16,
                letterSpacing: '1px',
                fontWeight: 600,
              }}
              autoFocus
            />
            <Button
              type="primary"
              size="large"
              onClick={handleCheckIn}
              loading={loading}
              style={{
                background: '#FFB955',
                borderColor: '#FFB955',
                color: '#000000',
                fontWeight: 700,
                padding: '0 24px',
              }}
            >
              Soát Vé
            </Button>
          </div>

          {result.status === 'success' && (
            <Alert
              type="success"
              showIcon
              icon={<CheckCircle2 color="#52C41A" />}
              message={<Title level={5} style={{ color: '#52C41A', margin: 0 }}>Soát Vé Hợp Lệ</Title>}
              description={result.message}
              style={{ background: 'rgba(82, 196, 26, 0.1)', borderColor: '#52C41A' }}
              action={
                <Button size="small" type="primary" onClick={handleResetForNext} style={{ background: '#52C41A' }}>
                  Soát Vé Tiếp
                </Button>
              }
            />
          )}

          {result.status === 'error' && (
            <Alert
              type="error"
              showIcon
              icon={<AlertCircle color="#FF535A" />}
              message={<Title level={5} style={{ color: '#FF535A', margin: 0 }}>Không Hợp Lệ</Title>}
              description={result.message}
              style={{ background: 'rgba(255, 83, 90, 0.1)', borderColor: '#FF535A' }}
            />
          )}

          <div
            style={{
              background: '#1A1E29',
              borderRadius: 8,
              padding: 12,
              border: '1px dashed #2B3345',
              fontSize: 12,
              color: '#6B7280',
            }}
          >
            💡 <b style={{ color: '#A0A6B8' }}>Lưu ý:</b> Mỗi mã vé chỉ có thể soát vé thành công một lần duy
            nhất. Trạng thái đơn vé sẽ tự động chuyển sang <b style={{ color: '#9333EA' }}>ĐÃ SOÁT VÉ (CHECKED_IN)</b>.
          </div>
        </Space>
      </div>
    </AdminBaseModal>
  );
};

export default CheckInModal;
