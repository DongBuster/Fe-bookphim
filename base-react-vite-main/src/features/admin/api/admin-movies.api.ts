import { unwrapPaginated } from './admin-api.utils';
import axiosClient from '@config/axios-instance';
import type { BaseResponse, MetaData } from '@shared/types/api.types';
import type {
  MovieAdminDto,
  CreateMovieRequestDto,
  UpdateMovieRequestDto,
} from '../types/admin.types';

export interface GetAdminMoviesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export const getAdminMoviesApi = async (
  params?: GetAdminMoviesParams,
): Promise<{ data: MovieAdminDto[]; metaData?: MetaData }> => {
  const res = await axiosClient.get('/admin/movies', { params });
  return unwrapPaginated<MovieAdminDto>(res);
};

export const createAdminMovieApi = async (body: CreateMovieRequestDto): Promise<MovieAdminDto> => {
  const res = await axiosClient.post<BaseResponse<MovieAdminDto>>('/admin/movies', body);
  return (res as unknown as BaseResponse<MovieAdminDto>).data;
};

export const updateAdminMovieApi = async (id: string, body: UpdateMovieRequestDto): Promise<MovieAdminDto> => {
  const res = await axiosClient.put<BaseResponse<MovieAdminDto>>(`/admin/movies/${id}`, body);
  return (res as unknown as BaseResponse<MovieAdminDto>).data;
};

export const patchMovieStatusApi = async (id: string, status: string): Promise<void> => {
  await axiosClient.patch(`/admin/movies/${id}/status`, { status });
};

export const deleteAdminMovieApi = async (id: string): Promise<void> => {
  await axiosClient.delete(`/admin/movies/${id}`);
};
