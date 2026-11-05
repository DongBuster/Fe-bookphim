import axiosClient from '@config/axios-instance';
import type {
  BaseResponse,
  BadgeDto,
  ClaimRewardRequest,
  ClaimRewardResponseData,
  PassportDto,
} from '@shared/types/api.types';

/**
 * Lấy thông tin Hộ Chiếu Điện Ảnh, danh hiệu Cinephile, tem Hologram và huy hiệu của người dùng
 * Endpoint: GET /api/v1/passport/me
 */
export const getMyPassportApi = async (): Promise<PassportDto> => {
  const res = (await axiosClient.get('/passport/me')) as unknown as
    | BaseResponse<PassportDto>
    | PassportDto;

  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as PassportDto;
};

/**
 * Lấy toàn bộ bộ sưu tập huy hiệu hệ thống và trạng thái mở khóa
 * Endpoint: GET /api/v1/passport/badges
 */
export const getPassportBadgesApi = async (): Promise<BadgeDto[]> => {
  const res = (await axiosClient.get('/passport/badges')) as unknown as
    | BaseResponse<BadgeDto[]>
    | BadgeDto[];

  if (res && typeof res === 'object' && 'data' in res && Array.isArray(res.data)) {
    return res.data;
  }
  return (Array.isArray(res) ? res : []) as BadgeDto[];
};

/**
 * Đổi phần thưởng từ huy hiệu đã mở khóa thành điểm thưởng PhimPoints
 * Endpoint: POST /api/v1/passport/claim-reward
 */
export const claimBadgeRewardApi = async (
  body: ClaimRewardRequest,
): Promise<ClaimRewardResponseData> => {
  const res = (await axiosClient.post<BaseResponse<ClaimRewardResponseData>>(
    '/passport/claim-reward',
    body,
  )) as unknown as
    | BaseResponse<ClaimRewardResponseData>
    | ClaimRewardResponseData;

  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as ClaimRewardResponseData;
};
