# PhimBook API — Tài Liệu Tích Hợp Frontend (FE Integration Guide)

Tài liệu hướng dẫn kết nối và tích hợp hệ thống API Backend **PhimBook** (Clean Architecture .NET 8, Supabase PostgreSQL, Redis Seat Locking) dành cho đội ngũ Frontend (React, Next.js, Vue, Mobile Flutter/React Native).

---

## 1. Thông Tin Môi Trường & Base URL

| Môi trường | Base URL | Swagger UI |
|---|---|---|
| **Local Development** | `http://localhost:5195` | `http://localhost:5195/swagger` |
| **Railway Production** | `https://be-bookphim-production.up.railway.app` | `https://be-bookphim-production.up.railway.app/swagger` |

- **API Versioning**: Toàn bộ endpoint nghiệp vụ đều có tiền tố `/api/v1/`.
- **Content-Type**: `application/json; charset=utf-8` cho tất cả Request & Response.

---

## 2. Chuẩn Định Dạng Base Response & Error Handling

Tất cả các API đều trả về định dạng chuẩn bọc qua `BaseResponseDTO<T>`:

### 2.1 Thành công (Success Response)
```json
{
  "code": 200,
  "success": true,
  "message": "Thành công",
  "data": { ... },
  "metaData": {
    "page": 1,
    "pageSize": 20,
    "total": 50
  }
}
```
> **Lưu ý**: `metaData` xuất hiện ở các API có phân trang (như danh sách phim). Đối với các API đơn lẻ (chi tiết phim, đặt vé, profile...), `metaData` có thể là `null`.

### 2.2 Thất bại (Error Response)
```json
{
  "code": 400,
  "success": false,
  "message": "Ghế đã được người khác giữ chỗ. Vui lòng chọn ghế khác!",
  "data": null,
  "metaData": null
}
```

### 2.3 Bảng mã trạng thái HTTP (HTTP Status Codes)
- `200 OK`: Yêu cầu thành công, kiểm tra `success: true` để lấy `data`.
- `400 Bad Request`: Lỗi dữ liệu đầu vào hoặc vi phạm logic nghiệp vụ (ghế đã khóa, hết vé, mã giảm giá không hợp lệ...).
- `401 Unauthorized`: Chưa truyền JWT Bearer Token hoặc Token đã hết hạn.
- `403 Forbidden`: Người dùng không có quyền truy cập tài nguyên này.
- `404 Not Found`: Không tìm thấy tài nguyên (phim không tồn tại, sai mã vé...).
- `409 Conflict`: Xung đột trạng thái (đồng thời đặt cùng 1 ghế hoặc xung đột đơn hàng).
- `500 Internal Server Error`: Lỗi hệ thống ngoài mong muốn.

---

## 3. Khai Báo TypeScript Types & Enums Dành Cho FE

Copy khối code sau vào dự án Frontend (ví dụ `types/api.ts` hoặc `src/types/phimbook.d.ts`):

```typescript
// ==================== BASE WRAPPER ====================
export interface BaseResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
  metaData?: MetaData | null;
}

export interface MetaData {
  page: number;
  pageSize: number;
  total: number;
}

// ==================== ENUMS ====================
export enum MovieStatus {
  NOW_SHOWING = 'NOW_SHOWING',
  COMING_SOON = 'COMING_SOON'
}

export enum AgeRating {
  P = 'P',     // Phổ biến cho mọi độ tuổi
  K = 'K',     // Dưới 13 tuổi có người bảo trợ đi kèm
  T13 = 'T13', // Được phép xem cho khán giả từ 13 tuổi trở lên
  T16 = 'T16', // Được phép xem cho khán giả từ 16 tuổi trở lên
  T18 = 'T18', // Được phép xem cho khán giả từ 18 tuổi trở lên
  C = 'C'      // Cấm chiếu / phổ biến
}

export enum MovieSortBy {
  RELEASE_DATE_DESC = 'RELEASE_DATE_DESC',
  RATING_DESC = 'RATING_DESC',
  TITLE_ASC = 'TITLE_ASC'
}

export enum ScreenType {
  STANDARD_2D = 'STANDARD_2D',
  STANDARD_3D = 'STANDARD_3D',
  IMAX_LASER = 'IMAX_LASER',
  DOLBY_CINEMA = 'DOLBY_CINEMA',
  GOLD_CLASS = 'GOLD_CLASS',
  FOUR_DX = 'FOUR_DX'
}

export enum SeatType {
  STANDARD = 'STANDARD',
  VIP = 'VIP',
  SWEETBOX = 'SWEETBOX'
}

export enum SeatState {
  AVAILABLE = 'AVAILABLE',
  LOCKED = 'LOCKED',
  BOOKED = 'BOOKED'
}

export enum PaymentMethodType {
  MOMO = 'MOMO',
  VNPAY = 'VNPAY',
  ZALOPAY = 'ZALOPAY',
  CREDIT_CARD = 'CREDIT_CARD',
  QUICK_PAY = 'QUICK_PAY'
}

export enum MembershipTier {
  STANDARD = 'STANDARD',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  VIP_ELITE = 'VIP_ELITE'
}

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  EXPIRED = 'EXPIRED'
}

export enum TicketPassStatus {
  VALID = 'VALID',
  CHECKED_IN = 'CHECKED_IN',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}
```

