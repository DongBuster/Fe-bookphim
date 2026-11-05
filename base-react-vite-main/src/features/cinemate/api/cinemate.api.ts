import axiosClient from '@config/axios-instance';
import type {
  BaseResponse,
  CineMateMatchDto,
  CineMateOptInRequest,
  CineMateSendHiRequest,
} from '@shared/types/api.types';

/**
 * Đăng ký tham gia ghép đôi gu phim (CineMate) cho khán giả xem phim solo
 * Endpoint: POST /api/v1/cinemate/opt-in
 */
export const optInCineMateApi = async (
  body: CineMateOptInRequest,
): Promise<boolean> => {
  const res = (await axiosClient.post<BaseResponse<boolean>>(
    '/cinemate/opt-in',
    body,
  )) as unknown as BaseResponse<boolean> | boolean;

  if (res && typeof res === 'object' && 'success' in res) {
    return Boolean(res.success);
  }
  return Boolean(res);
};

/**
 * Tìm các bạn xem phim solo cùng suất chiếu có gu điện ảnh tương đồng (TasteMatchRate >= 70%)
 * Endpoint: GET /api/v1/cinemate/matches/{showtimeId}
 */
export const getCineMateMatchesApi = async (
  showtimeId: string,
): Promise<CineMateMatchDto[]> => {
  const res = (await axiosClient.get(`/cinemate/matches/${encodeURIComponent(showtimeId)}`)) as unknown as
    | BaseResponse<CineMateMatchDto[]>
    | CineMateMatchDto[];

  if (res && typeof res === 'object' && 'data' in res && Array.isArray(res.data)) {
    return res.data;
  }
  return (Array.isArray(res) ? res : []) as CineMateMatchDto[];
};

/**
 * Gửi lời chào làm quen lịch sự đến bạn xem phim solo cùng rạp
 * Endpoint: POST /api/v1/cinemate/send-hi
 */
export const sendCineMateGreetingApi = async (
  body: CineMateSendHiRequest,
): Promise<boolean> => {
  const res = (await axiosClient.post<BaseResponse<boolean>>(
    '/cinemate/send-hi',
    body,
  )) as unknown as BaseResponse<boolean> | boolean;

  if (res && typeof res === 'object' && 'success' in res) {
    return Boolean(res.success);
  }
  return Boolean(res);
};
