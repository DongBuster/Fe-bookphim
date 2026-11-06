import type { NotificationArgsProps } from 'antd';
import { ConfigProvider, notification } from 'antd';
import { sanitizeErrorMessage } from '@/shared/utils/error-sanitizer';
import { theme } from './antDesign';

// Ensure global theme is active for static notification calls
ConfigProvider.config({
  theme,
});

type NotificationPlacement = NotificationArgsProps['placement'];

const defaultPlacement: NotificationPlacement = 'topRight';

// Global config for Ant Design notifications
notification.config({
  placement: defaultPlacement,
  duration: 3.5,
  showProgress: true,
  pauseOnHover: true,
});

// Deduplication tracker to prevent identical notifications from stacking within 1.5 seconds
const recentNotifications = new Map<string, number>();
const DEDUPE_WINDOW_MS = 1500;

export const shouldDisplayNotification = (key: string): boolean => {
  const now = Date.now();
  const lastTime = recentNotifications.get(key) || 0;
  if (now - lastTime < DEDUPE_WINDOW_MS) {
    return false;
  }
  recentNotifications.set(key, now);

  // Periodically sweep expired entries
  if (recentNotifications.size > 50) {
    for (const [k, time] of recentNotifications.entries()) {
      if (now - time > 10000) recentNotifications.delete(k);
    }
  }
  return true;
};

const NOTIFICATION_BASE_STYLE = {
  backgroundColor: '#18181B',
  border: '1px solid rgba(255, 255, 255, 0.14)',
  borderRadius: '12px',
  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.85)',
};

const SEMANTIC_STYLES = {
  title: {
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: 700,
    letterSpacing: '-0.2px',
    marginBottom: '4px',
  },
  description: {
    color: '#F1F5F9', // Crisp high-contrast light slate white
    fontSize: '13.5px',
    lineHeight: '1.55',
    fontWeight: 400,
  },
};

const notify = {
  success: (description?: string, title = 'Thành công') => {
    const key = `success_${title}_${description}`;
    if (!shouldDisplayNotification(key)) return;

    notification.success({
      message: title,
      title, // AntD 6 compatibility
      description,
      placement: defaultPlacement,
      duration: 3,
      showProgress: true,
      pauseOnHover: true,
      style: {
        ...NOTIFICATION_BASE_STYLE,
        borderLeft: '4px solid #34C759',
      },
      styles: {
        root: {
          backgroundColor: '#18181B',
          borderRadius: '12px',
        },
        title: SEMANTIC_STYLES.title,
        description: SEMANTIC_STYLES.description,
      },
    });
  },

  error: (rawDescription?: string, title = 'Thông báo lỗi') => {
    const cleanDesc = sanitizeErrorMessage(rawDescription);
    const key = `error_${cleanDesc}`;
    if (!shouldDisplayNotification(key)) return;

    notification.error({
      message: title,
      title, // AntD 6 compatibility
      description: cleanDesc,
      placement: defaultPlacement,
      duration: 4,
      showProgress: true,
      pauseOnHover: true,
      style: {
        ...NOTIFICATION_BASE_STYLE,
        borderLeft: '4px solid #FF535A',
      },
      styles: {
        root: {
          backgroundColor: '#18181B',
          borderRadius: '12px',
        },
        title: SEMANTIC_STYLES.title,
        description: SEMANTIC_STYLES.description,
      },
    });
  },

  warning: (description?: string, title = 'Cảnh báo') => {
    const cleanDesc = sanitizeErrorMessage(description);
    const key = `warning_${cleanDesc}`;
    if (!shouldDisplayNotification(key)) return;

    notification.warning({
      message: title,
      title, // AntD 6 compatibility
      description: cleanDesc,
      placement: defaultPlacement,
      duration: 3.5,
      showProgress: true,
      pauseOnHover: true,
      style: {
        ...NOTIFICATION_BASE_STYLE,
        borderLeft: '4px solid #FFB955',
      },
      styles: {
        root: {
          backgroundColor: '#18181B',
          borderRadius: '12px',
        },
        title: SEMANTIC_STYLES.title,
        description: SEMANTIC_STYLES.description,
      },
    });
  },

  info: (description?: string, title = 'Thông báo') => {
    const key = `info_${title}_${description}`;
    if (!shouldDisplayNotification(key)) return;

    notification.info({
      message: title,
      title, // AntD 6 compatibility
      description,
      placement: defaultPlacement,
      duration: 3,
      showProgress: true,
      pauseOnHover: true,
      style: {
        ...NOTIFICATION_BASE_STYLE,
        borderLeft: '4px solid #178FE2',
      },
      styles: {
        root: {
          backgroundColor: '#18181B',
          borderRadius: '12px',
        },
        title: SEMANTIC_STYLES.title,
        description: SEMANTIC_STYLES.description,
      },
    });
  },
};

/**
 * Unified Toast & Message helpers using the unified Cinema Noir Notification Card
 */
export const toast = {
  success: (msg: string, title = 'Thành công') => notify.success(msg, title),
  error: (rawMsg: string, title = 'Thông báo lỗi') => notify.error(rawMsg, title),
  warning: (msg: string, title = 'Cảnh báo') => notify.warning(msg, title),
  info: (msg: string, title = 'Thông báo') => notify.info(msg, title),
};

export const message = toast;

export default notify;
