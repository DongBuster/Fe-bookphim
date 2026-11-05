import type { ReactNode } from 'react';

/**
 * Danh sách các tính năng có thể bật / tắt qua biến môi trường (.env).
 * Quy tắc:
 * - Mặc định: BẬT TẤT CẢ (All Enabled = true).
 * - Chỉ tắt khi biến môi trường tương ứng được gán giá trị rõ ràng là 'false' hoặc '0'.
 */
export const FEATURE_ENV_MAP = {
  /** 1. Trợ lý ảo CineBot AI Concierge Floating Widget */
  cineBotAi: 'VITE_FEATURE_CINEBOT_AI',

  /** 2. Hộ chiếu điện ảnh & Huy hiệu 3D Hologram (/profile/passport) */
  passport: 'VITE_FEATURE_PASSPORT',

  /** 3. Đặt vé nhóm & Chia tiền tự động (CineParty) trên sơ đồ ghế */
  cineParty: 'VITE_FEATURE_CINEPARTY',

  /** 4. Ghép đôi gu phim solo (CineMate) */
  cineMate: 'VITE_FEATURE_CINEMATE',

  /** 5. Suất chiếu bí ẩn (Mystery Night Showtimes) */
  mysteryNight: 'VITE_FEATURE_MYSTERY_NIGHT',

  /** 6. Các nút đăng nhập mạng xã hội (Google / Facebook / Zalo) */
  socialLogin: 'VITE_FEATURE_SOCIAL_LOGIN',

  /** 7. Thanh Đặt vé nhanh tại Hero Banner */
  quickBooking: 'VITE_FEATURE_QUICK_BOOKING',
} as const;

export type FeatureKey = keyof typeof FEATURE_ENV_MAP;

/**
 * Kiểm tra xem một tính năng có đang được kích hoạt hay không.
 * Mặc định trả về true nếu biến môi trường chưa được khai báo hoặc khác 'false' / '0'.
 */
export function isFeatureEnabled(feature: FeatureKey): boolean {
  const envVar = FEATURE_ENV_MAP[feature];
  const envValue = import.meta.env[envVar];

  // Chỉ khi đặt rõ ràng là 'false' hoặc '0' thì mới tắt
  if (envValue === 'false' || envValue === '0') {
    return false;
  }

  // Mặc định bật tất cả (All ON by default)
  return true;
}

/**
 * Hook kiểm tra tính năng trong React component
 */
export function useFeatureFlag(feature: FeatureKey): boolean {
  return isFeatureEnabled(feature);
}

/**
 * Component bọc điều kiện hiển thị UI dựa trên Feature Flag
 */
export interface FeatureGateProps {
  feature: FeatureKey;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGate({
  feature,
  children,
  fallback = null,
}: FeatureGateProps): ReactNode {
  if (!isFeatureEnabled(feature)) {
    return fallback;
  }
  return children;
}
