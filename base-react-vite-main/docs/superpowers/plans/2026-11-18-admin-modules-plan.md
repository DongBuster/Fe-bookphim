# PhimBook Admin Modules (FE + BE) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mở rộng hệ thống PhimBook Admin với các phân hệ còn thiếu (Quản lý Tài khoản & Phân quyền, Bảo trì ghế, Báo cáo & Đối soát, Nội dung & Kiểm duyệt, Cài đặt & Audit Log) đồng bộ cả Frontend và Backend.

**Architecture:** Frontend sử dụng React 19 + TypeScript + Vite + Ant Design v6 (`AdminBaseModal`, `AdminPageHeader`, `AdminStatCard`, `StatusBadge`, `adminUi.ts`) + TanStack Query + `axiosClient` (`baseURL: /api/v1`, tự động unwrap `data.data` cho `GET` không có `metaData`, và giữ `{ data, metaData }` cho `GET` phân trang) + `axiosFileInstance` cho luồng tải file CSV/Blob. Backend theo kiến trúc RESTful API chuẩn `/api/v1/admin/*` với JWT Auth + RBAC (`CUSTOMER`, `STAFF`, `MANAGER`, `ADMIN`), Audit Middleware ghi log thao tác nhạy cảm, và migration DB bổ sung bảng/cột tương ứng.

**Tech Stack:**
- **FE:** React 19, TypeScript, Ant Design v6, Styled-components, TanStack React Query, Lucide React, Day.js
- **BE:** REST API (`/api/v1/admin/*`), RBAC Guard (`CUSTOMER` / `STAFF` / `MANAGER` / `ADMIN`), Relational DB (Users, Roles, Seat Maintenance, Banners, Reviews, System Settings, Audit Logs)

---

## Global Constraints

- Mọi modal Admin mới **bắt buộc** dùng `AdminBaseModal` (`src/features/admin/components/AdminBaseModal.tsx`) và token trong `src/features/admin/styles/adminUi.ts`.
- Đồng bộ kiểu `UserRole` trong `src/features/admin/types/admin.types.ts`: `'CUSTOMER' | 'STAFF' | 'MANAGER' | 'ADMIN'` (dùng `'CUSTOMER'` thay vì `'USER'` để khớp với codebase hiện tại).
- Toàn bộ route Admin đi qua `AdminGuard` (`src/features/admin/guards/AdminGuard.tsx`): cần mở rộng cho phép `STAFF` truy cập `/admin/bookings` (và tự động redirect `STAFF` từ `/admin` về `/admin/bookings`), đồng thời chặn `STAFF` truy cập các route cấu hình/báo cáo bằng `RoleRouteGuard`.
- Lưu ý cơ chế interceptor trong `src/config/axios-instance.ts`:
  - `GET` có `metaData` trả về `{ data: T[], metaData: MetaData }`.
  - `GET` đơn lẻ không có `metaData` trả về trực tiếp `T` (đã unwrap `response.data.data`).
  - Export file (`CSV`/`Excel`) phải dùng `axiosFileInstance` (`src/config/axios-file-instance.ts`) với `responseType: 'blob'`, không dùng `axiosClient` mặc định.
- Mọi thao tác mutate quan trọng ở BE (khóa tài khoản, đổi role, hoàn tiền, ẩn review, sửa cấu hình giá/phí) phải ghi vào `audit_logs`.
- Không tự ý chạy migration hoặc deploy trên môi trường production nếu chưa có xác nhận.

---

## Phase 1 (Priority 1): Quản Lý Tài Khoản & Phân Quyền (`/admin/users`)

### Task 1.1: Backend — Database & API Quản Lý Tài Khoản (`/api/v1/admin/users`)

**Endpoints & Contract:**
- `GET /api/v1/admin/users` — Query: `search` (name/email/phone), `role` (`ALL | CUSTOMER | STAFF | MANAGER | ADMIN`), `status` (`ALL | ACTIVE | LOCKED`), `tier` (`STANDARD | SILVER | GOLD | PLATINUM`), `page`, `pageSize` -> `{ success: true, data: UserAdminDto[], metaData: MetaData }`
- `GET /api/v1/admin/users/:id` -> Chi tiết user + thống kê tổng đơn vé, tổng chi tiêu, 10 đơn vé gần nhất.
- `POST /api/v1/admin/users` -> Tạo tài khoản nhân viên (`STAFF` / `MANAGER` / `ADMIN`), gán `assignedTheaterId` (nếu là `MANAGER` / `STAFF`).
- `PATCH /api/v1/admin/users/:id/role` -> Body: `{ role, assignedTheaterId? }` (chỉ `ADMIN` được phép đổi role; không cho tự hạ quyền chính mình).
- `PATCH /api/v1/admin/users/:id/status` -> Body: `{ status: 'ACTIVE' | 'LOCKED', reason?: string }` (khi `LOCKED`, revoke refresh token hiện tại).

