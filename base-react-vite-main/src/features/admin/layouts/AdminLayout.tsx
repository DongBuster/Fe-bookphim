import type { FC } from 'react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import * as S from './AdminLayout.styles';

export const AdminLayout: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#FFB955',
          colorBgContainer: '#13151B',
          colorBgLayout: '#0B0C0E',
          colorBorder: '#252A36',
          borderRadius: 8,
          colorText: '#FFFFFF',
          colorTextSecondary: '#A0A6B8',
        },
      }}
    >
      <S.LayoutContainer>
        <AdminSidebar collapsed={collapsed} onCollapse={setCollapsed} />
        <S.MainWrapper $collapsed={collapsed}>
          <AdminHeader />
          <S.ContentArea>
            <Outlet />
          </S.ContentArea>
        </S.MainWrapper>
      </S.LayoutContainer>
    </ConfigProvider>
  );
};

export default AdminLayout;