---

## 4. Chi Tiết Các Module API Nghiệp Vụ

### 4.1 Module 1: Xác Thực & Người Dùng (Auth & Profile)

#### ① Đăng Ký Tài Khoản Mới
- **Endpoint**: `POST /api/v1/auth/register`
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "Password123@",
  "phone": "0987654321",
  "fullName": "Nguyễn Văn A"
}
```
- **Response**: Trả về `BaseResponse<UserProfileDto>` kèm tài khoản được kích hoạt.

#### ② Đăng Nhập Hệ Thống
- **Endpoint**: `POST /api/v1/auth/login`
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "admin@phimbook.vn",
  "password": "Password123@"
}
```
- **Response**:
```json
{
  "code": 200,
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "48f1082c-...",
    "expiresIn": 3600,
    "user": {
      "id": "87b11104-16ec-4547-822b-259ce16745d2",
      "email": "admin@phimbook.vn",
      "fullName": "Quản Trị Viên PhimBook",
      "membershipTier": "VIP_ELITE",
      "totalPoints": 500
    }
  }
}
```

#### ③ Làm Mới Token (Refresh Token)
- **Endpoint**: `POST /api/v1/auth/refresh-token`
- **Request Body**:
```json
{
  "refreshToken": "48f1082c-..."
}
```

#### ④ Lấy Thông Tin Người Dùng Hiện Tại
- **Endpoint**: `GET /api/v1/auth/me`
- **Auth**: `Authorization: Bearer <accessToken>`

#### ⑤ Xem Hồ Sơ & Điểm Thưởng Khách Hàng Thân Thiết (Loyalty)
- **Endpoint**: `GET /api/v1/profile`
- **Auth**: `Authorization: Bearer <accessToken>`
- **Response**:
```json
{
  "id": "87b11104-16ec-4547-822b-259ce16745d2",
  "email": "admin@phimbook.vn",
  "phone": "0988888888",
  "fullName": "Quản Trị Viên PhimBook",
  "avatarUrl": "https://...",
  "birthDate": "1995-05-15",
  "membershipTier": "VIP_ELITE",
  "totalPoints": 500,
  "moviesWatchedCount": 12,
  "theatersVisitedCount": 4,
  "nickname": "Cinephile 01",
  "favoriteTheaterId": "..."
}
```

#### ⑥ Cập Nhật Hồ Sơ
- **Endpoint**: `PUT /api/v1/profile`
- **Auth**: `Authorization: Bearer <accessToken>`
- **Request Body**:
```json
{
  "fullName": "Nguyễn Hoàng Nam",
  "phone": "0912345678",
  "birthDate": "1998-10-20",
  "nickname": "NamPhim",
  "favoriteTheaterId": "d0000001-0000-0000-0000-000000000001"
}
```

