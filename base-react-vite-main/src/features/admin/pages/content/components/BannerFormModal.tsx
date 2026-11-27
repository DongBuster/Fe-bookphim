import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Switch, message } from 'antd';
import { AdminBaseModal } from '@features/admin/components/AdminBaseModal';
import { createAdminBannerApi, updateAdminBannerApi } from '@features/admin/api/admin-content.api';
import type { BannerAdminDto, UpsertBannerDto } from '@features/admin/types/admin.types';

export interface BannerFormModalProps {
  open: boolean;
  initialData?: BannerAdminDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const BannerFormModal: FC<BannerFormModalProps> = ({
  open,
  initialData,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm<UpsertBannerDto>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.setFieldsValue(initialData);
      } else {
        form.resetFields();
        form.setFieldsValue({ displayOrder: 1, isActive: true });
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (initialData?.id) {
        await updateAdminBannerApi(initialData.id, values);
        message.success('Cập nhật banner thành công!');
      } else {
        await createAdminBannerApi(values);
        message.success('Thêm banner mới thành công!');
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errorFields' in err) {
        return;
      }
      message.error(err instanceof Error ? err.message : 'Không thể lưu banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminBaseModal
      title={initialData ? 'Chỉnh Sửa Banner' : 'Thêm Banner Mới'}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={initialData ? 'Lưu Thay Đổi' : 'Thêm Banner'}
      cancelText="Hủy"
      confirmLoading={loading}
      width={540}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Tiêu Đề Banner"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề banner' }]}
        >
          <Input placeholder="VD: Siêu Phẩm Hè 2026 - Đặt Vé Sớm Giảm 20%" />
        </Form.Item>

        <Form.Item
          name="imageUrl"
          label="Đường Dẫn Hình Ảnh (URL)"
          rules={[{ required: true, message: 'Vui lòng nhập URL hình ảnh' }]}
        >
          <Input placeholder="https://example.com/banner.jpg" />
        </Form.Item>

        <Form.Item name="linkUrl" label="Đường Dẫn Điều Hướng (Khi Click)">
          <Input placeholder="/movies/dune-part-two" />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            name="displayOrder"
            label="Thứ Tự Hiển Thị"
            rules={[{ required: true, message: 'Nhập thứ tự' }]}
          >
            <InputNumber min={1} max={99} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="isActive" label="Trạng Thái Hiển Thị" valuePropName="checked">
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
        </div>
      </Form>
    </AdminBaseModal>
  );
};

export default BannerFormModal;
