import type { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Breadcrumb, Avatar, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { LogOut, ExternalLink, Shield } from 'lucide-react';
import tokenManager from '@shared/utils/tokenManager';
import { LOCAL_STORAGE_KEYS } from '@shared/constants/storage-key';

export const AdminHeader: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userName = localStorage.getItem('user_name') || 'Quản Trị Viên';
  const userRole =
    localStorage.getItem(LOCAL_STORAGE_KEYS.userRole) ||
    localStorage.getItem('user_role') ||
    'ADMIN';

  const handleLogout = () => {
    tokenManager.clearSession();
    navigate('/login');
  };

  const getBreadcrumbTitle = () => {
    if (location.pathname.startsWith('/admin/movies')) {
      return 'Quản Lý Danh Sách Phim';
    }
    if (location.pathname.startsWith('/admin/showtimes')) {
      return 'Lịch Chiếu & Suất Chiếu';
    }
    if (location.pathname.startsWith('/admin/theaters')) {
      return 'Quản Lý Rạp & Phòng Chiếu';
    }
    if (location.pathname.startsWith('/admin/bookings')) {
      return 'Quản Lý Đơn Vé & Soát Vé';
    }
    if (location.pathname.startsWith('/admin/concessions')) {
      return 'Bắp Nước & Mã Giảm Giá';
    }
    if (location.pathname.startsWith('/admin/users')) {
      return 'Quản Lý Tài Khoản & Phân Quyền';
    }
    if (location.pathname.startsWith('/admin/reports')) {
      return 'Báo Cáo & Đối Soát Doanh Thu';
    }
    if (location.pathname.startsWith('/admin/content')) {
      return 'Quản Lý Nội Dung & Kiểm Duyệt';
    }
    if (location.pathname.startsWith('/admin/settings')) {
      return 'Cấu Hình Hệ Thống & Nhật Ký';
    }
    return 'Tổng Quan Doanh Thu';
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'client-view',
      icon: <ExternalLink size={14} />,
      label: 'Xem Trang Khách Hàng',
      onClick: () => window.open('/', '_blank'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogOut size={14} />,
      label: 'Đăng Xuất',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header
      style={{
        height: 64,
        position: 'sticky',
        top: 0,
        zIndex: 90,
        background: 'rgba(19, 21, 27, 0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid #252A36',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
      }}
    >
      <Breadcrumb
        items={[
          { title: <span style={{ color: '#A0A6B8' }}>PhimBook Console</span> },
          { title: <span style={{ color: '#FFB955', fontWeight: 600 }}>{getBreadcrumbTitle()}</span> },
        ]}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          type="button"
          onClick={() => window.open('/', '_blank')}
          style={{
            background: 'rgba(255, 185, 85, 0.1)',
            border: '1px solid rgba(255, 185, 85, 0.25)',
            color: '#FFB955',
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <ExternalLink size={13} />
          <span>Trang Đặt Vé</span>
        </button>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <Avatar style={{ background: '#FF535A', color: '#FFF', fontWeight: 700 }}>
              {userName.charAt(0).toUpperCase()}
            </Avatar>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#FFF' }}>{userName}</span>
              <span
                style={{
                  fontSize: 10,
                  color: '#FFB955',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Shield size={10} />
                {userRole}
              </span>
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default AdminHeader;
