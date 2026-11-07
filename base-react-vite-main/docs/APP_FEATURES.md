# PHIMBOOK - TỔNG HỢP TOÀN DIỆN CÁC TÍNH NĂNG ỨNG DỤNG
> **Phiên bản:** 2.0 • **Ngôn ngữ:** TypeScript / React 19 • **Thiết kế:** Cinema Noir Luxury Dark Theme  
> **Cập nhật:** 06/11/2026

---

## 📌 I. TỔNG QUAN DỰ ÁN & ĐỊNH VỊ SẢN PHẨM

**PHIMBOOK (Cinematic Lounge)** là nền tảng đặt vé xem phim trực tuyến tiêu chuẩn quốc tế dành cho phân khúc rạp cao cấp (IMAX Laser, ScreenX, Dolby Atmos, 4DX, VIP Lounge). Hệ thống kết hợp giữa trải nghiệm đặt vé mượt mà và các tính năng tương tác mạng xã hội điện ảnh (Ghép đôi gu phim, Đặt vé nhóm chia tiền, Hộ chiếu điện ảnh 3D và Trợ lý ảo AI Concierge).

### Phong cách thiết kế: Cinema Noir Luxury
- **Màu sắc chủ đạo:** Đen tuyền huyền bí (`#0B0B0C`, `#18181B`), Đỏ rạp chiếu sang trọng (`#FF535A`), Vàng Champagne Gold (`#FFB955`), Tím Hologram bí ẩn (`#A855F7`).
- **Hiệu ứng:** Kính mờ (Glassmorphism), bóng đổ đa lớp, bo góc 12px - 16px, hiệu ứng viền phát sáng (Ambient Glow).
- **Tiêu chuẩn trợ năng:** Đạt chuẩn tương phản **WCAG AAA** cho toàn bộ typography và hệ thống thông báo.

---

## 🎬 II. DANH MỤC CÁC PHÂN HỆ TÍNH NĂNG CHÍNH

```
PHIMBOOK Platform
├── 1. Khám phá & Trang chủ (Home & Discovery)
├── 2. Chi tiết phim & Suất chiếu (Movie Details & Showtimes)
├── 3. Luồng Đặt vé toàn diện (Interactive Booking Flow)
├── 4. Trợ lý trí tuệ nhân tạo (AI Concierge & Chatbot)
├── 5. Hồ sơ thành viên & Cá nhân hóa (VIP Elite & Passport)
└── 6. Tiện ích nền tảng & Trải nghiệm người dùng (UX Platform)
```

---

### 1. Phân hệ Trang chủ & Khám phá phim (Home & Discovery)

| Tính năng | Vị trí / Đường dẫn | Mô tả chi tiết |
| :--- | :--- | :--- |
| **Hero Spotlight Carousel** | Trang chủ (`/`) | Banner trượt toàn màn hình các bộ phim bom tấn nổi bật nhất. Hỗ trợ tự động chuyển slide, xem tóm tắt, điểm IMDb/Rotten Tomatoes, nút **Đặt vé ngay** và **Xem Trailer 4K**. |
| **Thanh Tìm kiếm thông minh** | Header chính giữa | Tìm kiếm thời gian thực theo tên phim, diễn viên, đạo diễn với menu kết quả drop-down trực quan. |
| **Phim Đang chiếu & Sắp chiếu** | Trang chủ (`/`) | Danh sách phim phân loại theo tab, hỗ trợ bộ lọc nhanh theo thể loại (Hành động, Viễn tưởng, Hoạt hình...) và định dạng chiếu (IMAX, 3D, 2D). |
| **Trang Khám phá phim đa chiều** | `/kham-pha` | Bộ lọc nâng cao theo xếp hạng độ tuổi (P, K, T13, T16, T18), điểm đánh giá, quốc gia và năm phát hành. |
| **Lịch chiếu & Cụm rạp cao cấp** | `/lich-chieu`, `/rap-chieu` | Danh sách các hệ thống rạp đối tác tiêu chuẩn 5 sao (CGV Vincom Landmark 81, Lotte Cinema Nowzone, Galaxy Sala, BHD Bitexco...) kèm địa chỉ bản đồ và khoảng cách GPS. |
| **Ưu đãi & Đặc quyền (Exclusive Offers)** | Trang chủ (`#uu-dai`) | Danh mục khuyến mãi đối tác thẻ ngân hàng (Visa, Mastercard, JCB), combo bắp nước giới hạn và gói hội viên CinePass. |

