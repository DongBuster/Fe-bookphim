# Báo Cáo Đánh Giá Chất Lượng Tầng Tích Hợp API (API Integration Audit Report)

> **Dự án:** `base-react-vite-main`  
> **Phạm vi kiểm tra:** Tầng cấu hình Axios, Interceptors, Quản lý Token & Auth Lifecycle, Xử lý lỗi, Type Safety, Trải nghiệm người dùng khi gặp lỗi (Error UX) và Tích hợp TanStack React Query.  
> **Thời gian thực hiện:** 29/10/2026

---

## 1. Tổng quan & Bảng điểm chất lượng (Scorecard)

| Tiêu chí | Điểm số | Trạng thái | Đánh giá tổng quan |
| :--- | :---: | :---: | :--- |
| **Kiến trúc & Cấu trúc thư mục (Architecture)** | **8.5/10** | 🟢 Tốt | Tách module theo feature-based rõ ràng, proxy Vite chuẩn xác. |
| **Xử lý Response & Interceptor** | **5.0/10** | 🔴 Cần chuẩn hóa | Trả về dữ liệu không đồng nhất giữa GET và POST; ép buộc tầng API viết code phòng thủ. |
| **Cơ chế Refresh Token & Concurrency** | **4.0/10** | 🔴 Nghiêm trọng | **Rủi ro treo Promise vĩnh viễn (hang) & Deadlock** hàng đợi khi refresh token lỗi/hết hạn. |
| **An toàn kiểu dữ liệu (Type Safety)** | **4.5/10** | 🔴 Cần sửa | Lạm dụng ép kiểu mù quáng `as unknown as ...`, vô hiệu hóa bộ kiểm tra kiểu của TypeScript. |
| **Xử lý lỗi & Trải nghiệm người dùng (Error UX)** | **5.0/10** | 🟡 Cần nâng cấp | **Dễ lộ lỗi kỹ thuật 500/SQL/Exception ra UI**; nguy cơ ngập tràn thông báo (Spam Notification) khi nhiều API cùng lỗi. |
| **Bảo mật & Quản lý Token (Security)** | **5.5/10** | 🟡 Cần sửa | Dùng thuật toán DES lỗi thời với secret key lộ ở client bundle; token lưu in-memory chưa sync đa tab. |
| **Quản lý Cache & TanStack Query** | **6.5/10** | 🟡 Cần tối ưu | Cấu hình mặc định `staleTime: 2ms` làm mất tác dụng cache; chưa áp dụng `useMutation` cho thao tác ghi. |

---

## 2. Các điểm sáng đã làm tốt (Strengths)

1. **Kiến trúc Feature-Based phân tầng rõ rệt**:
   - Tách biệt rõ ràng giữa cấu hình hạ tầng (`src/config/axios-*`), định nghĩa API theo nghiệp vụ (`src/features/*/api/*.api.ts`) và tầng hiển thị Component UI.
2. **Cơ chế Idempotency-Key trong thanh toán**:
   - Tại [`booking.api.ts`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/features/booking/api/booking.api.ts), hàm `createOrderApi` tự động tạo `Idempotency-Key` thông qua `crypto.randomUUID()`. Đây là tiêu chuẩn bảo đảm tính toàn vẹn dữ liệu, chống thanh toán trùng lặp khi mạng chập chờn.
3. **Xử lý chuyên sâu cho File/Blob Error**:
   - Tại [`axios-file-instance.ts`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/config/axios-file-instance.ts), hàm `tryParseBlobErrorResponse` bóc tách được payload JSON báo lỗi ngay cả khi request download file dạng `responseType: 'blob'`, giúp hiển thị thông báo thân thiện.
4. **Cấu hình Proxy chuẩn trong môi trường phát triển**:
   - [`vite.config.ts`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/vite.config.ts) đã thiết lập `server.proxy` chuyển hướng `/api` sang backend Railway, giải quyết triệt để lỗi CORS ở môi trường local.

