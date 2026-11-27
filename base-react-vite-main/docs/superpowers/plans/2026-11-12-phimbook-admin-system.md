# PhimBook Admin Management System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng và tích hợp hoàn chỉnh hệ thống Quản trị Rạp chiếu phim PhimBook (Cinema Operations Admin Suite) tại phân hệ `/admin`, kết nối trực tiếp với Backend API .NET 8 (không mock / fallback), hỗ trợ phân quyền Role-based (ADMIN, MANAGER), giao diện Cinema Noir Pro Dark (Ant Design v6 + Styled-Components).

**Architecture:** Cấu trúc phân hệ mô-đun (Modular Feature-Driven Architecture) tại `src/features/admin/`, tích hợp trực tiếp `axiosClient` với JWT Bearer Token, quản lý Server State bằng TanStack Query v5, lazy loading từng route với React Router v7, đồng bộ giao diện Dark Theme thông qua Ant Design `ConfigProvider`.

**Tech Stack:** React 19, TypeScript, Vite, Ant Design v6, TanStack Query v5, Styled-Components, Lucide React, Axios.

**Spec:** `C:\Users\ADMIN\.gemini\antigravity\brain\6335e6c0-178a-4ad4-bae0-26656f78fba1\phimbook-admin-design-spec.md`

## Global Constraints
- Toàn bộ endpoint quản trị kết nối trực tiếp đến backend `/api/v1/admin/*` qua `axiosClient`, tuyệt đối không dùng Mock Store hay Fallback data.
- Bảo đảm 0 lỗi TypeScript (`tsc -b`) và 0 cảnh báo ESLint (`eslint .`).
- Áp dụng giao diện Cinema Noir Dark Theme đồng bộ thương hiệu PhimBook: nền đen sâu `#0B0C0E` / `#13151B`, viền `#252A36`, màu nhấn vàng kim `#FFB955` và đỏ nhung `#FF535A`.
- Tuân thủ quy tắc an toàn toàn cục: không tự ý commit, push, tạo git tag hoặc chạy DB migration.

---

## File Structure

```text
src/
├── shared/
│   ├── constants/
│   │   ├── storage-key.ts                    # Thêm key user_role
│   │   └── path.ts                           # Thêm ADMIN_PATHS
│   └── types/
│       └── api.types.ts                      # Cập nhật AuthUser với role: UserRole
├── features/
│   ├── auth/
│   │   └── components/LoginForm/LoginForm.tsx # Lưu user_role vào localStorage khi đăng nhập
│   └── admin/
│       ├── types/
│       │   └── admin.types.ts                # Định nghĩa toàn bộ DTOs của phân hệ Admin
│       ├── api/
│       │   ├── admin-dashboard.api.ts        # API overview, revenue chart, top movies, upcoming
│       │   ├── admin-movies.api.ts           # API CRUD phim, status toggle
│       │   ├── admin-theaters.api.ts         # API rạp, phòng chiếu, seat matrix, tạo phòng
│       │   ├── admin-showtimes.api.ts        # API suất chiếu, conflict validation
│       │   ├── admin-bookings.api.ts         # API tra cứu đơn vé, check-in, hoàn vé
│       │   └── admin-concessions.api.ts      # API bắp nước F&B và voucher
│       ├── guards/
│       │   ├── AdminGuard.tsx                # Chặn người dùng không có role ADMIN/MANAGER
│       │   └── Forbidden403Page.tsx          # Màn hình báo lỗi không đủ quyền hạn
│       ├── layouts/
│       │   ├── AdminLayout.tsx               # Khung sườn tổng thể + Antd ConfigProvider Dark Theme
│       │   ├── AdminSidebar.tsx              # Sidebar thu phóng với menu điều hướng
│       │   ├── AdminHeader.tsx               # Header với breadcrumb, avatar admin, quick link
│       │   └── AdminLayout.styles.ts         # Styled-components cho khung layout admin
│       ├── components/
│       │   ├── AdminPageHeader.tsx           # Tiêu đề trang, breadcrumb & nút thao tác
│       │   ├── AdminStatCard.tsx             # Thẻ KPI kèm chỉ số % tăng trưởng
│       │   ├── AdminDataTable.tsx            # Bảng dữ liệu chuẩn dark theme với search/filter
│       │   └── StatusBadge.tsx               # Badge hiển thị trạng thái phim, vé, suất chiếu
│       └── pages/
│           ├── dashboard/
│           │   ├── AdminDashboardPage.tsx    # Trang dashboard chỉ số, biểu đồ, top phim
│           │   └── components/
│           │       └── RevenueChart.tsx      # Biểu đồ doanh thu 7/30 ngày
│           ├── movies/
│           │   ├── AdminMoviesPage.tsx       # Quản lý danh sách phim
│           │   └── components/
│           │       └── MovieFormDrawer.tsx   # Drawer thêm / sửa thông tin phim
│           ├── theaters/
│           │   ├── AdminTheatersPage.tsx     # Quản lý rạp và phòng chiếu
│           │   └── components/
│           │       ├── SeatMatrixModal.tsx   # Modal xem sơ đồ ghế của phòng chiếu
│           │       └── CreateRoomModal.tsx   # Modal tạo phòng chiếu kèm cấu hình hàng ghế
│           ├── showtimes/
│           │   ├── AdminShowtimesPage.tsx    # Quản lý lịch chiếu theo rạp & phòng
│           │   └── components/
│           │       └── ShowtimeFormModal.tsx # Modal tạo suất chiếu mới kèm conflict check
│           ├── bookings/
│           │   ├── AdminBookingsPage.tsx     # Tra cứu đơn đặt vé & check-in
│           │   └── components/
│           │       ├── BookingDetailDrawer.tsx # Drawer xem chi tiết vé & mã QR
│           │       └── CheckInModal.tsx      # Modal quét mã / nhập passCode soát vé
│           └── concessions/
│               ├── AdminConcessionsPage.tsx  # Quản lý bắp nước & voucher khuyến mãi
│               └── components/
│                   ├── ConcessionFormModal.tsx # Modal thêm/sửa combo bắp nước
│                   └── VoucherFormModal.tsx  # Modal tạo mã giảm giá mới
└── config/
    └── AppRoutes.tsx                         # Khai báo cấu hình route `/admin` (lazy-loaded)
```

---

## Tasks

### Task 1: Type Definitions & Storage Key Updates
**Files:**
- Modify: `src/shared/types/api.types.ts`
- Modify: `src/shared/constants/storage-key.ts`
- Modify: `src/shared/constants/path.ts`
- Create: `src/features/admin/types/admin.types.ts`