#### ⑦ Phân Tích Khẩu Vị Điện Ảnh AI (CineMatch AI)
- **Endpoint**: `GET /api/v1/profile/taste-ai`
- **Auth**: `Authorization: Bearer <accessToken>`
- **Response**:
```json
{
  "tasteMatchRate": 94.5,
  "favoriteGenres": ["Hành động", "Khoa học viễn tưởng", "Phiêu lưu"],
  "favoriteDirectors": ["Christopher Nolan", "Denis Villeneuve"],
  "favoriteActors": ["Cillian Murphy", "Timothée Chalamet"]
}
```

---

### 4.2 Module 2: Khám Phá Phim (Movies Discovery)

#### ① Danh Sách Phim Kèm Bộ Lọc & Phân Trang
- **Endpoint**: `GET /api/v1/movies`
- **Auth**: Public
- **Query Parameters**:
  - `Status` *(MovieStatus, Optional)*: `NOW_SHOWING` hoặc `COMING_SOON`.
  - `Genre` *(string, Optional)*: Lọc theo thể loại tiếng Việt (`"Hành động"`, `"Hoạt hình"`, `"Kinh dị"`, `"Khoa học viễn tưởng"`,...).
  - `Format` *(string, Optional)*: `"2D"`, `"3D"`, `"IMAX"`.
  - `AgeRating` *(AgeRating, Optional)*: `P`, `K`, `T13`, `T16`, `T18`, `C`.
  - `SortBy` *(MovieSortBy, Optional)*: `RELEASE_DATE_DESC`, `RATING_DESC`, `TITLE_ASC`.
  - `Search` *(string, Optional)*: Tìm theo tên phim hoặc diễn viên.
  - `Page` *(int, Default: 1)*: Trang hiện tại.
  - `PageSize` *(int, Default: 20)*: Số phim mỗi trang.
- **Example Request**:
  `GET /api/v1/movies?Status=NOW_SHOWING&AgeRating=T13&SortBy=RATING_DESC&Page=1&PageSize=10`
- **Response Structure**:
```json
{
  "code": 200,
  "success": true,
  "message": "Thành công",
  "data": [
    {
      "id": "c0000001-0000-0000-0000-000000000001",
      "title": "Mai",
      "slug": "mai",
      "durationMinutes": 131,
      "ageRating": "T18",
      "releaseDate": "2024-02-10",
      "posterUrl": "https://rhffbtpohhimxjrfyias.supabase.co/storage/v1/object/public/bookphim-media/seed/media_1.jpg",
      "bannerUrl": "https://rhffbtpohhimxjrfyias.supabase.co/storage/v1/object/public/bookphim-media/seed/media_11.jpg",
      "genres": ["Tâm lý", "Tình cảm", "Hài hước"],
      "formats": ["2D"],
      "imdbRating": 7.4,
      "rottenTomatoesRating": 82,
      "isNowShowing": true,
      "isComingSoon": false
    }
  ],
  "metaData": {
    "page": 1,
    "pageSize": 10,
    "total": 50
  }
}
```

#### ② Chi Tiết Phim Theo Slug
- **Endpoint**: `GET /api/v1/movies/{slug}`
- **Auth**: Public
- **Example Request**: `GET /api/v1/movies/mai`
- **Response Data**:
```json
{
  "id": "c0000001-0000-0000-0000-000000000001",
  "title": "Mai",
  "slug": "mai",
  "originalTitle": "Mai",
  "synopsis": "Một câu chuyện cảm động và sâu sắc về thân phận người phụ nữ...",
  "durationMinutes": 131,
  "releaseDate": "2024-02-10",
  "posterUrl": "https://...",
  "bannerUrl": "https://...",
  "trailerUrl": "https://www.youtube.com/watch?v=...",
  "ageRating": "T18",
  "director": "Trấn Thành",
  "cast": ["Phương Anh Đào", "Tuấn Trần", "Hồng Đào"],
  "genres": ["Tâm lý", "Tình cảm"],
  "formats": ["2D"],
  "imdbRating": 7.4,
  "rottenTomatoesRating": 82,
  "isNowShowing": true,
  "isComingSoon": false
}
```

---

### 4.3 Module 3: Lịch Chiếu & Cụm Rạp (Showtimes Discovery)

