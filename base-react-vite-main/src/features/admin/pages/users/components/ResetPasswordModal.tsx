import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Form, Input, message } from 'antd';
import { AdminBaseModal } from '@features/admin/components/AdminBaseModal';
import { resetUserPasswordApi } from '@features/admin/api/admin-users.api';
import type { UserAdminDto } from '@features/admin/types/admin.types';

export interface ResetPasswordModalProps {
  open: boolean;
  user: UserAdminDto | null;
  onClose: () => void;
}

interface ResetPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

export const ResetPasswordModal: FC<ResetPasswordModalProps> = ({ open, user, onClose }) => {
  const [form] = Form.useForm<ResetPasswordFormValues>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = async () => {
    if (!user) return;
    try {
      const values = await form.validateFields();
      setLoading(true);
      await resetUserPasswordApi(user.id, values.newPassword);
      message.success(`Đã đặt lại mật khẩu cho "${user.email}"!`);
      onClose();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errorFields' in err) {
        return;
      }
      message.error(err instanceof Error ? err.message : 'Không thể đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminBaseModal
      title="Đặt Lại Mật Khẩu"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Cập Nhật Mật Khẩu"
      cancelText="Hủy"
      confirmLoading={loading}
      width={460}
    >
      {user && (
        <div
          style={{
            marginBottom: 16,
            padding: '10px 14px',
            background: '#1E222E',
            border: '1px solid #3A4258',
            borderRadius: 8,
            fontSize: 13,
            color: '#CBD5E1',
          }}
        >
          Tài khoản: <strong style={{ color: '#FFB955' }}>{user.fullName}</strong> ({user.email})
        </div>
      )}

      <Form form={form} layout="vertical">
        <Form.Item
          name="newPassword"
          label="Mật Khẩu Mới"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
            { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
          ]}
        >
          <Input.Password placeholder="Tối thiểu 6 ký tự" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác Nhận Mật Khẩu Mới"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu mới" />
        </Form.Item>
      </Form>
    </AdminBaseModal>
  );
};

export default ResetPasswordModal;
