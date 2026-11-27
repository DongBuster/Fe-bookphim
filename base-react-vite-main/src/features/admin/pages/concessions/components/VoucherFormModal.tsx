import type { FC } from 'react';
import { useState } from 'react';
import { Form, Input, InputNumber, Radio, DatePicker, message } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { createAdminVoucherApi } from '@features/admin/api/admin-concessions.api';
import type { CreateVoucherDto } from '@features/admin/types/admin.types';
import { AdminBaseModal } from '@features/admin/components/AdminBaseModal';

interface VoucherFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface VoucherFormFieldValues {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderAmount?: number;
  maxUsageCount: number;
  expiresAt: Dayjs;
}

export const VoucherFormModal: FC<VoucherFormModalProps> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm<VoucherFormFieldValues>();
  const [loading, setLoading] = useState(false);

  const discountType = Form.useWatch('discountType', form);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload: CreateVoucherDto = {
        code: values.code.trim().toUpperCase(),
        discountType: values.discountType,
        discountValue: values.discountValue,
        minOrderAmount: values.minOrderAmount || 0,
        maxUsageCount: values.maxUsageCount,
        expiresAt: values.expiresAt.toISOString(),
      };

      await createAdminVoucherApi(payload);
      message.success(`Tạo mã ưu đãi "${payload.code}" thành công!`);
      form.resetFields();
      onSuccess();
    } catch (err: unknown) {
      let errMsg = 'Có lỗi xảy ra khi tạo voucher';
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
      title="Tạo Mã Giảm Giá / Voucher Mới"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleSubmit}
      okText="Tạo Voucher"
      cancelText="Hủy"
      confirmLoading={loading}
      width={560}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          discountType: 'PERCENTAGE',
          discountValue: 15,
          minOrderAmount: 0,
          maxUsageCount: 100,
          expiresAt: dayjs().add(30, 'day'),
        }}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="code"
          label={<span style={{ color: '#E2E8F0' }}>Mã Voucher (Code)</span>}
          rules={[
            { required: true, message: 'Vui lòng nhập mã code' },
            { min: 3, message: 'Mã tối thiểu 3 ký tự' },
          ]}
        >
          <Input
            placeholder="VD: PHIMBOOK2026, SUMMER20, VIPGIFT"
            style={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}
          />
        </Form.Item>

        <Form.Item
          name="discountType"
          label={<span style={{ color: '#E2E8F0' }}>Loại Giảm Giá</span>}
          rules={[{ required: true }]}
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="PERCENTAGE">Theo Phần Trăm (%)</Radio.Button>
            <Radio.Button value="FIXED_AMOUNT">Số Tiền Cố Định (VNĐ)</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            name="discountValue"
            label={
              <span style={{ color: '#E2E8F0' }}>
                {discountType === 'PERCENTAGE' ? 'Tỷ Lệ Giảm (%)' : 'Số Tiền Giảm (VNĐ)'}
              </span>
            }
            rules={[{ required: true, message: 'Nhập giá trị giảm' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              max={discountType === 'PERCENTAGE' ? 100 : 2000000}
              step={discountType === 'PERCENTAGE' ? 5 : 10000}
              formatter={
                discountType === 'PERCENTAGE'
                  ? (val) => `${val}%`
                  : (val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
            />
          </Form.Item>

          <Form.Item
            name="minOrderAmount"
            label={<span style={{ color: '#E2E8F0' }}>Đơn Hàng Tối Thiểu (VNĐ)</span>}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={10000}
              formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              placeholder="0 = Không yêu cầu"
            />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            name="maxUsageCount"
            label={<span style={{ color: '#E2E8F0' }}>Lượt Sử Dụng Tối Đa</span>}
            rules={[{ required: true, message: 'Nhập số lượt' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} max={100000} />
          </Form.Item>

          <Form.Item
            name="expiresAt"
            label={<span style={{ color: '#E2E8F0' }}>Hạn Sử Dụng Đến</span>}
            rules={[{ required: true, message: 'Chọn ngày hết hạn' }]}
          >
            <DatePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </div>
      </Form>
    </AdminBaseModal>
  );
};

export default VoucherFormModal;