#### ① Tìm Lịch Chiếu Theo Phim, Ngày, Định Dạng & Vị Trí GPS
- **Endpoint**: `GET /api/v1/showtimes`
- **Auth**: Public
- **Query Parameters**:
  - `MovieId` *(Guid, Optional)*: Lọc theo phim cụ thể.
  - `Date` *(DateOnly, Optional)*: Định dạng `YYYY-MM-DD` (ví dụ: `2026-10-15`).
  - `City` *(string, Optional)*: `"Hồ Chí Minh"`, `"Hà Nội"`, `"Đà Nẵng"`...
  - `ScreenType` *(ScreenType, Optional)*: `STANDARD_2D`, `STANDARD_3D`, `IMAX_LASER`, `DOLBY_CINEMA`, `GOLD_CLASS`, `FOUR_DX`.
  - `UserLat` *(double, Optional)*: Tọa độ vĩ độ người dùng (để tính khoảng cách `distanceKm`).
  - `UserLon` *(double, Optional)*: Tọa độ kinh độ người dùng.
- **Example Request**:
  `GET /api/v1/showtimes?MovieId=c0000001-0000-0000-0000-000000000001&Date=2026-10-15&City=Hồ Chí Minh&UserLat=10.7769&UserLon=106.7009`
- **Response**: Trả về danh sách rạp được gom nhóm (`TheaterShowtimesGroupDto`), tự động sắp xếp theo rạp gần người dùng nhất nếu có truyền GPS.
```json
[
  {
    "theaterId": "d0000001-0000-0000-0000-000000000001",
    "theaterName": "PhimBook Lounge Landmark 81",
    "address": "Tầng B1, TTTM Vincom Center Landmark 81, 720A Điện Biên Phủ, P.22, Bình Thạnh",
    "city": "Hồ Chí Minh",
    "chainName": "PhimBook VIP Lounge",
    "chainLogo": "https://...",
    "distanceKm": 3.2,
    "showtimes": [
      {
        "showtimeId": "e0000001-0000-0000-0000-000000000001",
        "startTime": "2026-10-15T09:30:00",
        "endTime": "2026-10-15T11:41:00",
        "format": "IMAX LASER",
        "subtitleLanguage": "Tiếng Việt",
        "basePrice": 120000.0,
        "auditoriumName": "Phòng Chiếu 01 - IMAX Laser"
      }
    ]
  }
]
```

---

### 4.4 Module 4: Sơ Đồ Ghế & Giữ Ghế Realtime (Seat Locking)

Động cơ đặt vé của PhimBook sử dụng **Redis Distributed Lock** với thời gian giữ chỗ **600 giây (10 phút)**.

#### ① Lấy Sơ Đồ Ghế Của Suất Chiếu (SeatMap)
- **Endpoint**: `GET /api/v1/showtimes/{showtimeId}/seatmap`
- **Auth**: Public
- **Query Parameter**:
  - `lockToken` *(Guid, Optional)*: Nếu client đang giữ ghế từ trước, truyền mã token này để API đánh dấu `isMine: true` cho các ghế mà chính client đang giữ.
- **Response**:
```json
{
  "showtimeId": "e0000001-0000-0000-0000-000000000001",
  "auditoriumName": "Phòng Chiếu 01 - IMAX Laser",
  "screenType": "IMAX_LASER",
  "totalRows": 8,
  "totalColumns": 12,
  "seats": [
    {
      "seatId": "f0000001-0000-0000-0000-000000000001",
      "rowLabel": "A",
      "seatNumber": 1,
      "seatType": "STANDARD",
      "state": "AVAILABLE",
      "price": 120000.0,
      "isMine": false
    },
    {
      "seatId": "f0000001-0000-0000-0000-000000000002",
      "rowLabel": "A",
      "seatNumber": 2,
      "seatType": "VIP",
      "state": "LOCKED",
      "price": 150000.0,
      "isMine": false
    },
    {
      "seatId": "f0000001-0000-0000-0000-000000000003",
      "rowLabel": "A",
      "seatNumber": 3,
      "seatType": "SWEETBOX",
      "state": "BOOKED",
      "price": 280000.0,
      "isMine": false
    }
  ]
}
```