**Database Schema Changes:**
- Bảng `users`: đảm bảo có các cột `role` (`CUSTOMER | STAFF | MANAGER | ADMIN`), `status` (`ACTIVE | LOCKED`), `locked_reason`, `locked_at`, `assigned_theater_id` (nullable FK -> `theaters.id`), `loyalty_points`, `membership_tier`.

**Checklist:**
- [ ] Tạo migration bổ sung cột `status`, `locked_reason`, `locked_at`, `assigned_theater_id` cho `users` (nếu chưa có).
- [ ] Viết `AdminUsersController` & `AdminUsersService` với RBAC guard (`ADMIN` toàn quyền; `MANAGER` chỉ xem khách hàng & nhân viên thuộc cụm rạp mình).
- [ ] Validate không cho phép khóa/hạ quyền chính tài khoản đang đăng nhập hoặc xóa `ADMIN` cuối cùng.
- [ ] Viết integration tests cho list/filter, tạo staff, đổi role, khóa/mở khóa + revoke token.

---

### Task 1.2: Frontend — Trang Quản Lý Tài Khoản (`/admin/users`)

**Files:**
- Modify: `src/shared/constants/path.ts` (thêm `USERS: '/admin/users'`)
- Modify: `src/config/AppRoutes.tsx` (thêm route `/admin/users` -> `AdminUsersPage`)
- Modify: `src/features/admin/guards/AdminGuard.tsx` (hỗ trợ `STAFF` + phân quyền route theo role)
- Modify: `src/features/admin/layouts/AdminSidebar.tsx` (thêm menu `Tài Khoản & Quyền` với icon `Users`)
- Modify: `src/features/admin/layouts/AdminHeader.tsx` (thêm breadcrumb title cho `/admin/users`)
- Modify: `src/features/admin/components/StatusBadge.tsx` (thêm trạng thái `ACTIVE`, `LOCKED`, `MAINTENANCE`, `VISIBLE`, `HIDDEN`)
- Modify: `src/features/admin/types/admin.types.ts` (cập nhật `UserRole`, thêm `UserAdminDto`, `UserDetailAdminDto`, `CreateStaffRequestDto`)
- Create: `src/features/admin/api/admin-users.api.ts`
- Create: `src/features/admin/pages/users/AdminUsersPage.tsx`
- Create: `src/features/admin/pages/users/components/UserDetailDrawer.tsx`
- Create: `src/features/admin/pages/users/components/StaffFormModal.tsx` (dùng `AdminBaseModal`)

**Checklist:**
- [ ] Thêm `USERS` path, route lazy-load, sidebar item và breadcrumb.
- [ ] Tạo `admin-users.api.ts` với `getAdminUsersApi`, `getAdminUserDetailApi`, `createAdminStaffApi`, `updateUserRoleApi`, `toggleUserStatusApi`.
- [ ] Dựng `AdminUsersPage.tsx`:
  - Thanh lọc: Search (tên/email/SĐT), Select Role, Select Trạng thái, nút **Đặt Lại** (`admin-btn-primary`), nút **Thêm Nhân Viên** (`admin-btn-primary`).
  - Bảng danh sách: Avatar + Họ tên, Email/SĐT, Role Tag (màu phân biệt), Hạng thành viên & Điểm, Trạng thái (`ACTIVE` / `LOCKED`), Thao tác (Chi tiết, Đổi quyền, Khóa/Mở khóa).
- [ ] Dựng `UserDetailDrawer.tsx` (xem thông tin, cụm rạp phụ trách, lịch sử đặt vé gần đây).
- [ ] Dựng `StaffFormModal.tsx` bằng `AdminBaseModal` để tạo tài khoản nhân viên / gán rạp.
- [ ] Chạy `npm run build` kiểm tra TypeScript & bundle.

---

## Phase 2 (Priority 1): Nâng Cấp Quản Lý Ghế & Rạp (Mở Rộng `/admin/theaters`)

### Task 2.1: Backend — API Bảo Trì Ghế

**Endpoints:**
- `PATCH /api/admin/rooms/:roomId/seats/status` -> Body: `{ seatIds: string[], status: 'ACTIVE' | 'MAINTENANCE', reason?: string }`
- Cập nhật logic lấy sơ đồ ghế khi đặt vé (`GET /api/showtimes/:id/seats`): ghế có `status = 'MAINTENANCE'` không cho phép user chọn/giữ chỗ.

