import type { AxiosError } from 'axios';
import notify from './notification';
import { BACKEND_ERROR_CODES } from '@shared/constants/backend-error-code';
import type { IResponse } from '@shared/types/response';
import { sanitizeErrorMessage } from '@/shared/utils/error-sanitizer';

export interface BusinessError extends Error {
  isBusinessError: true;
  isHandled?: boolean;
  code: number;
  serverData: IResponse<unknown>;
}

export function isBusinessError(error: unknown): error is BusinessError {
  return (
    error instanceof Error && (error as BusinessError).isBusinessError === true
  );
}

export function isResponseBody(value: unknown): value is IResponse<unknown> {
  if (!value || typeof value !== 'object') return false;

  return 'success' in value && 'code' in value;
}

export function isBusinessResponseFailed(
  value: unknown,
): value is IResponse<unknown> {
  return isResponseBody(value) && value.success === false;
}

export function getBackendErrorMessage(data: Partial<IResponse<unknown>>) {
  const raw = data.message || data.error;
  return sanitizeErrorMessage(raw);
}

export function createBusinessError(
  data: IResponse<unknown>,
  isHandled = false,
): BusinessError {
  const message = getBackendErrorMessage(data);
  const businessError = new Error(message) as BusinessError;
  businessError.isBusinessError = true;
  businessError.isHandled = isHandled;
  businessError.code = data.code ?? BACKEND_ERROR_CODES.UNKNOWN;
  businessError.serverData = data;

  return businessError;
}

export function rejectBusinessError(
  data: IResponse<unknown>,
  shouldNotify = true,
) {
  const message = getBackendErrorMessage(data);
  if (shouldNotify) {
    notify.error(message);
  }

  return Promise.reject(createBusinessError(data, shouldNotify));
}

export async function tryParseBlobErrorResponse(blob: Blob) {
  if (!blob.type.includes('application/json')) {
    return null;
  }

  try {
    const text = await blob.text();
    const json = JSON.parse(text) as unknown;
    return isResponseBody(json) ? json : null;
  } catch {
    return null;
  }
}

export function handleCommonHttpError(
  error: AxiosError<IResponse<unknown>>,
  shouldNotify = true,
) {
  (error as { isHandled?: boolean }).isHandled = true;

  if (!error.response) {
    if (shouldNotify) {
      notify.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.');
    }
    return Promise.reject(error);
  }

  const { status, data } = error.response;

  if (isBusinessResponseFailed(data)) {
    return rejectBusinessError(data, shouldNotify);
  }

  if (status === 401) {
    if (shouldNotify) {
      notify.warning('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
    return Promise.reject(error);
  }

  if (status === 403) {
    if (shouldNotify) {
      notify.warning('Bạn không có quyền thực hiện hành động này.');
    }
    return Promise.reject(error);
  }

  if (status === 404) {
    if (shouldNotify) {
      notify.warning('Không tìm thấy tài nguyên hoặc đường dẫn yêu cầu.');
    }
    return Promise.reject(error);
  }

  if (status >= 500) {
    if (shouldNotify) {
      notify.error('Hệ thống đang bận hoặc gặp sự cố. Vui lòng thử lại sau ít phút.');
    }
    return Promise.reject(error);
  }

  // Bóc tách thông báo lỗi chi tiết nếu backend trả về RFC 9110 ProblemDetails (status 400)
  let fallbackMsg = getBackendErrorMessage(data ?? {});
  const errorsObj = (data as unknown as { errors?: Record<string, string[]> })?.errors;
  if (errorsObj && typeof errorsObj === 'object') {
    const errorList = Object.values(errorsObj).flat();
    if (errorList.length > 0) {
      fallbackMsg = errorList[0];
    }
  }

  if (shouldNotify) {
    notify.error(fallbackMsg);
  }
  return Promise.reject(error);
}
