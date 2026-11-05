import { useState } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from './header/Header';
import { Footer } from './footer/Footer';
import Sidebar from './sidebar/Sidebar';
import { CineBotWidget } from '@/features/ai-concierge/components/CineBotWidget';
import { isFeatureEnabled } from '@/config/features.config';
import * as S from './MainLayout.styles';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <S.LayoutWrapper>
      <ScrollRestoration />
      {/* 1. Header (Sticky Top, Full-width Glassmorphism với nút menu 3 gạch sát mép màn hình) */}
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* 2. Main Body Content */}
      <S.MainContent>
        <Outlet />
      </S.MainContent>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Full Vertical Sidebar ở mép màn hình */}
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

      {/* 5. CineBot AI Concierge Floating Widget */}
      {isFeatureEnabled('cineBotAi') && <CineBotWidget />}
    </S.LayoutWrapper>
  );
}