**Checklist:**
- [ ] Bổ sung cột `status` (`ACTIVE | MAINTENANCE`), `maintenance_note` vào bảng `seats`.
- [ ] Viết endpoint cập nhật trạng thái ghế hàng loạt & kiểm tra không cho bảo trì ghế đang có vé đã thanh toán cho suất chiếu chưa diễn ra (hoặc trả warning).

### Task 2.2: Frontend — Tương Tác Bảo Trì Trên `SeatMatrixModal`

**Files:**
- Modify: `src/features/admin/types/admin.types.ts` (thêm `status?: 'ACTIVE' | 'MAINTENANCE'` và `maintenanceNote?: string` vào `RoomSeatMatrixDto['seats'][number]`)
- Modify: `src/features/admin/api/admin-theaters.api.ts` (thêm `updateRoomSeatsStatusApi`)
- Modify: `src/features/admin/pages/theaters/components/SeatMatrixModal.tsx`

**Checklist:**
- [ ] Cho phép click chọn nhiều ghế trên sơ đồ trong `SeatMatrixModal` để chuyển đổi `Hoạt động` <-> `Bảo trì` (kèm chú thích màu sắc rõ ràng trên legend).

---

## Phase 3 (Priority 2): Báo Cáo & Đối Soát Doanh Thu (`/admin/reports`)

### Task 3.1: Backend — API Báo Cáo & Export

**Endpoints:**
- `GET /api/admin/reports/revenue` — Query: `fromDate`, `toDate`, `theaterId?`, `groupBy` (`day | week | month`) -> doanh thu vé, doanh thu F&B, số tiền hoàn, tổng thực thu.
- `GET /api/admin/reports/payment-methods` — Thống kê theo cổng thanh toán (VNPay, MoMo, ZaloPay, Tại quầy).
- `GET /api/admin/reports/export` — Trả về CSV/Excel stream (`Content-Disposition: attachment`).

**Checklist:**
- [ ] Viết aggregation query tối ưu theo index `created_at`, `theater_id`, `status` trên bảng `bookings` & `payments`.
- [ ] Viết endpoint export CSV hỗ trợ UTF-8 BOM để mở đúng tiếng Việt trên Excel.

### Task 3.2: Frontend — Trang Báo Cáo (`/admin/reports`)

**Files:**
- Modify: `src/shared/constants/path.ts`, `src/config/AppRoutes.tsx`, `src/features/admin/layouts/AdminSidebar.tsx`, `src/features/admin/layouts/AdminHeader.tsx`
- Modify: `src/features/admin/types/admin.types.ts` (thêm `RevenueReportDto`, `PaymentMethodReportDto`)
- Create: `src/features/admin/api/admin-reports.api.ts` (dùng `axiosFileInstance` với `responseType: 'blob'` cho API export CSV)
- Create: `src/features/admin/pages/reports/AdminReportsPage.tsx`

**Checklist:**
- [ ] Filter bar: `RangePicker` (Khoảng ngày), Select Cụm rạp, Select Nhóm theo ngày/tuần/tháng, nút **Xuất Excel/CSV** (`admin-btn-primary`).
- [ ] 4 thẻ `AdminStatCard` đồng bộ chiều cao (Tổng doanh thu, Doanh thu vé, Doanh thu F&B, Tổng hoàn tiền).
- [ ] Bảng đối soát theo cụm rạp & phương thức thanh toán.

---

## Phase 4 (Priority 3): Nội Dung & Kiểm Duyệt (`/admin/content`) + Cài Đặt & Audit Log (`/admin/settings`)

### Task 4.1: Backend — Banner, Review Moderation, System Settings & Audit Log

**Database & Endpoints:**
- **Banners** (`banners` table): `GET/POST/PUT/DELETE /api/admin/banners`, `PATCH /api/admin/banners/:id/toggle` (thứ tự hiển thị, link phim/ưu đãi, lịch chạy).
- **Reviews** (`movie_reviews` table): `GET /api/admin/reviews?status=ALL|VISIBLE|HIDDEN`, `PATCH /api/admin/reviews/:id/visibility` (ẩn/hiện đánh giá vi phạm).
- **System Settings** (`system_settings` table): `GET/PUT /api/admin/settings` (thời gian giữ ghế mặc định, % phụ thu cuối tuần/IMAX, thời gian cho phép hủy/hoàn vé trước giờ chiếu).
- **Audit Logs** (`audit_logs` table): `GET /api/admin/audit-logs` (lọc theo `actorId`, `action`, `resourceType`, `fromDate`, `toDate`).

