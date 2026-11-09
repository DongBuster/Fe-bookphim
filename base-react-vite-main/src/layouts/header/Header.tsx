import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import tokenManager from '@shared/utils/tokenManager';
import { LocationPicker } from './components/LocationPicker';
import { LangSwitcher } from './components/LangSwitcher';
import { NotificationDropdownMenu } from './components/NotificationDropdown';
import { ProfileDropdownMenu } from './components/ProfileDropdown';
import { HeaderLogo } from './components/HeaderLogo';
import { HeaderNav } from './components/HeaderNav';
import { HeaderSearch } from './components/HeaderSearch';
import * as S from './Header.styles';

export interface HeaderProps {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

const Header: FC<HeaderProps> = ({
  isSidebarOpen = false,
  onToggleSidebar,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [, setAuthTick] = useState(0);

  // Lucian UX/UI Prompt #212 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#212
  const [isVisible, setIsVisible] = useState(true);
  const [isSolid, setIsSolid] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let acc = 0;
    let rafId = 0;

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const currentY = window.scrollY;
        const delta = currentY - lastY;
        lastY = currentY;

        acc = (delta > 0) === (acc > 0) ? acc + delta : delta;

        setIsSolid(currentY > 20);

        if (currentY < 60) {
          setIsVisible(true);
        } else if (acc > 12) {
          setIsVisible(false);
        } else if (acc < -8) {
          setIsVisible(true);
        }

        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0 && progressBarRef.current) {
          const ratio = Math.min(1, Math.max(0, currentY / docHeight));
          progressBarRef.current.style.setProperty('--scroll-p', ratio.toFixed(4));
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleScrollOrNavigate = (sectionId: string) => {
    if (location.pathname === '/' || location.pathname === '/home') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate(`/#${sectionId}`);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleCloseOthers = () => {};

  const handleLogout = () => {
    tokenManager.removeAccessToken();
    setAuthTick((v) => v + 1);
  };

  return (
    <S.OuterHeader $isVisible={isVisible || isSidebarOpen} $isSolid={isSolid}>
      <S.ScrollProgressBar ref={progressBarRef} $isSolid={isSolid} aria-hidden="true" />
      <S.InnerContainer>
        {/* Left Side: Logo + Navigation */}
        <S.NavLeftGroup>
          <HeaderLogo />
          <HeaderNav onScrollOrNavigate={handleScrollOrNavigate} />
        </S.NavLeftGroup>

        {/* Center: Prominent Search Bar */}
        <S.SearchCenterGroup>
          <HeaderSearch />
        </S.SearchCenterGroup>

        {/* Right Side: Actions */}
        <S.ActionsGroup>
          {/* Language Switcher */}
          <LangSwitcher />

          {/* Location Picker */}
          <LocationPicker />

          {/* Notification Dropdown */}
          <NotificationDropdownMenu
            onCloseOthers={handleCloseOthers}
            onScrollOrNavigate={handleScrollOrNavigate}
          />

          {/* Profile / Login */}
          <ProfileDropdownMenu
            onLogout={handleLogout}
          />

          {/* Sidebar Toggle Button */}
          <S.EdgeMenuTrigger
            type="button"
            $isOpen={isSidebarOpen}
            onClick={onToggleSidebar}
            title={t('header:sidebar_menu_title', 'Menu hệ thống')}
            aria-label={t('header:sidebar_menu_aria', 'Mở menu hệ thống')}
          >
            <MenuIcon size={20} />
          </S.EdgeMenuTrigger>
        </S.ActionsGroup>
      </S.InnerContainer>
    </S.OuterHeader>
  );
};

export default Header;
