# Kế Hoạch Triển Khai 6 Thành Phần Lucian UX/UI Cinema Noir Cho PHIMBOOK

> **Dành cho Agentic Workers:** SUB-SKILL YÊU CẦU: Sử dụng `superpowers:subagent-driven-development` hoặc `superpowers:executing-plans` để triển khai kế hoạch từng task. Các bước dùng cú pháp checkbox (`- [ ]`) để theo dõi tiến độ.

**Goal:** Chuyển hóa và tích hợp 6 thành phần vi mô & chuyển động cao cấp từ thư viện Lucian UX/UI Prompt (#228, #212, #218, #106/#278, #386, #320) vào hệ sinh thái giao diện PHIMBOOK theo phong cách Cinema Noir Dark Luxury, đảm bảo đạt chuẩn 60–120 FPS không gây reflow.

**Architecture:** Áp dụng mô hình 4 lớp chuyển hóa: (1) Thay thế bảng màu sang Cinema Noir Palette (`--primary: #FF535A`, `--secondary: #FFB955`, Obsidian Black), (2) Đóng gói thành React 19 + TypeScript + Styled-Components có memory cleanup đầy đủ, (3) Tích hợp GSAP GPU Compositing & cached bounding box, (4) Nhúng metadata rạp chiếu phim chuyên biệt.

**Tech Stack:** React 19, TypeScript, Vite, Styled-Components, GSAP 3, Lucian UX/UI Prompt CLI, HTML5 Canvas/CSS Mask.

## Global Constraints & Safety Rules
- **QUY TẮC AN TOÀN TUYỆT ĐỐI (`RULE[user_global]`):** CẤM tự ý chạy `git commit`, `git push`, hoặc migrate database. Mọi hành động chỉnh sửa chỉ diễn ra trên local workspace.
- **Hiệu năng:** Không gây layout thrashing (cấm gọi `getBoundingClientRect()` trực tiếp trong `pointermove`/`scroll` mà không cache hoặc throttle).
- **Trợ năng:** Tôn trọng `prefers-reduced-motion` và vô hiệu hóa các hiệu ứng hover chuột trên thiết bị cảm ứng di động (`e.pointerType === 'mouse'`).
- **Bản quyền:** Giữ dòng chú thích bản quyền MIT một dòng ở đầu mỗi component chuyển hóa từ Lucian UX/UI.

---

### Task 1: Tạo Hook Tái Sử Dụng `useSpotlightBorder` & Thiết Lập Token Mapping (#228)

**Mục tiêu:** Tạo hook dùng chung giúp tính toán toạ độ luồng sáng viền `--cursor-x`, `--cursor-y` theo con trỏ chuột mà không gây React re-render.

**Files:**
- Tạo: `src/shared/animations/useSpotlightBorder.ts`
- Sửa: `src/shared/animations/index.ts`

**Các bước thực hiện:**
- [ ] Bước 1: Viết hook `useSpotlightBorder<T>` nhận vào `ref`, các tùy chọn kích thước đốm sáng (`radius = 200px`) và màu sắc (`primaryGlow`, `secondaryGlow`).
- [ ] Bước 2: Trong hook, gắn listener `pointerenter`, `pointermove`, `pointerleave`. Caching `getBoundingClientRect()` trên `pointerenter`, cập nhật `--cx`, `--cy`, `--o` trực tiếp vào inline CSS variables.
- [ ] Bước 3: Thêm passive scroll listener để tự động reset `cachedRect = null` khi trang cuộn.
- [ ] Bước 4: Thêm guard `if (e.pointerType !== 'mouse') return;` để bảo vệ thiết bị di động.
- [ ] Bước 5: Export hook từ `src/shared/animations/index.ts`.
- [ ] Bước 6: Kiểm tra TypeScript: chạy `npx tsc --noEmit` xác nhận 0 lỗi.

---

### Task 2: Nâng Cấp Thẻ Phim `NowShowing` với Viền Sáng Spotlight Đỏ-Vàng (#228)

**Mục tiêu:** Tích hợp hiệu ứng Lucian #228 vào poster phim đang chiếu, kết hợp hài hòa với hiệu ứng 3D Gyroscope Tilt đã có.

**Files:**
- Sửa: `src/features/home/components/NowShowing/NowShowing.styles.ts`
- Sửa: `src/features/home/components/NowShowing/NowShowing.tsx`

**Các bước thực hiện:**
- [ ] Bước 1: Thêm lớp viền ngoài `MovieCardBorder` trong `NowShowing.styles.ts` sử dụng `radial-gradient` theo `--cx`, `--cy`, `--o` với dải màu Cinema Noir (`rgba(255, 83, 90, 0.9)` pha `rgba(255, 185, 85, 0.5)`).
- [ ] Bước 2: Cập nhật hàm `handleCardPointerMove` trong `NowShowing.tsx` để đồng bộ cập nhật toạ độ `--cx`, `--cy` cho viền sáng mà không làm gián đoạn `quickTo` của 3D tilt.
- [ ] Bước 3: Kiểm tra hiển thị: Khi di chuột qua các thẻ phim, viền sáng mềm mại lướt theo mép thẻ, lan nhẹ sang các thẻ lân cận.
- [ ] Bước 4: Kiểm tra build: `npm run build`.

---

### Task 3: Triển Khai Header Tự Ẩn / Trượt Hiện Thông Minh (#212)

**Mục tiêu:** Nâng cấp Navigation Header (`OuterHeader`) tự động trượt lên ẩn khi cuộn xuống để mở rộng không gian rạp phim, và trượt xuống hiện ngay khi cuộn ngược lên.

**Files:**
- Sửa: `src/layouts/header/Header.styles.ts`
- Sửa: `src/layouts/header/Header.tsx`

**Các bước thực hiện:**
- [ ] Bước 1: Bổ sung prop `$isVisible: boolean` và `$isScrolled: boolean` trong `Header.styles.ts` với transition `transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)`.
- [ ] Bước 2: Trong `Header.tsx`, tạo logic theo dõi hướng cuộn (`deltaY = currentScrollY - lastScrollY`):
  - Khi `scrollY < 60px`: Header luôn hiển thị (trong suốt hoặc kính mờ).
  - Khi cuộn xuống (`deltaY > 8px` và `scrollY > 120px`): Header trượt lên ẩn (`transform: translateY(-100%)`).
  - Khi cuộn ngược lên (`deltaY < -6px`): Header lập tức trượt xuống (`transform: translateY(0)`).
- [ ] Bước 3: Đảm bảo khi dropdown menu / giỏ vé / search đang mở thì header không được tự ẩn.
- [ ] Bước 4: Kiểm tra trực quan bằng script kiểm thử trên trình duyệt.

---

### Task 4: Chế Độ Mini-Player Docking Góc Màn Hình Khi Xem Trailer (#218)

**Mục tiêu:** Khi người dùng mở Trailer phim ở trang chủ hoặc trang chi tiết và cuộn trang xuống để xem lịch chiếu, trailer tự động thu nhỏ về góc dưới bên phải dạng Picture-in-Picture.

**Files:**
- Tạo: `src/shared/components/media/DockingMiniPlayer/DockingMiniPlayer.tsx`
- Tạo: `src/shared/components/media/DockingMiniPlayer/DockingMiniPlayer.styles.ts`
- Sửa: `src/features/movie-details/components/TrailerModal/TrailerModal.tsx`

**Các bước thực hiện:**
- [ ] Bước 1: Xây dựng component `DockingMiniPlayer` với khung video 16:9 nhỏ gọn (320×180px), viền sáng coral mờ, nút phóng to (expand to modal), nút tắt (close), và nút play/pause.
- [ ] Bước 2: Trong `TrailerModal.tsx`, thêm trạng thái `$isDocked`:
  - Khi modal trailer đang bật, nếu `window.scrollY > 350px`, chuyển chế độ sang `DockingMiniPlayer`.
  - Khi cuộn ngược lên đầu trang, tự động bung lại toàn màn hình hoặc giữ trạng thái theo người dùng.
- [ ] Bước 3: Bổ sung nút "Thu nhỏ góc màn hình" chủ động trên thanh điều khiển của Trailer.
- [ ] Bước 4: Kiểm tra âm thanh và video tiếp tục chạy mượt mà không bị reload lại iframe khi chuyển đổi chế độ.

---

### Task 5: Nâng Cấp Sơ Đồ Chọn Ghế & Tính Tiền Real-Time (#106 & #278)

**Mục tiêu:** Thêm micro-interactions đẳng cấp cho ghế xem phim: tooltip góc nhìn màn hình preview, hiệu ứng viền sáng khi hover ghế VIP/Đôi và nhịp đếm tiền vé thời gian thực.

**Files:**
- Sửa: `src/features/seat-selection/components/SeatMap/SeatMap.styles.ts`
- Sửa: `src/features/seat-selection/components/SeatMap/SeatMap.tsx`
- Sửa: `src/features/seat-selection/components/BookingSummary/BookingSummary.tsx`

**Các bước thực hiện:**
- [ ] Bước 1: Tạo tooltip nhỏ xuất hiện tức thì khi hover vào từng ghế: hiển thị mã ghế (ví dụ: `H12 - VIP Gold`), giá tiền, và độ lệch góc nhìn tới màn hình IMAX (ví dụ: "Góc nhìn trung tâm 98%").
- [ ] Bước 2: Ghế VIP và ghế Couple có luồng sáng viền vàng kim hổ phách nhấp nháy nhẹ khi rê chuột.
- [ ] Bước 3: Tích hợp hiệu ứng đếm số (Count-up) tại thanh tổng tiền vé: khi bấm chọn thêm 1 ghế, giá tiền nhảy số mượt mà từ 0ms lên tổng mới thay vì đổi số giật cục.
- [ ] Bước 4: Kiểm thử luồng chọn ghế trên desktop và mobile.

---

### Task 6: Huy Hiệu Điện Ảnh Kim Loại 3D Có Thanh Tiến Độ Mở Khóa (#386)

**Mục tiêu:** Nâng cấp trang Cinephile Passport (`/profile/passport`) với các huy hiệu thành tích dạng huân chương kim loại ánh kim, có thanh tiến trình và hiệu ứng xoay lật 3D khi mở khóa.

**Files:**
- Tạo: `src/features/passport/components/CinephileBadgeCard/CinephileBadgeCard.tsx`
- Tạo: `src/features/passport/components/CinephileBadgeCard/CinephileBadgeCard.styles.ts`
- Sửa: `src/features/passport/PassportPage.tsx`

**Các bước thực hiện:**
- [ ] Bước 1: Port cấu trúc từ Lucian #386: huy hiệu đã khóa hiển thị màu xám kim loại nhám kèm icon ổ khóa và thanh tiến độ (ví dụ: `Đã xem 3/5 phim IMAX`).
- [ ] Bước 2: Huy hiệu đã mở khóa sở hữu hiệu ứng ánh kim quét chéo (metallic shimmer sheen) với viền vàng vương giả, hỗ trợ xoay lật 3D xem mặt sau (ghi ngày mở khóa và đặc quyền VIP).
- [ ] Bước 3: Tích hợp nút tương tác mô phỏng mở khóa huy hiệu mới với âm thanh/hiệu ứng hạt ánh sáng bung tỏa.
- [ ] Bước 4: Kiểm tra build TypeScript và layout grid trên trang Passport.

---

### Task 7: Vé Cào May Mắn Suất Chiếu Bí Ẩn (#320)

**Mục tiêu:** Tạo tương tác cào vé tráng bạc (Scratch-off Ticket) cho tính năng Mystery Night hoặc tặng quà voucher tại trang chủ.

**Files:**
- Tạo: `src/shared/components/interactive/ScratchTicketModal/ScratchTicketModal.tsx`
- Tạo: `src/shared/components/interactive/ScratchTicketModal/ScratchTicketModal.styles.ts`
- Sửa: `src/features/home/components/HeroSpotlight/HeroSpotlight.tsx` hoặc banner Mystery Night

**Các bước thực hiện:**
- [ ] Bước 1: Xây dựng canvas cào vé HTML5 với lớp phủ màu xám bạc ánh kim hologram có in hoa văn PHIMBOOK.
- [ ] Bước 2: Xử lý sự kiện kéo chuột/chạm ngón tay để xóa lớp phủ bạc (sử dụng `ctx.globalCompositeOperation = 'destination-out'`).
- [ ] Bước 3: Khi diện tích cào đạt trên 55%, tự động kích hoạt hiệu ứng tan biến lớp bạc còn lại và phát hiệu ứng pháo hoa Cinema Noir, làm lộ mã giảm giá hoặc tên suất chiếu bí ẩn.
- [ ] Bước 4: Lưu trạng thái đã cào vào local storage/state để tránh gian lận.

---

### Task 8: Kiểm Thử Toàn Diện, Đo Đạc FPS & Nghiệm Thu Sản Phẩm

**Mục tiêu:** Đảm bảo toàn bộ 6 thành phần hoạt động trơn tru, không gây suy giảm hiệu năng.

**Các bước thực hiện:**
- [ ] Bước 1: Chạy `npm run build` toàn diện, đảm bảo 0 lỗi TypeScript, 0 lỗi cảnh báo bundle.
- [ ] Bước 2: Khởi động preview server `npm run preview -- --port 4173`.
- [ ] Bước 3: Kiểm tra tự động bằng Chrome DevTools Protocol:
  - Đo tốc độ FPS khi cuộn trang với Smart Auto-hide Header (#212) và Mini-player (#218).
  - Kiểm tra không xảy ra hiện tượng rò rỉ bộ nhớ (Memory Leak) khi đóng mở trailer và cào vé.
- [ ] Bước 4: Chụp ảnh màn hình các thành phần đã hoàn thiện và báo cáo kết quả.