**Checklist:**
- [ ] Tạo migration cho `banners`, `system_settings`, `audit_logs` và cột `is_hidden` trên `movie_reviews`.
- [ ] Tạo `AuditLogInterceptor` / Middleware tự động ghi lại `actor_id`, `action`, `target_id`, `payload_diff`, `ip_address`, `created_at`.

### Task 4.2: Frontend — Trang Nội Dung (`/admin/content`) & Hệ Thống (`/admin/settings`)

**Files:**
- Create: `src/features/admin/api/admin-content.api.ts`, `src/features/admin/api/admin-settings.api.ts`
- Create: `src/features/admin/pages/content/AdminContentPage.tsx` (Tabs: Banner Trang Chủ | Kiểm Duyệt Đánh Giá)
- Create: `src/features/admin/pages/content/components/BannerFormModal.tsx` (dùng `AdminBaseModal`)
- Create: `src/features/admin/pages/settings/AdminSettingsPage.tsx` (Tabs: Cấu Hình Hệ Thống | Nhật Ký Thao Tác)

**Checklist:**
- [ ] Hoàn thiện UI 2 trang theo chuẩn `AdminBaseModal` + `AdminPageHeader` + `adminUi.ts`.
- [ ] Cập nhật `AdminGuard.tsx` và `AdminSidebar.tsx` để ẩn/hiện menu theo role (`STAFF` chỉ thấy Đơn Vé & Soát Vé; `MANAGER` thấy vận hành rạp; `ADMIN` thấy toàn bộ kể cả Tài Khoản & Cài Đặt).
- [ ] Chạy `npm run build` và test end-to-end từng luồng.

---

## Phase 5: Chiến Lược Kiểm Thử Toàn Diện (Unit Test + Browser Test)

### Task 5.1: Unit Test — Backend (Service / Guard / Validator)

**Mục tiêu:** Đảm bảo logic nghiệp vụ cốt lõi, phân quyền RBAC và validate dữ liệu hoạt động chính xác độc lập với DB/HTTP.

**Test Cases theo từng module:**
- **Users & RBAC (`AdminUsersService`, `RolesGuard`):**
  - Không cho phép `ADMIN` tự khóa hoặc tự hạ quyền chính mình.
  - Không cho phép hạ quyền/khóa tài khoản `ADMIN` cuối cùng trong hệ thống.
  - `MANAGER` chỉ được query/quản lý nhân viên thuộc `assignedTheaterId` của mình; truy cập rạp khác trả `403 Forbidden`.
  - Khi chuyển trạng thái sang `LOCKED`, refresh token bị revoke.
- **Seat Maintenance (`AdminSeatsService`):**
  - Chặn đặt ghế có `status = 'MAINTENANCE'`.
  - Cảnh báo/chặn bảo trì ghế đã có vé `PAID` cho suất chiếu sắp diễn ra.
- **Reports (`AdminReportsService`):**
  - Tính đúng `netRevenue = ticketRevenue + concessionRevenue - refundedAmount`.
  - Xuất CSV có UTF-8 BOM (`\uFEFF`) để hiển thị đúng tiếng Việt.
- **Settings & Audit (`AdminSettingsService`, `AuditLogInterceptor`):**
  - Validate giá trị cấu hình (ví dụ: thời gian giữ ghế > 0, % phụ thu >= 0).
  - Tự động ghi log khi gọi các mutation nhạy cảm.

**Checklist:**
- [ ] Cài/chạy test runner của BE (`jest` / `vitest` / `xunit` tùy stack BE) với mock repository.
- [ ] Đạt pass 100% cho toàn bộ test cases RBAC và edge cases.

---

### Task 5.2: Unit Test — Frontend (Vitest + React Testing Library)

