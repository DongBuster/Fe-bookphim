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
  TurnstileCheckInResponseData,
  TicketRefundResponseData,
  UnlockSeatsRequest,
} from '@shared/types/api.types';

/**
 * Lấy thông tin vé điện tử thông minh (Smart E-Ticket)
 * Endpoint: GET /api/v1/tickets/{passCode}
 */
export const getTicketPassApi = async (
  passCode: string,
  options?: { silent?: boolean },
): Promise<TicketDto> => {
  const cleanCode = passCode.replace(/[\s#]/g, '').trim();
  const res = (await axiosClient.get(`/tickets/${encodeURIComponent(cleanCode)}`, {
    silent: options?.silent,
  })) as unknown as BaseResponse<TicketDto> | TicketDto;

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
  options?: { silent?: boolean },
): Promise<OrderDto> => {
  const cleanCode = orderCode.replace(/[\s#]/g, '').trim();
  const res = (await axiosClient.get(`/orders/code/${encodeURIComponent(cleanCode)}`, {
    silent: options?.silent,
  })) as unknown as BaseResponse<OrderDto> | OrderDto;

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
  options?: { silent?: boolean },
): Promise<OrderDto> => {
  const res = (await axiosClient.get(`/orders/${encodeURIComponent(id)}`, {
    silent: options?.silent,
  })) as unknown as BaseResponse<OrderDto> | OrderDto;

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
  const cleanCode = passCode.replace(/[\s#]/g, '').trim();
  return `/api/v1/tickets/qr/${encodeURIComponent(cleanCode)}`;
};

/**
 * Cổng soát vé tự động (Fast-Track Turnstile Check-In)
 * Endpoint: POST /api/v1/tickets/turnstile-checkin
 */
export const turnstileCheckInApi = async (
  body: TurnstileCheckInRequest,
  options?: { silent?: boolean },
): Promise<TurnstileCheckInResponseData> => {
  const res = (await axiosClient.post<BaseResponse<TurnstileCheckInResponseData>>(
    '/tickets/turnstile-checkin',
    {
      passCode: body.passCode.replace(/[\s#]/g, '').trim(),
      deviceId: body.deviceId || 'GATE_TURNSTILE_01',
      gateNumber: body.gateNumber || 'Cổng VIP Fast-Track 01',
    },
    {
      silent: options?.silent,
    },
  )) as unknown as BaseResponse<TurnstileCheckInResponseData> | TurnstileCheckInResponseData;

  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as TurnstileCheckInResponseData;
};

/**
 * Yêu cầu hoàn vé / hủy vé điện tử (ít nhất 60 phút trước giờ chiếu)
 * Endpoint: POST /api/v1/tickets/{passCode}/refund
 */
export const refundTicketApi = async (
  passCode: string,
  options?: { silent?: boolean },
): Promise<TicketRefundResponseData> => {
  const cleanCode = passCode.replace(/[\s#]/g, '').trim();
  const res = (await axiosClient.post<BaseResponse<TicketRefundResponseData>>(
    `/tickets/${encodeURIComponent(cleanCode)}/refund`,
    {},
    {
      silent: options?.silent,
    },
  )) as unknown as BaseResponse<TicketRefundResponseData> | TicketRefundResponseData;

  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as TicketRefundResponseData;
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

