# Cấu trúc báo cáo môn học xây dựng website

> Khung báo cáo tham khảo cho đồ án môn học. Có thể điều chỉnh số chương, tên mục và độ dài theo yêu cầu của giảng viên hoặc mẫu quy định của trường.

## 1. Phần mở đầu

- Trang bìa
  - Tên trường, khoa/bộ môn
  - Tên môn học và tên đề tài
  - Giảng viên hướng dẫn
  - Sinh viên thực hiện, mã sinh viên, lớp
  - Thời gian thực hiện
- Lời cảm ơn (không bắt buộc)
- Mục lục
- Danh mục hình ảnh, bảng biểu, từ viết tắt (nếu có)
- Giới thiệu đề tài
- Lý do chọn đề tài
- Mục tiêu thực hiện
- Đối tượng và phạm vi đề tài

## 2. Chương 1: Tổng quan đề tài

### 1.1. Giới thiệu bài toán
Trình bày bối cảnh, vấn đề thực tế mà website hướng đến giải quyết.

### 1.2. Mục đích xây dựng website
Nêu mục đích và giá trị dự kiến của hệ thống.

### 1.3. Đối tượng sử dụng
Mô tả các nhóm người dùng chính và nhu cầu của họ.

### 1.4. Phạm vi đề tài
Nêu rõ những nội dung nằm trong và ngoài phạm vi thực hiện.

### 1.5. Các chức năng chính
Tóm tắt những chức năng quan trọng của website.

### 1.6. Khảo sát hệ thống tương tự (nếu có)
Tham khảo một số website liên quan, chỉ ra điểm phù hợp và điểm có thể cải thiện.

## 3. Chương 2: Phân tích và đặc tả yêu cầu

### 2.1. Yêu cầu chức năng
Liệt kê các chức năng theo từng nhóm người dùng hoặc từng phân hệ.

### 2.2. Yêu cầu phi chức năng
Ví dụ: hiệu năng, bảo mật, khả năng sử dụng, tương thích trình duyệt và responsive.

### 2.3. Các tác nhân (Actors)
Xác định người dùng và hệ thống bên ngoài tương tác với website.

### 2.4. Sơ đồ Use Case
Trình bày sơ đồ tổng quan và các sơ đồ chi tiết nếu cần.

### 2.5. Đặc tả Use Case
Mô tả các luồng chính, luồng thay thế, điều kiện đầu vào và kết quả của những chức năng tiêu biểu.

## 4. Chương 3: Phân tích và thiết kế hệ thống

### 3.1. Kiến trúc tổng thể
Mô tả các thành phần và cách chúng giao tiếp, ví dụ mô hình Client–Server hoặc Frontend–Backend.

### 3.2. Thiết kế cơ sở dữ liệu
- Sơ đồ ERD
- Danh sách bảng và mô tả trường dữ liệu
- Khóa chính, khóa ngoại và quan hệ giữa các bảng

### 3.3. Thiết kế luồng nghiệp vụ
Sử dụng Activity Diagram, Sequence Diagram hoặc lưu đồ cho các nghiệp vụ quan trọng (nếu phù hợp).

### 3.4. Thiết kế giao diện
- Wireframe hoặc bản thiết kế Figma
- Bố cục các màn hình chính
- Điều hướng và luồng thao tác người dùng

## 5. Chương 4: Công nghệ và quá trình xây dựng

### 4.1. Công nghệ sử dụng
Liệt kê công nghệ và vai trò của từng thành phần, chẳng hạn:
- Frontend: ReactJS, Next.js, Vue hoặc HTML/CSS/JavaScript
- Backend: ASP.NET Core, Node.js hoặc công nghệ khác (nếu có)
- Cơ sở dữ liệu: SQL Server, PostgreSQL, MySQL, Supabase...
- UI framework/thư viện: Tailwind CSS, Bootstrap, Ant Design...
- Công cụ: Git, GitHub, Figma, Postman, Docker...

Chỉ ghi những công nghệ thực tế được sử dụng trong dự án.

### 4.2. Môi trường phát triển
Nêu hệ điều hành, IDE, phiên bản runtime và công cụ cần thiết.

