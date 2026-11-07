# Kế Hoạch Triển Khai 5 Hiệu Ứng Animation WOW (Cinema Noir Motion)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nâng cấp toàn diện trải nghiệm thị giác trang chủ PHIMBOOK với 5 hiệu ứng animation đẳng cấp điện ảnh (Cinema Noir WOW), đạt chuẩn 60FPS mượt mà trên nền GSAP 3 + React 19 + styled-components.

**Architecture:** Xây dựng các hook và utility chuyển động GPU-accelerated độc lập tại `src/shared/animations/`, sau đó gắn kết hài hòa vào các component trang chủ (`Home.tsx`, `HeroSpotlight`, `SlideItem`, `SlideCta`, `NowShowing`, `LuxuryCinemas`). Đảm bảo 100% tuân thủ `prefers-reduced-motion` và tự động giải phóng bộ nhớ (`useGSAP` cleanup/revert).

**Tech Stack:** React 19, TypeScript, GSAP 3, @gsap/react, ScrollTrigger, styled-components.

---

## Danh Sách 5 Hiệu Ứng WOW

1. **WOW #1 — Cinematic Letterbox Curtain Opening (Mở Màn Rạp Chiếu Phim)**
2. **WOW #2 — Cinematic Word-by-Word Masked Reveal (Tựa Phim Từng Từ Đậm Chất Trailer)**
3. **WOW #3 — Magnetic Button Physics (Nút Hút Nam Châm Đa Chiều Cho CTAs)**
4. **WOW #4 — Interactive 3D Gyroscope Card Tilt & Rating Score Count-Up**
5. **WOW #5 — Horizontal Cinema Reel Scroll & Parallax Depth Layering**

---

## Task Decomposition

### Task 1: Xây dựng Core Animation Hooks & Utilities
**Files:**
- Create: `src/shared/animations/useMagneticEffect.ts`
- Create: `src/shared/animations/textReveal.ts`
- Modify: `src/shared/animations/gsap.ts`

**Mô tả:**
- Tạo hook `useMagneticEffect(ref, { strength, ease })` sử dụng `gsap.quickTo` để điều khiển tọa độ nút hút theo con trỏ chuột và nảy về vị trí ban đầu bằng `elastic.out`.
- Tạo hàm tiện ích `splitWords(text)` tách tựa đề thành các thẻ span có class `word-mask` và `word-inner` với `overflow: hidden; display: inline-block`.
- Xuất các helper đếm số `animateNumberCounter(element, target, duration)` cho điểm đánh giá.

- [ ] **Step 1:** Viết file `src/shared/animations/useMagneticEffect.ts`
- [ ] **Step 2:** Viết file `src/shared/animations/textReveal.ts`
- [ ] **Step 3:** Kiểm tra export và types trong `src/shared/animations/gsap.ts`

---

### Task 2: WOW #1 — Cinematic Letterbox Curtain Opening
**Files:**
- Create: `src/shared/animations/components/CinematicLetterbox/CinematicLetterbox.tsx`
- Create: `src/shared/animations/components/CinematicLetterbox/CinematicLetterbox.styles.ts`
- Modify: `src/features/home/Home.tsx`

**Mô tả:**
- Khi trang chủ mount lần đầu trong phiên: 2 thanh rèm đen trên và dưới (`topBar`, `bottomBar`, mỗi thanh 50vh) giữ 0.25s tạo kịch tính, sau đó trượt tách đôi theo chiều dọc (`yPercent: -100` và `100`), logo PHIMBOOK và hiệu ứng ánh sáng Lens Flare vàng phát sáng rồi tan biến.
- Sau khi mở màn xong, gỡ bỏ pointer-events (`pointer-events: none`) để không cản trở tương tác.
- Lưu trạng thái vào `sessionStorage` để không làm phiền người dùng khi chuyển qua lại các tab.

- [ ] **Step 1:** Tạo component `CinematicLetterbox` với GSAP timeline
- [ ] **Step 2:** Nhúng vào đầu component `Home.tsx`
- [ ] **Step 3:** Kiểm tra hiệu ứng mở màn và cờ `sessionStorage`

---

### Task 3: WOW #2 — Cinematic Word-by-Word Masked Title Reveal
**Files:**
- Modify: `src/features/home/components/HeroSpotlight/components/SlideItem/SlideItem.tsx`
- Modify: `src/features/home/components/HeroSpotlight/components/SlideItem/SlideItem.styles.ts`

**Mô tả:**
- Bọc các từ của tựa phim `movie.mainTitle` bằng cấu trúc mask:
  ```html
  <span class="word-mask"><span class="word-inner">{word}</span></span>
  ```
- Timeline khi slide xuất hiện: từng từ bay vụt từ dưới lên (`yPercent: 120 -> 0`, `rotateZ: 4 -> 0`, `stagger: 0.07s`, `ease: 'power3.out'`).
- Tự động re-run khi `isActive` thay đổi qua carousel.

