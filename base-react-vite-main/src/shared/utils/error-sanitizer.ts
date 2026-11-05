/**
 * Error Sanitizer & Translation Utility
 * Maps technical backend error codes / strings to user-friendly Vietnamese messages.
 */

const ERROR_CODE_TRANSLATIONS: Record<string, string> = {
  // Common / System codes
  common_500: 'Hệ thống đang bận hoặc gặp sự cố xử lý. Vui lòng thử lại sau ít phút.',
  common_400: 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.',
  common_401: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  common_403: 'Bạn không có quyền thực hiện thao tác này.',
  common_404: 'Không tìm thấy dữ liệu yêu cầu.',
  common_422: 'Dữ liệu gửi lên không đúng định dạng. Vui lòng kiểm tra lại.',

  // Network & Transport
  network_error: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.',
  timeout: 'Yêu cầu phản hồi quá lâu. Vui lòng kiểm tra lại đường truyền.',
  econnrefused: 'Không thể kết nối đến máy chủ hệ thống.',

  // Seat & Showtime
  seat_alreadylocked: 'Ghế bạn chọn đang có người khác giữ chỗ. Vui lòng chọn ghế khác.',
  seat_booked: 'Ghế bạn chọn đã được bán. Vui lòng chọn ghế khác.',
  seat_invalid: 'Thông tin ghế không hợp lệ. Vui lòng tải lại sơ đồ ghế.',
  showtime_expired: 'Suất chiếu này đã bắt đầu hoặc không còn nhận đặt vé trực tuyến.',
  lock_expired: 'Thời gian giữ ghế đã hết hạn. Vui lòng chọn lại ghế.',

  // Order & Ticket
  order_notfound: 'Không tìm thấy thông tin đơn hàng.',
  order_alreadypaid: 'Đơn hàng này đã được thanh toán thành công trước đó.',
  order_expired: 'Đơn hàng đã quá thời hạn thanh toán (tối đa 10 phút).',
  order_cancelled: 'Đơn hàng đã bị hủy.',

  // Voucher / Promotion
  voucher_notfound: 'Mã giảm giá không tồn tại trong hệ thống.',
  voucher_invalid: 'Mã giảm giá không đủ điều kiện áp dụng cho đơn hàng này.',
  voucher_expired: 'Mã giảm giá đã hết hạn sử dụng.',
  voucher_usageexceeded: 'Mã giảm giá đã hết lượt sử dụng.',

  // Payment
  payment_failed: 'Giao dịch thanh toán chưa thành công. Vui lòng thử lại hoặc chọn phương thức khác.',
  payment_cancelled: 'Bạn đã hủy giao dịch thanh toán.',
  payment_gateway_error: 'Cổng thanh toán đang bảo trì hoặc bận. Vui lòng thử lại sau.',

  // Auth & Account
  auth_usernotfound: 'Tài khoản không tồn tại trong hệ thống.',
  auth_wrongpassword: 'Mật khẩu đăng nhập không chính xác.',
  auth_emailexisted: 'Email này đã được đăng ký bởi tài khoản khác.',
  auth_phoneexisted: 'Số điện thoại này đã được đăng ký.',
};

/**
 * Standardize any backend error code or technical message to polite, human-readable Vietnamese.
 */
export function sanitizeErrorMessage(rawInput?: unknown): string {
  if (!rawInput) {
    return 'Thao tác không thành công. Vui lòng thử lại sau.';
  }

  // Extract string message if rawInput is an Error or Object
  let rawStr = '';
  if (typeof rawInput === 'string') {
    rawStr = rawInput;
  } else if (rawInput instanceof Error) {
    rawStr = rawInput.message;
  } else if (typeof rawInput === 'object') {
    const obj = rawInput as Record<string, unknown>;
    rawStr = String(obj.message || obj.error || obj.errorCode || obj.title || '');
  }

  const trimmed = rawStr.trim();
  if (!trimmed) {
    return 'Thao tác không thành công. Vui lòng thử lại sau.';
  }

  // 1. Direct or normalized key match
  const normalizedKey = trimmed.toLowerCase().replace(/[\s-]+/g, '_');
  if (ERROR_CODE_TRANSLATIONS[normalizedKey]) {
    return ERROR_CODE_TRANSLATIONS[normalizedKey];
  }

  // Check without underscores
  const pureKey = normalizedKey.replace(/_/g, '');
  for (const [key, val] of Object.entries(ERROR_CODE_TRANSLATIONS)) {
    if (key.replace(/_/g, '') === pureKey) {
      return val;
    }
  }

  // 2. Pattern check for typical technical codes (e.g. Common_500, ORDER_400, etc.)
  const isCodePattern = /^[A-Za-z0-9]+_[A-Za-z0-9_]+$/.test(trimmed);
  const isTechnicalPhrase =
    /internal server error|network error|econnrefused|timeout|sqlstate|unhandled|nullpointer/i.test(
      trimmed,
    );

  if (isCodePattern || isTechnicalPhrase) {
    if (trimmed.includes('500') || isTechnicalPhrase) {
      return 'Hệ thống đang bận hoặc gặp sự cố xử lý. Vui lòng thử lại sau ít phút.';
    }
    if (trimmed.includes('400') || trimmed.includes('422')) {
      return 'Dữ liệu yêu cầu không hợp lệ. Vui lòng kiểm tra lại.';
    }
    if (trimmed.includes('404')) {
      return 'Không tìm thấy dữ liệu yêu cầu.';
    }
    if (trimmed.includes('401') || trimmed.includes('403')) {
      return 'Bạn không có quyền hoặc phiên đăng nhập đã hết hạn.';
    }
    return 'Thao tác không thành công. Vui lòng thử lại sau ít phút.';
  }

  // 3. If it is already a descriptive Vietnamese or readable message, return it
  return trimmed;
}