### 4.3. Cấu trúc dự án
Giới thiệu ngắn gọn các thư mục và thành phần quan trọng.

### 4.4. Quá trình xây dựng
Trình bày cách triển khai giao diện, xử lý nghiệp vụ, API và kết nối cơ sở dữ liệu.

### 4.5. Các chức năng đã triển khai
Mô tả cách hoạt động của những chức năng chính; có thể kèm ảnh giao diện hoặc đoạn mã tiêu biểu khi cần.

## 6. Chương 5: Kết quả thực hiện và kiểm thử

### 5.1. Kết quả sản phẩm
Nêu địa chỉ website chạy thử (nếu có), các màn hình và chức năng đã hoàn thành.

### 5.2. Hình ảnh minh họa
Chụp màn hình các chức năng chính và chú thích rõ ràng.

### 5.3. Kiểm thử chức năng
Lập bảng kiểm thử, ví dụ:

| STT | Chức năng | Dữ liệu/điều kiện kiểm thử | Kết quả mong đợi | Kết quả thực tế |
|---:|---|---|---|---|
| 1 | Đăng nhập | Tài khoản hợp lệ | Đăng nhập thành công | Đạt |
| 2 | Đăng nhập | Sai mật khẩu | Hiển thị thông báo lỗi | Đạt |
| 3 | Thêm dữ liệu | Dữ liệu hợp lệ | Lưu dữ liệu thành công | Đạt |

### 5.4. Đánh giá kết quả
Nêu những mục tiêu đã đạt, chức năng còn thiếu và các vấn đề đã phát hiện.

## 7. Kết luận và hướng phát triển

### 7.1. Kết luận
Tổng kết quá trình thực hiện và mức độ hoàn thành mục tiêu.

### 7.2. Kiến thức và kỹ năng đạt được
Nêu những kiến thức chuyên môn, kỹ năng làm việc nhóm và kinh nghiệm thực tế đã học được.

### 7.3. Hạn chế
Trình bày trung thực những điểm chưa hoàn thiện của sản phẩm.

### 7.4. Hướng phát triển
Đề xuất các chức năng, cải tiến hoặc công nghệ có thể bổ sung trong tương lai.

## 8. Tài liệu tham khảo

- Giáo trình và tài liệu môn học
- Tài liệu chính thức của các công nghệ, framework và thư viện
- Tài liệu API hoặc dịch vụ bên thứ ba
- Các nguồn tham khảo khác

Ghi thông tin tài liệu nhất quán theo quy định của giảng viên hoặc nhà trường.

## 9. Phụ lục (nếu có)

- Hướng dẫn cài đặt và chạy dự án
- Hướng dẫn sử dụng website
- Một số đoạn mã hoặc cấu hình tiêu biểu
- Link repository mã nguồn
- Tài khoản demo (không đưa mật khẩu cá nhân hoặc thông tin nhạy cảm vào báo cáo)

---

## Phân bổ số trang tham khảo

| Phần | Số trang gợi ý |
|---|---:|
| Mở đầu | 2–3 |
| Chương 1: Tổng quan đề tài | 3–4 |
| Chương 2: Phân tích yêu cầu | 4–6 |
| Chương 3: Thiết kế hệ thống | 5–7 |
| Chương 4: Công nghệ và xây dựng | 5–8 |
| Chương 5: Kết quả và kiểm thử | 4–6 |
| Kết luận | 1–2 |
| Tài liệu tham khảo và phụ lục | Tùy nội dung |

**Tổng độ dài tham khảo:** khoảng 25–40 trang, không tính hoặc tùy cách tính phụ lục theo quy định của môn học.

## Lưu ý khi hoàn thiện báo cáo

- Ưu tiên mẫu trình bày và yêu cầu chấm điểm do giảng viên cung cấp.
- Chỉ mô tả chức năng và công nghệ thực sự có trong sản phẩm.
- Dùng hình ảnh, sơ đồ và bảng biểu để minh họa; đánh số và đặt chú thích nhất quán.
- Không cần chép toàn bộ mã nguồn vào nội dung chính.
- Phân biệt rõ kết quả đã hoàn thành, hạn chế và tính năng dự kiến.
