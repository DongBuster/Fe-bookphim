import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, Card, Form, InputNumber, Button, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Settings, History, Save } from 'lucide-react';
import dayjs from 'dayjs';
import { AdminPageHeader } from '@features/admin/components/AdminPageHeader';
import { adminPrimaryButtonStyle } from '@features/admin/styles/adminUi';
import {
  getAdminAuditLogsApi,
  getAdminSettingsApi,
  updateAdminSettingsApi,
} from '@features/admin/api/admin-settings.api';
import type { AuditLogDto, SystemSettingsDto } from '@features/admin/types/admin.types';

export const AdminSettingsPage: FC = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm<SystemSettingsDto>();
  const [logPage, setLogPage] = useState(1);
  const [logPageSize, setLogPageSize] = useState(15);

  const { data: settings, isLoading: isSettingsLoading } = useQuery<SystemSettingsDto>({
    queryKey: ['admin', 'settings'],
    queryFn: getAdminSettingsApi,
  });

  const { data: logsResponse, isLoading: isLogsLoading } = useQuery({
    queryKey: ['admin', 'audit-logs', logPage, logPageSize],
    queryFn: () => getAdminAuditLogsApi({ page: logPage, pageSize: logPageSize }),
  });

  useEffect(() => {
    if (settings) {
      form.setFieldsValue(settings);
    }
  }, [settings, form]);

  const saveMutation = useMutation({
    mutationFn: (values: SystemSettingsDto) => updateAdminSettingsApi(values),
    onSuccess: () => {
      message.success('Đã lưu cấu hình hệ thống!');
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
    },
    onError: (err: unknown) => {
      message.error(err instanceof Error ? err.message : 'Không thể lưu cấu hình');
    },
  });

  const logs: AuditLogDto[] = logsResponse?.data ?? [];
  const totalLogs = logsResponse?.metaData?.total ?? logs.length;

  const logColumns: ColumnsType<AuditLogDto> = [
    {
      title: 'Thời Gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (val: string) => (
        <span style={{ color: '#CBD5E1', fontSize: 12 }}>
          {val ? dayjs(val).format('HH:mm:ss DD/MM/YYYY') : '-'}
        </span>
      ),
    },
    {
      title: 'Người Thực Hiện',
      key: 'actor',
      render: (_, r) => (
        <div>
          <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{r.actorName}</span>{' '}
          <Tag color="gold" style={{ marginLeft: 4 }}>
            {r.actorRole}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Hành Động',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => <Tag color="blue">{action}</Tag>,
    },
    {
      title: 'Đối Tượng',
      dataIndex: 'resourceType',
      key: 'resourceType',
      render: (res: string, r) => (
        <span style={{ color: '#CBD5E1' }}>
          {res} {r.targetId ? `(${r.targetId})` : ''}
        </span>
      ),
    },
    {
      title: 'Chi Tiết',
      dataIndex: 'summary',
      key: 'summary',
      render: (text: string) => <span style={{ color: '#E2E8F0' }}>{text}</span>,
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Cấu Hình Hệ Thống & Nhật Ký Thao Tác"
        subtitle="Thiết lập tham số vận hành phòng vé và theo dõi lịch sử tác động của quản trị viên"
      />

      <Card
        style={{ background: '#161922', borderColor: '#2E3548', borderRadius: 10 }}
        styles={{ body: {} }}
      >
        <Tabs
          items={[
            {
              key: 'settings',
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Settings size={16} /> Tham Số Hệ Thống
                </span>
              ),
              children: (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={(vals) => saveMutation.mutate(vals)}
                  style={{ maxWidth: 680 }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Form.Item
                      name="seatHoldMinutes"
                      label="Thời Gian Giữ Ghế (Phút)"
                      rules={[{ required: true, message: 'Nhập số phút giữ ghế' }]}
                    >
                      <InputNumber min={1} max={60} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                      name="refundDeadlineHours"
                      label="Hạn Hủy/Hoàn Vé Trước Giờ Chiếu (Giờ)"
                      rules={[{ required: true, message: 'Nhập số giờ tối thiểu' }]}
                    >
                      <InputNumber min={0} max={72} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                      name="weekendSurchargePercent"
                      label="Phụ Thu Cuối Tuần (%)"
                      rules={[{ required: true, message: 'Nhập % phụ thu' }]}
                    >
                      <InputNumber min={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                      name="imaxSurchargePercent"
                      label="Phụ Thu Định Dạng IMAX (%)"
                      rules={[{ required: true, message: 'Nhập % phụ thu IMAX' }]}
                    >
                      <InputNumber min={0} max={200} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                      name="bookingFeePercent"
                      label="Phí Tiện Ích Đặt Vé Online (%)"
                      rules={[{ required: true, message: 'Nhập % phí dịch vụ' }]}
                    >
                      <InputNumber min={0} max={50} style={{ width: '100%' }} />
                    </Form.Item>
                  </div>

                  <Button
                    type="primary"
                    htmlType="submit"
                    className="admin-btn-primary"
                    icon={<Save size={16} />}
                    loading={saveMutation.isPending || isSettingsLoading}
                    style={adminPrimaryButtonStyle}
                  >
                    Lưu Cấu Hình
                  </Button>
                </Form>
              ),
            },
            {
              key: 'audit-logs',
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <History size={16} /> Nhật Ký Thao Tác ({totalLogs})
                </span>
              ),
              children: (
                <Table<AuditLogDto>
                  size="small"
                  scroll={{ x: 'max-content' }}
                  columns={logColumns}
                  dataSource={logs}
                  rowKey="id"
                  loading={isLogsLoading}
                  pagination={{
                    current: logPage,
                    pageSize: logPageSize,
                    total: totalLogs,
                    onChange: (p, ps) => {
                      setLogPage(p);
                      setLogPageSize(ps);
                    },
                  }}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default AdminSettingsPage;