**Interfaces:**
- Produces: `UserRole`, `AuthUser.role`, `LOCAL_STORAGE_KEYS.userRole`, `ADMIN_PATHS`, và các Admin DTOs (`DashboardOverviewDto`, `RevenueChartDto`, `MovieAdminDto`, `ShowtimeAdminDto`, `BookingAdminDto`, `ConcessionDto`, `VoucherDto`...).

- [ ] **Step 1: Cập nhật `src/shared/types/api.types.ts`**
Thêm `UserRole` và bổ sung trường `role?: UserRole | string;` vào `AuthUser`:
```typescript
export type UserRole = 'CUSTOMER' | 'ADMIN' | 'MANAGER';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  membershipTier?: MembershipTier | string;
  totalPoints?: number;
  role?: UserRole | string;
}
```

- [ ] **Step 2: Cập nhật `src/shared/constants/storage-key.ts`**
Thêm `userRole` vào `LOCAL_STORAGE_KEYS`:
```typescript
export const LOCAL_STORAGE_KEYS = {
  accessToken: 'hkuyemmbkwbđb',
  refreshToken: 'fyjghkertw43',
  userRole: 'phimbook_user_role',
} as const;
```

- [ ] **Step 3: Cập nhật `src/shared/constants/path.ts`**
Khai báo đường dẫn phân hệ Admin:
```typescript
export const ADMIN_PATHS = {
  DASHBOARD: '/admin',
  MOVIES: '/admin/movies',
  SHOWTIMES: '/admin/showtimes',
  THEATERS: '/admin/theaters',
  BOOKINGS: '/admin/bookings',
  CONCESSIONS: '/admin/concessions',
} as const;
```

- [ ] **Step 4: Khởi tạo tệp `src/features/admin/types/admin.types.ts`**
Định nghĩa đầy đủ các DTO cho phân hệ Admin (theo đúng spec đã duyệt):
```typescript
import type { ScreenType, AgeRating, OrderStatus, PaymentMethodType } from '@shared/types/api.types';

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'MANAGER';

export interface DashboardOverviewDto {
  todayRevenue: number;
  todayTicketsSold: number;
  avgOccupancyRate: number;
  activeShowtimesToday: number;
  revenueChangePercent: number;
  ticketsChangePercent: number;
}

export interface RevenueChartDto {
  labels: string[];
  ticketRevenue: number[];
  concessionRevenue: number[];
  totalRevenue: number[];
}

export interface TopMovieRevenueDto {
  movieId: string;
  title: string;
  posterUrl: string;
  ticketsSold: number;
  revenue: number;
}

export interface MovieAdminDto {
  id: string;
  title: string;
  slug: string;
  originalTitle?: string;
  synopsis: string;
  trailerUrl?: string;
  posterUrl: string;
  bannerUrl?: string;
  director?: string;
  cast: string[];
  genres: string[];
  formats: string[];
  durationMinutes: number;
  ageRating: AgeRating | string;
  releaseDate: string;
  status: 'NOW_SHOWING' | 'COMING_SOON' | 'STOPPED';
  imdbRating?: number;
  totalTicketsSold: number;
  totalRevenue: number;
}

export interface CreateMovieRequestDto {
  title: string;
  originalTitle?: string;
  synopsis: string;
  trailerUrl?: string;
  posterUrl: string;
  bannerUrl?: string;
  director?: string;
  cast: string[];
  genres: string[];
  formats: string[];
  durationMinutes: number;
  ageRating: AgeRating | string;
  releaseDate: string;
  status: 'NOW_SHOWING' | 'COMING_SOON';
}

export type UpdateMovieRequestDto = Partial<CreateMovieRequestDto>;

export interface RoomDto {
  roomId: string;
  roomName: string;
  screenType: ScreenType | string;
  totalSeats: number;
  theaterId: string;
}

export interface TheaterWithRoomsDto {
  theaterId: string;
  theaterName: string;
  address: string;
  city: string;
  rooms: RoomDto[];
}

export interface RoomSeatMatrixDto {
  roomId: string;
  roomName: string;
  totalRows: number;
  totalColumns: number;
  seats: { seatId: string; rowLabel: string; seatNumber: number; seatType: string }[];
}

export interface CreateRoomDto {
  theaterId: string;
  roomName: string;
  screenType: ScreenType | string;
  totalRows: number;
  totalColumns: number;
}

export interface ShowtimeAdminDto {
  showtimeId: string;
  movieId: string;
  movieTitle: string;
  roomId: string;
  roomName: string;
  theaterId: string;
  theaterName: string;
  startTime: string;
  endTime: string;
  format: ScreenType | string;
  basePrice: number;
  vipPrice: number;
  sweetboxPrice: number;
  ticketsSold: number;
  totalSeats: number;
  occupancyRate: number;
}

export interface CreateShowtimeDto {
  movieId: string;
  roomId: string;
  startTime: string;
  format: ScreenType | string;
  basePrice: number;
  vipPrice: number;
  sweetboxPrice: number;
}

export type UpdateShowtimeDto = Pick<CreateShowtimeDto, 'basePrice' | 'vipPrice' | 'sweetboxPrice'>;

export interface BookingAdminDto {
  bookingId: string;
  passCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  movieTitle: string;
  showtimeDate: string;
  startTime: string;
  theaterName: string;
  seatLabels: string[];
  totalAmount: number;
  status: OrderStatus | string;
  paymentMethod: PaymentMethodType | string;
  createdAt: string;
}

export interface BookingDetailAdminDto extends BookingAdminDto {
  concessions: { name: string; quantity: number; unitPrice: number }[];
  discountAmount: number;
  voucherCode?: string;
  qrCodeBase64?: string;
  checkedInAt?: string | null;
  refundReason?: string | null;
}

export interface ConcessionDto {
  itemId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  isAvailable: boolean;
  soldCount: number;
}

export interface UpsertConcessionDto {
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  isAvailable: boolean;
}

export interface VoucherDto {
  voucherId: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderAmount: number;
  maxUsageCount: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateVoucherDto {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderAmount?: number;
  maxUsageCount: number;
  expiresAt: string;
}
```

- [ ] **Step 5: Kiểm tra biên dịch Type**
Chạy: `npm run build` hoặc `npx tsc --noEmit` để đảm bảo không có lỗi type.

---

### Task 2: Auth Flow Update (Lưu Role & Xử Lý Đăng Nhập Phân Quyền)
**Files:**
- Modify: `src/features/auth/components/LoginForm/LoginForm.tsx`

**Interfaces:**
- Consumes: `LOCAL_STORAGE_KEYS.userRole`, `AuthUser.role`
- Produces: Lưu `user_role` vào localStorage khi đăng nhập thành công.