---

### 2. Phân hệ Chi tiết phim & Suất chiếu (Movie Details & Showtimes)

| Tính năng | Vị trí / Đường dẫn | Mô tả chi tiết |
| :--- | :--- | :--- |
| **Chi tiết phim toàn diện** | `/phim/:id` (hoặc `/movie-details/:id`) | Hiển thị Banner 4K, Poster, thời lượng, phân loại độ tuổi, điểm IMDb / Rotten Tomatoes, danh sách diễn viên, đạo diễn và cốt truyện chi tiết. |
| **Xem Trailer 4K Chống chặn** | Modal nổi trên trang chi tiết & Home | Phát trailer sắc nét chuẩn hóa qua miền `youtube-nocookie.com`. Tích hợp chính sách bảo mật chống chặn cookie trình duyệt (Brave Shields / AdBlock) và nút **"Mở trên YouTube"** trực tiếp. |
| **Bộ chọn Suất chiếu (Showtime Picker)** | Trang chi tiết phim | Lọc suất chiếu theo: Ngày trong tuần (7 ngày tới), Thành phố (TP.HCM, Hà Nội, Đà Nẵng...), và Định dạng phòng chiếu (IMAX Laser, 2D Tiêu chuẩn, ScreenX). |
| **Suất chiếu bí ẩn (Mystery Night)** 🔮 | Trong Showtime Picker (ca đêm `> 22:00`) | Suất chiếu đặc biệt **giảm giá 35% - 40%**. Ô suất chiếu phát sáng tím hologram `🔮 Bí ẩn`. Tên bộ phim được giữ bí mật 100% đến khi đèn rạp tắt, mang lại cảm giác phiêu lưu điện ảnh. |
| **Thanh Sticky Booking Bar** | Chân trang chi tiết phim | Luôn cố định ở đáy màn hình khi cuộn trang, hiển thị suất chiếu và rạp đang chọn kèm nút **"Tiếp tục chọn ghế"**. |

---

### 3. Phân hệ Luồng Đặt vé tương tác (Interactive Booking Flow)

#### 🎟️ Bước 1: Sơ đồ chọn ghế (`/booking/seat-selection`)
- **Sơ đồ rạp trực quan:** Mô phỏng vị trí màn hình cong chuẩn rạp, hiển thị trạng thái từng ghế (Ghế Thường, Ghế VIP, Ghế đôi Sweetbox, Ghế đang chọn, Ghế đã bán).
- **Bộ đếm thời gian giữ ghế (Booking Timer):** Đếm ngược 10:00 phút để bảo vệ ghế đang chọn theo thời gian thực.
- **Ghép đôi gu phim Solo (CineMate) ❤️:**
  - Widget nổi bật ngay dưới sơ đồ ghế dành cho người đi xem phim một mình.
  - Tự động phân tích và ghép đôi với các khán giả solo khác trong cùng phòng chiếu dựa trên độ trùng khớp gu phim (Match rate: 92%, 78%...).
  - Cho phép bấm **"Gửi lời chào 👋"** để kết nối trước giờ chiếu.
- **Đặt vé nhóm & Chia tiền (CineParty) 👥:**
  - Tạo phòng đặt vé nhóm, tạo liên kết mời bạn bè cùng vào sơ đồ phòng chiếu để tự chọn ghế của mình.
  - Tự động chia đều tổng hóa đơn cho từng thành viên tham gia.

#### 🍿 Bước 2: Chọn bắp nước & Dịch vụ (`/booking/snacks-services`)
- Danh mục combo bắp rang bơ (Caramel, Phô mai, Chocolate), nước ngọt có gas, trà sữa và quà lưu niệm phiên bản giới hạn của bộ phim.
- Tự động cập nhật tổng tiền theo thời gian thực vào thanh tóm tắt đơn hàng.

#### 💳 Bước 3: Thanh toán & Xuất vé QR (`/booking/checkout`)
- **Đa dạng cổng thanh toán:**
  - Ví điện tử: MoMo, ZaloPay, ShopeePay.
  - Thẻ quốc tế: Visa, MasterCard, JCB.
  - Thẻ ATM nội địa & Chuyển khoản QR Napas 24/7.
  - Điểm thưởng tích lũy VIP Elite Point.
- **Áp dụng Voucher khuyến mãi:** Nhập mã giảm giá hoặc chọn voucher có sẵn trong ví.
- **Xuất vé điện tử QR Code:** Ngay sau khi thanh toán thành công, hệ thống sinh mã QR Code động để khán giả quét vào cửa rạp ngay mà không cần xếp hàng đổi vé giấy.

