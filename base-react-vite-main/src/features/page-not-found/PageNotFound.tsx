import { Button } from 'antd';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as S from './PageNotFound.styles';

const PageNotFound: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <S.PageNotFoundContainer>
      <S.StyledResult
        status="404"
        title={t('common:not_found_title', '404 - Không Tìm Thấy Trang')}
        subTitle={t(
          'common:not_found_desc',
          'Trang bạn đang truy cập hiện chưa khả dụng hoặc đang trong quá trình phát triển.',
        )}
        extra={
          <Button
            type="primary"
            onClick={handleNavigateHome}
          >
            {t('common:back_to_home', 'Quay Về Trang Chủ')}
          </Button>
        }
      />
    </S.PageNotFoundContainer>
  );
};

export default PageNotFound;
