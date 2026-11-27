import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Row, Col, Table, Avatar } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DollarSign, Ticket, Users, Clock } from 'lucide-react';
import { AdminPageHeader } from '@features/admin/components/AdminPageHeader';
import { AdminStatCard } from '@features/admin/components/AdminStatCard';
import { RevenueChart } from './components/RevenueChart';
import {
  getDashboardOverviewApi,
  getRevenueChartApi,
  getTopMoviesApi,
  getUpcomingShowtimesApi,
} from '@features/admin/api/admin-dashboard.api';
import type { TopMovieRevenueDto, ShowtimeAdminDto } from '@features/admin/types/admin.types';

export const AdminDashboardPage: FC = () => {
  const { data: overview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ['admin', 'dashboard', 'overview'],
    queryFn: getDashboardOverviewApi,
  });

  const { data: chartData, isLoading: isChartLoading } = useQuery({
    queryKey: ['admin', 'dashboard', 'chart'],
    queryFn: () => getRevenueChartApi({ groupBy: 'day' }),
  });

  const { data: topMovies = [], isLoading: isTopMoviesLoading } = useQuery({
    queryKey: ['admin', 'dashboard', 'top-movies'],
    queryFn: () => getTopMoviesApi(5),
  });

  const { data: upcomingShowtimes = [], isLoading: isShowtimesLoading } = useQuery({
    queryKey: ['admin', 'dashboard', 'upcoming-showtimes'],
    queryFn: () => getUpcomingShowtimesApi(2),
  });

  const topMovieColumns: ColumnsType<TopMovieRevenueDto> = [
    {
      title: 'Phim',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: TopMovieRevenueDto) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar shape="square" size={40} src={record.posterUrl} />
          <span style={{ fontWeight: 600, color: '#FFF' }}>{text}</span>
        </div>
      ),
    },
    {
      title: 'Số Vé',
      dataIndex: 'ticketsSold',
      key: 'ticketsSold',
      render: (val: number) => `${val?.toLocaleString('vi-VN') ?? 0} vé`,
    },
    {
      title: 'Doanh Thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (val: number) => (
        <span style={{ color: '#FFB955', fontWeight: 600 }}>{(val ?? 0).toLocaleString('vi-VN')} đ</span>
      ),
    },
  ];

  const upcomingColumns: ColumnsType<ShowtimeAdminDto> = [
    { title: 'Phim', dataIndex: 'movieTitle', key: 'movieTitle' },
    { title: 'Phòng', dataIndex: 'roomName', key: 'roomName' },
    { title: 'Giờ Chiếu', dataIndex: 'startTime', key: 'startTime' },
    {
      title: 'Đã Bán',
      key: 'occupancy',
      render: (_, r: ShowtimeAdminDto) =>
        `${r.ticketsSold ?? 0}/${r.totalSeats ?? 0} ghế (${(((r.occupancyRate ?? 0) * 100)).toFixed(0)}%)`,
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Bảng Điều Khiển Tổng Quan"
        subtitle="Thống kê doanh thu, lưu lượng vé và công suất hoạt động phòng vé PhimBook theo thời gian thực"
      />

      <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <AdminStatCard
            title="Doanh Thu Hôm Nay"
            value={isOverviewLoading ? '...' : `${(overview?.todayRevenue ?? 0).toLocaleString('vi-VN')} đ`}
            icon={<DollarSign size={20} />}
            changePercent={overview?.revenueChangePercent}
          />
        </Col>
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <AdminStatCard
            title="Số Vé Bán Hôm Nay"
            value={isOverviewLoading ? '...' : `${(overview?.todayTicketsSold ?? 0).toLocaleString('vi-VN')}`}
            icon={<Ticket size={20} />}
            changePercent={overview?.ticketsChangePercent}
            suffix="vé"
          />
        </Col>
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <AdminStatCard
            title="Tỷ Lệ Lấp Đầy Ghế"
            value={isOverviewLoading ? '...' : `${(((overview?.avgOccupancyRate ?? 0) * 100)).toFixed(1)}%`}
            icon={<Users size={20} />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <AdminStatCard
            title="Suất Chiếu Hôm Nay"
            value={isOverviewLoading ? '...' : `${overview?.activeShowtimesToday ?? 0}`}
            icon={<Clock size={20} />}
            suffix="suất"
          />
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <RevenueChart data={chartData} loading={isChartLoading} />
      </div>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <div
            style={{
              background: '#161922',
              border: '1px solid #2E3548',
              borderRadius: 10,
              padding: 20,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FFF', marginBottom: 16 }}>
              Top 5 Phim Doanh Thu Cao Nhất
            </h3>
            <Table
              dataSource={topMovies}
              columns={topMovieColumns}
              rowKey="movieId"
              pagination={false}
              loading={isTopMoviesLoading}
            />
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <div
            style={{
              background: '#161922',
              border: '1px solid #2E3548',
              borderRadius: 10,
              padding: 20,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FFF', marginBottom: 16 }}>
              Suất Chiếu Trong 2 Giờ Tới
            </h3>
            <Table
              dataSource={upcomingShowtimes}
              columns={upcomingColumns}
              rowKey="showtimeId"
              pagination={false}
              loading={isShowtimesLoading}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboardPage;