- [ ] **Step 1:** Cập nhật CSS cho `.word-mask` (`overflow: hidden; display: inline-block`) trong `SlideItem.styles.ts`
- [ ] **Step 2:** Tích hợp hàm split vào JSX và tween trong `useGSAP` của `SlideItem.tsx`
- [ ] **Step 3:** Kiểm tra chữ xuất hiện từng từ mượt mà khi đổi phim

---

### Task 4: WOW #3 — Magnetic Button Physics trên các CTA chính
**Files:**
- Modify: `src/features/home/components/HeroSpotlight/components/SlideCta/SlideCta.tsx`
- Modify: `src/features/home/components/HeroSpotlight/HeroSpotlight.tsx` (Nút QuickBookSubmitButton)

**Mô tả:**
- Gắn `useMagneticEffect` vào:
  1. Nút "ĐẶT VÉ NGAY" (Hero CTA)
  2. Nút "Xem Trailer Full HD" (Hero CTA)
  3. Nút "ĐẶT VÉ NGAY" trên thanh Quick Booking Bar
- Khi rê chuột trong phạm vi nút: nút di chuyển mượt mà theo hướng chuột (`strength: 0.3`). Rê chuột ra ngoài: nảy đàn hồi về tâm (`elastic.out(1, 0.3)`).

- [ ] **Step 1:** Cập nhật `SlideCta.tsx` gắn hook magnetic
- [ ] **Step 2:** Cập nhật `HeroSpotlight.tsx` gắn hook magnetic cho nút Đặt vé nhanh
- [ ] **Step 3:** Kiểm tra tương tác rê chuột không bị giật lag

---

### Task 5: WOW #4 — Interactive 3D Tilt Card & Rating Score Count-Up
**Files:**
- Modify: `src/features/home/components/NowShowing/NowShowing.tsx`
- Modify: `src/features/home/components/NowShowing/NowShowing.styles.ts`

**Mô tả:**
- **Rating Score Count-Up:** Khi thẻ phim cuộn vào màn hình, điểm số (ví dụ 8.8, 9.2) đếm số tăng dần từ 0.0 lên điểm thật với hiệu ứng số nhảy mượt.
- **Interactive 3D Tilt:** Khi người dùng rê chuột lên poster thẻ phim, thẻ nghiêng nhẹ theo góc độ con trỏ (`rotateX`, `rotateY`, `perspective: 1000px`) kèm hiệu ứng lớp bóng gương vàng (gold sheen) lướt qua.

- [ ] **Step 1:** Bổ sung hiệu ứng 3D tilt và sheen trong CSS của `NowShowing.styles.ts`
- [ ] **Step 2:** Thêm logic đếm số và mouse-tilt mượt bằng GSAP trong `NowShowing.tsx`
- [ ] **Step 3:** Kiểm tra hiệu ứng thẻ phim sống động

---

### Task 6: WOW #5 — Horizontal Cinema Reel Scroll & Parallax Depth
**Files:**
- Modify: `src/features/home/components/LuxuryCinemas/LuxuryCinemas.tsx`
- Modify: `src/features/home/components/ExclusiveOffers/ExclusiveOffers.tsx`

**Mô tả:**
- **LuxuryCinemas:** Khi cuộn chuột qua phân đoạn rạp chiếu, ảnh nền các phòng chiếu VIP (IMAX Laser Landmark 81, La Rosa Sala, Charlotte Suite) dịch chuyển chậm hơn khung hình (`parallax scrub: 1`, `yPercent: -12`), tạo cảm giác chiều sâu 3D sang trọng.
- **ExclusiveOffers:** 3 thẻ ưu đãi trượt vào dạng lượn sóng so le (wave entrance) theo ScrollTrigger.

- [ ] **Step 1:** Tích hợp ScrollTrigger parallax cho ảnh phòng chiếu trong `LuxuryCinemas.tsx`
- [ ] **Step 2:** Tích hợp Wave Stagger ScrollTrigger cho các card voucher trong `ExclusiveOffers.tsx`
- [ ] **Step 3:** Kiểm tra độ mượt khi cuộn trang lên xuống

---

### Task 7: Kiểm Thử Toàn Diện, Build & Đo Đạc Hiệu Năng
**Files:**
- Test build: `npm run build`
- Chụp ảnh & kiểm thử FPS: `http://localhost:4173/`

- [ ] **Step 1:** Chạy `npm run build` xác nhận 0 lỗi TypeScript
- [ ] **Step 2:** Khởi chạy preview server và chụp ảnh kiểm tra từng hiệu ứng WOW
- [ ] **Step 3:** Đánh giá độ phản hồi đạt 60FPS trên cả máy tính lẫn thiết bị di động
