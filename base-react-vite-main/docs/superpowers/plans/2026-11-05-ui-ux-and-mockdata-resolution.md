# Kế Hoạch Xử Lý Toàn Diện UI/UX và Chuẩn Hóa Mock Data (PhimBook Cinema)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Khắc phục triệt để các lỗi chặn luồng (Flow Blockers), nút bấm rỗng/thiếu CTA, xung đột Dark Theme với Ant Design, và dọn sạch các điểm dữ liệu fix cứng (mock data) nhằm mang lại trải nghiệm xem phim và đặt vé mượt mà, chuyên nghiệp chuẩn Cinema Noir.

**Architecture:** Tách biệt rõ ràng giữa khu vực công khai (Guest Browsing: Home, Discovery, Movie Details) và khu vực yêu cầu đăng nhập (Profile, My Tickets, Checkout Payment); chuẩn hóa Theme Ant Design với `darkAlgorithm` và CSS Tokens; động hóa dữ liệu ngày chiếu/phiên chiếu và loại bỏ mock data giả lập trong Booking Context.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, Ant Design 6 / CSS-in-JS, Styled-Components 6, TanStack React Query 5, i18next, Lucide React.

**Spec:** [`C:\Users\ADMIN\.gemini\antigravity\brain\1b37a26a-718f-435b-9dbc-020249018b4e\ui_ux_audit_report.md`](file:///C:/Users/ADMIN/.gemini/antigravity/brain/1b37a26a-718f-435b-9dbc-020249018b4e/ui_ux_audit_report.md)

## Global Constraints

- **QUY TẮC AN TOÀN TOÀN CỤC (CRITICAL):** Tuyệt đối không tự ý chạy lệnh `git commit`, `git push`, tạo tag hay chạy DB migration nếu không có yêu cầu trực tiếp từ người dùng. Các bước kết thúc task chỉ chạy test / build verification.
- **Tính toàn vẹn mã nguồn:** Giữ nguyên các comment và docstring hiện có không liên quan đến thay đổi UI/UX.
- **Tiêu chuẩn thiết kế:** Tuân thủ hệ thống design tokens Cinema Noir (`#0b0b0c`, `#1c1b1c`, `#ff535a`, `#ffb955`) và chuẩn tiếp cận WCAG 2.1 AA (độ tương phản text >= 4.5:1, touch target >= 44x44px).
- **Hệ thống liên kết:** Tất cả file và symbol phải sử dụng clickable markdown link theo format `[file.ts](file:///path/to/file.ts)`.

---

## Danh Sách File Bị Tác Động (File Impact Map)

- `src/config/AppRoutes.tsx`: Điều chỉnh AuthGuard, mở public cho Home, Discovery, Movie Details; cấu hình lại route lịch chiếu.
- `src/features/home/components/HeroSpotlight/HeroSpotlight.tsx`: Chèn component `QuickBookSubmitButton` và logic điều hướng đặt vé.
- `src/features/home/components/HeroSpotlight/components/SlideCta/SlideCta.tsx`: Nối sự kiện mở TrailerModal thay vì navigate.
- `src/features/booking/context/BookingContext.tsx`: Xóa bỏ dữ liệu mock người nhận Nguyễn Thanh Tùng, ngày cũ 2024, voucher mặc định; lấy profile từ auth state.
- `src/features/movie-details/data/mock-movie-details.ts`: Động hóa `DAY_OPTIONS` theo ngày thực tế (`today + 0..5 ngày`).
- `src/features/home/components/HeroSpotlight/data/spotlight-data.ts`: Động hóa `BOOKING_DATES`.
- `src/features/booking/my-tickets/MyTicketsPage.tsx`: Tính toán số lượng vé thật từ localStorage thay vì fix cứng `( 1 )` và `( 3 )`.
- `src/config/antDesign.ts`: Kích hoạt `algorithm: theme.darkAlgorithm`.
- `src/styles/AntdOverrides.ts`: Xóa bỏ các thuộc tính màu trắng `#ffffff` và `#f2f2f2` ở pagination, table, button, datepicker.
- `src/layouts/header/Header.styles.ts`: Tăng độ tương phản nút vé và mở rộng ô tìm kiếm.
- `src/features/auth/components/LoginForm/LoginForm.tsx`: Bổ sung inline error, thông báo khi chọn SĐT hoặc social login.
- `src/features/profile/security/components/ChangePasswordCard/ChangePasswordCard.tsx`: Xóa mật khẩu điền sẵn trong input.
- `src/features/booking/seat-selection/components/SeatGrid/SeatGrid.tsx`: Bổ sung `aria-label`, tăng touch target cảm ứng.
- `index.html`: Đổi `lang="vi"`.

---

## GIAI ĐOẠN 1: SỬA LỖI CHẶN LUỒNG & ROUTING (P0 - CRITICAL)

### Task 1: Mở khóa duyệt web cho khách vãng lai (Guest Browsing) & Sắp xếp lại Route

**Files:**
- Modify: [`src/config/AppRoutes.tsx:41-171`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/config/AppRoutes.tsx#L41-L171)

**Interfaces:**
- Consumes: `tokenManager.getAccessToken()`, `AuthGuard`, `GuestGuard`, `MainLayout`, `Home`, `MovieDiscoveryPage`, `MovieDetailsPage`
- Produces: Router cấu trúc 2 tầng: Tầng Public (khách vãng lai xem được Home, Discovery, Phim chi tiết) và Tầng Protected (chỉ cho phép user đăng nhập vào Profile, Vé của tôi).

- [ ] **Step 1: Cấu trúc lại router trong `AppRoutes.tsx`**
  Đưa `Home`, `MovieDiscoveryPage`, `MovieDetailsPage` cùng các route con của `BookingLayout` (`movie-details/*`, `phim/*`, `booking/*`) ra ngoài `AuthGuard` để khách tự do chọn ghế, chọn bắp nước. Chỉ giữ `AuthGuard` bọc quanh `/ve-cua-toi` và `/profile/*`. Tách `/lich-chieu` và `/rap-chieu` để chuyển về trang Khám phá phim thay vì nhảy về trang chi tiết phim Sonic 3:

```typescript
// src/config/AppRoutes.tsx
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: HOME_PATH, element: <Home /> },
      {
        path: 'kham-pha',
        async lazy() {
          const { default: MovieDiscoveryPage } = await import(
            '@features/movie-discovery/MovieDiscoveryPage'
          );
          return { Component: MovieDiscoveryPage };
        },
      },
      {
        path: 'uu-dai',
        element: <Home />,
      },
      {
        path: 'lich-chieu',
        async lazy() {
          const { default: MovieDiscoveryPage } = await import(
            '@features/movie-discovery/MovieDiscoveryPage'
          );
          return { Component: MovieDiscoveryPage };
        },
      },
      {
        path: 'rap-chieu',
        async lazy() {
          const { default: MovieDiscoveryPage } = await import(
            '@features/movie-discovery/MovieDiscoveryPage'
          );
          return { Component: MovieDiscoveryPage };
        },
      },
      {
        element: <BookingLayout />,
        children: [
          ...MOVIE_DETAILS_PATHS.map((path) => ({
            path,
            lazy: loadMovieDetailsPage,
          })),
          {
            path: 'booking/seat-selection',
            async lazy() {
              const { default: SeatSelectionPage } = await import(
                '@features/booking/seat-selection/SeatSelectionPage'
              );
              return { Component: SeatSelectionPage };
            },
          },
          {
            path: 'booking/snacks-services',
            async lazy() {
              const { default: SnacksServicesPage } = await import(
                '@features/booking/snacks-services/SnacksServicesPage'
              );
              return { Component: SnacksServicesPage };
            },
          },
          {
            path: 'booking/checkout',
            async lazy() {
              const { default: CheckoutPage } = await import(
                '@features/booking/checkout/CheckoutPage'
              );
              return { Component: CheckoutPage };
            },
          },
        ],
      },
      // Protected Routes: Yêu cầu đăng nhập
      {
        element: <AuthGuard />,
        children: [
          {
            path: 've-cua-toi',
            async lazy() {
              const { default: MyTicketsPage } = await import(
                '@features/booking/my-tickets/MyTicketsPage'
              );
              return { Component: MyTicketsPage };
            },
          },
          ...VIP_ELITE_PATHS.map((path) => ({
            path,
            lazy: loadVipElitePage,
          })),
          {
            path: 'profile/personal-info',
            async lazy() {
              const { default: PersonalInfoPage } = await import(
                '@features/profile/personal-info/PersonalInfoPage'
              );
              return { Component: PersonalInfoPage };
            },
          },
          {
            path: 'profile/security',
            async lazy() {
              const { default: SecurityPage } = await import(
                '@features/profile/security/SecurityPage'
              );
              return { Component: SecurityPage };
            },
          },
          {
            path: 'profile/payment-methods',
            async lazy() {
              const { default: PaymentMethodsPage } = await import(
                '@features/profile/payment-methods/PaymentMethodsPage'
              );
              return { Component: PaymentMethodsPage };
            },
          },
          {
            path: 'profile/cinematic-taste',
            async lazy() {
              const { default: CinematicTastePage } = await import(
                '@features/profile/cinematic-taste/CinematicTastePage'
              );
              return { Component: CinematicTastePage };
            },
          },
          {
            path: 'profile/notification-settings',
            async lazy() {
              const { default: NotificationSettingsPage } = await import(
                '@features/profile/notification-settings/NotificationSettingsPage'
              );
              return { Component: NotificationSettingsPage };
            },
          },
        ],
      },
      { path: '*', element: <PageNotFound /> },
    ],
  },
  {
    element: <GuestGuard />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
]);
```

- [ ] **Step 2: Chạy build kiểm tra kiểu TypeScript**
  Chạy lệnh `npm run build` để xác nhận routing hợp lệ, không có lỗi lazy loading hay type mismatch.

---

### Task 2: Chèn nút Đặt Vé Nhanh (`QuickBookSubmitButton`) tại Hero Banner

**Files:**
- Modify: [`src/features/home/components/HeroSpotlight/HeroSpotlight.tsx:325-376`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/features/home/components/HeroSpotlight/HeroSpotlight.tsx#L325-L376)
- Modify: [`src/features/home/components/HeroSpotlight/HeroSpotlight.styles.ts:377-400`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/features/home/components/HeroSpotlight/HeroSpotlight.styles.ts#L377-L400)

**Interfaces:**
- Consumes: `useBooking`, `useNavigate`, `useTranslation`, `QuickBookSubmitButton`
- Produces: Nút "ĐẶT VÉ NGAY" kích hoạt sau khi người dùng chọn phim và giờ chiếu, điều hướng chính xác vào trang đặt vé.

- [ ] **Step 1: Cập nhật hàm xử lý đặt vé nhanh trong `HeroSpotlight.tsx`**
  Thêm hàm `handleQuickBookSubmit` và render `<S.QuickBookSubmitButton>` ở cuối `<S.QuickBookingBar>`:

```tsx
// Trong HeroSpotlight.tsx:
const navigate = useNavigate();

const handleQuickBookSubmit = (e: React.MouseEvent) => {
  e.stopPropagation();
  const matchedMovie = SPOTLIGHT_MOVIES.find((m) => m.mainTitle === selectedMovie) || SPOTLIGHT_MOVIES[0];
  const targetId = matchedMovie.detailMovieId || 'nhim-sonic-3';
  
  // Điều hướng thẳng tới trang chi tiết phim với suất chiếu đã chọn
  navigate(`/phim/${targetId}`);
};

// Trong JSX của QuickBookingBar:
      {/* Nút Submit Đặt vé nhanh */}
      <S.QuickBookSubmitButton
        type="button"
        onClick={handleQuickBookSubmit}
        aria-label={t('home:hero.quick_book_btn', 'Đặt vé ngay')}
      >
        <Ticket size={16} />
        <span>{t('home:hero.quick_book_btn', 'ĐẶT VÉ NGAY')}</span>
      </S.QuickBookSubmitButton>
    </S.QuickBookingBar>
```

- [ ] **Step 2: Chạy build kiểm tra tính hợp lệ**
  Chạy `npm run build` xác nhận component render chuẩn xác.

---

## GIAI ĐOẠN 2: DỌN SẠCH MOCK DATA & ĐỘNG HÓA THỜI GIAN (P0 - CRITICAL)

### Task 3: Dọn sạch dữ liệu Mock trong `BookingContext.tsx`

**Files:**
- Modify: [`src/features/booking/context/BookingContext.tsx:5-65`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/features/booking/context/BookingContext.tsx#L5-L65)

**Interfaces:**
- Consumes: `localStorage.getItem('user_info')`, `localStorage.getItem('user_name')`
- Produces: Khởi tạo state sạch: `recipient` lấy từ user đăng nhập nếu có; không gán cứng voucher `GIAM30K`; ngày chiếu lấy ngày hiện tại.

- [ ] **Step 1: Chuẩn hóa `defaultState` trong `BookingContext.tsx`**
  Xóa sạch các chuỗi cứng cá nhân hóa:

```typescript
// src/features/booking/context/BookingContext.tsx
const getInitialRecipient = () => {
  try {
    const userInfoStr = localStorage.getItem('user_info');
    if (userInfoStr) {
      const user = JSON.parse(userInfoStr);
      return {
        name: user.fullName || localStorage.getItem('user_name') || '',
        phone: user.phone || '',
        email: user.email || '',
        isSendZalo: true,
      };
    }
  } catch {
    // fallback
  }
  return {
    name: localStorage.getItem('user_name') || '',
    phone: '',
    email: '',
    isSendZalo: true,
  };
};

const defaultState: BookingState = {
  movie: {
    id: '',
    title: '',
    originalTitle: '',
    posterUrl: '',
    backdropUrl: '',
    rating: 8.8,
    ageRating: 'P',
    duration: '',
    format: '2D Tiêu Chuẩn',
  },
  session: {
    cinemaId: '',
    cinemaName: '',
    cinemaAddress: '',
    room: '',
    date: '',
    time: '',
    format: '',
    soundSystem: 'DOLBY ATMOS',
  },
  selectedSeats: [],
  selectedSnacks: [],
  pickupMethod: 'at-seat',
  appliedVoucher: null, // Không gán ngầm voucher
  recipient: getInitialRecipient(),
  paymentMethod: 'momo',
};
```

- [ ] **Step 2: Chạy build kiểm tra types**
  Chạy `npm run build` để xác nhận `appliedVoucher: null` không gây xung đột kiểu dữ liệu.

---

### Task 4: Động hóa ngày chiếu (`DAY_OPTIONS`) theo thời gian thực tế

**Files:**
- Modify: [`src/features/movie-details/data/mock-movie-details.ts:2015-2050`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/features/movie-details/data/mock-movie-details.ts#L2015-L2050)
- Modify: [`src/features/home/components/HeroSpotlight/data/spotlight-data.ts:130-137`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/features/home/components/HeroSpotlight/data/spotlight-data.ts#L130-L137)

**Interfaces:**
- Produces: Hàm `generateDynamicDayOptions()` tạo danh sách 6 ngày chiếu kế tiếp dựa trên `new Date()`, tự động tính toán Thứ trong tuần và định dạng `DD/MM/YYYY`.

- [ ] **Step 1: Viết hàm sinh ngày động trong `mock-movie-details.ts`**
  Thay thế mảng tĩnh ngày 24/10/2024:

```typescript
// src/features/movie-details/data/mock-movie-details.ts
const WEEKDAY_NAMES = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
];

export const generateDynamicDayOptions = (): DayOption[] => {
  const options: DayOption[] = [];
  const today = new Date();

  for (let i = 0; i < 6; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const dayOfMonth = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const dayOfWeek = WEEKDAY_NAMES[d.getDay()];

    const padDay = dayOfMonth < 10 ? `0${dayOfMonth}` : `${dayOfMonth}`;
    const padMonth = month < 10 ? `0${month}` : `${month}`;
    const dateStr = `${padDay}/${padMonth}`;

    let dayLabel = dayOfWeek.toUpperCase();
    if (i === 0) dayLabel = 'HÔM NAY';
    else if (i === 1) dayLabel = 'NGÀY MAI';
    else if (d.getDay() === 0 || d.getDay() === 6) dayLabel = 'CUỐI TUẦN';

    options.push({
      dayLabel,
      dateStr,
      dayOfWeek,
      fullDate: `${dayOfWeek}, ${dateStr}/${year}`,
    });
  }

  return options;
};

export const DAY_OPTIONS: DayOption[] = generateDynamicDayOptions();
```

- [ ] **Step 2: Động hóa ngày trong `spotlight-data.ts`**
  Cập nhật mảng `BOOKING_DATES`:

```typescript
// src/features/home/components/HeroSpotlight/data/spotlight-data.ts
export const BOOKING_DATES: BookingDateOption[] = [
  { key: 'today', defaultLabel: 'Hôm nay' },
  { key: 'tomorrow', defaultLabel: 'Ngày mai' },
  { key: 'day_3', defaultLabel: '2 ngày tới' },
  { key: 'day_4', defaultLabel: '3 ngày tới' },
  { key: 'day_5', defaultLabel: '4 ngày tới' },
];
```

- [ ] **Step 3: Kiểm tra build**
  Chạy `npm run build` để kiểm tra.

---

### Task 5: Động hóa số lượng vé & voucher thật tại `MyTicketsPage.tsx`

**Files:**
- Modify: [`src/features/booking/my-tickets/MyTicketsPage.tsx:48-68`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/features/booking/my-tickets/MyTicketsPage.tsx#L48-L68)
- Modify: [`src/features/booking/my-tickets/hooks/useMyTickets.ts`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/features/booking/my-tickets/hooks/useMyTickets.ts)

**Interfaces:**
- Consumes: `activeTicket`, `pastTickets`, `VOUCHERS`
- Produces: Hiển thị đúng số vé sắp xem `( ${activeTicket ? 1 : 0} )`, số vé lịch sử `( ${pastTickets.length} )`, và voucher khả dụng.

- [ ] **Step 1: Đọc vé đã đặt từ `localStorage` và cập nhật tiêu đề tab**
  Thay thế các số cứng `( 1 )` và `( 3 )`:

```tsx
// Trong MyTicketsPage.tsx:
<S.TabPill
  $isActive={activeTab === 'upcoming'}
  onClick={handleSelectTab('upcoming')}
>
  {t('booking:tickets_upcoming')} ({activeTicket ? 1 : 0})
</S.TabPill>
<S.TabPill
  $isActive={activeTab === 'history'}
  onClick={handleSelectTab('history')}
>
  {t('booking:tickets_history')} ({pastTickets.length})
</S.TabPill>
<S.TabPill
  $isActive={activeTab === 'vouchers'}
  onClick={handleSelectTab('vouchers')}
>
  {t('booking:tickets_vouchers')} ({VOUCHERS.length})
</S.TabPill>
```

- [ ] **Step 2: Thêm Empty State khi chưa có vé nào**
  Nếu `!activeTicket`, hiển thị giao diện báo chưa có vé và nút điều hướng "Khám phá phim ngay".

---

## GIAI ĐOẠN 3: CHUẨN HÓA DARK THEME & KHỬ NỀN TRẮNG CHÓI (P1)

### Task 6: Kích hoạt `theme.darkAlgorithm` và dọn sạch nền trắng trong `AntdOverrides.ts`

**Files:**
- Modify: [`src/config/antDesign.ts:1-45`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/config/antDesign.ts#L1-L45)
- Modify: [`src/styles/AntdOverrides.ts:50-80`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/styles/AntdOverrides.ts#L50-L80) và [`L508-L515`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/styles/AntdOverrides.ts#L508-L515), [`L610-L618`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/styles/AntdOverrides.ts#L610-L618)

- [ ] **Step 1: Bật `theme.darkAlgorithm` trong `src/config/antDesign.ts`**

```typescript
import { theme as antdTheme, type ConfigProviderProps, type ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm, // Kích hoạt dark mode chuẩn từ Ant Design
  token: {
    colorPrimary: palette.primary,
    colorLink: palette.primary,
    colorInfo: palette.primary,
    colorSuccess: palette.success,
    colorWarning: palette.warning,
    colorError: palette.error,
    colorText: palette.textPrimary,
    colorTextBase: palette.textPrimary,
    colorTextSecondary: palette.textSecondary,
    colorBgBase: palette.bgPrimary,
    colorBgContainer: palette.surface,
    colorBgElevated: '#201F20',
    colorBgLayout: palette.bgPrimary,
    colorBorder: palette.borderSecondary,
    colorBorderSecondary: palette.borderPrimary,
    borderRadius: 8,
    fontFamily: "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    ...
```

- [ ] **Step 2: Sửa các rule nền trắng trong `src/styles/AntdOverrides.ts`**
  - Đổi `.ant-pagination.ant-table-pagination` từ `background-color: #ffffff` thành `background-color: var(--bg-elevated, #201f20)`.
  - Đổi `.ant-table-wrapper.--disabled tbody tr` từ `background-color: #f2f2f2` thành `background-color: var(--bg-disabled, #2a2a2b)`.
  - Sửa `.ant-btn-default` để không mang `background-color: var(--primary-text)` (màu trắng), thay bằng `background-color: rgba(255, 255, 255, 0.08)` và viền `rgba(255, 255, 255, 0.15)`.

- [ ] **Step 3: Chạy build kiểm tra**
  Chạy `npm run build` để kiểm tra.

---

### Task 7: Cải thiện tương phản Header & Kích thước ô tìm kiếm

**Files:**
- Modify: [`src/layouts/header/Header.styles.ts:131-150`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/layouts/header/Header.styles.ts#L131-L150)
- Modify: [`src/layouts/header/components/HeaderSearch/HeaderSearch.styles.ts:4-40`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/layouts/header/components/HeaderSearch/HeaderSearch.styles.ts#L4-L40)

- [ ] **Step 1: Đổi màu chữ nút vé trong `Header.styles.ts`**
  Đổi màu chữ từ `#5b000d` sang `#ffffff` với `font-weight: 700` để đạt độ tương phản chuẩn trên nền đỏ `#ff535a`.

- [ ] **Step 2: Nâng cấp ô tìm kiếm trong `HeaderSearch.styles.ts`**
  Tăng kích thước từ `width: 127px` lên `width: 180px`, và hỗ trợ `:focus-within { width: 230px; border-color: var(--secondary); }`.

---

## GIAI ĐOẠN 4: SỬA LỖI TƯƠNG TÁC, BIỂU MẪU & NÚT RỖNG (P1)

### Task 8: Chuẩn hóa Form Đăng nhập / Đăng ký (`LoginForm.tsx`)

**Files:**
- Modify: [`src/features/auth/components/LoginForm/LoginForm.tsx:75-180`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/features/auth/components/LoginForm/LoginForm.tsx#L75-L180)

- [ ] **Step 1: Bổ sung inline error và phản hồi khi thiếu thông tin**
  Thêm state `formErrors: { email?: string; password?: string; general?: string }`. Khi nhấn Đăng nhập/Đăng ký mà input trống, gán lỗi và hiển thị viền đỏ kèm dòng chữ thông báo thay vì return âm thầm.
- [ ] **Step 2: Xử lý các nút chưa tích hợp API**
  Với các nút Google, Facebook, Zalo, Quên mật khẩu: thay vì hàm rỗng `() => {}`, gọi `message.info(t('auth:feature_in_development', 'Tính năng đang trong quá trình tích hợp.'))`.
- [ ] **Step 3: Khóa hoặc ghi chú rõ ràng trên Tab SĐT**
  Nếu chọn tab Số điện thoại, hiển thị tooltip/dòng chữ thông báo: "Hệ thống hiện ưu tiên đăng nhập bằng Email tài khoản".

---

### Task 9: Chuyển nút Trailer trên Hero Banner sang mở TrailerModal

**Files:**
- Modify: [`src/features/home/components/HeroSpotlight/components/SlideCta/SlideCta.tsx:26-30`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/features/home/components/HeroSpotlight/components/SlideCta/SlideCta.tsx#L26-L30)
- Modify: [`src/features/home/components/HeroSpotlight/HeroSpotlight.tsx`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/features/home/components/HeroSpotlight/HeroSpotlight.tsx)

- [ ] **Step 1: Bổ sung prop `onOpenTrailer` cho `SlideCTA`**
  Khi người dùng nhấn "Xem Trailer 4K", mở `TrailerModal` với link YouTube trailer tương ứng thay vì gọi `navigate('/phim/' + id)`.

---

### Task 10: Xóa mật khẩu điền sẵn trong `ChangePasswordCard.tsx`

**Files:**
- Modify: [`src/features/profile/security/components/ChangePasswordCard/ChangePasswordCard.tsx:15-18`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/features/profile/security/components/ChangePasswordCard/ChangePasswordCard.tsx#L15-L18)

- [ ] **Step 1: Khởi tạo giá trị chuỗi rỗng cho input mật khẩu**
  Thay `useState('PasswordVIP2024!')` và `useState('CinemaNoir_Elite99#')` thành `useState('')`.
  Thêm kiểm tra khớp mật khẩu: nếu `newPass !== confirmPass`, hiển thị lỗi "Mật khẩu xác nhận không khớp" thay vì return âm thầm.

---

## GIAI ĐOẠN 5: TỐI ƯU MOBILE, ACCESSIBILITY & PERFORMANCE (P2)

### Task 11: Tối ưu Touch Target & Khả năng tiếp cận trên bản đồ ghế (`SeatGrid.tsx`)

**Files:**
- Modify: [`src/features/booking/seat-selection/components/SeatGrid/SeatGrid.tsx:140-155`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/features/booking/seat-selection/components/SeatGrid/SeatGrid.tsx#L140-L155)
- Modify: [`src/features/booking/seat-selection/components/SeatGrid/SeatGrid.styles.ts:80-105`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/features/booking/seat-selection/components/SeatGrid/SeatGrid.styles.ts#L80-L105)

- [ ] **Step 1: Bổ sung `aria-label`, `aria-pressed` cho từng ghế**
  Thêm `aria-label={`Ghế ${seatLabel}, loại ${normalizedType}, giá ${seat.price}đ, ${isSold ? 'đã bán' : isSelected ? 'đang chọn' : 'còn trống'}`}`.
- [ ] **Step 2: Mở rộng vùng chạm cảm ứng cho mobile**
  Thêm pseudo-element `::after` cho `SeatBox` với `position: absolute; inset: -6px;` để diện tích tap đạt tối thiểu 44x44px mà không làm vỡ khoảng cách thẩm mỹ giữa các ghế.
- [ ] **Step 3: Nâng tương phản chữ số ghế đã bán**
  Đổi màu chữ ghế sold từ `rgba(255, 255, 255, 0.2)` sang `rgba(255, 255, 255, 0.45)`.

---

### Task 12: Đổi `html lang="vi"` và tối ưu Favicon trong `index.html`

**Files:**
- Modify: [`index.html:1-10`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/index.html#L1-L10)

- [ ] **Step 1: Đổi `lang="vi"` trong thẻ `<html>`**
- [ ] **Step 2: Đổi icon Favicon sang file SVG nhẹ (`/vite.svg`) để tăng tốc độ tải trang ban đầu (FCP/LCP)**

---

## Kiểm Tra Hoàn Thành & Nghiệm Thu (Verification Checklist)

1. [ ] **Build Check**: Chạy `npm run build` thành công, không phát sinh lỗi TypeScript.
2. [ ] **Lint Check**: Chạy `npm run lint` sạch sẽ.
3. [ ] **Guest Flow Verification**: Xóa token trong Application/LocalStorage, truy cập `/`, `/kham-pha`, `/phim/dune-2` mở mượt mà không bị chuyển hướng sang `/login`.
4. [ ] **Quick Book Check**: Trên Hero Banner, bấm "ĐẶT VÉ NGAY" chuyển hướng chính xác vào trang đặt vé.
5. [ ] **Theme Check**: Kiểm tra bảng và phân trang không còn bất kỳ vệt màu trắng chói lóa nào.
6. [ ] **Clean Data Check**: Vào bước checkout không còn xuất hiện tên "Nguyễn Thanh Tùng" hay ngày chiếu cũ 2024.
