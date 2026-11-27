import axiosClient from '@config/axios-instance';
import type { BaseResponse, MetaData } from '@shared/types/api.types';
import type {
  ShowtimeAdminDto,
  CreateShowtimeDto,
  UpdateShowtimeDto,
} from '../types/admin.types';

export interface GetAdminShowtimesParams {
  theaterId?: string;
  roomId?: string;
  date?: string;
  page?: number;
  pageSize?: number;
}

export const getAdminShowtimesApi = async (
  params?: GetAdminShowtimesParams,
): Promise<{ data: ShowtimeAdminDto[]; metaData?: MetaData }> => {
  const res = (await axiosClient.get('/admin/showtimes', { params })) as unknown as {
    data: ShowtimeAdminDto[];
    metaData?: MetaData;
  };
  return res;
};

export const createAdminShowtimeApi = async (body: CreateShowtimeDto): Promise<ShowtimeAdminDto> => {
  const res = await axiosClient.post<BaseResponse<ShowtimeAdminDto>>('/admin/showtimes', body);
  return (res as unknown as BaseResponse<ShowtimeAdminDto>).data;
};

export const updateAdminShowtimeApi = async (id: string, body: UpdateShowtimeDto): Promise<ShowtimeAdminDto> => {
  const res = await axiosClient.put<BaseResponse<ShowtimeAdminDto>>(`/admin/showtimes/${id}`, body);
  return (res as unknown as BaseResponse<ShowtimeAdminDto>).data;
};

export const deleteAdminShowtimeApi = async (id: string): Promise<void> => {
  await axiosClient.delete(`/admin/showtimes/${id}`);
};
