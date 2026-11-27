import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { Form, Select, DatePicker, InputNumber, Alert, Space, Typography, message, Spin } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { getAdminMoviesApi } from '@features/admin/api/admin-movies.api';
import { getAdminTheatersApi } from '@features/admin/api/admin-theaters.api';
import { getAdminShowtimesApi, createAdminShowtimeApi } from '@features/admin/api/admin-showtimes.api';
import type { CreateShowtimeDto, ShowtimeAdminDto, MovieAdminDto, TheaterWithRoomsDto, RoomDto } from '@features/admin/types/admin.types';
import { AdminBaseModal } from '@features/admin/components/AdminBaseModal';

const { Text } = Typography;

interface ShowtimeFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultDate?: string;
  defaultTheaterId?: string;
}

interface ShowtimeFormFieldValues {
  movieId: string;
  theaterId: string;
  roomId: string;
  startTime: Dayjs;
  format: string;
  basePrice: number;
  vipPrice: number;
  sweetboxPrice: number;
}

export const ShowtimeFormModal: FC<ShowtimeFormModalProps> = ({
  open,
  onClose,
  onSuccess,
  defaultDate,
  defaultTheaterId,
}) => {
  const [form] = Form.useForm<ShowtimeFormFieldValues>();
  const [submitting, setSubmitting] = useState(false);

  // Watch form values for dynamic calculations and conflict check
  const selectedMovieId = Form.useWatch('movieId', form);
  const selectedTheaterId = Form.useWatch('theaterId', form);
  const selectedRoomId = Form.useWatch('roomId', form);
  const selectedStartTime = Form.useWatch('startTime', form);

  // Fetch movies
  const { data: moviesData, isLoading: isMoviesLoading } = useQuery({
    queryKey: ['admin', 'movies', 'active-for-showtimes'],
    queryFn: () => getAdminMoviesApi({ pageSize: 100 }),
    enabled: open,
  });

  // Fetch theaters and rooms
  const { data: theatersData = [], isLoading: isTheatersLoading } = useQuery<TheaterWithRoomsDto[]>({
    queryKey: ['admin', 'theaters', 'all'],
    queryFn: getAdminTheatersApi,
    enabled: open,
  });

  const movies: MovieAdminDto[] = useMemo(() => moviesData?.data || [], [moviesData]);
  const selectedMovie = useMemo(
    () => movies.find((m) => m.id === selectedMovieId),
    [movies, selectedMovieId],
  );

  // Available rooms for selected theater
  const availableRooms: RoomDto[] = useMemo(() => {
    if (!selectedTheaterId) return [];
    const theater = theatersData.find((t) => t.theaterId === selectedTheaterId);
    return theater?.rooms || [];
  }, [theatersData, selectedTheaterId]);

  // Calculated end time: duration + 15 min buffer
  const calculatedEndTime = useMemo(() => {
    if (!selectedStartTime || !selectedMovie) return null;
    const duration = selectedMovie.durationMinutes || 120;
    return selectedStartTime.add(duration + 15, 'minute');
  }, [selectedStartTime, selectedMovie]);

  // Query existing showtimes for conflict detection on the selected room & date
  const selectedDateStr = selectedStartTime ? selectedStartTime.format('YYYY-MM-DD') : undefined;

  const { data: roomShowtimesData, isLoading: isCheckingConflict } = useQuery({
    queryKey: ['admin', 'showtimes', 'conflict-check', selectedRoomId, selectedDateStr],
    queryFn: () => getAdminShowtimesApi({ roomId: selectedRoomId, date: selectedDateStr }),
    enabled: Boolean(open && selectedRoomId && selectedDateStr),
  });

  // Conflict validation calculation
  const conflictShowtime = useMemo<ShowtimeAdminDto | null>(() => {
    if (!selectedStartTime || !calculatedEndTime || !roomShowtimesData?.data?.length) {
      return null;
    }

    const newStartMs = selectedStartTime.valueOf();
    const newEndMs = calculatedEndTime.valueOf();

    for (const item of roomShowtimesData.data) {
      const existingStartMs = dayjs(item.startTime).valueOf();
      const existingEndMs = dayjs(item.endTime).valueOf();

      // Check overlap: newStart < existingEnd AND newEnd > existingStart
      if (newStartMs < existingEndMs && newEndMs > existingStartMs) {
        return item;
      }
    }
    return null;
  }, [selectedStartTime, calculatedEndTime, roomShowtimesData]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (conflictShowtime) {
        message.error('Phòng chiếu đã có suất chiếu bị trùng giờ! Vui lòng chọn khung giờ khác.');
        return;
      }

      setSubmitting(true);
      const payload: CreateShowtimeDto = {
        movieId: values.movieId,
        roomId: values.roomId,
        startTime: values.startTime.toISOString(),
        format: values.format,
        basePrice: values.basePrice,
        vipPrice: values.vipPrice,
        sweetboxPrice: values.sweetboxPrice,
      };

      await createAdminShowtimeApi(payload);
      message.success('Tạo suất chiếu mới thành công!');
      form.resetFields();
      onSuccess();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const errorResponse = err as { response?: { data?: { message?: string } } };
        message.error(errorResponse.response?.data?.message || 'Có lỗi xảy ra khi tạo suất chiếu');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <AdminBaseModal
      title="Thêm Suất Chiếu Mới"
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText="Tạo Suất Chiếu"
      cancelText="Hủy"
      okButtonProps={{
        disabled: Boolean(conflictShowtime) || isCheckingConflict,
      }}
      confirmLoading={submitting}
      width={680}
    >
      <Spin spinning={isMoviesLoading || isTheatersLoading}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            theaterId: defaultTheaterId,
            format: '2D',
            basePrice: 85000,
            vipPrice: 105000,
            sweetboxPrice: 155000,
            startTime: defaultDate ? dayjs(defaultDate).hour(9).minute(0).second(0) : undefined,
          }}
          style={{ marginTop: 16 }}
        >
          {/* Movie Selection */}
          <Form.Item
            name="movieId"
            label={<span style={{ color: '#E2E8F0' }}>Chọn Phim</span>}
            rules={[{ required: true, message: 'Vui lòng chọn phim' }]}
          >
            <Select
              placeholder="Chọn phim đang chiếu hoặc sắp chiếu"
              showSearch
              filterOption={(input, option) =>
                ((option?.label ?? '') as string).toLowerCase().includes(input.toLowerCase())
              }
              options={movies.map((m) => ({
                value: m.id,
                label: `${m.title} (${m.durationMinutes} phút - ${m.ageRating})`,
              }))}
            />
          </Form.Item>

          {/* Theater and Room Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="theaterId"
              label={<span style={{ color: '#E2E8F0' }}>Cụm Rạp</span>}
              rules={[{ required: true, message: 'Vui lòng chọn cụm rạp' }]}
            >
              <Select
                placeholder="Chọn cụm rạp"
                options={theatersData.map((t) => ({
                  value: t.theaterId,
                  label: `${t.theaterName} (${t.city})`,
                }))}
                onChange={() => form.setFieldValue('roomId', undefined)}
              />
            </Form.Item>

            <Form.Item
              name="roomId"
              label={<span style={{ color: '#E2E8F0' }}>Phòng Chiếu</span>}
              rules={[{ required: true, message: 'Vui lòng chọn phòng chiếu' }]}
            >
              <Select
                placeholder={selectedTheaterId ? 'Chọn phòng' : 'Chọn rạp trước'}
                disabled={!selectedTheaterId}
                options={availableRooms.map((r) => ({
                  value: r.roomId,
                  label: `${r.roomName} (${r.screenType} - ${r.totalSeats} ghế)`,
                }))}
              />
            </Form.Item>
          </div>

          {/* Start Time & Format */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16 }}>
            <Form.Item
              name="startTime"
              label={<span style={{ color: '#E2E8F0' }}>Thời Gian Bắt Đầu</span>}
              rules={[{ required: true, message: 'Vui lòng chọn ngày và giờ chiếu' }]}
            >
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                style={{ width: '100%' }}
                placeholder="Chọn ngày và giờ chiếu"
              />
            </Form.Item>

            <Form.Item
              name="format"
              label={<span style={{ color: '#E2E8F0' }}>Định Dạng Suất Chiếu</span>}
              rules={[{ required: true, message: 'Vui lòng chọn định dạng' }]}
            >
              <Select
                options={[
                  { value: '2D', label: '2D Digital' },
                  { value: '3D', label: '3D Digital' },
                  { value: 'IMAX', label: 'IMAX Laser' },
                  { value: '4DX', label: '4DX Motion' },
                  { value: 'SCREENX', label: 'ScreenX 270°' },
                ]}
              />
            </Form.Item>
          </div>

          {/* Calculated Runtime & Cleaning Buffer Banner */}
          {selectedMovie && selectedStartTime && calculatedEndTime && (
            <div
              style={{
                background: '#1A1E29',
                border: '1px solid #2B3345',
                borderRadius: 8,
                padding: '12px 16px',
                marginBottom: 16,
              }}
            >
              <Space direction="vertical" size={2}>
                <Text style={{ color: '#FFB955', fontSize: 13, fontWeight: 600 }}>
                  Thời Lượng & Giờ Kết Thúc Dự Kiến:
                </Text>
                <Text style={{ color: '#CBD5E1', fontSize: 13 }}>
                  • Thời lượng phim: <b>{selectedMovie.durationMinutes} phút</b> + 15 phút dọn phòng chiếu
                </Text>
                <Text style={{ color: '#52C41A', fontSize: 13 }}>
                  • Giờ kết thúc: <b>{calculatedEndTime.format('HH:mm - DD/MM/YYYY')}</b>
                </Text>
              </Space>
            </div>
          )}

          {/* Conflict Alert Banner */}
          {isCheckingConflict && (
            <Alert
              type="info"
              showIcon
              message="Đang kiểm tra xung đột lịch chiếu trong phòng..."
              style={{ marginBottom: 16, background: '#1A2333', borderColor: '#2E4765' }}
            />
          )}

          {conflictShowtime && (
            <Alert
              type="error"
              showIcon
              message="Xung Đột Lịch Chiếu Phát Hiện!"
              description={
                <div>
                  Suất chiếu này trùng với phim <b>{conflictShowtime.movieTitle}</b> (
                  {dayjs(conflictShowtime.startTime).format('HH:mm')} -{' '}
                  {dayjs(conflictShowtime.endTime).format('HH:mm')}) tại phòng chiếu đã chọn. Vui
                  lòng chọn một khung giờ khác!
                </div>
              }
              style={{ marginBottom: 16, background: 'rgba(255, 83, 90, 0.1)', borderColor: '#FF535A' }}
            />
          )}

          {/* Ticket Price Configuration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item
              name="basePrice"
              label={<span style={{ color: '#E2E8F0' }}>Ghế Thường (VNĐ)</span>}
              rules={[{ required: true, message: 'Nhập giá' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={10000}
                step={5000}
                formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>

            <Form.Item
              name="vipPrice"
              label={<span style={{ color: '#E2E8F0' }}>Ghế VIP (VNĐ)</span>}
              rules={[{ required: true, message: 'Nhập giá' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={10000}
                step={5000}
                formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>

            <Form.Item
              name="sweetboxPrice"
              label={<span style={{ color: '#E2E8F0' }}>Sweetbox Đôi (VNĐ)</span>}
              rules={[{ required: true, message: 'Nhập giá' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={10000}
                step={5000}
                formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </div>
        </Form>
      </Spin>
    </AdminBaseModal>
  );
};

export default ShowtimeFormModal;