- [ ] **Step 1: Cập nhật hàm `handleSubmit` trong `LoginForm.tsx`**
Tìm đoạn lưu `loginData` (dòng 181-190) và bổ sung lưu `role`:
```typescript
// Lưu role người dùng
const userRole = loginData.user?.role || 'CUSTOMER';
localStorage.setItem('user_role', userRole);

// Nếu là tài khoản Admin hoặc Manager, tự động chuyển hướng vào /admin
if (userRole === 'ADMIN' || userRole === 'MANAGER') {
  navigate('/admin', { replace: true });
} else {
  navigate('/', { replace: true });
}
```

- [ ] **Step 2: Thêm nút điền nhanh tài khoản Admin demo**
Tại `LoginForm.tsx`, bổ sung một nút bấm nhỏ để điền tài khoản Admin phục vụ kiểm thử nhanh:
```typescript
const handleFillAdminAccount = () => {
  setIsRegisterMode(false);
  setActiveTab('email');
  setIdentifier('admin@phimbook.vn');
  setCredential('Password123@');
};
```

---

### Task 3: AdminGuard & Access Control Component
**Files:**
- Create: `src/features/admin/guards/AdminGuard.tsx`
- Create: `src/features/admin/guards/Forbidden403Page.tsx`

**Interfaces:**
- Consumes: `tokenManager.getAccessToken()`, `localStorage.getItem('user_role')`
- Produces: Component `AdminGuard` bảo vệ route `/admin`, render `Outlet` khi có quyền, hoặc chuyển hướng đến `/login` / hiển thị `Forbidden403Page`.

- [ ] **Step 1: Tạo `Forbidden403Page.tsx`**
```tsx
import type { FC } from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0B0C0E;
`;

export const Forbidden403Page: FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Result
        icon={<ShieldAlert size={64} color="#FF535A" style={{ margin: '0 auto' }} />}
        title={<span style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 700 }}>403 - Truy Cập Bị Từ Chối</span>}
        subTitle={<span style={{ color: '#A0A6B8' }}>Tài khoản của bạn không có quyền truy cập vào trung tâm quản trị PhimBook. Vui lòng đăng nhập bằng tài khoản Quản trị viên (Admin/Manager).</span>}
        extra={[
          <Button key="home" type="primary" style={{ background: '#FFB955', color: '#000000', fontWeight: 600, border: 'none' }} onClick={() => navigate('/')}>
            Về Trang Chủ
          </Button>,
          <Button key="login" ghost style={{ borderColor: '#FF535A', color: '#FF535A' }} onClick={() => navigate('/login')}>
            Đăng Nhập Tài Khoản Khác
          </Button>,
        ]}
      />
    </Container>
  );
};