#### ② Khóa Ghế (Lock Seats — Giữ Ghế 10 Phút)
- **Endpoint**: `POST /api/v1/showtimes/{showtimeId}/seats/lock`
- **Auth**: `Authorization: Bearer <accessToken>`
- **Request Body**:
```json
{
  "seatIds": [
    "f0000001-0000-0000-0000-000000000001",
    "f0000001-0000-0000-0000-000000000002"
  ],
  "lockToken": null
}
```
> **Mẹo**: Lần đầu tiên chọn ghế thì để `lockToken: null`. Nếu người dùng chọn thêm ghế thứ 3 hoặc bỏ bớt, truyền lại `lockToken` vừa nhận được để duy trì phiên giữ ghế.

- **Response**:
```json
{
  "code": 200,
  "success": true,
  "message": "Giữ ghế thành công trong 10 phút",
  "data": {
    "success": true,
    "lockToken": "7b0a84e3-3fc8-48b8-b80c-a96c321b18c5",
    "lockedSeatIds": [
      "f0000001-0000-0000-0000-000000000001",
      "f0000001-0000-0000-0000-000000000002"
    ],
    "expiresAt": "2026-10-14T15:15:00Z",
    "expiresInSeconds": 600
  }
}
```
> **Trường hợp xung đột**: Nếu ghế vừa bị người khác giữ trước 1 miligiây, API trả về `code: 400`, `success: false`, `message: "Ghế A1 đã được giữ bởi khách hàng khác"`. FE hiển thị thông báo và cập nhật lại sơ đồ ghế.

#### ③ Hủy Giữ Ghế (Unlock Seats)
Gọi khi người dùng bấm nút "Quay lại" hoặc bỏ chọn ghế trước khi thanh toán.
- **Endpoint**: `POST /api/v1/showtimes/{showtimeId}/seats/unlock`
- **Request Body**:
```json
{
  "lockToken": "7b0a84e3-3fc8-48b8-b80c-a96c321b18c5",
  "seatIds": ["f0000001-0000-0000-0000-000000000001"]
}
```

---

### 4.5 Module 5: Đơn Hàng & Áp Mã Giảm Giá (Orders & Vouchers)

#### ① Tạo Đơn Hàng (Create Order)
- **Endpoint**: `POST /api/v1/orders`
- **Auth**: `Authorization: Bearer <accessToken>`
- **Request Headers**:
  - `Idempotency-Key` *(UUID, Bắt buộc)*: Mã chống lặp lệnh ngẫu nhiên do FE sinh ra (ví dụ: `crypto.randomUUID()`). Đảm bảo dù mạng chập chờn người dùng bấm 2 lần cũng chỉ sinh đúng 1 đơn hàng duy nhất.
- **Request Body**:
```json
{
  "showtimeId": "e0000001-0000-0000-0000-000000000001",
  "lockToken": "7b0a84e3-3fc8-48b8-b80c-a96c321b18c5",
  "seatIds": [
    "f0000001-0000-0000-0000-000000000001",
    "f0000001-0000-0000-0000-000000000002"
  ],
  "concessions": [
    {
      "itemId": "b0000001-0000-0000-0000-000000000001",
      "quantity": 1
    }
  ],
  "voucherCode": "PHIMMOI20",
  "pointsToRedeem": 50,
  "taxInvoice": {
    "companyName": "Công ty TNHH Giải Trí ABC",
    "taxCode": "0312345678",
    "address": "123 Lê Lợi, Q.1, TP.HCM",
    "recipientEmail": "invoice@abc.vn"
  }
}
```
- **Response**:
```json
{
  "code": 200,
  "success": true,
  "message": "Đơn hàng đã được tạo thành công",
  "data": {
    "orderId": "9c8a7b6d-5e4f-3a2b-1c0d-e9f8a7b6c5d4",
    "orderCode": "PB261014-9988",
    "ticketSubtotal": 270000.0,
    "concessionSubtotal": 85000.0,
    "discountAmount": 54000.0,
    "pointsDiscount": 50000.0,
    "totalAmount": 251000.0,
    "status": "PENDING_PAYMENT",
    "createdAt": "2026-10-14T15:05:00Z",
    "items": [
      {
        "itemType": "TICKET",
        "itemName": "Vé Phim: Mai - Ghế A1 (STANDARD)",
        "quantity": 1,
        "unitPrice": 120000.0,
        "totalPrice": 120000.0
      },
      {
        "itemType": "CONCESSION",
        "itemName": "Bắp Phô Mai Cỡ Lớn",
        "quantity": 1,
        "unitPrice": 85000.0,
        "totalPrice": 85000.0
      }
    ]
  }
}
```