---

### 4. Phân hệ Trợ lý Trí tuệ Nhân tạo (AI Concierge & Chatbot)

| Tính năng | Vị trí / Đường dẫn | Mô tả chi tiết |
| :--- | :--- | :--- |
| **Widget CineBot AI nổi** | Góc dưới cùng bên phải màn hình | Trợ lý ảo AI túc trực 24/7. Hỗ trợ trả lời tự nhiên mọi câu hỏi: gợi ý phim theo cảm xúc, tìm suất chiếu gần nhất, giải đáp chính sách giá vé và ưu đãi. |
| **Cố vấn điện ảnh (AiCineAdvisor)** | Trang chủ (`#ai-tro-ly`) | Giao diện AI cố vấn chọn phim với các tag gợi ý thông minh ("Phim hành động kịch tính", "Phim lãng mạn hẹn hò", "Phim gia đình cuối tuần"). |
| **Cơ chế Phục hồi sự cố AI** | Tích hợp trong Chatbot | Tự động chuyển đổi sang danh mục phim gợi ý tĩnh nếu kết nối API gặp sự cố, đảm bảo người dùng không bao giờ bị gián đoạn trải nghiệm. |

---

### 5. Phân hệ Hồ sơ Thành viên & Cá nhân hóa (VIP Elite & Passport)

| Tính năng | Vị trí / Đường dẫn | Mô tả chi tiết |
| :--- | :--- | :--- |
| **Vé của tôi & Lịch sử đặt vé** | `/ve-cua-toi` | Quản lý toàn bộ vé sắp chiếu và vé đã xem. Xem chi tiết thông tin phòng chiếu, vị trí ghế, combo bắp nước và mã QR Check-in. |
| **Hộ chiếu điện ảnh (CinePassport)** 🛂 | `/profile/passport` hoặc `/ho-chieu` | Cuốn hộ chiếu số hóa ghi nhận toàn bộ hành trình điện ảnh: tổng số giờ xem phim, số rạp đã đặt chân tới, và bộ sưu tập **Huy hiệu 3D Hologram** độc quyền (Cinephile, IMAX Pioneer, Night Owl...). |
| **Khẩu vị điện ảnh (Cinematic Taste)** 🧬 | `/profile/cinematic-taste` | Phân tích và lưu trữ **DNA điện ảnh cá nhân**: thể loại phim yêu thích, đạo diễn thần tượng, công nghệ phòng chiếu và vị trí ghế ưa thích — nền tảng cho thuật toán ghép đôi CineMate. |
| **Hồ sơ VIP Elite Lounge** | `/profile/vip-elite` | Thẻ thành viên số hóa với 4 hạng thẻ (Silver, Gold, Platinum, Diamond). Hiển thị tiến trình thăng hạng, số điểm tích lũy và đặc quyền phòng chờ thương gia. |
| **Bảo mật & Cài đặt cá nhân** | `/profile/personal-info`, `/profile/security`, `/profile/payment-methods` | Quản lý họ tên, số điện thoại, đổi mật khẩu, xác thực 2 lớp, lưu trữ thẻ thanh toán nhanh và tùy chọn nhận thông báo ưu đãi. |

---

### 6. Phân hệ Tiện ích Nền tảng & Trải nghiệm Người dùng (UX Platform)

| Tiện ích | Chi tiết triển khai |
| :--- | :--- |
| **Đa ngôn ngữ (i18n)** | Hỗ trợ chuyển đổi tức thì giữa **Tiếng Việt (VI)** và **Tiếng Anh (EN)** trên toàn bộ giao diện thông qua bộ chuyển đổi ngôn ngữ ở Header. |
| **Bộ chọn Địa phương (Location Picker)** | Lựa chọn nhanh tỉnh/thành phố (TP.HCM, Hà Nội, Đà Nẵng, Cần Thơ, Hải Phòng) để tự động ưu tiên lịch chiếu rạp gần nhất. |
| **Hệ thống Thông báo Cao cấp** | Thiết kế riêng dựa trên Ant Design 6 với nền tối `#18181B`, chữ trắng tương phản cao chuẩn WCAG AAA, và thanh tiến trình thời gian thực mang màu sắc nhận diện từng loại thông báo (Lỗi đỏ, Cảnh báo vàng, Thành công xanh). |
| **Chống trùng lặp thông báo (Deduplication)** | Bộ lọc thông minh ngăn chặn việc hiển thị thông báo lỗi/thành công trùng lặp liên tục trong vòng 1.5 giây. |
| **Nhận diện Mạng Online / Offline** | Tự động phát hiện khi thiết bị mất kết nối Internet và hiển thị thông báo cảnh báo ngoại tuyến để người dùng không bị mất dữ liệu đặt vé. |

