import axiosClient from '@config/axios-instance';
import type { BaseResponse, MetaData } from '@shared/types/api.types';
import type {
  BannerAdminDto,
  ReviewAdminDto,
  UpsertBannerDto,
} from '../types/admin.types';

export const getAdminBannersApi = async (): Promise<BannerAdminDto[]> => {
  const res = await axiosClient.get<BaseResponse<BannerAdminDto[]>>('/admin/banners');
  return res as unknown as BannerAdminDto[];
};

export const createAdminBannerApi = async (body: UpsertBannerDto): Promise<BannerAdminDto> => {
  const res = await axiosClient.post<BaseResponse<BannerAdminDto>>('/admin/banners', body);
  return (res as unknown as BaseResponse<BannerAdminDto>).data;
};

export const updateAdminBannerApi = async (
  id: string,
  body: Partial<UpsertBannerDto>,
): Promise<BannerAdminDto> => {
  const res = await axiosClient.put<BaseResponse<BannerAdminDto>>(`/admin/banners/${id}`, body);
  return (res as unknown as BaseResponse<BannerAdminDto>).data;
};

export const toggleAdminBannerApi = async (id: string, isActive: boolean): Promise<void> => {
  await axiosClient.patch(`/admin/banners/${id}/toggle`, { isActive });
};

export const deleteAdminBannerApi = async (id: string): Promise<void> => {
  await axiosClient.delete(`/admin/banners/${id}`);
};

export const getAdminReviewsApi = async (params?: {
  status?: 'ALL' | 'VISIBLE' | 'HIDDEN';
  page?: number;
  pageSize?: number;
}): Promise<{ data: ReviewAdminDto[]; metaData?: MetaData }> => {
  const res = (await axiosClient.get('/admin/reviews', { params })) as unknown as {
    data: ReviewAdminDto[];
    metaData?: MetaData;
  };
  return res;
};

export const toggleReviewVisibilityApi = async (id: string, isHidden: boolean): Promise<void> => {
  await axiosClient.patch(`/admin/reviews/${id}/visibility`, { isHidden });
};