#### ② Xem Chi Tiết Đơn Hàng Theo ID Hoặc OrderCode
- `GET /api/v1/orders/{id}`
- `GET /api/v1/orders/code/{orderCode}` (Ví dụ: `GET /api/v1/orders/code/PB261014-9988`)

---

### 4.6 Module 6: Thanh Toán (Payments & Quick-Pay)

#### ① Khởi Tạo Thanh Toán (Checkout)
- **Endpoint**: `POST /api/v1/payments/checkout`
- **Auth**: `Authorization: Bearer <accessToken>`
- **Request Body**:
```json
{
  "orderId": "9c8a7b6d-5e4f-3a2b-1c0d-e9f8a7b6c5d4",
  "paymentMethod": "MOMO",
  "returnUrl": "https://phimbook.vn/booking/result"
}
```
> **Lưu ý về `paymentMethod`**:
> - `MOMO`: Trả về `paymentUrl` (app MoMo) & `qrCodeUrl` (quét mã QR MoMo).
> - `VNPAY`: Trả về `paymentUrl` cổng VNPAY (ATM nội địa / Thẻ quốc tế).
> - `ZALOPAY`: Trả về `paymentUrl` & `qrCodeUrl` ZaloPay.
> - `CREDIT_CARD`: Trả về cổng thanh toán OnePay / Stripe.
> - `QUICK_PAY`: Tính năng thanh toán 1-chạm không cần mật khẩu cho đơn hàng **dưới 500.000 VNĐ**. Đơn hàng sẽ được tự động khớp thanh toán ngay lập tức (`status: "PAID"`), không cần redirect ra cổng ngoài!

- **Response (Ví dụ MoMo)**:
```json
{
  "code": 200,
  "success": true,
  "message": "Tạo giao dịch thanh toán thành công",
  "data": {
    "orderId": "9c8a7b6d-5e4f-3a2b-1c0d-e9f8a7b6c5d4",
    "orderCode": "PB261014-9988",
    "amount": 251000.0,
    "paymentMethod": "MOMO",
    "paymentUrl": "https://test-payment.momo.vn/v2/gateway/pay?...",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?...",
    "transactionRef": "TXN_MOMO_179196...",
    "status": "PENDING",
    "expiresAt": "2026-10-14T15:20:00Z"
  }
}
```

---

### 4.7 Module 7: Vé Điện Tử & Vào Rạp (Smart E-Ticket Pass)

Sau khi thanh toán thành công, hệ thống tự động sinh ra vé điện tử có chữ ký mã hóa chống làm giả HMAC.

#### ① Lấy Thông Tin Vé Điện Tử (E-Ticket Pass)
- **Endpoint**: `GET /api/v1/tickets/{passCode}`
- **Auth**: `Authorization: Bearer <accessToken>`
- **Example**: `GET /api/v1/tickets/PASS-261014-A1B2`
- **Response**:
```json
{
  "ticketId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "passCode": "PASS-261014-A1B2",
  "movieTitle": "Mai",
  "theaterName": "PhimBook Lounge Landmark 81",
  "auditoriumName": "Phòng Chiếu 01 - IMAX Laser",
  "seatLabel": "A1",
  "format": "IMAX LASER",
  "startTime": "2026-10-15T09:30:00",
  "endTime": "2026-10-15T11:41:00",
  "status": "VALID",
  "checkedInAt": null,
  "qrCodeBase64": "data:image/png;base64,iVBORw0KGgo...",
  "qrCodeUrl": "https://api.phimbook.vn/api/v1/tickets/qr/PASS-261014-A1B2",
  "appleWalletUrl": "https://...",
  "googleWalletUrl": "https://...",
  "isEligibleForRefund": true
}
```

#### ② Tải / Hiển Thị Ảnh Mã QR (PNG Binary)
- **Endpoint**: `GET /api/v1/tickets/qr/{passCode}`
- **Response Type**: `image/png`
- **FE Usage**: Thẻ ảnh trực tiếp:
  ```html
  <img src="https://be-bookphim-production.up.railway.app/api/v1/tickets/qr/PASS-261014-A1B2" alt="QR Vé" />
  ```

