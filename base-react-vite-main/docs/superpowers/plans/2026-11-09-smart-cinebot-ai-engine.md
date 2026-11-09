# Kế hoạch Triển khai: Smart CineBot AI Engine & Tương tác Đa dạng Ngữ cảnh

> **Mục tiêu**: Nâng cấp toàn diện trí tuệ của Chatbox CineBot và khu vực AiCineAdvisor trên trang chủ, xóa bỏ tình trạng trả lời rập khuôn 1 kiểu của backend, đưa ra phản hồi tự nhiên, linh hoạt theo ngữ cảnh thực tế (chào hỏi, rạp chiếu theo thành phố, tìm phim theo thể loại, giá vé & ưu đãi).

---

## 1. Phân Tích & Kiến Trúc Kỹ Thuật

### 1.1 Vấn đề hiện tại
- **Backend API (`/api/v1/ai/concierge/chat`)**: Luôn trả về 1 template cố định: *"Dựa trên yêu cầu của bạn, bộ phim [Tên phim] là lựa chọn sáng giá nhất lúc này..."* cho bất kỳ câu hỏi nào.
- **Trang chủ (`AiCineAdvisor`)**: Khung chat và các thẻ gợi ý (ChatSuggestions) là UI tĩnh, không phản hồi khi bấm hay gõ phím.
- **Thiếu kết nối với City State**: Bot chưa nắm được thành phố hiện tại người dùng đang chọn để gợi ý đúng rạp ở Hà Nội, TP. HCM hay Đà Nẵng.

### 1.2 Kiến trúc giải pháp
```
[User Input]
     │
     ▼
[CineBot Intent Engine (Client-Side Smart Pipeline)]
     │
     ├── 1. Phân loại Ý định (Greeting, Cinema/Location, Movie Search, Pricing/Promo)
     ├── 2. Bổ sung ngữ cảnh Thành phố hiện tại (useSelectedCity)
     ├── 3. Gọi Backend API (/ai/concierge/chat)
     │         │
     │         ├── Thành công: Làm giàu (Enhance) phản hồi nếu Backend trả lời rập khuôn
     │         └── Thất bại: Tự động Fallback sang Knowledge Base cục bộ (15 cụm rạp, phim bom tấn)
     │
     ▼
[Hiển thị: Câu trả lời tự nhiên + Thẻ phim + Suất chiếu thật + Quick Reply Chips]
```

---

## 2. Danh Sách File Cần Tạo & Cập Nhật

1. **`src/features/ai-concierge/services/cinebot-engine.ts`** *(Mới)*:
   - Module xử lý ngôn ngữ & phân loại ý định (Intent Classifier).
   - Phân loại: `GREETING`, `LOCATION_CINEMA`, `MOVIE_GENRE`, `PRICING_OFFERS`, `GENERAL_CHAT`.
   - Kết nối với `city-theaters-data.ts` để lấy danh sách rạp và suất chiếu theo thành phố đang chọn.
   - Hàm `generateSmartConciergeReply(userMessage, currentCity, backendResponse)`: Biến hóa câu trả lời sống động, tự nhiên.

2. **`src/features/ai-concierge/components/CineBotWidget/CineBotWidget.tsx`** *(Cập nhật)*:
   - Tích hợp `useSelectedCity()` để nhận biết thành phố người dùng đang xem.
   - Sử dụng `generateSmartConciergeReply` để trả lời đa dạng phong cách, không bao giờ bị rập khuôn 1 kiểu.
   - Thêm sự kiện toàn cục `phimbook:open-cinebot` cho phép các trang khác (như trang chủ) mở và gửi tin nhắn trực tiếp vào bot.

3. **`src/features/home/components/AiCineAdvisor/AiCineAdvisor.tsx` & components con** *(Cập nhật)*:
   - `ChatInput.tsx`: Gắn state `inputText`, khi bấm gửi sẽ mở `CineBotWidget` và bắt đầu trò chuyện ngay.
   - `ChatSuggestions.tsx`: Bấm vào bất kỳ chip gợi ý nào sẽ kích hoạt CineBot trả lời chủ đề đó.
   - `ChatMessage.tsx`: Hiển thị tin nhắn động ban đầu hoặc đồng bộ với cuộc trò chuyện.

---

## 3. Các Bước Thực Hiện (Task Breakdown)

### Task 1: Xây dựng module `cinebot-engine.ts`
- Phân tích từ khóa tiếng Việt (chào hỏi, tên phim, rạp chiếu, thể loại, giá vé, khuyến mãi).
- Xây dựng kho mẫu phản hồi tự nhiên, chuẩn phong cách Điện ảnh Thượng lưu (Cinema Noir).
- Hỗ trợ trích xuất phim phù hợp từ dữ liệu rạp 3 cấp và danh sách phim đang chiếu.

### Task 2: Cải tiến `CineBotWidget` với Smart Engine
- Tích hợp `useSelectedCity()`.
- Xử lý phản hồi đa dạng cho `CineBotWidget`.
- Hỗ trợ lắng nghe sự kiện `phimbook:open-cinebot`.

### Task 3: Kích hoạt tương tác cho `AiCineAdvisor` trên Trang chủ
- Bổ sung handler gửi tin nhắn và click gợi ý tại Trang chủ.
- Kết nối thông suốt với `CineBotWidget`.

### Task 4: Kiểm thử E2E & Biên dịch
- Chạy `npm run build` đảm bảo 0 lỗi TypeScript.
- Kiểm thử các kịch bản:
  - Chào hỏi: Không gợi ý ép đặt vé bừa bãi.
  - Hỏi rạp Hà Nội / TP. HCM / Đà Nẵng: Trả về chính xác rạp của thành phố đó.
  - Tìm phim hoạt hình / kinh dị / Dune: Trả về đúng phim và suất chiếu.
  - Hỏi giá vé: Giải thích chi tiết các định dạng.
