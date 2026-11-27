import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Form, Input, Select, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { AdminBaseModal } from '@features/admin/components/AdminBaseModal';
import { createAdminStaffApi } from '@features/admin/api/admin-users.api';
import { getAdminTheatersApi } from '@features/admin/api/admin-theaters.api';
import type { CreateStaffRequestDto, TheaterWithRoomsDto } from '@features/admin/types/admin.types';

export interface StaffFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const StaffFormModal: FC<StaffFormModalProps> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm<CreateStaffRequestDto>();
  const [loading, setLoading] = useState(false);

  const selectedRole = Form.useWatch('role', form);

  const { data: theaters = [] } = useQuery<TheaterWithRoomsDto[]>({
    queryKey: ['admin', 'theaters', 'staff-modal'],
    queryFn: getAdminTheatersApi,
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({ role: 'STAFF' });
    }
  }, [open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await createAdminStaffApi({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone?.trim() || undefined,
        password: values.password,
        role: values.role,
        assignedTheaterId: values.role === 'ADMIN' ? undefined : values.assignedTheaterId,
      });
      message.success('Tạo tài khoản nhân viên thành công!');
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errorFields' in err) {
        return;
      }
      const msg = err instanceof Error ? err.message : 'Không thể tạo tài khoản nhân viên';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminBaseModal
      title="Thêm Tài Khoản Nhân Viên"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Tạo Tài Khoản"
      cancelText="Hủy"
      confirmLoading={loading}
      width={540}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="fullName"
          label="Họ và Tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
        >
          <Input placeholder="Ví dụ: Nguyễn Văn A" />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            name="email"
            label="Email Đăng Nhập"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không đúng định dạng' },
            ]}
          >
            <Input placeholder="staff@phimbook.vn" />
          </Form.Item>

          <Form.Item name="phone" label="Số Điện Thoại">
            <Input placeholder="09xxxxxxxx" />
          </Form.Item>
        </div>

        <Form.Item
          name="password"
          label="Mật Khẩu Khởi Tạo"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
          ]}
        >
          <Input.Password placeholder="Tối thiểu 6 ký tự" />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            name="role"
            label="Vai Trò Phân Quyền"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select
              options={[
                { value: 'STAFF', label: 'Nhân Viên Quầy (STAFF)' },
                { value: 'MANAGER', label: 'Quản Lý Rạp (MANAGER)' },
                { value: 'ADMIN', label: 'Quản Trị Viên (ADMIN)' },
              ]}
            />
          </Form.Item>

          {selectedRole !== 'ADMIN' && (
            <Form.Item
              name="assignedTheaterId"
              label="Cụm Rạp Phụ Trách"
              rules={[{ required: true, message: 'Vui lòng chọn cụm rạp' }]}
            >
              <Select
                placeholder="Chọn cụm rạp"
                options={theaters.map((t) => ({
                  value: t.theaterId,
                  label: `${t.theaterName} (${t.city})`,
                }))}
              />
            </Form.Item>
          )}
        </div>
      </Form>
    </AdminBaseModal>
  );
};

export default StaffFormModal;
