import { DisconnectOutlined, WifiOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useOnlineStatus } from './useOnlineStatus';

const SuccessWifiIcon = styled(WifiOutlined)`
  color: var(--success);
`;

const ErrorDisconnectIcon = styled(DisconnectOutlined)`
  color: var(--error);
`;

export function NetworkDetector() {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();
  const previousOnlineRef = useRef(isOnline);

  useEffect(() => {
    if (previousOnlineRef.current === isOnline) {
      return;
    }

    previousOnlineRef.current = isOnline;

    if (isOnline) {
      notification.destroy('offline-notification');
      notification.success({
        message: t('common:network_online_title', 'Đã kết nối mạng'),
        description: t(
          'common:network_online_desc',
          'Kết nối internet đã được khôi phục.',
        ),
        placement: 'bottomRight',
        duration: 3,
        icon: <SuccessWifiIcon />,
      });
      return;
    }

    notification.error({
      message: t('common:network_offline_title', 'Mất kết nối mạng'),
      description: t(
        'common:network_offline_desc',
        'Bạn đang offline. Vui lòng kiểm tra kết nối internet.',
      ),
      placement: 'bottomRight',
      duration: 0,
      key: 'offline-notification',
      icon: <ErrorDisconnectIcon />,
    });
  }, [isOnline, t]);

  return null;
}

export default NetworkDetector;