---

## 3. Các lỗi kỹ thuật nghiêm trọng & Rủi ro tiềm ẩn

### 🔴 Vấn đề 1: Nguy cơ treo ứng dụng (Promise Hang) & Deadlock tại `refreshToken.ts`

> [!CAUTION]
> **Mức độ: Nghiêm trọng (Critical)**  
> **Vị trí:** [`src/shared/utils/refreshToken.ts`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/shared/utils/refreshToken.ts#L45-L89)

#### Chi tiết lỗi:
```typescript
// src/shared/utils/refreshToken.ts
return new Promise(function (resolve, reject) {
  const refreshToken = tokenManager.getRefreshToken();

  if (refreshToken) {
    axios.post(...)
      .then(...)
      .then(() => { isRefreshing = false; })
      .catch((err) => {
        // ⚠️ Không có `isRefreshing = false` ở đây!
        processQueue(err, null);
        reject(err);
      });
  }
  // ⚠️ THIẾU ELSE: Nếu refreshToken không tồn tại, Promise không bao giờ resolve hay reject!
});
```

1. **Treo Promise vĩnh viễn (Memory Leak & Freezing UI)**: Nếu người dùng không có `refreshToken` (hoặc đã bị xóa), Promise được trả về nhưng không bao giờ gọi `resolve()` hay `reject()`. Bất kỳ component nào gọi API lúc đó sẽ kẹt vĩnh viễn ở trạng thái `isLoading: true`.
2. **Deadlock trạng thái `isRefreshing`**: Cờ `isRefreshing = false` chỉ được đặt trong nhánh `.then()`. Khi gặp lỗi mạng hoặc HTTP 500, code nhảy vào nhánh `.catch()`, khiến `isRefreshing` mãi mãi giữ giá trị `true`. Mọi request tiếp theo sẽ bị kẹt vào `failedQueue` mà không có cơ hội được xử lý lại.
3. **Nuốt lỗi trong hàng đợi**: Tại dòng 39: `.catch((err) => err);` chuyển đổi lỗi thành một giá trị hoàn thành thành công, khiến các request xếp hàng sau nhận nhầm lỗi là kết quả hợp lệ.

---

### 🔴 Vấn đề 2: Bóc tách Response không nhất quán tại `axios-instance.ts`

> [!WARNING]
> **Mức độ: Cao (High)**  
> **Vị trí:** [`src/config/axios-instance.ts`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/config/axios-instance.ts#L41-L56)

#### Chi tiết logic:
```typescript
const handleResponse = (response: AxiosResponse<IResponse<unknown>>) => {
  const { data } = response;
  ...
  if (response.config.method === 'get') {
    if ((data as { metaData?: unknown })?.metaData) {
      return data;       // Trả về cả vỏ wrapper BaseResponse
    }
    return data.data;     // Chỉ bóc tách phần ruột data
  }
  return data;           // POST, PUT, DELETE trả về cả vỏ
};
```

#### Hệ lụy:
Tầng gọi API phải liên tục viết code phòng thủ, kiểm tra kiểu động và bọc lại thủ công:
- **Tại [`movie.api.ts`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/features/movie-discovery/api/movie.api.ts#L22-L30):**
  ```typescript
  // Phải kiểm tra nếu mảng thì tự tạo object bọc lại!
  if (Array.isArray(res)) {
    return { code: 200, success: true, message: 'Thành công', data: res };
  }
  ```
- **Tại [`booking.api.ts`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/features/booking/api/booking.api.ts#L27-L30):**
  ```typescript
  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as TicketDto;
  ```

---

### 🔴 Vấn đề 3: Phá vỡ an toàn kiểu dữ liệu (Type Safety) bằng `as unknown as`

> [!WARNING]
> **Mức độ: Trung bình - Cao (Medium-High)**  
> **Vị trí:** Hầu hết các hàm trong `auth.api.ts`, `booking.api.ts`, `movie.api.ts`.

```typescript
const res = (await axiosClient.post<BaseResponse<LoginResponseData>>(
  '/auth/login',
  body,
)) as unknown as BaseResponse<LoginResponseData>;
```
* **Nguyên nhân:** Axios TypeScript definitions mặc định khai báo phương thức trả về `AxiosResponse<T>`. Vì interceptor tự ý unwrap `response.data` ở runtime mà không khai báo mở rộng kiểu (Module Augmentation) cho Axios, compiler TypeScript báo lỗi và lập trình viên phải "chữa cháy" bằng cú pháp hai lần ép kiểu `as unknown as`.
* **Hậu quả:** Khi backend thay đổi cấu trúc DTO hoặc đổi tên trường, TypeScript hoàn toàn không thể phát hiện lỗi lúc build time, dẫn đến lỗi runtime âm thầm trên production.

---

### 🟡 Vấn đề 4: Thông báo lỗi thô sơ, lộ chi tiết kỹ thuật 500/Backend ra UI

> [!WARNING]
> **Mức độ: Trung bình - Cao (Medium-High)**  
> **Vị trí:** [`src/config/axios-error-helper.ts`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/config/axios-error-helper.ts#L37-L41)

```typescript
export function getBackendErrorMessage(data: Partial<IResponse<unknown>>) {
  return (
    data.message || data.error || 'Thao tác không thành công. Vui lòng thử lại.'
  );
}
```

#### Rủi ro thực tế:
1. **Lộ lỗi kỹ thuật & Stack Trace**: Nếu backend gặp lỗi chưa bắt (Unhandled Exception), database query fail hoặc crash, các chuỗi như `NullPointerException`, `syntax error at or near...`, `E11000 duplicate key error`, `Deadlock found` sẽ được đẩy thẳng lên màn hình người dùng qua `data.message`. Điều này vừa gây hoang mang cho người dùng thông thường, vừa tiềm ẩn nguy cơ bảo mật rò rỉ cấu trúc hệ thống.
2. **Không có thông điệp hướng dẫn hành động (Actionable Guidance)**: Khi server trả 500, hệ thống chỉ báo `Máy chủ gặp sự cố`. Người dùng không biết nên làm gì tiếp theo: chờ đợi, tải lại trang, hay kiểm tra tài khoản thanh toán.
3. **Nguy cơ bão thông báo (Notification Flood)**: Khi một trang web kích hoạt 4–5 API đồng thời (ví dụ khi mở Dashboard/Chi tiết phim) mà kết nối mạng chập chờn hoặc backend khởi động lại, Ant Design Notification sẽ bung ra 5 popup liên tiếp đè kín góc màn hình, tạo trải nghiệm rất ức chế cho người dùng.

---

### 🟡 Vấn đề 5: Ảo giác bảo mật (Security through obscurity) với mã hóa DES

> [!NOTE]
> **Mức độ: Trung bình (Medium)**  
> **Vị trí:** [`src/shared/utils/desEncrypt.ts`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/shared/utils/desEncrypt.ts) và [`.env.example`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/.env.example)

1. Thuật toán **DES** đã lỗi thời từ nhiều thập kỷ, không còn an toàn mật mã.
2. Mã hóa token ở phía client bằng khóa bí mật (`VITE_DES_ENCRYPT_KEY` hoặc hardcode `'ghkd324i0230'`) nằm ngay trong source code JavaScript được tải về trình duyệt người dùng. Bất kỳ ai mở DevTools đều có thể lấy khóa và giải mã token.
3. Mã hóa client-side lưu vào `localStorage` không chống được XSS: mã script độc hại chạy cùng domain có toàn quyền gọi hàm `tokenManager.getAccessToken()`.

---

### 🟡 Vấn đề 6: Lỗi tiềm ẩn Crash ứng dụng tại `storage.ts`

> [!WARNING]
> **Mức độ: Trung bình (Medium)**  
> **Vị trí:** [`src/shared/utils/storage.ts`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/shared/utils/storage.ts#L2-L18)

1. **So sánh sai `null`**: `localStorage.getItem(key)` khi không tìm thấy trả về `null`. Biểu thức `null !== 'undefined'` cho kết quả `true`, dẫn đến `JSON.parse(null)` được gọi (trả về `null` thay vì `undefined`).
2. **Không có `try-catch` bọc ngoài**: Nếu giá trị trong `localStorage` là chuỗi text thuần túy không phải JSON hợp lệ (ví dụ mã code cũ lưu `localStorage.setItem('user_name', 'Nguyen Van A')`), `JSON.parse()` sẽ quăng ngoại lệ **`SyntaxError` không được bắt**, làm sập toàn bộ ứng dụng (White Screen of Death).
3. **Lỗi `TypeError` trong hàm `remove`**: Hàm `remove(item, key)` giả định `localStorage.getItem(item)` luôn là chuỗi JSON của một object. Nếu key rỗng, lệnh `delete store[key]` sẽ gây lỗi `TypeError: Cannot delete property of null`.

---

### 🟡 Vấn đề 7: Cấu hình `staleTime: 2` và quản lý Server State trong React Query

> [!NOTE]
> **Mức độ: Trung bình (Medium)**  
> **Vị trí:** [`src/config/reactQuery/react-query.ts`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/config/reactQuery/react-query.ts#L6)

1. **`staleTime: 2` (2 mili-giây)**: Giá trị này tương đương 0, khiến mọi truy vấn đều bị coi là đã cũ ngay lập tức sau khi fetch. Mỗi khi component mount hoặc chuyển trang quay lại, request đều bị bắn lại liên tục vào backend.
2. **Chưa tận dụng `useMutation`**: Các thao tác thay đổi dữ liệu (như `updateProfileApi`, `lockSeatsApi`, `unlockSeatsApi`) đang được gọi bằng `async/await` thông thường kết hợp `useState(isLoading)` tự chế, thay vì dùng `useMutation` để tận dụng tự động xử lý trạng thái `isPending`, rollback dữ liệu (optimistic update), và tự động `invalidateQueries`.

---

## 4. Hướng dẫn & Mã nguồn chuẩn hóa (Refactoring Solutions)

### 4.1. Chuẩn hóa hệ thống thông báo thân thiện (Friendly Error UX & Chống Spam)

Để không bao giờ để lộ lỗi 500, chuỗi ngoại lệ thô, hoặc quăng 5 popup cùng lúc lên màn hình, giải pháp gồm 3 lớp bảo vệ:
1. **Lớp 1 - Từ điển mã lỗi thân thiện (Friendly Dictionary)**: Ánh xạ mã HTTP và mã Backend sang tiếng Việt lịch sự kèm hướng dẫn cụ thể.
2. **Lớp 2 - Bộ lọc làm sạch (Error Sanitizer)**: Phát hiện dấu hiệu lỗi nội bộ (như `Exception`, `SQL`, `null pointer`, `stack trace`, tiếng Anh kỹ thuật) để thay thế bằng thông báo an toàn.
3. **Lớp 3 - Cơ chế chống Spam (Deduplication / Debounce)**: Đảm bảo cùng một thông điệp lỗi hoặc chuỗi lỗi sập mạng trong 2.5 giây chỉ hiển thị 1 thông báo duy nhất.

#### Triển khai nâng cấp cho [`src/config/axios-error-helper.ts`](file:///d:/Codes/Gitlap/UI/base-react-vite-main/src/config/axios-error-helper.ts):

```typescript
// src/config/axios-error-helper.ts
import type { AxiosError } from 'axios';
import { notification } from 'antd';
import { BACKEND_ERROR_CODES } from '@shared/constants/backend-error-code';
import type { IResponse } from '@shared/types/response';

// 1. Quản lý chống Spam Notification (Debounce / Deduplication)
const activeNotificationSet = new Set<string>();

const showSafeNotification = (
  type: 'error' | 'warning' | 'info',
  messageTitle: string,
  description?: string,
  keyOverride?: string,
) => {
  const dedupeKey = keyOverride || `${type}:${messageTitle}:${description || ''}`;

  if (activeNotificationSet.has(dedupeKey)) {
    return; // Đang hiển thị thông báo tương tự, bỏ qua để tránh spam
  }

  activeNotificationSet.add(dedupeKey);

  notification[type]({
    key: dedupeKey,
    message: messageTitle,
    description,
    duration: 4.5,
    onClose: () => {
      activeNotificationSet.delete(dedupeKey);
    },
  });

  // Tự động giải phóng sau 2.5s phòng trường hợp notification đóng sớm
  setTimeout(() => {
    activeNotificationSet.delete(dedupeKey);
  }, 2500);
};

export const notify = {
  error: (msg?: string, title = 'Thông báo sự cố') =>
    showSafeNotification('error', title, msg),
  warning: (msg?: string, title = 'Cảnh báo') =>
    showSafeNotification('warning', title, msg),
  info: (msg?: string, title = 'Thông báo') =>
    showSafeNotification('info', title, msg),
};

// 2. Danh mục thông điệp thân thiện theo HTTP Status
const HTTP_ERROR_MESSAGES: Record<number, { title: string; desc: string }> = {
  400: {
    title: 'Dữ liệu chưa hợp lệ',
    desc: 'Vui lòng kiểm tra lại các trường thông tin và thử lại.',
  },
  401: {
    title: 'Phiên làm việc hết hạn',
    desc: 'Vui lòng đăng nhập lại để tiếp tục sử dụng dịch vụ.',
  },
  403: {
    title: 'Không có quyền truy cập',
    desc: 'Tài khoản của bạn không có quyền thực hiện thao tác này.',
  },
  404: {
    title: 'Không tìm thấy dữ liệu',
    desc: 'Tài nguyên hoặc đường dẫn bạn yêu cầu hiện không tồn tại.',
  },
  408: {
    title: 'Hết thời gian phản hồi',
    desc: 'Máy chủ phản hồi quá chậm. Vui lòng kiểm tra lại mạng và thử lại.',
  },
  429: {
    title: 'Thao tác quá nhanh',
    desc: 'Hệ thống đang tiếp nhận quá nhiều yêu cầu. Vui lòng thử lại sau giây lát.',
  },
  500: {
    title: 'Hệ thống đang bảo trì hoặc quá tải',
    desc: 'Dịch vụ tạm thời gián đoạn. Đội ngũ kỹ thuật đang xử lý, bạn vui lòng thử lại sau ít phút.',
  },
  502: {
    title: 'Cổng kết nối gián đoạn',
    desc: 'Không thể kết nối đến máy chủ xử lý. Vui lòng thử lại sau giây lát.',
  },
  503: {
    title: 'Dịch vụ tạm ngừng phục vụ',
    desc: 'Hệ thống đang bảo trì định kỳ. Quý khách vui lòng quay lại sau.',
  },
  504: {
    title: 'Kết nối máy chủ quá hạn',
    desc: 'Yêu cầu xử lý mất nhiều thời gian hơn dự kiến. Vui lòng làm mới trang.',
  },
};

// 3. Bộ lọc kiểm tra chuỗi kỹ thuật nội bộ (Sanitizer)
const TECHNICAL_ERROR_PATTERNS = [
  /exception/i,
  /sql/i,
  /syntax\s+error/i,
  /null\s*pointer/i,
  /stack\s*trace/i,
  /failed\s+to\s+execute/i,
  /cannot\s+read\s+properties/i,
  /undefined/i,
  /e11000/i,
  /table\s+doesn't\s+exist/i,
  /connection\s+refused/i,
  /internal\s+server\s+error/i,
  /deadlock/i,
];

export function sanitizeErrorMessage(rawMessage?: string | null): string {
  if (!rawMessage || typeof rawMessage !== 'string') {
    return 'Thao tác không thành công. Quý khách vui lòng thử lại sau.';
  }

  const trimmed = rawMessage.trim();

  // Kiểm tra xem message có chứa từ khóa lỗi kỹ thuật của backend không
  const isTechnical = TECHNICAL_ERROR_PATTERNS.some((pattern) =>
    pattern.test(trimmed),
  );

  if (isTechnical) {
    return 'Hệ thống đang xử lý yêu cầu khác hoặc tạm thời quá tải. Vui lòng thử lại sau ít phút.';
  }

  return trimmed;
}

export function getBackendErrorMessage(data: Partial<IResponse<unknown>>) {
  const rawMsg = data.message || data.error;
  return sanitizeErrorMessage(rawMsg);
}

// 4. Xử lý lỗi HTTP chung kết hợp Bộ lọc thân thiện
export function handleCommonHttpError(error: AxiosError<IResponse<unknown>>) {
  // Lỗi mạng hoặc máy chủ không phản hồi
  if (!error.response) {
    notify.error(
      'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại tín hiệu Wi-Fi/4G của bạn.',
      'Lỗi kết nối mạng',
    );
    return Promise.reject(error);
  }

  const { status, data } = error.response;

  // Lỗi nghiệp vụ từ phía Backend có mã lỗi trả về
  if (isBusinessResponseFailed(data)) {
    return rejectBusinessError(data);
  }

  // Ánh xạ lỗi HTTP ra thông điệp thân thiện
  const friendlyConfig = HTTP_ERROR_MESSAGES[status];
  if (friendlyConfig) {
    if (status >= 500) {
      notify.error(friendlyConfig.desc, friendlyConfig.title);
    } else {
      notify.warning(friendlyConfig.desc, friendlyConfig.title);
    }
    return Promise.reject(error);
  }

  // Lỗi khác nằm ngoài dải thông dụng
  const safeMessage = getBackendErrorMessage(data ?? {});
  notify.error(safeMessage, 'Thông báo sự cố');
  return Promise.reject(error);
}
```

---

### 4.2. Chuẩn hóa Type cho Axios Client (Xóa bỏ hoàn toàn `as unknown as`)

Tạo file khai báo kiểu `src/types/axios.d.ts`:

```typescript
// src/types/axios.d.ts
import 'axios';
import type { BaseResponse } from '@shared/types/api.types';

declare module 'axios' {
  export interface AxiosInstance {
    get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<BaseResponse<T>>;
    delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<BaseResponse<T>>;
    post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<BaseResponse<T>>;
    put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<BaseResponse<T>>;
    patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<BaseResponse<T>>;
  }
}
```

Khi đó, các hàm API sẽ trở nên ngắn gọn, an toàn và tự động nhận diện kiểu:

```typescript
// src/features/auth/api/auth.api.ts
export const loginApi = async (body: LoginRequest): Promise<LoginResponseData> => {
  const res = await axiosClient.post<LoginResponseData>('/auth/login', body);
  return res.data; // res.data tự động có kiểu LoginResponseData
};
```

---

### 4.3. Viết lại `refreshToken.ts` an toàn, chống Deadlock & Hang

```typescript
// src/shared/utils/refreshToken.ts
import axios from 'axios';
import axiosClient, { type IOriginRequest } from '@config/axios-instance';
import { LOGIN_PATH } from '@shared/constants/path';
import tokenManager from './tokenManager';

interface IFailedQueueItem {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}

let isRefreshing = false;
let failedQueue: IFailedQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const handleRefreshToken = async (originalRequest: IOriginRequest) => {
  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then((token) => {
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
      }
      return axiosClient(originalRequest);
    });
  }

  originalRequest._retry = true;
  isRefreshing = true;

  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) {
    isRefreshing = false;
    tokenManager.removeAccessToken();
    tokenManager.removeRefreshToken();
    window.location.href = LOGIN_PATH;
    return Promise.reject(new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'));
  }

  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL || '/api/v1'}/auth/refresh-token`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const newAccessToken = data?.data?.accessToken;
    const newRefreshToken = data?.data?.refreshToken;

    if (!newAccessToken) {
      throw new Error('Refresh token không hợp lệ hoặc đã hết hạn.');
    }

    tokenManager.setAccessToken(newAccessToken);
    if (newRefreshToken) {
      tokenManager.setRefreshToken(newRefreshToken);
    }

    if (originalRequest.headers) {
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    }

    processQueue(null, newAccessToken);
    return axiosClient(originalRequest);
  } catch (err) {
    tokenManager.removeAccessToken();
    tokenManager.removeRefreshToken();
    processQueue(err, null);
    window.location.href = LOGIN_PATH;
    return Promise.reject(err);
  } finally {
    isRefreshing = false; // Luôn giải phóng trạng thái trong finally
  }
};
```

---

### 4.4. Viết lại `lcStorage` phòng thủ chống Crash

```typescript
// src/shared/utils/storage.ts
export const lcStorage = {
  get: <T = unknown>(key: string): T | undefined => {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === 'undefined') return undefined;
      return JSON.parse(item) as T;
    } catch {
      return undefined;
    }
  },

  set: (key: string, value: unknown): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Lỗi khi lưu localStorage key "${key}":`, e);
    }
  },

  delete: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Lỗi khi xóa localStorage key "${key}":`, e);
    }
  },
};
```

---

### 4.5. Tối ưu cấu hình TanStack Query

```typescript
// src/config/reactQuery/react-query.ts
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,      // Dữ liệu fresh trong 1 phút mặc định
      gcTime: 10 * 60 * 1000,     // Giữ trong cache 10 phút
      refetchOnWindowFocus: false, // Tránh refetch liên tục khi chuyển tab
      retry: (failureCount, error) => {
        // Không retry nếu lỗi 401 hoặc 403
        const status = (error as { response?: { status: number } })?.response?.status;
        if (status === 401 || status === 403 || status === 404) return false;
        return failureCount < 2;
      },
    },
  },
});

