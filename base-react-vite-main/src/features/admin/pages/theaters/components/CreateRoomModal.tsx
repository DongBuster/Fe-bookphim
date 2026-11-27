import type { FC } from 'react';
import { useEffect } from 'react';
import { Form, Input, InputNumber, Select, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateRoomDto } from '@features/admin/types/admin.types';
import { createAdminRoomApi } from '@features/admin/api/admin-theaters.api';
import { AdminBaseModal } from '@features/admin/components/AdminBaseModal';

export interface CreateRoomModalProps {
  open: boolean;
  onClose: () => void;
  theaterId?: string;
  theaterName?: string;
  theaters?: { theaterId: string; theaterName: string }[];
  onSuccess: () => void;
}

export const CreateRoomModal: FC<CreateRoomModalProps> = ({
  open,
  onClose,
  theaterId,
  theaterName,
  theaters = [],
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        theaterId: theaterId || (theaters[0]?.theaterId ?? ''),
        screenType: 'STANDARD_2D',
        totalRows: 10,
        totalColumns: 14,
      });
    }
  }, [open, theaterId, theaters, form]);

  const mutation = useMutation({
    mutationFn: (body: CreateRoomDto) => createAdminRoomApi(body),
    onSuccess: () => {
      message.success('Tạo phòng chiếu mới thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'theaters'] });
      onSuccess();
      onClose();
    },
    onError: (err: unknown) => {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi khi tạo phòng chiếu';
      message.error(errorMsg);
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: CreateRoomDto = {
        theaterId: values.theaterId,
        roomName: values.roomName.trim(),
        screenType: values.screenType,
        totalRows: Number(values.totalRows),
        totalColumns: Number(values.totalColumns),
      };
      await mutation.mutateAsync(payload);
    } catch {
      // Form validation error
    }
  };

  const totalRows = Form.useWatch('totalRows', form) || 0;
  const totalColumns = Form.useWatch('totalColumns', form) || 0;
  const calculatedSeats = totalRows * totalColumns;

  return (
    <AdminBaseModal
      title={
        <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 17 }}>
          Thêm Phòng Chiếu Mới
          {theaterName && <span style={{ color: '#FFB955', marginLeft: 8 }}>— {theaterName}</span>}
        </div>
      }
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Tạo Phòng Chiếu"
      cancelText="Hủy"
      confirmLoading={mutation.isPending}
      width={520}
    >
      <Form form={form} layout="vertical">
        {!theaterId && (
          <Form.Item
            name="theaterId"
            label={<span style={{ color: '#FFFFFF' }}>Cụm Rạp Chiếu</span>}
            rules={[{ required: true, message: 'Vui lòng chọn cụm rạp' }]}
          >
            <Select
              placeholder="Chọn rạp"
              options={theaters.map((t) => ({ label: t.theaterName, value: t.theaterId }))}
            />
          </Form.Item>
        )}

        <Form.Item
          name="roomName"
          label={<span style={{ color: '#FFFFFF' }}>Tên Phòng Chiếu</span>}
          rules={[{ required: true, message: 'Nhập tên phòng chiếu' }]}
        >
          <Input placeholder="Ví dụ: Phòng 1 (IMAX Laser), Phòng 2 (Standard)" />
        </Form.Item>

        <Form.Item
          name="screenType"
          label={<span style={{ color: '#FFFFFF' }}>Loại Màn Hình & Công Nghệ Chiếu</span>}
          rules={[{ required: true, message: 'Chọn loại màn hình' }]}
        >
          <Select
            options={[
              { label: 'Standard 2D', value: 'STANDARD_2D' },
              { label: 'Standard 3D', value: 'STANDARD_3D' },
              { label: 'IMAX Laser 2D', value: 'IMAX' },
              { label: 'IMAX 3D', value: 'IMAX_3D' },
              { label: '4DX Motion', value: 'FOUR_DX' },
              { label: 'ScreenX 270°', value: 'SCREEN_X' },
            ]}
          />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            name="totalRows"
            label={<span style={{ color: '#FFFFFF' }}>Số Hàng Ghế (Rows)</span>}
            rules={[{ required: true, message: 'Nhập số hàng' }]}
          >
            <InputNumber min={2} max={26} style={{ width: '100%' }} placeholder="10" />
          </Form.Item>

          <Form.Item
            name="totalColumns"
            label={<span style={{ color: '#FFFFFF' }}>Số Ghế Mỗi Hàng (Columns)</span>}
            rules={[{ required: true, message: 'Nhập số cột' }]}
          >
            <InputNumber min={4} max={30} style={{ width: '100%' }} placeholder="14" />
          </Form.Item>
        </div>

        <div
          style={{
            background: 'rgba(255, 185, 85, 0.08)',
            border: '1px solid rgba(255, 185, 85, 0.2)',
            borderRadius: 8,
            padding: '12px 16px',
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 13, color: '#A0A6B8' }}>Ước tính công suất phòng chiếu:</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#FFB955' }}>
            {calculatedSeats} ghế ngồi
          </span>
        </div>
      </Form>
    </AdminBaseModal>
  );
};

export default CreateRoomModal;
