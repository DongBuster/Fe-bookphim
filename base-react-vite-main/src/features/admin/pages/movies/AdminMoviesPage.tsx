import type { FC } from 'react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Avatar,
  Tag,
  Popconfirm,
  message,
  Dropdown,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Plus, Search, Edit2, Trash2, Film, ChevronDown, RotateCw } from 'lucide-react';
import { AdminPageHeader } from '@features/admin/components/AdminPageHeader';
import { StatusBadge } from '@features/admin/components/StatusBadge';
import { adminPrimaryButtonStyle } from '@features/admin/styles/adminUi';
import { MovieFormDrawer } from './components/MovieFormDrawer';
import {
  getAdminMoviesApi,
  deleteAdminMovieApi,
  patchMovieStatusApi,
} from '@features/admin/api/admin-movies.api';
import type { MovieAdminDto } from '@features/admin/types/admin.types';

export const AdminMoviesPage: FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieAdminDto | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'movies', { page, pageSize, search: searchTerm, status: statusFilter }],
    queryFn: () =>
      getAdminMoviesApi({
        page,
        pageSize,
        search: searchTerm ? searchTerm.trim() : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminMovieApi(id),
    onSuccess: () => {
      message.success('Đã xóa phim thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'movies'] });
    },
    onError: (err: unknown) => {
      const errorMsg = err instanceof Error ? err.message : 'Không thể xóa phim (có thể đã có suất chiếu)';
      message.error(errorMsg);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => patchMovieStatusApi(id, status),
    onSuccess: () => {
      message.success('Đã cập nhật trạng thái phim');
      queryClient.invalidateQueries({ queryKey: ['admin', 'movies'] });
    },
    onError: (err: unknown) => {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi khi cập nhật trạng thái';
      message.error(errorMsg);
    },
  });

  const handleOpenCreate = () => {
    setSelectedMovie(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (movie: MovieAdminDto) => {
    setSelectedMovie(movie);
    setDrawerOpen(true);
  };

  const getAgeRatingColor = (rating: string) => {
    switch (rating) {
      case 'P':
        return '#52C41A';
      case 'K':
        return '#1890FF';
      case 'T13':
        return '#FAAD14';
      case 'T16':
        return '#FA8C16';
      case 'T18':
      case 'C':
        return '#FF535A';
      default:
        return '#A0A6B8';
    }
  };

  const columns: ColumnsType<MovieAdminDto> = [
    {
      title: 'Phim',
      key: 'movieInfo',
      width: 280,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            shape="square"
            size={56}
            src={record.posterUrl}
            icon={<Film size={24} />}
            style={{ borderRadius: 6, flexShrink: 0 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, color: '#FFFFFF', fontSize: 14 }}>{record.title}</span>
              <Tag
                style={{
                  margin: 0,
                  fontSize: 10,
                  padding: '0 4px',
                  lineHeight: '16px',
                  borderColor: getAgeRatingColor(String(record.ageRating)),
                  color: getAgeRatingColor(String(record.ageRating)),
                  background: 'transparent',
                }}
              >
                {record.ageRating}
              </Tag>
            </div>
            {record.originalTitle && (
              <span style={{ fontSize: 12, color: '#A0A6B8', marginTop: 2 }}>{record.originalTitle}</span>
            )}
            <span style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              {record.durationMinutes} phút
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Thể Loại & Định Dạng',
      key: 'genresFormats',
      width: 220,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {record.genres?.slice(0, 3).map((g) => (
              <Tag key={g} style={{ margin: 0, background: '#1A1D26', border: '1px solid #252A36', color: '#A0A6B8' }}>
                {g}
              </Tag>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
            {record.formats?.map((f) => (
              <Tag key={f} color="gold" style={{ margin: 0, fontSize: 11 }}>
                {f}
              </Tag>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Khởi Chiếu',
      dataIndex: 'releaseDate',
      key: 'releaseDate',
      width: 120,
      render: (date: string) => <span style={{ color: '#A0A6B8' }}>{date || '—'}</span>,
    },
    {
      title: 'Trạng Thái',
      key: 'status',
      width: 170,
      render: (_, record) => {
        const statusMenu = {
          items: [
            { key: 'NOW_SHOWING', label: 'Đang Chiếu (NOW_SHOWING)' },
            { key: 'COMING_SOON', label: 'Sắp Chiếu (COMING_SOON)' },
            { key: 'STOPPED', label: 'Ngừng Chiếu (STOPPED)' },
          ],
          onClick: ({ key }: { key: string }) => {
            statusMutation.mutate({ id: record.id, status: key });
          },
        };

        return (
          <Dropdown menu={statusMenu} trigger={['click']}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: 4,
                background: '#1A1D26',
                border: '1px solid #252A36',
              }}
            >
              <StatusBadge status={record.status} />
              <ChevronDown size={12} color="#A0A6B8" />
            </div>
          </Dropdown>
        );
      },
    },
    {
      title: 'Doanh Thu / Vé',
      key: 'performance',
      width: 160,
      render: (_, record) => (
        <div>
          <div style={{ color: '#FFB955', fontWeight: 600 }}>
            {(record.totalRevenue ?? 0).toLocaleString('vi-VN')} đ
          </div>
          <div style={{ fontSize: 11, color: '#A0A6B8' }}>
            {(record.totalTicketsSold ?? 0).toLocaleString('vi-VN')} vé
          </div>
        </div>
      ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<Edit2 size={16} />}
            onClick={() => handleOpenEdit(record)}
            style={{ color: '#FFB955' }}
          />
          <Popconfirm
            title="Xác nhận xóa phim?"
            description={`Bạn có chắc chắn muốn xóa phim "${record.title}"?`}
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<Trash2 size={16} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Quản Lý Danh Sách Phim"
        subtitle="Danh mục phim chiếu rạp, cập nhật trạng thái phát hành và thông số doanh thu từng bộ phim"
        action={
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={handleOpenCreate}
            style={{ background: '#FFB955', color: '#000000', fontWeight: 600, border: 'none' }}
          >
            Thêm Phim Mới
          </Button>
        }
      />

      <div
        style={{
          background: '#161922',
          border: '1px solid #2E3548',
          borderRadius: 10,
          padding: 16,
          marginBottom: 16,
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: 12, flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Tìm theo tên phim hoặc tên gốc..."
            prefix={<Search size={16} color="#CBD5E1" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={() => refetch()}
            allowClear
            style={{ maxWidth: 360 }}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 170 }}
            options={[
              { label: 'Tất cả trạng thái', value: 'ALL' },
              { label: 'Đang Chiếu', value: 'NOW_SHOWING' },
              { label: 'Sắp Chiếu', value: 'COMING_SOON' },
              { label: 'Ngừng Chiếu', value: 'STOPPED' },
            ]}
          />
        </div>

        <Button
          type="primary"
          className="admin-btn-primary"
          icon={<RotateCw size={15} />}
          onClick={() => refetch()}
          style={adminPrimaryButtonStyle}
        >
          Làm Mới
        </Button>
      </div>

      <div
        style={{
          background: '#161922',
          border: '1px solid #2E3548',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        <Table
          size="small"
          scroll={{ x: 'max-content' }}
          dataSource={data?.data ?? []}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: page,
            pageSize,
            total: data?.metaData?.total ?? data?.data?.length ?? 0,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
        />
      </div>

      <MovieFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        movie={selectedMovie}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default AdminMoviesPage;
