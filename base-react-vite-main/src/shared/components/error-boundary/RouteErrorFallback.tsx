import type { FC } from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const FallbackContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 40px 24px;
  background: var(--bg-primary, #0b0b0c);
  color: #fff;

  .ant-result-title {
    color: #ffffff !important;
    font-weight: 700;
  }

  .ant-result-subtitle {
    color: #ae8786 !important;
  }
`;

export const RouteErrorFallback: FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const { t } = useTranslation();

  console.error('[RouteErrorFallback] Router error caught:', error);

  const routeErr = error as { statusText?: string; message?: string } | null | undefined;
  const errorMessage =
    routeErr?.statusText ||
    routeErr?.message ||
    t('common:error_desc', 'Ứng dụng gặp sự cố không mong muốn. Vui lòng tải lại hoặc về trang chủ.');

  return (
    <FallbackContainer>
      <Result
        status="500"
        title={t('common:error_occurred', 'Đã xảy ra sự cố')}
        subTitle={errorMessage}
        extra={[
          <Button key="retry" type="primary" onClick={() => window.location.reload()}>
            {t('common:retry', 'Tải lại trang')}
          </Button>,
          <Button key="home" onClick={() => navigate('/')}>
            {t('common:back_home', 'Về trang chủ')}
          </Button>,
        ]}
      />
    </FallbackContainer>
  );
};

export default RouteErrorFallback;
