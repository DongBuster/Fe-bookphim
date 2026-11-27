import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Select, DatePicker, Popconfirm, Tag, message, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Plus, Trash2, Calendar, Film, RotateCcw } from 'lucide-react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { AdminPageHeader } from '@features/admin/components/AdminPageHeader';
import { adminPrimaryButtonStyle } from '@features/admin/styles/adminUi';
import { ShowtimeFormModal } from './components/ShowtimeFormModal';
import { getAdminShowtimesApi, deleteAdminShowtimeApi } from '@features/admin/api/admin-showtimes.api';
import { getAdminTheatersApi } from '@features/admin/api/admin-theaters.api';
import type { ShowtimeAdminDto, TheaterWithRoomsDto, RoomDto } from '@features/admin/types/admin.types';

export const AdminShowtimesPage: FC = () => {
  const queryClient = useQueryClient();

  // Filters
  const [selectedTheaterId, setSelectedTheaterId] = useState<string | undefined>(undefined);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch Theaters for filter
  const { data: theatersData = [] } = useQuery<TheaterWithRoomsDto[]>({
    queryKey: ['admin', 'theaters', 'filter-list'],
    queryFn: getAdminTheatersApi,
  });

  // Available rooms based on selected theater
  const availableRooms: RoomDto[] = useMemo(() => {
    if (!selectedTheaterId) return [];
    const theater = theatersData.find((t) => t.theaterId === selectedTheaterId);
    return theater?.rooms || [];
  }, [theatersData, selectedTheaterId]);

  // Fetch Showtimes
  const dateParam = selectedDate ? selectedDate.format('YYYY-MM-DD') : undefined;

  const {
    data: showtimesResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'showtimes', 'list', selectedTheaterId, selectedRoomId, dateParam, page, pageSize],
    queryFn: () =>
      getAdminShowtimesApi({
        theaterId: selectedTheaterId,
        roomId: selectedRoomId,
        date: dateParam,
        page,
        pageSize,
      }),
  });

  const showtimes: ShowtimeAdminDto[] = showtimesResponse?.data || [];
  const totalItems = showtimesResponse?.metaData?.total || showtimes.length;

  // Delete Showtime Mutation
  const deleteMutation = useMutation({
    mutationFn: (showtimeId: string) => deleteAdminShowtimeApi(showtimeId),
    onSuccess: () => {
      message.success('Đã hủy suất chiếu thành công!');
      queryClient.invalidateQueries({ queryKey: ['admin', 'showtimes'] });
    },
    onError: (err: unknown) => {
      if (err && typeof err === 'object' && 'response' in err) {
        const errorResponse = err as { response?: { data?: { message?: string } } };
        message.error(errorResponse.response?.data?.message || 'Không thể xóa suất chiếu');
      } else {
        message.error('Có lỗi xảy ra khi xóa suất chiếu');
      }
    },
  });

  const columns: ColumnsType<ShowtimeAdminDto> = [
    {
      title: 'Phim',
      dataIndex: 'movieTitle',
      key: 'movieTitle',
      render: (title: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Film size={16} color="#FFB955" />
          <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{title}</span>
        </div>
      ),
    },
    {
      title: 'Cụm Rạp & Phòng',
      key: 'theaterAndRoom',
      render: (_, record) => (
        <div>
          <div style={{ color: '#E2E8F0', fontWeight: 500 }}>{record.theaterName}</div>
          <div style={{ color: '#A0A6B8', fontSize: 12 }}>{record.roomName}</div>
        </div>
      ),
    },
    {
      title: 'Khung Giờ Chiếu',
      key: 'timeSlot',
      render: (_, record) => {
        const start = dayjs(record.startTime).format('HH:mm');
        const end = dayjs(record.endTime).format('HH:mm');
        const date = dayjs(record.startTime).format('DD/MM/YYYY');
        return (
          <div>
            <div style={{ color: '#FFB955', fontWeight: 600 }}>
              {start} - {end}
            </div>
            <div style={{ color: '#A0A6B8', fontSize: 12 }}>{date}</div>
          </div>
        );
      },
    },
    {
      title: 'Định Dạng',
      dataIndex: 'format',
      key: 'format',
      render: (format: string) => <Tag color="gold">{format}</Tag>,
    },
    {
      title: 'Giá Vé (Thường / VIP / Đôi)',
      key: 'prices',
      render: (_, record) => (
        <div style={{ fontSize: 12, color: '#CBD5E1' }}>
          <div>Thường: {(record.basePrice ?? 0).toLocaleString('vi-VN')} đ</div>
          <div>VIP: {(record.vipPrice ?? 0).toLocaleString('vi-VN')} đ</div>
          <div>Đôi: {(record.sweetboxPrice ?? 0).toLocaleString('vi-VN')} đ</div>
        </div>
      ),
    },
    {
      title: 'Vé Đã Bán / Tỷ Lệ Lấp Đầy',
      key: 'occupancy',
      render: (_, record) => {
        const rate = (record.occupancyRate ?? 0) * 100;
        const color = rate > 75 ? '#52C41A' : rate > 40 ? '#FFB955' : '#A0A6B8';
        return (
          <div>
            <div style={{ color: '#FFF', fontWeight: 600 }}>
              {record.ticketsSold ?? 0}/{record.totalSeats ?? 0} ghế
            </div>
            <div style={{ color, fontSize: 12, fontWeight: 500 }}>
              Lấp đầy: {rate.toFixed(0)}%
            </div>
          </div>
        );
      },
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      fixed: 'right',
      width: 90,
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title="Hủy suất chiếu"
          description="Bạn có chắc chắn muốn xóa/hủy suất chiếu này không? Hành động không thể hoàn tác."
          onConfirm={() => deleteMutation.mutate(record.showtimeId)}
          okText="Xóa Suất"
          cancelText="Hủy"
          okButtonProps={{ danger: true, loading: deleteMutation.isPending }}
        >
          <Button
            danger
            type="text"
            icon={<Trash2 size={16} />}
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            Hủy
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Quản Lý Lịch Chiếu"
        subtitle="Lập kế hoạch, theo dõi công suất và điều phối các suất chiếu phim phòng ngừa xung đột lịch chiếu"
        action={
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => setIsModalOpen(true)}
            style={{
              background: '#FFB955',
              borderColor: '#FFB955',
              color: '#000000',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Thêm Suất Chiếu
          </Button>
        }
      />

      {/* Filter Toolbar */}
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
          {/* Theater Filter */}
          <div style={{ minWidth: 200, flex: 1 }}>
            <span style={{ fontSize: 12, color: '#CBD5E1', display: 'block', marginBottom: 4 }}>
              Cụm Rạp:
            </span>
            <Select
              placeholder="Tất cả cụm rạp"
              allowClear
              value={selectedTheaterId}
              onChange={(val) => {
                setSelectedTheaterId(val);
                setSelectedRoomId(undefined);
              }}
              style={{ width: '100%' }}
              options={theatersData.map((t) => ({
                value: t.theaterId,
                label: `${t.theaterName} (${t.city})`,
              }))}
            />
          </div>

          {/* Room Filter */}
          <div style={{ minWidth: 180, flex: 1 }}>
            <span style={{ fontSize: 12, color: '#CBD5E1', display: 'block', marginBottom: 4 }}>
              Phòng Chiếu:
            </span>
            <Select
              placeholder={selectedTheaterId ? 'Tất cả phòng chiếu' : 'Chọn rạp trước'}
              allowClear
              disabled={!selectedTheaterId}
              value={selectedRoomId}
              onChange={setSelectedRoomId}
              style={{ width: '100%' }}
              options={availableRooms.map((r) => ({
                value: r.roomId,
                label: `${r.roomName} (${r.screenType})`,
              }))}
            />
          </div>

          {/* Date Filter */}
          <div style={{ minWidth: 160 }}>
            <span style={{ fontSize: 12, color: '#CBD5E1', display: 'block', marginBottom: 4 }}>
              Ngày Chiếu:
            </span>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              format="DD/MM/YYYY"
              allowClear
              style={{ width: '100%' }}
              prefix={<Calendar size={14} color="#CBD5E1" style={{ marginRight: 6 }} />}
            />
          </div>

          {/* Reset button */}
          <div style={{ alignSelf: 'flex-end' }}>
            <Button
              type="primary"
              className="admin-btn-primary"
              icon={<RotateCcw size={15} />}
              onClick={() => {
                setSelectedTheaterId(undefined);
                setSelectedRoomId(undefined);
                setSelectedDate(dayjs());
              }}
              style={adminPrimaryButtonStyle}
            >
              Đặt Lại Bộ Lọc
            </Button>
          </div>
        </div>
      </Card>

      {/* Showtimes Table */}
      <Card
        style={{
          background: '#161922',
          borderColor: '#2E3548',
          borderRadius: 10,
        }}
        styles={{ body: {} }}
      >
        <Table<ShowtimeAdminDto>
          size="small"
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={showtimes}
          rowKey="showtimeId"
          loading={isLoading}
          pagination={{
            current: page,
            pageSize,
            total: totalItems,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
            showTotal: (total) => `Tổng số ${total} suất chiếu`,
          }}
        />
      </Card>

      {/* Create Showtime Modal */}
      <ShowtimeFormModal
        open={isModalOpen}
        defaultDate={selectedDate ? selectedDate.format('YYYY-MM-DD') : undefined}
        defaultTheaterId={selectedTheaterId}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
};

export default AdminShowtimesPage;
