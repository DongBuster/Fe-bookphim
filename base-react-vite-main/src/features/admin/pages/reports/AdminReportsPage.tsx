import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Row, Col, Card, DatePicker, Select, Button, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DollarSign, Ticket, Coffee, RotateCcw, Download } from 'lucide-react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { AdminPageHeader } from '@features/admin/components/AdminPageHeader';
import { AdminStatCard } from '@features/admin/components/AdminStatCard';
import { adminPrimaryButtonStyle } from '@features/admin/styles/adminUi';
import { getAdminTheatersApi } from '@features/admin/api/admin-theaters.api';
import {
  exportAdminRevenueCsvApi,
  getAdminPaymentMethodReportApi,
  getAdminRevenueReportApi,
} from '@features/admin/api/admin-reports.api';
import type {
  PaymentMethodReportDto,
  RevenueReportDto,
  TheaterWithRoomsDto,
} from '@features/admin/types/admin.types';

const { RangePicker } = DatePicker;

export const AdminReportsPage: FC = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);
  const [theaterId, setTheaterId] = useState<string | undefined>(undefined);
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');
  const [exporting, setExporting] = useState(false);

  const fromDate = dateRange[0].format('YYYY-MM-DD');
  const toDate = dateRange[1].format('YYYY-MM-DD');

  const { data: theaters = [] } = useQuery<TheaterWithRoomsDto[]>({
    queryKey: ['admin', 'theaters', 'reports-filter'],
    queryFn: getAdminTheatersApi,
  });

  const { data: report, isLoading: isReportLoading } = useQuery<RevenueReportDto>({
    queryKey: ['admin', 'reports', 'revenue', fromDate, toDate, theaterId, groupBy],
    queryFn: () => getAdminRevenueReportApi({ fromDate, toDate, theaterId, groupBy }),
  });

  const { data: paymentMethods = [], isLoading: isPaymentLoading } = useQuery<
    PaymentMethodReportDto[]
  >({
    queryKey: ['admin', 'reports', 'payment-methods', fromDate, toDate, theaterId],
    queryFn: () => getAdminPaymentMethodReportApi({ fromDate, toDate, theaterId }),
  });

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      const blob = await exportAdminRevenueCsvApi({ fromDate, toDate, theaterId, groupBy });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `phimbook-revenue-${fromDate}-to-${toDate}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      message.success('Xuất báo cáo CSV thành công!');
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : 'Không thể xuất file báo cáo');
    } finally {
      setExporting(false);
    }
  };

  const revenueColumns: ColumnsType<RevenueReportDto['items'][number]> = [
    {
      title: 'Kỳ Thống Kê',
      dataIndex: 'period',
      key: 'period',
      render: (val: string) => <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{val}</span>,
    },
    {
      title: 'Số Vé Bán',
      dataIndex: 'ticketsSold',
      key: 'ticketsSold',
      render: (val: number) => `${(val ?? 0).toLocaleString('vi-VN')} vé`,
    },
    {
      title: 'Doanh Thu Vé',
      dataIndex: 'ticketRevenue',
      key: 'ticketRevenue',
      render: (val: number) => `${(val ?? 0).toLocaleString('vi-VN')} đ`,
    },
    {
      title: 'Doanh Thu F&B',
      dataIndex: 'concessionRevenue',
      key: 'concessionRevenue',
      render: (val: number) => `${(val ?? 0).toLocaleString('vi-VN')} đ`,
    },
    {
      title: 'Hoàn Tiền',
      dataIndex: 'refundedAmount',
      key: 'refundedAmount',
      render: (val: number) => (
        <span style={{ color: '#FF6B71' }}>{(val ?? 0).toLocaleString('vi-VN')} đ</span>
      ),
    },
    {
      title: 'Thực Thu',
      dataIndex: 'netRevenue',
      key: 'netRevenue',
      render: (val: number) => (
        <span style={{ color: '#FFB955', fontWeight: 700 }}>
          {(val ?? 0).toLocaleString('vi-VN')} đ
        </span>
      ),
    },
  ];

  const paymentColumns: ColumnsType<PaymentMethodReportDto> = [
    {
      title: 'Phương Thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (val: string) => <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{val}</span>,
    },
    {
      title: 'Số Giao Dịch',
      dataIndex: 'transactionCount',
      key: 'transactionCount',
      render: (val: number) => `${(val ?? 0).toLocaleString('vi-VN')}`,
    },
    {
      title: 'Tổng Thu',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (val: number) => (
        <span style={{ color: '#FFB955', fontWeight: 600 }}>
          {(val ?? 0).toLocaleString('vi-VN')} đ
        </span>
      ),
    },
    {
      title: 'Đã Hoàn',
      dataIndex: 'refundedAmount',
      key: 'refundedAmount',
      render: (val: number) => (
        <span style={{ color: '#FF6B71' }}>{(val ?? 0).toLocaleString('vi-VN')} đ</span>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Báo Cáo & Đối Soát Doanh Thu"
        subtitle="Tổng hợp doanh thu vé, F&B, hoàn tiền theo cụm rạp và đối soát cổng thanh toán"
        action={
          <Button
            type="primary"
            className="admin-btn-primary"
            icon={<Download size={16} />}
            loading={exporting}
            onClick={handleExportCsv}
            style={adminPrimaryButtonStyle}
          >
            Xuất CSV
          </Button>
        }
      />

      <Card
        style={{
          background: '#161922',
          borderColor: '#2E3548',
          borderRadius: 10,
          marginBottom: 20,
        }}
        styles={{ body: {} }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <div style={{ minWidth: 260 }}>
            <span style={{ fontSize: 12, color: '#CBD5E1', display: 'block', marginBottom: 4 }}>
              Khoảng Thời Gian:
            </span>
            <RangePicker
              value={dateRange}
              onChange={(vals) => {
                if (vals && vals[0] && vals[1]) {
                  setDateRange([vals[0], vals[1]]);
                }
              }}
              format="DD/MM/YYYY"
              allowClear={false}
            />
          </div>

          <div style={{ minWidth: 220, flex: 1 }}>
            <span style={{ fontSize: 12, color: '#CBD5E1', display: 'block', marginBottom: 4 }}>
              Cụm Rạp:
            </span>
            <Select
              allowClear
              placeholder="Tất cả cụm rạp"
              value={theaterId}
              onChange={setTheaterId}
              style={{ width: '100%' }}
              options={theaters.map((t) => ({
                value: t.theaterId,
                label: `${t.theaterName} (${t.city})`,
              }))}
            />
          </div>

          <div style={{ minWidth: 160 }}>
            <span style={{ fontSize: 12, color: '#CBD5E1', display: 'block', marginBottom: 4 }}>
              Nhóm Theo:
            </span>
            <Select
              value={groupBy}
              onChange={setGroupBy}
              style={{ width: '100%' }}
              options={[
                { value: 'day', label: 'Theo Ngày' },
                { value: 'week', label: 'Theo Tuần' },
                { value: 'month', label: 'Theo Tháng' },
              ]}
            />
          </div>

          <div style={{ alignSelf: 'flex-end' }}>
            <Button
              type="primary"
              className="admin-btn-primary"
              icon={<RotateCcw size={15} />}
              onClick={() => {
                setDateRange([dayjs().subtract(7, 'day'), dayjs()]);
                setTheaterId(undefined);
                setGroupBy('day');
              }}
              style={adminPrimaryButtonStyle}
            >
              Đặt Lại
            </Button>
          </div>
        </div>
      </Card>

      <Row gutter={[16, 16]} align="stretch" style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <AdminStatCard
            title="Tổng Thực Thu"
            value={
              isReportLoading ? '...' : `${(report?.netRevenue ?? 0).toLocaleString('vi-VN')} đ`
            }
            icon={<DollarSign size={20} />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <AdminStatCard
            title="Doanh Thu Vé"
            value={
              isReportLoading ? '...' : `${(report?.ticketRevenue ?? 0).toLocaleString('vi-VN')} đ`
            }
            icon={<Ticket size={20} />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <AdminStatCard
            title="Doanh Thu F&B"
            value={
              isReportLoading
                ? '...'
                : `${(report?.concessionRevenue ?? 0).toLocaleString('vi-VN')} đ`
            }
            icon={<Coffee size={20} />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <AdminStatCard
            title="Tổng Tiền Hoàn"
            value={
              isReportLoading
                ? '...'
                : `${(report?.refundedAmount ?? 0).toLocaleString('vi-VN')} đ`
            }
            icon={<RotateCcw size={20} />}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={15}>
          <Card
            title={<span style={{ color: '#FFFFFF', fontWeight: 700 }}>Chi Tiết Doanh Thu</span>}
            style={{ background: '#161922', borderColor: '#2E3548', borderRadius: 10 }}
            styles={{ body: {} }}
          >
            <Table
              size="small"
              scroll={{ x: 'max-content' }}
              columns={revenueColumns}
              dataSource={report?.items ?? []}
              rowKey="period"
              loading={isReportLoading}
              pagination={false}
            />
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card
            title={
              <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Theo Cổng Thanh Toán</span>
            }
            style={{ background: '#161922', borderColor: '#2E3548', borderRadius: 10 }}
            styles={{ body: {} }}
          >
            <Table
              size="small"
              scroll={{ x: 'max-content' }}
              columns={paymentColumns}
              dataSource={paymentMethods}
              rowKey="paymentMethod"
              loading={isPaymentLoading}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminReportsPage;
