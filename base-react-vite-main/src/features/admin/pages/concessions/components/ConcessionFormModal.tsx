import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Switch, message } from 'antd';
import { upsertAdminConcessionApi } from '@features/admin/api/admin-concessions.api';
import type { ConcessionDto, UpsertConcessionDto } from '@features/admin/types/admin.types';
import { AdminBaseModal } from '@features/admin/components/AdminBaseModal';

interface ConcessionFormModalProps {
  open: boolean;
  initialData?: ConcessionDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ConcessionFormModal: FC<ConcessionFormModalProps> = ({
  open,
  initialData,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm<UpsertConcessionDto>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.setFieldsValue({
          name: initialData.name,
          description: initialData.description,
          imageUrl: initialData.imageUrl,
          price: initialData.price,
          isAvailable: initialData.isAvailable ?? true,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          isAvailable: true,
          price: 50000,
        });
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await upsertAdminConcessionApi(values);
      message.success(initialData ? 'Cập nhật món bắp nước thành công!' : 'Thêm món bắp nước mới thành công!');
      onSuccess();
    } catch (err: unknown) {
      let errMsg = 'Có lỗi xảy ra khi lưu món bắp nước';
      if (err && typeof err === 'object' && 'response' in err) {
        const errResp = err as { response?: { data?: { message?: string } } };
        if (errResp.response?.data?.message) {
          errMsg = errResp.response.data.message;
        }
      }
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminBaseModal
      title={initialData ? 'Chỉnh Sửa Món F&B' : 'Thêm Món F&B Mới'}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={initialData ? 'Lưu Thay Đổi' : 'Thêm Món'}
      cancelText="Hủy"
      confirmLoading={loading}
      width={560}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="name"
          label={<span style={{ color: '#E2E8F0' }}>Tên Món / Combo</span>}
          rules={[{ required: true, message: 'Vui lòng nhập tên món' }]}
        >
          <Input placeholder="VD: Combo Bắp Phô Mai + 2 Coca lớn" />
        </Form.Item>

        <Form.Item
          name="price"
          label={<span style={{ color: '#E2E8F0' }}>Đơn Giá (VNĐ)</span>}
          rules={[{ required: true, message: 'Vui lòng nhập đơn giá' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            step={5000}
            formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            placeholder="VD: 85,000"
          />
        </Form.Item>

        <Form.Item
          name="imageUrl"
          label={<span style={{ color: '#E2E8F0' }}>Đường Dẫn Hình Ảnh (URL)</span>}
        >
          <Input placeholder="https://example.com/popcorn-combo.png" />
        </Form.Item>

        <Form.Item
          name="description"
          label={<span style={{ color: '#E2E8F0' }}>Mô Tả Chi Tiết</span>}
        >
          <Input.TextArea
            rows={3}
            placeholder="VD: Gồm 1 bắp rang vị phô mai thượng hạng và 2 ly nước ngọt có ga cỡ lớn."
          />
        </Form.Item>

        <Form.Item
          name="isAvailable"
          label={<span style={{ color: '#E2E8F0' }}>Sẵn Sàng Phục Vụ (Còn Hàng)</span>}
          valuePropName="checked"
        >
          <Switch checkedChildren="Còn Hàng" unCheckedChildren="Tạm Hết" />
        </Form.Item>
      </Form>
    </AdminBaseModal>
  );
};

export default ConcessionFormModal;
