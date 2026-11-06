// ─── Navigation Items ────────────────────────────────────────────────────────

export interface NavItemConfig {
  labelKey: string;
  path?: string;
  scrollTarget?: string;
  hasAiDot?: boolean;
}

export const NAV_ITEMS: NavItemConfig[] = [
  { labelKey: 'header:home', path: '/' },
  { labelKey: 'header:discovery', path: '/kham-pha' },
];

// ─── Cities ──────────────────────────────────────────────────────────────────

export const CITIES = ['Hà Nội', 'TP. HCM', 'Đà Nẵng'];

// ─── Languages ───────────────────────────────────────────────────────────────

export interface Language {
  code: string;
  label: string;
  flagUrl: string;
}

export const LANGUAGES: Language[] = [
  {
    code: 'vi',
    label: 'Tiếng Việt',
    flagUrl: 'https://flagcdn.com/w40/vn.png',
  },
  { code: 'en', label: 'English', flagUrl: 'https://flagcdn.com/w40/gb.png' },
  { code: 'ko', label: '한국어', flagUrl: 'https://flagcdn.com/w40/kr.png' },
  { code: 'ja', label: '日本語', flagUrl: 'https://flagcdn.com/w40/jp.png' },
  { code: 'zh', label: '中文', flagUrl: 'https://flagcdn.com/w40/cn.png' },
];

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotifType = 'ticket' | 'voucher' | 'release' | 'points';
export type NotifCategory = 'all' | 'offers';

export interface NotificationItem {
  id: string;
  type: NotifType;
  category: NotifCategory;
  title: string;
  desc: string;
  time: string;
  titleKey?: string;
  descKey?: string;
  timeKey?: string;
  isUnread: boolean;
  link: string;
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'ticket',
    category: 'all',
    title: 'Suất chiếu sắp diễn ra',
    desc: 'Vé xem phim Dune: Part Two sẽ bắt đầu lúc 19:30 tối nay tại IMAX Landmark 81.',
    time: '15 phút trước',
    titleKey: 'header:notif_1_title',
    descKey: 'header:notif_1_desc',
    timeKey: 'header:notif_1_time',
    isUnread: true,
    link: '/ve-cua-toi',
  },
  {
    id: '2',
    type: 'voucher',
    category: 'offers',
    title: 'Voucher ưu đãi VIP',
    desc: 'Tặng voucher giảm 50% Combo Bắp Nước CineLounge VIP cho hội viên Diamond.',
    time: '1 giờ trước',
    titleKey: 'header:notif_2_title',
    descKey: 'header:notif_2_desc',
    timeKey: 'header:notif_2_time',
    isUnread: true,
    link: '/uu-dai',
  },
  {
    id: '3',
    type: 'release',
    category: 'all',
    title: 'Mở bán suất chiếu sớm',
    desc: 'Deadpool & Wolverine đã mở bán vé suất chiếu sớm Midnight Sneak-show.',
    time: 'Hôm qua',
    titleKey: 'header:notif_3_title',
    descKey: 'header:notif_3_desc',
    timeKey: 'header:notif_3_time',
    isUnread: false,
    link: '/phim/5',
  },
  {
    id: '4',
    type: 'points',
    category: 'offers',
    title: 'Cộng điểm PhimPoints',
    desc: '+150 PhimPoints đã được tích lũy vào tài khoản hội viên VIP của bạn.',
    time: '2 ngày trước',
    titleKey: 'header:notif_4_title',
    descKey: 'header:notif_4_desc',
    timeKey: 'header:notif_4_time',
    isUnread: false,
    link: '/profile/vip-elite',
  },
];