**Setup (nếu project chưa cài):**
- Cài devDependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`.
- Cấu hình `vitest.config.ts` (hoặc mục `test` trong `vite.config.ts`) với `environment: 'jsdom'`.

**Test Cases:**
- **`AdminBaseModal` (`src/features/admin/components/__tests__/AdminBaseModal.test.tsx`):**
  - Render đúng `title`, `children`, nút primary (`admin-btn-primary`) và nút hủy (`admin-btn-danger`).
  - Gọi đúng `onOk` / `onCancel` khi click.
- **`AdminStatCard` (`src/features/admin/components/__tests__/AdminStatCard.test.tsx`):**
  - Render đúng giá trị, `suffix`, phần trăm tăng/giảm (`+` xanh, `-` đỏ), và vẫn giữ cấu trúc footer khi `changePercent` là `undefined`.
- **`AdminGuard` (`src/features/admin/guards/__tests__/AdminGuard.test.tsx`):**
  - Chưa có token -> redirect `/login`.
  - Role `CUSTOMER` -> hiển thị `Forbidden403Page`.
  - Role `STAFF` vào `/admin` -> redirect `/admin/bookings`; vào `/admin/users` -> `Forbidden403Page`.
  - Role `ADMIN` / `MANAGER` -> render `<Outlet />`.
- **Pages & Forms (`AdminUsersPage`, `StaffFormModal`, `AdminReportsPage`):**
  - Mock API bằng `vi.mock(...)`: kiểm tra filter theo search/role/status gọi lại query với đúng params; nút **Đặt Lại** reset state về mặc định.
  - Submit `StaffFormModal` khi thiếu trường required -> hiển thị lỗi validation và không gọi API.

**Checklist:**
- [ ] Cấu hình Vitest + React Testing Library trong repo FE.
- [ ] Viết unit test cho `AdminBaseModal`, `AdminStatCard`, `AdminGuard`, `StaffFormModal`, `AdminUsersPage`.
- [ ] Chạy `npx vitest run` và đảm bảo toàn bộ test pass.

---

### Task 5.3: Kiểm Thử Bằng Trình Duyệt (Browser E2E & Visual Verification)

**Mục tiêu:** Xác minh trực quan UI/UX (độ tương phản dark mode, layout, responsive, không bị 2 background bọc nhau, không lệch icon/text) và luồng tương tác thực tế trên trình duyệt.

**Kịch bản kiểm thử trên trình duyệt (chạy `npm run dev` trên `http://localhost:5173`):**
1. **Kiểm tra Guard & Điều hướng:**
   - Truy cập `/admin` khi chưa login -> chuyển hướng `/login`.
   - Login với tài khoản `ADMIN` -> vào `/admin`, kiểm tra Sidebar hiển thị đầy đủ các mục (Tổng Quan, Phim, Suất Chiếu, Rạp & Phòng, Đơn Vé, F&B & Voucher, Tài Khoản & Quyền, Báo Cáo, Nội Dung, Cài Đặt).
2. **Kiểm tra UI Dashboard & KPI Cards (`/admin`):**
   - Xác nhận 4 thẻ `AdminStatCard` có chiều cao bằng nhau tuyệt đối trên desktop (`1440px`) và tablet (`768px`).
3. **Kiểm tra Form Drawer & Select (`/admin/movies`):**
   - Mở Drawer **Thêm Phim Mới** / **Chỉnh Sửa**: kiểm tra label nổi bật, dấu `*` đỏ trên trường bắt buộc, nền & viền `Select` đồng nhất với `Input`, tag multi-select (`2D ×`, `Hoạt Hình ×`) thẳng hàng với icon `×`, nút **Hủy** màu đỏ, nút **Lưu/Thêm** màu vàng.
4. **Kiểm tra `AdminBaseModal` (`/admin/theaters`, `/admin/showtimes`, `/admin/concessions`, `/admin/users`):**
   - Mở các modal (**Thêm Phòng Chiếu Mới**, **Thêm Suất Chiếu Mới**, **Thêm Món F&B**, **Thêm Nhân Viên**): xác nhận chỉ có **1 lớp nền `#161922`** đồng nhất giữa header/body/footer, 2 nút footer bằng chiều cao nhau.
5. **Kiểm tra Luồng Nghiệp Vụ Mới:**
   - **Tài khoản (`/admin/users`):** Tìm kiếm, lọc theo role, bấm **Đặt Lại** (nút vàng), mở `UserDetailDrawer`, tạo nhân viên mới qua `StaffFormModal`, khóa/mở khóa tài khoản và reload trang kiểm tra dữ liệu cập nhật.
   - **Bảo trì ghế (`/admin/theaters`):** Mở `SeatMatrixModal`, chọn ghế chuyển sang trạng thái Bảo trì và kiểm tra hiển thị trên màn đặt vé user.
   - **Báo cáo (`/admin/reports`):** Chọn khoảng ngày, bấm **Xuất CSV** kiểm tra file tải về không lỗi font tiếng Việt.
   - **Console & Network:** Đảm bảo không có React warning, CSS layout vỡ hoặc uncaught 4xx/5xx error trong DevTools Console.

**Checklist:**
- [ ] Chạy kiểm thử trình duyệt (dùng `browser` subagent hoặc Playwright E2E suite).
- [ ] Chụp screenshot xác nhận UI các màn hình chính (Dashboard, Movies Drawer, Modal, Users) không còn lỗi layout/contrast.

