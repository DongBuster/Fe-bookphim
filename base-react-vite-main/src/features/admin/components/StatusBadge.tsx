import type { FC } from 'react';
import { Tag } from 'antd';

export interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'NOW_SHOWING':
      return <Tag color="gold">Đang Chiếu</Tag>;
    case 'COMING_SOON':
      return <Tag color="blue">Sắp Chiếu</Tag>;
    case 'STOPPED':
      return <Tag color="default">Ngừng Chiếu</Tag>;
    case 'PAID':
    case 'VALID':
      return <Tag color="green">Đã Thanh Toán</Tag>;
    case 'PENDING_PAYMENT':
      return <Tag color="warning">Chờ Thanh Toán</Tag>;
    case 'CANCELLED':
      return <Tag color="error">Đã Hủy</Tag>;
    case 'CHECKED_IN':
      return <Tag color="purple">Đã Soát Vé</Tag>;
    case 'REFUNDED':
      return <Tag color="magenta">Đã Hoàn Tiền</Tag>;
    case 'ACTIVE':
      return <Tag color="green">Hoạt Động</Tag>;
    case 'LOCKED':
      return <Tag color="error">Đã Khóa</Tag>;
    case 'MAINTENANCE':
      return <Tag color="orange">Bảo Trì</Tag>;
    case 'VISIBLE':
      return <Tag color="green">Đang Hiển Thị</Tag>;
    case 'HIDDEN':
      return <Tag color="default">Đã Ẩn</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

export default StatusBadge;