export default queryClient;
```

---

## 5. Lộ trình thực hiện khuyến nghị (Action Plan)

- [ ] **Giai đoạn 1 (Khẩn cấp - Sửa lỗi sập & treo hệ thống):**
  - Cập nhật `refreshToken.ts` với khối `try/catch/finally` và xử lý trường hợp không có refresh token để triệt tiêu lỗi treo ứng dụng.
  - Bổ sung `try/catch` cho `storage.ts` để chống văng lỗi `SyntaxError`.
  - **Cập nhật `axios-error-helper.ts`**: Triển khai `sanitizeErrorMessage` chặn stack trace kỹ thuật và cơ chế `Deduplication` chống nổ nhiều popup thông báo cùng lúc khi server lỗi 500.
- [ ] **Giai đoạn 2 (Chuẩn hóa Kiến trúc & Type):**
  - Thống nhất một interface phản hồi duy nhất (`BaseResponse<T>`) giữa `api.types.ts` và `response.ts`.
  - Cấu hình Module Augmentation cho Axios và loại bỏ tất cả cú pháp `as unknown as` trong các file `.api.ts`.
  - Chuẩn hóa interceptor `axios-instance.ts` luôn trả về một khuôn dữ liệu nhất quán cho mọi method HTTP.
- [ ] **Giai đoạn 3 (Tối ưu Hiệu năng & UI State):**
  - Cập nhật `staleTime: 60000` trong `react-query.ts`.
  - Chuyển đổi các API cập nhật (cập nhật hồ sơ cá nhân, giữ ghế, hủy ghế) sang hook `useMutation`.
  - Loại bỏ mã hóa DES client-side không cần thiết để đơn giản hóa luồng lưu trữ token.
