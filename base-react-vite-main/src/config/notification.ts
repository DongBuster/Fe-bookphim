import type { NotificationArgsProps } from 'antd';
import { notification, message as antdMessage } from 'antd';
import { sanitizeErrorMessage } from '@/shared/utils/error-sanitizer';

type NotificationPlacement = NotificationArgsProps['placement'];

const defaultPlacement: NotificationPlacement = 'topRight';

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
  backgroundColor: '#1C1B1C',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '10px',
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.65)',
};

const notify = {
  success: (description?: string, title = 'Thành công') => {
    const key = `success_${title}_${description}`;
    if (!shouldDisplayNotification(key)) return;

    notification.success({
      message: title,
      description,
      placement: defaultPlacement,
      duration: 2.5,
      showProgress: true,
      style: {
        ...NOTIFICATION_BASE_STYLE,
        border: '1px solid rgba(52, 199, 89, 0.35)',
      },
    });
  },

  error: (rawDescription?: string, title = 'Thông báo lỗi') => {
    const cleanDesc = sanitizeErrorMessage(rawDescription);
    const key = `error_${cleanDesc}`;
    if (!shouldDisplayNotification(key)) return;

    notification.error({
      message: title,
      description: cleanDesc,
      placement: defaultPlacement,
      duration: 3.5,
      showProgress: true,
      style: {
        ...NOTIFICATION_BASE_STYLE,
        border: '1px solid rgba(255, 83, 90, 0.4)',
      },
    });
  },

  warning: (description?: string, title = 'Cảnh báo') => {
    const cleanDesc = sanitizeErrorMessage(description);
    const key = `warning_${cleanDesc}`;
    if (!shouldDisplayNotification(key)) return;

    notification.warning({
      message: title,
      description: cleanDesc,
      placement: defaultPlacement,
      duration: 3,
      showProgress: true,
      style: {
        ...NOTIFICATION_BASE_STYLE,
        border: '1px solid rgba(255, 185, 85, 0.35)',
      },
    });
  },

  info: (description?: string, title = 'Thông báo') => {
    const key = `info_${title}_${description}`;
    if (!shouldDisplayNotification(key)) return;

    notification.info({
      message: title,
      description,
      placement: defaultPlacement,
      duration: 2.5,
      showProgress: true,
      style: {
        ...NOTIFICATION_BASE_STYLE,
        border: '1px solid rgba(23, 143, 226, 0.35)',
      },
    });
  },
};

/**
 * Toast / Message helper with automatic deduplication & error sanitization
 */
export const toast = {
  success: (msg: string) => {
    if (!shouldDisplayNotification(`toast_s_${msg}`)) return;
    antdMessage.success(msg);
  },
  error: (rawMsg: string) => {
    const cleanMsg = sanitizeErrorMessage(rawMsg);
    if (!shouldDisplayNotification(`toast_e_${cleanMsg}`)) return;
    antdMessage.error(cleanMsg);
  },
  warning: (msg: string) => {
    if (!shouldDisplayNotification(`toast_w_${msg}`)) return;
    antdMessage.warning(msg);
  },
  info: (msg: string) => {
    if (!shouldDisplayNotification(`toast_i_${msg}`)) return;
    antdMessage.info(msg);
  },
};

export default notify;