#### ③ Cổng Soát Vé Tự Động (Turnstile Fast-Track Check-In)
- **Endpoint**: `POST /api/v1/tickets/turnstile-checkin`
- **Request Body**:
```json
{
  "passCode": "PASS-261014-A1B2",
  "deviceId": "GATE_TURNSTILE_01",
  "gateNumber": "Cổng 01"
}
```
- **Response**: Trả về `success: true` và ghi nhận `checkedInAt`. Nếu vé đã check-in từ trước, API trả về `code: 400`, `message: "Vé này đã được sử dụng lúc 09:15!"`.

#### ④ Hoàn Vé / Hủy Vé Tự Động
- **Endpoint**: `POST /api/v1/tickets/{passCode}/refund`
- **Auth**: `Authorization: Bearer <accessToken>`
- **Điều kiện hoàn vé**: Suất chiếu phải còn cách **ít nhất 60 phút** trước giờ bắt đầu. Nếu suất chiếu chỉ còn dưới 60 phút, hệ thống sẽ từ chối hoàn vé theo quy định.

---

## 5. Mẫu Cấu Hình Axios Client Với Tự Động Gắn Token

Dưới đây là đoạn code chuẩn mẫu để cấu hình Axios Interceptor trong dự án Frontend:

```typescript
// src/services/apiClient.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://be-bookphim-production.up.railway.app';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Tự động đính kèm Bearer token nếu đã đăng nhập
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Bắt lỗi tập trung & tự động Refresh Token khi gặp 401
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    
    // Nếu token hết hạn (401) và chưa từng thử retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const res = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
            refreshToken,
          });
          
          if (res.data?.success && res.data?.data?.accessToken) {
            const newAccessToken = res.data.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshErr) {
        // Refresh token cũng hết hạn -> Chuyển hướng người dùng về trang đăng nhập
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error.response?.data || error.message);
  }
);
```

---

## 6. Sơ Đồ Luồng Nghiệp Vụ Đặt Vé Cho FE (End-to-End User Flow)

```
[1. Khám phá Phim]  --> GET /api/v1/movies?Status=NOW_SHOWING
         │
[2. Chi tiết Phim]  --> GET /api/v1/movies/{slug}
         │
[3. Chọn Lịch Chiếu]--> GET /api/v1/showtimes?MovieId={id}&Date=YYYY-MM-DD&UserLat=...
         │
[4. Mở Sơ Đồ Ghế]   --> GET /api/v1/showtimes/{showtimeId}/seatmap
         │
[5. Chọn & Giữ Ghế] --> POST /api/v1/showtimes/{showtimeId}/seats/lock (Redis TTL 10 phút)
         │
[6. Tạo Đơn Hàng]   --> POST /api/v1/orders (Kèm Idempotency-Key + Voucher + Điểm thưởng)
         │
[7. Thanh Toán]     --> POST /api/v1/payments/checkout (MoMo / VNPAY / Quick-Pay < 500k)
         │
[8. Nhận Vé & QR]   --> GET /api/v1/tickets/{passCode} & GET /api/v1/tickets/qr/{passCode}
         │
[9. Soát Vé Vào Rạp]--> POST /api/v1/tickets/turnstile-checkin (Quét mã QR tại cổng)
```


---

## 7. Các Module Tính Năng Đột Phá Mới (Phases 1 - 4)

### 7.1 Module: Hộ Chiếu Điện Ảnh & Sưu Tầm Huy Hiệu (Passport & Gamification)
* **`GET /api/v1/passport/me`**: Lấy thông tin Hộ Chiếu, danh hiệu Cinephile (`Tân Binh`, `Khán Giả Quen Mặt`, `Tín Đồ Màn Bạc`, `Đại Sứ Điện Ảnh VIP`), danh sách tem ba chiều Hologram đã tích lũy và huy hiệu.
* **`GET /api/v1/passport/badges`**: Lấy toàn bộ bộ sưu tập huy hiệu hệ thống và trạng thái mở khóa của người dùng.
* **`POST /api/v1/passport/claim-reward`**: Đổi phần thưởng từ huy hiệu đã mở khóa thành điểm thưởng PhimPoints tích lũy.
  - Body: `{ "badgeId": "uuid" }`

