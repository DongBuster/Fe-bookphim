import type { FC } from 'react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, Card, Table, Button, Switch, Avatar, Popconfirm, Space, Rate, Select, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Plus, Image, MessageSquare, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import dayjs from 'dayjs';
import { AdminPageHeader } from '@features/admin/components/AdminPageHeader';
import { StatusBadge } from '@features/admin/components/StatusBadge';
import { adminPrimaryButtonStyle } from '@features/admin/styles/adminUi';
import {
  deleteAdminBannerApi,
  getAdminBannersApi,
  getAdminReviewsApi,
  toggleAdminBannerApi,
  toggleReviewVisibilityApi,
} from '@features/admin/api/admin-content.api';
import type { BannerAdminDto, ReviewAdminDto } from '@features/admin/types/admin.types';
import { BannerFormModal } from './components/BannerFormModal';

export const AdminContentPage: FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'banners' | 'reviews'>('banners');
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerAdminDto | null>(null);

  const [reviewStatus, setReviewStatus] = useState<'ALL' | 'VISIBLE' | 'HIDDEN'>('ALL');
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewPageSize, setReviewPageSize] = useState(10);

  const { data: banners = [], isLoading: isBannersLoading } = useQuery<BannerAdminDto[]>({
    queryKey: ['admin', 'banners'],
    queryFn: getAdminBannersApi,
  });

  const { data: reviewsResponse, isLoading: isReviewsLoading } = useQuery({
    queryKey: ['admin', 'reviews', reviewStatus, reviewPage, reviewPageSize],
    queryFn: () =>
      getAdminReviewsApi({ status: reviewStatus, page: reviewPage, pageSize: reviewPageSize }),
  });

  const reviews: ReviewAdminDto[] = reviewsResponse?.data ?? [];
  const totalReviews = reviewsResponse?.metaData?.total ?? reviews.length;

  const toggleBannerMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleAdminBannerApi(id, isActive),
    onSuccess: () => {
      message.success('Đã cập nhật trạng thái banner');
      queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] });
    },
  });

  const deleteBannerMutation = useMutation({
    mutationFn: (id: string) => deleteAdminBannerApi(id),
    onSuccess: () => {
      message.success('Đã xóa banner');
      queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] });
    },
  });

  const toggleReviewMutation = useMutation({
    mutationFn: ({ id, isHidden }: { id: string; isHidden: boolean }) =>
      toggleReviewVisibilityApi(id, isHidden),
    onSuccess: () => {
      message.success('Đã cập nhật trạng thái hiển thị đánh giá');
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    },
  });

  const bannerColumns: ColumnsType<BannerAdminDto> = [
    {
      title: 'Banner',
      key: 'banner',
      render: (_, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar shape="square" size={56} src={r.imageUrl} icon={<Image size={20} />} />
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{r.title}</div>
            {r.linkUrl && <div style={{ color: '#94A3B8', fontSize: 12 }}>{r.linkUrl}</div>}
          </div>
        </div>
      ),
    },
    {
      title: 'Thứ Tự',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: 90,
      align: 'center',
    },
    {
      title: 'Hiển Thị',
      key: 'isActive',
      render: (_, r) => (
        <Switch
          checked={r.isActive}
          onChange={(checked) => toggleBannerMutation.mutate({ id: r.id, isActive: checked })}
        />
      ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      width: 110,
      align: 'center',
      render: (_, r) => (
        <Space size={4}>
          <Button
            type="text"
            icon={<Edit2 size={15} />}
            onClick={() => {
              setEditingBanner(r);
              setBannerModalOpen(true);
            }}
            style={{ color: '#FFB955' }}
          />
          <Popconfirm
            title="Xóa banner này?"
            onConfirm={() => deleteBannerMutation.mutate(r.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<Trash2 size={15} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const reviewColumns: ColumnsType<ReviewAdminDto> = [
    {
      title: 'Phim & Người Đánh Giá',
      key: 'meta',
      render: (_, r) => (
        <div>
          <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{r.movieTitle}</div>
          <div style={{ color: '#CBD5E1', fontSize: 12 }}>
            {r.userName} • {dayjs(r.createdAt).format('HH:mm DD/MM/YYYY')}
          </div>
        </div>
      ),
    },
    {
      title: 'Điểm',
      dataIndex: 'rating',
      key: 'rating',
      render: (val: number) => <Rate disabled value={val} style={{ fontSize: 13 }} />,
    },
    {
      title: 'Nội Dung',
      dataIndex: 'comment',
      key: 'comment',
      render: (text: string) => <span style={{ color: '#CBD5E1' }}>{text}</span>,
    },
    {
      title: 'Trạng Thái',
      key: 'status',
      render: (_, r) => <StatusBadge status={r.isHidden ? 'HIDDEN' : 'VISIBLE'} />,
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, r) => (
        <Button
          type="text"
          icon={r.isHidden ? <Eye size={15} /> : <EyeOff size={15} />}
          onClick={() => toggleReviewMutation.mutate({ id: r.id, isHidden: !r.isHidden })}
          style={{ color: r.isHidden ? '#52C41A' : '#FF6B71' }}
        >
          {r.isHidden ? 'Hiện' : 'Ẩn'}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Quản Lý Nội Dung & Kiểm Duyệt"
        subtitle="Cấu hình banner trang chủ và kiểm duyệt đánh giá phim từ khách hàng"
        action={
          activeTab === 'banners' ? (
            <Button
              type="primary"
              className="admin-btn-primary"
              icon={<Plus size={16} />}
              onClick={() => {
                setEditingBanner(null);
                setBannerModalOpen(true);
              }}
              style={adminPrimaryButtonStyle}
            >
              Thêm Banner
            </Button>
          ) : undefined
        }
      />

      <Card
        style={{ background: '#161922', borderColor: '#2E3548', borderRadius: 10 }}
        bodyStyle={{ padding: 20 }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k as 'banners' | 'reviews')}
          items={[
            {
              key: 'banners',
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Image size={16} /> Banner Trang Chủ ({banners.length})
                </span>
              ),
              children: (
                <Table<BannerAdminDto>
                  size="small"
                  scroll={{ x: 'max-content' }}
                  columns={bannerColumns}
                  dataSource={banners}
                  rowKey="id"
                  loading={isBannersLoading}
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: 'reviews',
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MessageSquare size={16} /> Kiểm Duyệt Đánh Giá ({totalReviews})
                </span>
              ),
              children: (
                <div>
                  <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'flex-end' }}>
                    <Select
                      value={reviewStatus}
                      onChange={(val) => {
                        setReviewStatus(val);
                        setReviewPage(1);
                      }}
                      style={{ width: 180 }}
                      options={[
                        { value: 'ALL', label: 'Tất cả đánh giá' },
                        { value: 'VISIBLE', label: 'Đang hiển thị' },
                        { value: 'HIDDEN', label: 'Đã ẩn' },
                      ]}
                    />
                  </div>
                  <Table<ReviewAdminDto>
                    size="small"
                    scroll={{ x: 'max-content' }}
                    columns={reviewColumns}
                    dataSource={reviews}
                    rowKey="id"
                    loading={isReviewsLoading}
                    pagination={{
                      current: reviewPage,
                      pageSize: reviewPageSize,
                      total: totalReviews,
                      onChange: (p, ps) => {
                        setReviewPage(p);
                        setReviewPageSize(ps);
                      },
                    }}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>

      <BannerFormModal
        open={bannerModalOpen}
        initialData={editingBanner}
        onClose={() => setBannerModalOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] })}
      />
    </div>
  );
};

export default AdminContentPage;