export default Forbidden403Page;
```

- [ ] **Step 2: Tạo `AdminGuard.tsx`**
```tsx
import type { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import tokenManager from '@shared/utils/tokenManager';
import { Forbidden403Page } from './Forbidden403Page';

export const AdminGuard: FC = () => {
  const token = tokenManager.getAccessToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = localStorage.getItem('user_role');
  if (role !== 'ADMIN' && role !== 'MANAGER') {
    return <Forbidden403Page />;
  }

  return <Outlet />;
};

export default AdminGuard;
```

---

### Task 4: Admin API Client Layer
**Files:**
- Create: `src/features/admin/api/admin-dashboard.api.ts`
- Create: `src/features/admin/api/admin-movies.api.ts`
- Create: `src/features/admin/api/admin-theaters.api.ts`
- Create: `src/features/admin/api/admin-showtimes.api.ts`
- Create: `src/features/admin/api/admin-bookings.api.ts`
- Create: `src/features/admin/api/admin-concessions.api.ts`

**Interfaces:**
- Consumes: `axiosClient` từ `@config/axios-instance`, DTOs từ `admin.types.ts`
- Produces: Các hàm async gọi trực tiếp backend `/api/v1/admin/*`.

- [ ] **Step 1: Tạo `admin-dashboard.api.ts`**
```typescript
import axiosClient from '@config/axios-instance';
import type { BaseResponse } from '@shared/types/api.types';
import type {
  DashboardOverviewDto,
  RevenueChartDto,
  TopMovieRevenueDto,
  ShowtimeAdminDto,
} from '../types/admin.types';

export const getDashboardOverviewApi = async (): Promise<DashboardOverviewDto> => {
  const res = await axiosClient.get<BaseResponse<DashboardOverviewDto>>('/admin/dashboard/overview');
  return res as unknown as DashboardOverviewDto;
};

export const getRevenueChartApi = async (params: {
  from?: string;
  to?: string;
  groupBy?: 'day' | 'week' | 'month';
}): Promise<RevenueChartDto> => {
  const res = await axiosClient.get<BaseResponse<RevenueChartDto>>('/admin/dashboard/revenue-chart', { params });
  return res as unknown as RevenueChartDto;
};

export const getTopMoviesApi = async (limit = 5): Promise<TopMovieRevenueDto[]> => {
  const res = await axiosClient.get<BaseResponse<TopMovieRevenueDto[]>>('/admin/dashboard/top-movies', {
    params: { limit },
  });
  return res as unknown as TopMovieRevenueDto[];
};

export const getUpcomingShowtimesApi = async (withinHours = 2): Promise<ShowtimeAdminDto[]> => {
  const res = await axiosClient.get<BaseResponse<ShowtimeAdminDto[]>>('/admin/dashboard/upcoming-showtimes', {
    params: { withinHours },
  });
  return res as unknown as ShowtimeAdminDto[];
};
```

- [ ] **Step 2: Tạo `admin-movies.api.ts`**
```typescript
import axiosClient from '@config/axios-instance';
import type { BaseResponse, MetaData } from '@shared/types/api.types';
import type {
  MovieAdminDto,
  CreateMovieRequestDto,
  UpdateMovieRequestDto,
} from '../types/admin.types';

export interface GetAdminMoviesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export const getAdminMoviesApi = async (
  params?: GetAdminMoviesParams,
): Promise<{ data: MovieAdminDto[]; metaData?: MetaData }> => {
  const res = (await axiosClient.get('/admin/movies', { params })) as unknown as {
    data: MovieAdminDto[];
    metaData?: MetaData;
  };
  return res;
};

export const createAdminMovieApi = async (body: CreateMovieRequestDto): Promise<MovieAdminDto> => {
  const res = await axiosClient.post<BaseResponse<MovieAdminDto>>('/admin/movies', body);
  return (res as unknown as BaseResponse<MovieAdminDto>).data;
};

export const updateAdminMovieApi = async (id: string, body: UpdateMovieRequestDto): Promise<MovieAdminDto> => {
  const res = await axiosClient.put<BaseResponse<MovieAdminDto>>(`/admin/movies/${id}`, body);
  return (res as unknown as BaseResponse<MovieAdminDto>).data;
};

export const patchMovieStatusApi = async (id: string, status: string): Promise<void> => {
  await axiosClient.patch(`/admin/movies/${id}/status`, { status });
};

export const deleteAdminMovieApi = async (id: string): Promise<void> => {
  await axiosClient.delete(`/admin/movies/${id}`);
};
```

- [ ] **Step 3: Tạo `admin-theaters.api.ts`**
```typescript
import axiosClient from '@config/axios-instance';
import type { BaseResponse } from '@shared/types/api.types';
import type {
  TheaterWithRoomsDto,
  RoomSeatMatrixDto,
  CreateRoomDto,
  RoomDto,
} from '../types/admin.types';

export const getAdminTheatersApi = async (): Promise<TheaterWithRoomsDto[]> => {
  const res = await axiosClient.get<BaseResponse<TheaterWithRoomsDto[]>>('/admin/theaters');
  return res as unknown as TheaterWithRoomsDto[];
};

export const getRoomSeatMatrixApi = async (roomId: string): Promise<RoomSeatMatrixDto> => {
  const res = await axiosClient.get<BaseResponse<RoomSeatMatrixDto>>(`/admin/rooms/${roomId}/seat-matrix`);
  return res as unknown as RoomSeatMatrixDto;
};

export const createAdminRoomApi = async (body: CreateRoomDto): Promise<RoomDto> => {
  const res = await axiosClient.post<BaseResponse<RoomDto>>('/admin/rooms', body);
  return (res as unknown as BaseResponse<RoomDto>).data;
};
```

- [ ] **Step 4: Tạo `admin-showtimes.api.ts`**
```typescript
import axiosClient from '@config/axios-instance';
import type { BaseResponse, MetaData } from '@shared/types/api.types';
import type {
  ShowtimeAdminDto,
  CreateShowtimeDto,
  UpdateShowtimeDto,
} from '../types/admin.types';

export interface GetAdminShowtimesParams {
  theaterId?: string;
  roomId?: string;
  date?: string;
  page?: number;
  pageSize?: number;
}

export const getAdminShowtimesApi = async (
  params?: GetAdminShowtimesParams,
): Promise<{ data: ShowtimeAdminDto[]; metaData?: MetaData }> => {
  const res = (await axiosClient.get('/admin/showtimes', { params })) as unknown as {
    data: ShowtimeAdminDto[];
    metaData?: MetaData;
  };
  return res;
};

export const createAdminShowtimeApi = async (body: CreateShowtimeDto): Promise<ShowtimeAdminDto> => {
  const res = await axiosClient.post<BaseResponse<ShowtimeAdminDto>>('/admin/showtimes', body);
  return (res as unknown as BaseResponse<ShowtimeAdminDto>).data;
};

export const updateAdminShowtimeApi = async (id: string, body: UpdateShowtimeDto): Promise<ShowtimeAdminDto> => {
  const res = await axiosClient.put<BaseResponse<ShowtimeAdminDto>>(`/admin/showtimes/${id}`, body);
  return (res as unknown as BaseResponse<ShowtimeAdminDto>).data;
};

export const deleteAdminShowtimeApi = async (id: string): Promise<void> => {
  await axiosClient.delete(`/admin/showtimes/${id}`);
};
```

- [ ] **Step 5: Tạo `admin-bookings.api.ts`**
```typescript
import axiosClient from '@config/axios-instance';
import type { BaseResponse, MetaData } from '@shared/types/api.types';
import type {
  BookingAdminDto,
  BookingDetailAdminDto,
} from '../types/admin.types';

export interface GetAdminBookingsParams {
  search?: string;
  status?: string;
  date?: string;
  page?: number;
  pageSize?: number;
}

export const getAdminBookingsApi = async (
  params?: GetAdminBookingsParams,
): Promise<{ data: BookingAdminDto[]; metaData?: MetaData }> => {
  const res = (await axiosClient.get('/admin/bookings', { params })) as unknown as {
    data: BookingAdminDto[];
    metaData?: MetaData;
  };
  return res;
};

export const getAdminBookingDetailApi = async (id: string): Promise<BookingDetailAdminDto> => {
  const res = await axiosClient.get<BaseResponse<BookingDetailAdminDto>>(`/admin/bookings/${id}`);
  return res as unknown as BookingDetailAdminDto;
};

export const checkInTicketApi = async (passCode: string): Promise<{ success: boolean; message: string }> => {
  const res = await axiosClient.post<BaseResponse<{ success: boolean; message: string }>>(
    '/admin/tickets/check-in',
    { passCode },
  );
  return (res as unknown as BaseResponse<{ success: boolean; message: string }>).data;
};

export const refundBookingApi = async (id: string, reason: string): Promise<void> => {
  await axiosClient.post(`/admin/bookings/${id}/refund`, { reason });
};
```

- [ ] **Step 6: Tạo `admin-concessions.api.ts`**
```typescript
import axiosClient from '@config/axios-instance';
import type { BaseResponse, MetaData } from '@shared/types/api.types';
import type {
  ConcessionDto,
  UpsertConcessionDto,
  VoucherDto,
  CreateVoucherDto,
} from '../types/admin.types';

export const getAdminConcessionsApi = async (): Promise<ConcessionDto[]> => {
  const res = await axiosClient.get<BaseResponse<ConcessionDto[]>>('/admin/concessions');
  return res as unknown as ConcessionDto[];
};

export const upsertAdminConcessionApi = async (body: UpsertConcessionDto): Promise<ConcessionDto> => {
  const res = await axiosClient.post<BaseResponse<ConcessionDto>>('/admin/concessions', body);
  return (res as unknown as BaseResponse<ConcessionDto>).data;
};

export const toggleConcessionAvailabilityApi = async (id: string, isAvailable: boolean): Promise<void> => {
  await axiosClient.patch(`/admin/concessions/${id}/availability`, { isAvailable });
};

export const getAdminVouchersApi = async (params?: {
  page?: number;
  pageSize?: number;
  status?: string;
}): Promise<{ data: VoucherDto[]; metaData?: MetaData }> => {
  const res = (await axiosClient.get('/admin/vouchers', { params })) as unknown as {
    data: VoucherDto[];
    metaData?: MetaData;
  };
  return res;
};

export const createAdminVoucherApi = async (body: CreateVoucherDto): Promise<VoucherDto> => {
  const res = await axiosClient.post<BaseResponse<VoucherDto>>('/admin/vouchers', body);
  return (res as unknown as BaseResponse<VoucherDto>).data;
};

export const deactivateAdminVoucherApi = async (id: string): Promise<void> => {
  await axiosClient.patch(`/admin/vouchers/${id}/deactivate`);
};
```

---

### Task 5: AdminLayout & Navigation
**Files:**
- Create: `src/features/admin/layouts/AdminLayout.styles.ts`
- Create: `src/features/admin/layouts/AdminSidebar.tsx`
- Create: `src/features/admin/layouts/AdminHeader.tsx`
- Create: `src/features/admin/layouts/AdminLayout.tsx`

**Interfaces:**
- Produces: `AdminLayout` bọc quanh các trang con bằng Ant Design `ConfigProvider` Dark Theme.

- [ ] **Step 1: Tạo `AdminLayout.styles.ts`**
```typescript
import styled from 'styled-components';

export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #0b0c0e;
  color: #ffffff;
`;

export const MainWrapper = styled.div<{ $collapsed: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${({ $collapsed }) => ($collapsed ? '64px' : '240px')};
  transition: margin-left 0.2s cubic-bezier(0.2, 0, 0, 1);
  min-width: 0;
`;

export const ContentArea = styled.main`
  flex: 1;
  padding: 24px;
  background-color: #0b0c0e;
  overflow-y: auto;
`;
```

- [ ] **Step 2: Tạo `AdminSidebar.tsx`**
```tsx
import type { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  LayoutDashboard,
  Film,
  Calendar,
  Building2,
  Ticket,
  ShoppingBag,
} from 'lucide-react';
import { ADMIN_PATHS } from '@shared/constants/path';

const { Sider } = Layout;

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const AdminSidebar: FC<AdminSidebarProps> = ({ collapsed, onCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: ADMIN_PATHS.DASHBOARD,
      icon: <LayoutDashboard size={18} />,
      label: 'Tổng Quan',
    },
    {
      key: ADMIN_PATHS.MOVIES,
      icon: <Film size={18} />,
      label: 'Quản Lý Phim',
    },
    {
      key: ADMIN_PATHS.SHOWTIMES,
      icon: <Calendar size={18} />,
      label: 'Suất Chiếu',
    },
    {
      key: ADMIN_PATHS.THEATERS,
      icon: <Building2 size={18} />,
      label: 'Rạp & Phòng',
    },
    {
      key: ADMIN_PATHS.BOOKINGS,
      icon: <Ticket size={18} />,
      label: 'Đơn Vé',
    },
    {
      key: ADMIN_PATHS.CONCESSIONS,
      icon: <ShoppingBag size={18} />,
      label: 'F&B & Voucher',
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={240}
      collapsedWidth={64}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: '#13151B',
        borderRight: '1px solid #252A36',
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 20px',
          borderBottom: '1px solid #252A36',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #FF535A 0%, #FFB955 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#000',
              fontSize: 16,
            }}
          >
            P
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#FFFFFF', lineHeight: 1.2 }}>
                PhimBook <span style={{ color: '#FFB955' }}>Admin</span>
              </div>
              <div style={{ fontSize: 10, color: '#A0A6B8' }}>Cinema Operations</div>
            </div>
          )}
        </div>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ background: '#13151B', borderRight: 0, marginTop: 12 }}
      />
    </Sider>
  );
};
```

- [ ] **Step 3: Tạo `AdminHeader.tsx`**
```tsx
import type { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Breadcrumb, Avatar, Dropdown } from 'antd';
import { LogOut, ExternalLink, Shield } from 'lucide-react';
import tokenManager from '@shared/utils/tokenManager';

export const AdminHeader: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userName = localStorage.getItem('user_name') || 'Quản Trị Viên';
  const userRole = localStorage.getItem('user_role') || 'ADMIN';

  const handleLogout = () => {
    tokenManager.removeAccessToken();
    tokenManager.removeRefreshToken();
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    navigate('/login');
  };

  const getBreadcrumbTitle = () => {
    switch (location.pathname) {
      case '/admin':
        return 'Tổng Quan Doanh Thu';
      case '/admin/movies':
        return 'Quản Lý Danh Sách Phim';
      case '/admin/showtimes':
        return 'Lịch Chiếu & Suất Chiếu';
      case '/admin/theaters':
        return 'Quản Lý Rạp & Phòng Chiếu';
      case '/admin/bookings':
        return 'Quản Lý Đơn Vé & Soát Vé';
      case '/admin/concessions':
        return 'Bắp Nước & Mã Giảm Giá';
      default:
        return 'Quản Trị';
    }
  };

  const userMenuItems = [
    {
      key: 'client-view',
      icon: <ExternalLink size={14} />,
      label: 'Xem Trang Khách Hàng',
      onClick: () => window.open('/', '_blank'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogOut size={14} />,
      label: 'Đăng Xuất',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header
      style={{
        height: 64,
        background: '#13151B',
        borderBottom: '1px solid #252A36',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}
    >
      <Breadcrumb
        items={[
          { title: <span style={{ color: '#A0A6B8' }}>PhimBook Console</span> },
          { title: <span style={{ color: '#FFB955', fontWeight: 600 }}>{getBreadcrumbTitle()}</span> },
        ]}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          type="button"
          onClick={() => window.open('/', '_blank')}
          style={{
            background: 'rgba(255, 185, 85, 0.1)',
            border: '1px solid rgba(255, 185, 85, 0.25)',
            color: '#FFB955',
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <ExternalLink size={13} />
          <span>Trang Đặt Vé</span>
        </button>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <Avatar style={{ background: '#FF535A', color: '#FFF', fontWeight: 700 }}>
              {userName.charAt(0).toUpperCase()}
            </Avatar>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#FFF' }}>{userName}</span>
              <span
                style={{
                  fontSize: 10,
                  color: '#FFB955',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Shield size={10} />
                {userRole}
              </span>
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};
```

- [ ] **Step 4: Tạo `AdminLayout.tsx`**
```tsx
import type { FC } from 'react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import * as S from './AdminLayout.styles';

export const AdminLayout: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#FFB955',
          colorBgContainer: '#13151B',
          colorBgLayout: '#0B0C0E',
          colorBorder: '#252A36',
          borderRadius: 8,
          colorText: '#FFFFFF',
          colorTextSecondary: '#A0A6B8',
        },
      }}
    >
      <S.LayoutContainer>
        <AdminSidebar collapsed={collapsed} onCollapse={setCollapsed} />
        <S.MainWrapper $collapsed={collapsed}>
          <AdminHeader />
          <S.ContentArea>
            <Outlet />
          </S.ContentArea>
        </S.MainWrapper>
      </S.LayoutContainer>
    </ConfigProvider>
  );
};

export default AdminLayout;
```

---

### Task 6: Admin Routing Configuration
**Files:**
- Modify: `src/config/AppRoutes.tsx`

**Interfaces:**
- Consumes: `AdminGuard`, `AdminLayout`, các component trang trong `src/features/admin/pages/*`
- Produces: Cấu hình phân hệ `/admin` hoàn chỉnh trong router.

- [ ] **Step 1: Khai báo các lazy loaders và route `/admin` trong `AppRoutes.tsx`**
Thêm khối cấu hình vào mảng routes của `createBrowserRouter`:
```tsx
import AdminGuard from '@features/admin/guards/AdminGuard';
import AdminLayout from '@features/admin/layouts/AdminLayout';

// Thêm cấu hình phân hệ Admin:
{
  path: '/admin',
  element: <AdminGuard />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        {
          index: true,
          lazy: async () => {
            const { default: Component } = await import(
              '@features/admin/pages/dashboard/AdminDashboardPage'
            );
            return { Component };
          },
        },
        {
          path: 'movies',
          lazy: async () => {
            const { default: Component } = await import(
              '@features/admin/pages/movies/AdminMoviesPage'
            );
            return { Component };
          },
        },
        {
          path: 'showtimes',
          lazy: async () => {
            const { default: Component } = await import(
              '@features/admin/pages/showtimes/AdminShowtimesPage'
            );
            return { Component };
          },
        },
        {
          path: 'theaters',
          lazy: async () => {
            const { default: Component } = await import(
              '@features/admin/pages/theaters/AdminTheatersPage'
            );
            return { Component };
          },
        },
        {
          path: 'bookings',
          lazy: async () => {
            const { default: Component } = await import(
              '@features/admin/pages/bookings/AdminBookingsPage'
            );
            return { Component };
          },
        },
        {
          path: 'concessions',
          lazy: async () => {
            const { default: Component } = await import(
              '@features/admin/pages/concessions/AdminConcessionsPage'
            );
            return { Component };
          },
        },
      ],
    },
  ],
},
```

---

### Task 7: Shared Admin Components
**Files:**
- Create: `src/features/admin/components/AdminPageHeader.tsx`
- Create: `src/features/admin/components/AdminStatCard.tsx`
- Create: `src/features/admin/components/StatusBadge.tsx`

**Interfaces:**
- Produces: Component tiêu đề, thẻ chỉ số KPI, và badge trạng thái chuẩn màu Cinema Noir.

- [ ] **Step 1: Tạo `AdminPageHeader.tsx`**
```tsx
import type { FC, ReactNode } from 'react';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const AdminPageHeader: FC<AdminPageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
      }}
    >
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: '#A0A6B8', margin: '4px 0 0 0' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
```

- [ ] **Step 2: Tạo `AdminStatCard.tsx`**
```tsx
import type { FC, ReactNode } from 'react';
import { Card } from 'antd';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  changePercent?: number;
  suffix?: string;
}

export const AdminStatCard: FC<AdminStatCardProps> = ({
  title,
  value,
  icon,
  changePercent,
  suffix,
}) => {
  const isPositive = (changePercent ?? 0) >= 0;

  return (
    <Card
      style={{
        background: '#13151B',
        borderColor: '#252A36',
        borderRadius: 10,
      }}
      bodyStyle={{ padding: 20 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: '#A0A6B8' }}>{title}</span>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'rgba(255, 185, 85, 0.1)',
            color: '#FFB955',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
      </div>

      <div style={{ fontSize: 26, fontWeight: 700, color: '#FFFFFF', marginTop: 12 }}>
        {value} {suffix && <span style={{ fontSize: 14, color: '#A0A6B8' }}>{suffix}</span>}
      </div>

      {changePercent !== undefined && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            marginTop: 8,
            color: isPositive ? '#52C41A' : '#FF535A',
          }}
        >
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{isPositive ? `+${changePercent}%` : `${changePercent}%`}</span>
          <span style={{ color: '#6B7280' }}>so với hôm qua</span>
        </div>
      )}
    </Card>
  );
};
```

- [ ] **Step 3: Tạo `StatusBadge.tsx`**
```tsx
import type { FC } from 'react';
import { Tag } from 'antd';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'NOW_SHOWING':
      return <Tag color="gold">Đang Chiếu</Tag>;
    case 'COMING_SOON':
      return <Tag color="blue">Sắp Chiếu</Tag>;
    case 'STOPPED':
      return <Tag color="default">Ngừng Chiếu</Tag>;
    case 'PAID':
    case 'VALID':
      return <Tag color="green">Đã Thanh Toán</Tag>;
    case 'PENDING_PAYMENT':
      return <Tag color="warning">Chờ Thanh Toán</Tag>;
    case 'CANCELLED':
      return <Tag color="error">Đã Hủy</Tag>;
    case 'CHECKED_IN':
      return <Tag color="purple">Đã Soát Vé</Tag>;
    case 'REFUNDED':
      return <Tag color="magenta">Đã Hoàn Tiền</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};
```

---

### Task 8: Dashboard Page & Revenue Chart
**Files:**
- Create: `src/features/admin/pages/dashboard/components/RevenueChart.tsx`
- Create: `src/features/admin/pages/dashboard/AdminDashboardPage.tsx`

**Interfaces:**
- Consumes: `getDashboardOverviewApi`, `getRevenueChartApi`, `getTopMoviesApi`, `getUpcomingShowtimesApi`
- Produces: Trang Dashboard tổng quan hiển thị 4 KPI, biểu đồ doanh thu SVG mượt mà, bảng Top 5 phim và suất chiếu sắp diễn ra.

- [ ] **Step 1: Tạo `RevenueChart.tsx`**
Vẽ biểu đồ đường kết hợp cột CSS/SVG tương thích không phụ thuộc thư viện nặng:
```tsx
import type { FC } from 'react';
import { Card } from 'antd';
import type { RevenueChartDto } from '../../../types/admin.types';

interface RevenueChartProps {
  data?: RevenueChartDto;
  loading: boolean;
}

export const RevenueChart: FC<RevenueChartProps> = ({ data, loading }) => {
  if (loading || !data || data.labels.length === 0) {
    return (
      <Card style={{ background: '#13151B', borderColor: '#252A36' }} loading={loading}>
        <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A0A6B8' }}>
          Đang tải dữ liệu biểu đồ...
        </div>
      </Card>
    );
  }

  const maxVal = Math.max(...data.totalRevenue, 1);

  return (
    <Card
      title={<span style={{ color: '#FFF' }}>Biểu Đồ Doanh Thu 7 Ngày Qua</span>}
      style={{ background: '#13151B', borderColor: '#252A36', borderRadius: 10 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', height: 220, gap: 12, paddingBottom: 20 }}>
        {data.labels.map((label, idx) => {
          const val = data.totalRevenue[idx] || 0;
          const heightPercent = Math.min(100, Math.max(10, (val / maxVal) * 100));

          return (
            <div
              key={label}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                height: '100%',
                justifyContent: 'flex-end',
              }}
            >
              <span style={{ fontSize: 10, color: '#A0A6B8' }}>{(val / 1_000_000).toFixed(1)}M</span>
              <div
                style={{
                  width: '100%',
                  height: `${heightPercent}%`,
                  background: 'linear-gradient(180deg, #FFB955 0%, rgba(255, 83, 90, 0.4) 100%)',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease',
                }}
              />
              <span style={{ fontSize: 11, color: '#A0A6B8' }}>{label}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
```

- [ ] **Step 2: Tạo `AdminDashboardPage.tsx`**
```tsx
import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Row, Col, Table, Avatar } from 'antd';
import { DollarSign, Ticket, Users, Clock } from 'lucide-react';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { AdminStatCard } from '../../components/AdminStatCard';
import { RevenueChart } from './components/RevenueChart';
import {
  getDashboardOverviewApi,
  getRevenueChartApi,
  getTopMoviesApi,
  getUpcomingShowtimesApi,
} from '../../api/admin-dashboard.api';

export const AdminDashboardPage: FC = () => {
  const { data: overview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ['admin', 'dashboard', 'overview'],
    queryFn: getDashboardOverviewApi,
  });

  const { data: chartData, isLoading: isChartLoading } = useQuery({
    queryKey: ['admin', 'dashboard', 'chart'],
    queryFn: () => getRevenueChartApi({ groupBy: 'day' }),
  });

  const { data: topMovies = [], isLoading: isTopMoviesLoading } = useQuery({
    queryKey: ['admin', 'dashboard', 'top-movies'],
    queryFn: () => getTopMoviesApi(5),
  });

  const { data: upcomingShowtimes = [], isLoading: isShowtimesLoading } = useQuery({
    queryKey: ['admin', 'dashboard', 'upcoming-showtimes'],
    queryFn: () => getUpcomingShowtimesApi(2),
  });

  const topMovieColumns = [
    {
      title: 'Phim',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: { posterUrl: string }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar shape="square" size={40} src={record.posterUrl} />
          <span style={{ fontWeight: 600, color: '#FFF' }}>{text}</span>
        </div>
      ),
    },
    {
      title: 'Số Vé',
      dataIndex: 'ticketsSold',
      key: 'ticketsSold',
      render: (val: number) => `${val.toLocaleString('vi-VN')} vé`,
    },
    {
      title: 'Doanh Thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (val: number) => (
        <span style={{ color: '#FFB955', fontWeight: 600 }}>{val.toLocaleString('vi-VN')} đ</span>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Bảng Điều Khiển Tổng Quan"
        subtitle="Thống kê doanh thu, lưu lượng vé và công suất hoạt động phòng vé PhimBook theo thời gian thực"
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <AdminStatCard
            title="Doanh Thu Hôm Nay"
            value={isOverviewLoading ? '...' : `${(overview?.todayRevenue ?? 0).toLocaleString('vi-VN')} đ`}
            icon={<DollarSign size={20} />}
            changePercent={overview?.revenueChangePercent}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AdminStatCard
            title="Số Vé Bán Hôm Nay"
            value={isOverviewLoading ? '...' : `${(overview?.todayTicketsSold ?? 0).toLocaleString('vi-VN')}`}
            icon={<Ticket size={20} />}
            changePercent={overview?.ticketsChangePercent}
            suffix="vé"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AdminStatCard
            title="Tỷ Lệ Lấp Đầy Ghế"
            value={isOverviewLoading ? '...' : `${((overview?.avgOccupancyRate ?? 0) * 100).toFixed(1)}%`}
            icon={<Users size={20} />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AdminStatCard
            title="Suất Chiếu Hôm Nay"
            value={isOverviewLoading ? '...' : `${overview?.activeShowtimesToday ?? 0}`}
            icon={<Clock size={20} />}
            suffix="suất"
          />
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <RevenueChart data={chartData} loading={isChartLoading} />
      </div>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <div
            style={{
              background: '#13151B',
              border: '1px solid #252A36',
              borderRadius: 10,
              padding: 20,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FFF', marginBottom: 16 }}>
              Top 5 Phim Doanh Thu Cao Nhất
            </h3>
            <Table
              dataSource={topMovies}
              columns={topMovieColumns}
              rowKey="movieId"
              pagination={false}
              loading={isTopMoviesLoading}
            />
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <div
            style={{
              background: '#13151B',
              border: '1px solid #252A36',
              borderRadius: 10,
              padding: 20,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FFF', marginBottom: 16 }}>
              Suất Chiếu Trong 2 Giờ Tới
            </h3>
            <Table
              dataSource={upcomingShowtimes}
              rowKey="showtimeId"
              pagination={false}
              loading={isShowtimesLoading}
              columns={[
                { title: 'Phim', dataIndex: 'movieTitle', key: 'movieTitle' },
                { title: 'Phòng', dataIndex: 'roomName', key: 'roomName' },
                { title: 'Giờ Chiếu', dataIndex: 'startTime', key: 'startTime' },
                {
                  title: 'Đã Bán',
                  key: 'occupancy',
                  render: (_, r) => `${r.ticketsSold}/${r.totalSeats} ghế (${(r.occupancyRate * 100).toFixed(0)}%)`,
                },
              ]}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboardPage;
```

---

### Task 9: Movies Management Page
**Files:**
- Create: `src/features/admin/pages/movies/components/MovieFormDrawer.tsx`
- Create: `src/features/admin/pages/movies/AdminMoviesPage.tsx`

**Interfaces:**
- Consumes: `getAdminMoviesApi`, `createAdminMovieApi`, `updateAdminMovieApi`, `patchMovieStatusApi`, `deleteAdminMovieApi`
- Produces: Màn hình quản lý phim, tìm kiếm, lọc trạng thái, form drawer thêm/sửa, chuyển đổi trạng thái chiếu tức thời.

- [ ] **Step 1: Tạo `MovieFormDrawer.tsx`**
Form nhập liệu phim đầy đủ: tên phim, thời lượng, phân loại độ tuổi (`P`, `K`, `T13`, `T16`, `T18`, `C`), poster, trailer URL, danh sách thể loại, tóm tắt.
- [ ] **Step 2: Tạo `AdminMoviesPage.tsx`**
Bảng hiển thị phim, nút thêm mới mở Drawer, nút sửa, nút xóa (với confirm modal), switch trạng thái `NOW_SHOWING` / `COMING_SOON`.

---

### Task 10: Theaters & Rooms Management Page
**Files:**
- Create: `src/features/admin/pages/theaters/components/SeatMatrixModal.tsx`
- Create: `src/features/admin/pages/theaters/components/CreateRoomModal.tsx`
- Create: `src/features/admin/pages/theaters/AdminTheatersPage.tsx`

**Interfaces:**
- Consumes: `getAdminTheatersApi`, `getRoomSeatMatrixApi`, `createAdminRoomApi`
- Produces: Quản lý cụm rạp, phòng chiếu, xem trực quan ma trận sơ đồ ghế (Seat Matrix), tạo phòng chiếu mới (cấu hình số hàng, số cột, định dạng IMAX/Standard).

- [ ] **Step 1: Tạo `SeatMatrixModal.tsx`**
Hiển thị sơ đồ ghế theo hàng A, B, C... và số ghế 1, 2, 3... tương ứng `RoomSeatMatrixDto`.
- [ ] **Step 2: Tạo `CreateRoomModal.tsx`**
Form tạo phòng: Chọn rạp, tên phòng (Screen 1...), loại màn hình (Standard, IMAX, 4DX...), số hàng ghế và số cột ghế.
- [ ] **Step 3: Tạo `AdminTheatersPage.tsx`**
Danh sách rạp và danh sách phòng theo từng rạp, kèm nút xem sơ đồ ghế và nút thêm phòng.

---

### Task 11: Showtimes Management Page
**Files:**
- Create: `src/features/admin/pages/showtimes/components/ShowtimeFormModal.tsx`
- Create: `src/features/admin/pages/showtimes/AdminShowtimesPage.tsx`

**Interfaces:**
- Consumes: `getAdminShowtimesApi`, `createAdminShowtimeApi`, `deleteAdminShowtimeApi`
- Produces: Lịch chiếu theo ngày & rạp, bộ lọc, modal tạo suất chiếu mới kèm **Conflict Validation** (tự động fetch suất chiếu của phòng và báo lỗi trùng giờ).

- [ ] **Step 1: Tạo `ShowtimeFormModal.tsx`**
Form chọn phim, rạp, phòng chiếu, ngày giờ bắt đầu, cấu hình giá vé (thường, VIP, sweetbox). Tự động tính giờ kết thúc dựa trên thời lượng phim + 15 phút dọn rạp.
- [ ] **Step 2: Tạo `AdminShowtimesPage.tsx`**
Bảng danh sách suất chiếu, bộ lọc theo ngày/rạp, nút thêm suất chiếu và nút hủy suất.

---

### Task 12: Bookings Management Page
**Files:**
- Create: `src/features/admin/pages/bookings/components/BookingDetailDrawer.tsx`
- Create: `src/features/admin/pages/bookings/components/CheckInModal.tsx`
- Create: `src/features/admin/pages/bookings/AdminBookingsPage.tsx`

**Interfaces:**
- Consumes: `getAdminBookingsApi`, `getAdminBookingDetailApi`, `checkInTicketApi`, `refundBookingApi`
- Produces: Tra cứu đơn vé theo mã vé/SĐT/Email, xem chi tiết vé & mã QR, modal soát vé (check-in) bằng passCode, và nút xử lý hoàn tiền.

- [ ] **Step 1: Tạo `CheckInModal.tsx`**
Modal nhập hoặc quét mã `passCode` để soát vé trực tiếp tại rạp qua `POST /api/v1/admin/tickets/check-in`.
- [ ] **Step 2: Tạo `BookingDetailDrawer.tsx`**
Drawer xem đầy đủ thông tin: Ghế ngồi, phòng chiếu, bắp nước, tổng tiền, mã QR và nút hoàn vé.
- [ ] **Step 3: Tạo `AdminBookingsPage.tsx`**
Bảng tra cứu đơn vé với ô tìm kiếm tức thời và bộ lọc trạng thái thanh toán.

---

### Task 13: Concessions & Voucher Management Page
**Files:**
- Create: `src/features/admin/pages/concessions/components/ConcessionFormModal.tsx`
- Create: `src/features/admin/pages/concessions/components/VoucherFormModal.tsx`
- Create: `src/features/admin/pages/concessions/AdminConcessionsPage.tsx`

**Interfaces:**
- Consumes: `getAdminConcessionsApi`, `upsertAdminConcessionApi`, `toggleConcessionAvailabilityApi`, `getAdminVouchersApi`, `createAdminVoucherApi`, `deactivateAdminVoucherApi`
- Produces: Giao diện 2 Tabs:
  - Tab 1: Quản lý Combo bắp nước F&B (tên, giá, ảnh, công tắc còn hàng).
  - Tab 2: Quản lý Mã giảm giá Voucher (% giảm hoặc số tiền, đơn tối thiểu, số lượt dùng, ngày hết hạn).

- [ ] **Step 1: Tạo `ConcessionFormModal.tsx`**
- [ ] **Step 2: Tạo `VoucherFormModal.tsx`**
- [ ] **Step 3: Tạo `AdminConcessionsPage.tsx`**

---

### Task 14: Verification & Build Check
**Files:**
- Test & Verify toàn bộ codebase

- [ ] **Step 1: Kiểm tra biên dịch TypeScript**
Chạy `npx tsc -b` đảm bảo 0 errors.
- [ ] **Step 2: Kiểm tra Linting**
Chạy `npm run lint` đảm bảo tuân thủ chuẩn code của dự án.
- [ ] **Step 3: Kiểm tra Route & Guard**
Truy cập `/admin` khi chưa đăng nhập $\rightarrow$ Điều hướng về `/login`.
Đăng nhập tài khoản Customer $\rightarrow$ Hiển thị `Forbidden403Page`.
Đăng nhập tài khoản Admin $\rightarrow$ Truy cập thành công vào `AdminDashboardPage`.

---

## Self-Review Checklist
- [x] **Spec Coverage:** Đáp ứng toàn bộ 27 endpoints Backend và toàn bộ 8 vấn đề được chỉ ra trong Review.
- [x] **No Mock/Fallback:** Loại bỏ hoàn toàn mock data, gọi trực tiếp `/api/v1/admin/*` bằng `axiosClient`.
- [x] **No Placeholders:** Mọi step đều có file path và code mẫu chi tiết, không dùng TODO hay TBD.
- [x] **Safety Rules:** Không tự ý commit hay push git trong toàn bộ kế hoạch.
