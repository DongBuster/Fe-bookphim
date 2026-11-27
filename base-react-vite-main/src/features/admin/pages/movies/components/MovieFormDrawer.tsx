import type { FC } from 'react';
import { useEffect } from 'react';
import { Drawer, Form, Input, InputNumber, Select, DatePicker, Button, Space, Row, Col, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import type { MovieAdminDto, CreateMovieRequestDto } from '@features/admin/types/admin.types';
import { createAdminMovieApi, updateAdminMovieApi } from '@features/admin/api/admin-movies.api';
import {
  adminDrawerStyles,
  adminPrimaryButtonStyle,
  adminDangerButtonStyle,
} from '@features/admin/styles/adminUi';

const { TextArea } = Input;

export interface MovieFormDrawerProps {
  open: boolean;
  onClose: () => void;
  movie?: MovieAdminDto | null;
  onSuccess: () => void;
}

export const MovieFormDrawer: FC<MovieFormDrawerProps> = ({
  open,
  onClose,
  movie,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const isEdit = Boolean(movie?.id);

  useEffect(() => {
    if (open) {
      if (movie) {
        form.setFieldsValue({
          title: movie.title,
          originalTitle: movie.originalTitle,
          synopsis: movie.synopsis,
          posterUrl: movie.posterUrl,
          bannerUrl: movie.bannerUrl,
          trailerUrl: movie.trailerUrl,
          director: movie.director,
          cast: movie.cast ?? [],
          genres: movie.genres ?? [],
          formats: movie.formats ?? [],
          durationMinutes: movie.durationMinutes,
          ageRating: movie.ageRating,
          releaseDate: movie.releaseDate ? dayjs(movie.releaseDate) : undefined,
          status: movie.status === 'STOPPED' ? 'COMING_SOON' : movie.status,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          formats: ['2D'],
          status: 'COMING_SOON',
          ageRating: 'P',
          releaseDate: dayjs(),
        });
      }
    }
  }, [open, movie, form]);

  const mutation = useMutation({
    mutationFn: async (payload: CreateMovieRequestDto) => {
      if (isEdit && movie?.id) {
        return updateAdminMovieApi(movie.id, payload);
      }
      return createAdminMovieApi(payload);
    },
    onSuccess: () => {
      message.success(isEdit ? 'Cập nhật phim thành công' : 'Thêm phim mới thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'movies'] });
      onSuccess();
      onClose();
    },
    onError: (err: unknown) => {
      const errorMsg = err instanceof Error ? err.message : 'Đã có lỗi xảy ra';
      message.error(errorMsg);
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: CreateMovieRequestDto = {
        title: values.title.trim(),
        originalTitle: values.originalTitle ? values.originalTitle.trim() : undefined,
        synopsis: values.synopsis.trim(),
        posterUrl: values.posterUrl.trim(),
        bannerUrl: values.bannerUrl ? values.bannerUrl.trim() : undefined,
        trailerUrl: values.trailerUrl ? values.trailerUrl.trim() : undefined,
        director: values.director ? values.director.trim() : undefined,
        cast: Array.isArray(values.cast)
          ? values.cast
          : values.cast
            ? String(values.cast).split(',').map((s) => s.trim())
            : [],
        genres: values.genres ?? [],
        formats: values.formats ?? ['2D'],
        durationMinutes: Number(values.durationMinutes),
        ageRating: values.ageRating,
        releaseDate: values.releaseDate ? dayjs(values.releaseDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        status: values.status ?? 'COMING_SOON',
      };

      await mutation.mutateAsync(payload);
    } catch {
      // Form validation error
    }
  };

  return (
    <Drawer
      className="admin-panel-drawer"
      title={
        <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 16 }}>
          {isEdit ? 'Chỉnh Sửa Thông Tin Phim' : 'Thêm Phim Mới'}
        </span>
      }
      size={620}
      open={open}
      onClose={onClose}
      destroyOnHidden
      styles={adminDrawerStyles}
      extra={
        <Space>
          <Button
            danger
            className="admin-btn-danger"
            onClick={onClose}
            style={adminDangerButtonStyle}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            className="admin-btn-primary"
            onClick={handleSubmit}
            loading={mutation.isPending}
            style={adminPrimaryButtonStyle}
          >
            {isEdit ? 'Lưu Thay Đổi' : 'Thêm Phim'}
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="title"
              label={<span style={{ color: '#FFFFFF' }}>Tên Phim (Tiếng Việt)</span>}
              rules={[{ required: true, message: 'Vui lòng nhập tên phim' }]}
            >
              <Input placeholder="Ví dụ: Mai, Lật Mặt 7, Dune: Part Two" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="originalTitle"
              label={<span style={{ color: '#FFFFFF' }}>Tên Gốc (Tiếng Anh/Bản Ngữ)</span>}
            >
              <Input placeholder="Ví dụ: Dune: Part Two" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="durationMinutes"
              label={<span style={{ color: '#FFFFFF' }}>Thời Lượng (Phút)</span>}
              rules={[{ required: true, message: 'Nhập thời lượng' }]}
            >
              <InputNumber min={1} max={600} style={{ width: '100%' }} placeholder="120" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="ageRating"
              label={<span style={{ color: '#FFFFFF' }}>Phân Loại Độ Tuổi</span>}
              rules={[{ required: true, message: 'Chọn phân loại độ tuổi' }]}
            >
              <Select
                options={[
                  { label: 'P - Mọi lứa tuổi', value: 'P' },
                  { label: 'K - Dưới 13 tuổi có phụ huynh', value: 'K' },
                  { label: 'T13 - Khán giả từ 13 tuổi', value: 'T13' },
                  { label: 'T16 - Khán giả từ 16 tuổi', value: 'T16' },
                  { label: 'T18 - Khán giả từ 18 tuổi', value: 'T18' },
                  { label: 'C - Cấm phổ biến', value: 'C' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="status"
              label={<span style={{ color: '#FFFFFF' }}>Trạng Thái Phát Hành</span>}
              rules={[{ required: true, message: 'Chọn trạng thái' }]}
            >
              <Select
                options={[
                  { label: 'Đang Chiếu (NOW_SHOWING)', value: 'NOW_SHOWING' },
                  { label: 'Sắp Chiếu (COMING_SOON)', value: 'COMING_SOON' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="releaseDate"
              label={<span style={{ color: '#FFFFFF' }}>Ngày Khởi Chiếu</span>}
              rules={[{ required: true, message: 'Chọn ngày khởi chiếu' }]}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="posterUrl"
              label={<span style={{ color: '#FFFFFF' }}>Đường Dẫn Poster (URL)</span>}
              rules={[{ required: true, message: 'Vui lòng nhập URL poster' }]}
            >
              <Input placeholder="https://example.com/poster.jpg" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="bannerUrl"
              label={<span style={{ color: '#FFFFFF' }}>Đường Dẫn Banner Hero (URL)</span>}
            >
              <Input placeholder="https://example.com/banner.jpg" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="trailerUrl"
              label={<span style={{ color: '#FFFFFF' }}>Đường Dẫn YouTube Trailer</span>}
            >
              <Input placeholder="https://www.youtube.com/watch?v=..." />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="director"
              label={<span style={{ color: '#FFFFFF' }}>Đạo Diễn</span>}
            >
              <Input placeholder="Ví dụ: Christopher Nolan" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="formats"
              label={<span style={{ color: '#FFFFFF' }}>Định Dạng Chiếu</span>}
              rules={[{ required: true, message: 'Chọn ít nhất 1 định dạng' }]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn định dạng"
                options={[
                  { label: '2D', value: '2D' },
                  { label: '3D', value: '3D' },
                  { label: 'IMAX 2D', value: 'IMAX 2D' },
                  { label: 'IMAX 3D', value: 'IMAX 3D' },
                  { label: '4DX', value: '4DX' },
                  { label: 'ScreenX', value: 'ScreenX' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="genres"
              label={<span style={{ color: '#FFFFFF' }}>Thể Loại Phim</span>}
              rules={[{ required: true, message: 'Chọn ít nhất một thể loại' }]}
            >
              <Select
                mode="tags"
                placeholder="Nhập hoặc chọn thể loại"
                options={[
                  { label: 'Hành Động', value: 'Hành Động' },
                  { label: 'Phiêu Lưu', value: 'Phiêu Lưu' },
                  { label: 'Khoa Học Viễn Tưởng', value: 'Khoa Học Viễn Tưởng' },
                  { label: 'Kinh Dị', value: 'Kinh Dị' },
                  { label: 'Hài Hước', value: 'Hài Hước' },
                  { label: 'Tâm Lý', value: 'Tâm Lý' },
                  { label: 'Tình Cảm', value: 'Tình Cảm' },
                  { label: 'Hoạt Hình', value: 'Hoạt Hình' },
                  { label: 'Gia Đình', value: 'Gia Đình' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="cast"
              label={<span style={{ color: '#FFFFFF' }}>Diễn Viên Chính</span>}
            >
              <Select mode="tags" placeholder="Nhập tên diễn viên và nhấn Enter" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="synopsis"
              label={<span style={{ color: '#FFFFFF' }}>Tóm Tắt Nội Dung</span>}
              rules={[{ required: true, message: 'Vui lòng nhập tóm tắt nội dung' }]}
            >
              <TextArea rows={4} placeholder="Tóm tắt ngắn gọn nội dung và cốt truyện của bộ phim..." />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default MovieFormDrawer;
