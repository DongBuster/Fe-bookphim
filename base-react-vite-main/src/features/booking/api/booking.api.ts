import axiosClient from '@config/axios-instance';
import type {
  BaseResponse,
  CheckoutPaymentRequest,
  CreateOrderRequest,
  LockSeatsRequest,
  LockSeatsResponseData,
  OrderDto,
  PaymentCheckoutResponseData,
  SeatMapDto,
  TicketDto,
  TurnstileCheckInRequest,
  UnlockSeatsRequest,
} from '@shared/types/api.types';

/**
 * Lấy thông tin vé điện tử thông minh (Smart E-Ticket)
 * Endpoint: GET /api/v1/tickets/{passCode}
 */
export const getTicketPassApi = async (
  passCode: string,
): Promise<TicketDto> => {
  const res = (await axiosClient.get(`/tickets/${passCode}`)) as unknown as
    | BaseResponse<TicketDto>
    | TicketDto;

  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as TicketDto;
};

/**
 * Lấy chi tiết đơn hàng theo mã đơn orderCode
 * Endpoint: GET /api/v1/orders/code/{orderCode}
 */
export const getOrderByCodeApi = async (
  orderCode: string,
): Promise<OrderDto> => {
  const res = (await axiosClient.get(`/orders/code/${orderCode}`)) as unknown as
    | BaseResponse<OrderDto>
    | OrderDto;

  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as OrderDto;
};

/**
 * Lấy chi tiết đơn hàng theo orderId
 * Endpoint: GET /api/v1/orders/{id}
 */
export const getOrderByIdApi = async (
  id: string,
): Promise<OrderDto> => {
  const res = (await axiosClient.get(`/orders/${encodeURIComponent(id)}`)) as unknown as
    | BaseResponse<OrderDto>
    | OrderDto;

  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as OrderDto;
};

/**
 * Lấy URL ảnh mã QR vé điện tử từ backend Railway
 * Endpoint: GET /api/v1/tickets/qr/{passCode}
 */
export const getTicketQrUrl = (passCode: string): string => {
  return `/api/v1/tickets/qr/${encodeURIComponent(passCode)}`;
};

/**
 * Cổng soát vé tự động (Fast-Track Turnstile Check-In)
 * Endpoint: POST /api/v1/tickets/turnstile-checkin
 */
export const turnstileCheckInApi = async (
  body: TurnstileCheckInRequest,
): Promise<boolean> => {
  const res = (await axiosClient.post<BaseResponse<boolean>>(
    '/tickets/turnstile-checkin',
    body,
  )) as unknown as BaseResponse<boolean> | boolean;

  if (res && typeof res === 'object' && 'success' in res) {
    return Boolean(res.success);
  }
  return Boolean(res);
};

/**
 * Yêu cầu hoàn vé / hủy vé điện tử (ít nhất 60 phút trước giờ chiếu)
 * Endpoint: POST /api/v1/tickets/{passCode}/refund
 */
export const refundTicketApi = async (
  passCode: string,
): Promise<boolean> => {
  const res = (await axiosClient.post<BaseResponse<boolean>>(
    `/tickets/${passCode}/refund`,
  )) as unknown as BaseResponse<boolean> | boolean;

  if (res && typeof res === 'object' && 'success' in res) {
    return Boolean(res.success);
  }
  return Boolean(res);
};

/**
 * Lấy sơ đồ ghế và trạng thái các ghế (AVAILABLE, LOCKED, BOOKED) của một suất chiếu
 * Endpoint: GET /api/v1/showtimes/{showtimeId}/seatmap
 */
export const getSeatMapApi = async (
  showtimeId: string,
  lockToken?: string | null,
): Promise<SeatMapDto> => {
  const res = (await axiosClient.get(`/showtimes/${showtimeId}/seatmap`, {
    params: lockToken ? { lockToken } : undefined,
  })) as unknown as BaseResponse<SeatMapDto> | SeatMapDto;

  if ('data' in res && res.data) {
    return res.data;
  }
  return res as SeatMapDto;
};

/**
 * Khóa ghế tạm thời 10 phút (Redis Distributed Lock)
 * Endpoint: POST /api/v1/showtimes/{showtimeId}/seats/lock
 */
export const lockSeatsApi = async (
  showtimeId: string,
  body: LockSeatsRequest,
): Promise<LockSeatsResponseData> => {
  const res = (await axiosClient.post<BaseResponse<LockSeatsResponseData>>(
    `/showtimes/${showtimeId}/seats/lock`,
    body,
  )) as unknown as BaseResponse<LockSeatsResponseData>;

  return res.data;
};

/**
 * Hủy giữ ghế (Unlock Seats)
 * Endpoint: POST /api/v1/showtimes/{showtimeId}/seats/unlock
 */
export const unlockSeatsApi = async (
  showtimeId: string,
  body: UnlockSeatsRequest,
): Promise<boolean> => {
  const res = (await axiosClient.post<BaseResponse<boolean>>(
    `/showtimes/${showtimeId}/seats/unlock`,
    body,
  )) as unknown as BaseResponse<boolean>;

  return Boolean(res.data);
};

/**
 * Tạo đơn hàng đặt vé kèm mã Idempotency-Key chống trùng lặp
 * Endpoint: POST /api/v1/orders
 */
export const createOrderApi = async (
  body: CreateOrderRequest,
): Promise<OrderDto> => {
  const idempotencyKey =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'IDEM_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

  const res = (await axiosClient.post<BaseResponse<OrderDto>>(
    '/orders',
    body,
    {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    },
  )) as unknown as BaseResponse<OrderDto> | OrderDto;

  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as OrderDto;
};

/**
 * Khởi tạo thanh toán (Checkout) qua MoMo, VNPAY, hoặc Quick-Pay
 * Endpoint: POST /api/v1/payments/checkout
 */
export const checkoutPaymentApi = async (
  body: CheckoutPaymentRequest,
): Promise<PaymentCheckoutResponseData> => {
  const res = (await axiosClient.post<BaseResponse<PaymentCheckoutResponseData>>(
    '/payments/checkout',
    body,
  )) as unknown as
    | BaseResponse<PaymentCheckoutResponseData>
    | PaymentCheckoutResponseData;

  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as PaymentCheckoutResponseData;
};