---

## 🛠️ III. QUẢN TRỊ TÍNH NĂNG QUA BIẾN MÔI TRƯỜNG (FEATURE FLAGS)

Toàn bộ các tính năng đặc biệt của hệ thống được quản lý tập trung tại `src/config/features.config.ts`. Mặc định **BẬT TẤT CẢ** và có thể bật/tắt linh hoạt qua tệp cấu hình `.env`:

| Biến Môi trường | Tính năng tương ứng | Giá trị mặc định |
| :--- | :--- | :---: |
| `VITE_FEATURE_CINEBOT_AI` | Trợ lý ảo AI Concierge Floating Widget | `true` |
| `VITE_FEATURE_PASSPORT` | Hộ chiếu điện ảnh & Bộ sưu tập Huy hiệu 3D Hologram | `true` |
| `VITE_FEATURE_CINEPARTY` | Đặt vé nhóm & Chia tiền tự động (CineParty) | `true` |
| `VITE_FEATURE_CINEMATE` | Ghép đôi khán giả xem solo cùng gu phim (CineMate) | `true` |
| `VITE_FEATURE_MYSTERY_NIGHT` | Suất chiếu bí ẩn đêm muộn (Mystery Night Showtimes) | `true` |
| `VITE_FEATURE_QUICK_BOOKING` | Thanh đặt vé nhanh tại Hero Banner trang chủ | `true` |
| `VITE_FEATURE_SOCIAL_LOGIN` | Đăng nhập bằng Google / Facebook / Zalo | `true` |

---

## 🗺️ IV. SƠ ĐỒ ĐIỀU HƯỚNG URL (ROUTE SITEMAP)

| URL Tuyến đường | Tên Màn hình / Chức năng | Phân quyền truy cập |
| :--- | :--- | :---: |
| `/` hoặc `/home` | Trang chủ Cinema Noir Showcase | Công khai (Public) |
| `/kham-pha` | Khám phá & Lọc phim đa chiều | Công khai (Public) |
| `/lich-chieu` | Tra cứu lịch chiếu toàn hệ thống | Công khai (Public) |
| `/rap-chieu` | Danh sách cụm rạp tiêu chuẩn quốc tế | Công khai (Public) |
| `/phim/:id` | Chi tiết phim, Trailer & Lịch chiếu | Công khai (Public) |
| `/booking/seat-selection` | Sơ đồ chọn ghế, CineMate & CineParty | Khách / Thành viên |
| `/booking/snacks-services` | Chọn combo bắp nước & dịch vụ phòng chiếu | Khách / Thành viên |
| `/booking/checkout` | Thanh toán đơn hàng & Nhận vé QR Code | Khách / Thành viên |
| `/login` | Đăng nhập tài khoản & Quên mật khẩu | Khách (Guest Guard) |
| `/ve-cua-toi` | Danh sách vé đã đặt & Chi tiết vé QR | Yêu cầu Đăng nhập (Auth Guard) |
| `/profile/vip-elite` | Hồ sơ thành viên VIP Elite Lounge & Đặc quyền | Yêu cầu Đăng nhập (Auth Guard) |
| `/profile/passport` | Hộ chiếu điện ảnh & Huy hiệu 3D Hologram | Yêu cầu Đăng nhập (Auth Guard) |
| `/profile/cinematic-taste` | DNA Khẩu vị điện ảnh & CineMatch AI | Yêu cầu Đăng nhập (Auth Guard) |
| `/profile/personal-info` | Cập nhật thông tin cá nhân | Yêu cầu Đăng nhập (Auth Guard) |
| `/profile/security` | Quản lý mật khẩu & Bảo mật 2 lớp | Yêu cầu Đăng nhập (Auth Guard) |
| `/profile/payment-methods` | Quản lý phương thức thanh toán lưu trữ | Yêu cầu Đăng nhập (Auth Guard) |
| `*` | Trang báo lỗi 404 (Page Not Found) | Công khai (Public) |

---
*Tài liệu được khởi tạo và duy trì bởi đội ngũ phát triển PHIMBOOK.*
