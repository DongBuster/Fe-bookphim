import type { FC } from 'react';
import { CinemaAuroraBackground } from '@/shared/components/backgrounds/CinemaAuroraBackground';
import { AuthShowcase } from './components/AuthShowcase';
import { LoginForm } from './components/LoginForm';
import * as S from './LoginPage.styles';

export const LoginPage: FC = () => {
  return (
    <S.PageWrapper>
      {/* Living Cinema Noir Aurora Background (Lucian #319 + React Bits) */}
      <CinemaAuroraBackground />

      <S.MainContainer>
        {/* ================= CỘT TRÁI (SHOWCASE ĐẶC QUYỀN ĐIỆN ẢNH) ================= */}
        <AuthShowcase />

        {/* ================= CỘT PHẢI (FORM ĐĂNG NHẬP / ĐĂNG KÝ) ================= */}
        <LoginForm />
      </S.MainContainer>
    </S.PageWrapper>
  );
};

export default LoginPage;