### 7.2 Module: Trợ Lý Ảo CineBot AI (Gemini AI Concierge)
* **`POST /api/v1/ai/concierge/chat`**: Chat tự nhiên đa lượt với trợ lý ảo bằng tiếng Việt:
  - Body:
  ```json
  {
    "message": "Tối nay mình đi hẹn hò với bạn gái muốn xem phim tình cảm ở Landmark 81 lúc 20h và chọn ghế Sweetbox",
    "conversationHistory": []
  }
  ```
  - Response: Trả về câu trả lời tự nhiên (`reply`), thẻ phim gợi ý (`recommendedMovies`), và đơn hàng nháp đã chọn sẵn ghế đẹp (`bookingDraft`), kèm các câu hỏi tiếp theo (`suggestedReplies`).
* **`GET /api/v1/ai/concierge/quick-recommend`**: Gợi ý nhanh các phim bom tấn nổi bật phòng vé tuần này.

### 7.3 Module: CineParty - Đặt Vé Nhóm & Tách Tiền Tự Động (Group Booking & Split-Bill)
* **`POST /api/v1/group/rooms`**: Khởi tạo phòng đặt vé nhóm (Body: `{ "showtimeId": "uuid" }`). Nhận về mã phòng 6 số ngẫu nhiên (VD: `742918`).
* **`GET /api/v1/group/rooms/{roomCode}`**: Xem chi tiết phòng, danh sách bạn bè đã tham gia và các ghế đã chọn theo thời gian thực.
* **`POST /api/v1/group/rooms/join`**: Tham gia phòng qua mã 6 số (Body: `{ "roomCode": "742918" }`).
* **`POST /api/v1/group/rooms/select-seats`**: Chọn ghế cho bản thân trong phòng (Body: `{ "roomCode": "742918", "seatIds": ["..."] }`).
* **`POST /api/v1/group/rooms/{roomCode}/finalize-bill`**: Trưởng nhóm (Host) bấm chốt danh sách chọn ghế. Phòng sẽ chuyển sang trạng thái `LOCKED`, tự động loại bỏ các thành viên không chọn ghế nào và mở cổng thanh toán chia tiền.
* **`POST /api/v1/group/rooms/pay-share`**: Từng thành viên thanh toán phần tiền của mình (Body: `{ "roomCode": "742918", "paymentMethod": "QUICK_PAY" }`).
  - Khi 100% thành viên hoàn tất thanh toán, hệ thống tự động chốt đơn hàng và sinh vé điện tử riêng biệt về tài khoản của từng người!

### 7.4 Module: Suất Chiếu Bí Ẩn (Mystery Night) & Ghép Đôi Gu Phim (CineMate)
* **Suất Chiếu Bí Ẩn**: Khi gọi `GET /api/v1/showtimes`, mỗi suất chiếu (`ShowtimeSlotDto`) sẽ trả về các trường:
  - `isMysteryShowtime`: `true` nếu là suất chiếu bí ẩn.
  - `mysteryHint`: Gợi ý thể loại hoặc cốt truyện bí ẩn (VD: *"Một siêu phẩm trinh thám hack não đạt giải Oscar"*).
  - `mysteryDiscountRate`: Tỷ lệ ưu đãi giảm giá (mặc định `0.50` tức **giảm 50%** giá vé tự động khi tạo đơn).
* **`POST /api/v1/cinemate/opt-in`**: Dành cho người đi xem phim một mình muốn kết nối bạn bè (Body: `{ "showtimeId": "uuid", "seatLabel": "E6" }`).
* **`GET /api/v1/cinemate/matches/{showtimeId}`**: Tìm các bạn xem phim solo cùng suất chiếu có độ tương đồng gu điện ảnh (TasteMatchRate >= 70%) dựa trên đạo diễn và thể loại yêu thích.
* **`POST /api/v1/cinemate/send-hi`**: Gửi lời chào làm quen lịch sự (Body: `{ "targetUserId": "uuid", "showtimeId": "uuid", "greetingMessage": "Chào bạn!" }`).
