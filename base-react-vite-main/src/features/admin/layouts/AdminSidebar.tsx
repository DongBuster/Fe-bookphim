import type { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  LayoutDashboard,
  Film,
  Calendar,
  Building2,
  Ticket,
  ShoppingBag,
  Users,
  BarChart3,
  FileText,
  Settings,
} from 'lucide-react';
import { ADMIN_PATHS } from '@shared/constants/path';
import { getCurrentAdminRole } from '@features/admin/guards/adminRole.utils';

const { Sider } = Layout;

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const AdminSidebar: FC<AdminSidebarProps> = ({ collapsed, onCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const role = getCurrentAdminRole() || 'ADMIN';

  const allMenuItems = [
    {
      key: ADMIN_PATHS.DASHBOARD,
      icon: <LayoutDashboard size={18} />,
      label: 'Tổng Quan',
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      key: ADMIN_PATHS.MOVIES,
      icon: <Film size={18} />,
      label: 'Quản Lý Phim',
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      key: ADMIN_PATHS.SHOWTIMES,
      icon: <Calendar size={18} />,
      label: 'Suất Chiếu',
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      key: ADMIN_PATHS.THEATERS,
      icon: <Building2 size={18} />,
      label: 'Rạp & Phòng',
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      key: ADMIN_PATHS.BOOKINGS,
      icon: <Ticket size={18} />,
      label: 'Đơn Vé',
      roles: ['ADMIN', 'MANAGER', 'STAFF'],
    },
    {
      key: ADMIN_PATHS.CONCESSIONS,
      icon: <ShoppingBag size={18} />,
      label: 'F&B & Voucher',
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      key: ADMIN_PATHS.USERS,
      icon: <Users size={18} />,
      label: 'Tài Khoản & Quyền',
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      key: ADMIN_PATHS.REPORTS,
      icon: <BarChart3 size={18} />,
      label: 'Báo Cáo',
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      key: ADMIN_PATHS.CONTENT,
      icon: <FileText size={18} />,
      label: 'Nội Dung',
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      key: ADMIN_PATHS.SETTINGS,
      icon: <Settings size={18} />,
      label: 'Hệ Thống & Log',
      roles: ['ADMIN'],
    },
  ];

  const menuItems = allMenuItems
    .filter((item) => item.roles.includes(role))
    .map(({ key, icon, label }) => ({ key, icon, label }));

  const getSelectedKey = () => {
    const current = location.pathname;
    if (current.startsWith(ADMIN_PATHS.MOVIES)) return ADMIN_PATHS.MOVIES;
    if (current.startsWith(ADMIN_PATHS.SHOWTIMES)) return ADMIN_PATHS.SHOWTIMES;
    if (current.startsWith(ADMIN_PATHS.THEATERS)) return ADMIN_PATHS.THEATERS;
    if (current.startsWith(ADMIN_PATHS.BOOKINGS)) return ADMIN_PATHS.BOOKINGS;
    if (current.startsWith(ADMIN_PATHS.CONCESSIONS)) return ADMIN_PATHS.CONCESSIONS;
    if (current.startsWith(ADMIN_PATHS.USERS)) return ADMIN_PATHS.USERS;
    if (current.startsWith(ADMIN_PATHS.REPORTS)) return ADMIN_PATHS.REPORTS;
    if (current.startsWith(ADMIN_PATHS.CONTENT)) return ADMIN_PATHS.CONTENT;
    if (current.startsWith(ADMIN_PATHS.SETTINGS)) return ADMIN_PATHS.SETTINGS;
    return ADMIN_PATHS.DASHBOARD;
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={240}
      collapsedWidth={64}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: '#13151B',
        borderRight: '1px solid #252A36',
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 20px',
          borderBottom: '1px solid #252A36',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #FF535A 0%, #FFB955 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#000',
              fontSize: 16,
            }}
          >
            P
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#FFFFFF', lineHeight: 1.2 }}>
                PhimBook <span style={{ color: '#FFB955' }}>Admin</span>
              </div>
              <div style={{ fontSize: 10, color: '#A0A6B8' }}>Cinema Operations</div>
            </div>
          )}
        </div>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ background: '#13151B', borderRight: 0, marginTop: 12 }}
      />
    </Sider>
  );
};

export default AdminSidebar;
