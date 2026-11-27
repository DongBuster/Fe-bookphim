import { unwrapPaginated } from './admin-api.utils';
import axiosClient from '@config/axios-instance';
import type { BaseResponse, MetaData } from '@shared/types/api.types';
import type {
  CreateStaffRequestDto,
  UserAccountStatus,
  UserAdminDto,
  UserDetailAdminDto,
  UserRole,
} from '../types/admin.types';

export interface GetAdminUsersParams {
  search?: string;
  role?: UserRole | string;
  status?: UserAccountStatus | string;
  tier?: string;
  page?: number;
  pageSize?: number;
}

export const getAdminUsersApi = async (
  params?: GetAdminUsersParams,
): Promise<{ data: UserAdminDto[]; metaData?: MetaData }> => {
  const res = await axiosClient.get('/admin/users', { params });
  return unwrapPaginated<UserAdminDto>(res);
};

export const getAdminUserDetailApi = async (id: string): Promise<UserDetailAdminDto> => {
  const res = await axiosClient.get<BaseResponse<UserDetailAdminDto>>(`/admin/users/${id}`);
  return res as unknown as UserDetailAdminDto;
};

export const createAdminStaffApi = async (body: CreateStaffRequestDto): Promise<UserAdminDto> => {
  const res = await axiosClient.post<BaseResponse<UserAdminDto>>('/admin/users', body);
  return (res as unknown as BaseResponse<UserAdminDto>).data;
};

export const updateUserRoleApi = async (
  id: string,
  body: { role: UserRole; assignedTheaterId?: string },
): Promise<UserAdminDto> => {
  const res = await axiosClient.patch<BaseResponse<UserAdminDto>>(`/admin/users/${id}/role`, body);
  return (res as unknown as BaseResponse<UserAdminDto>).data;
};

export const toggleUserStatusApi = async (
  id: string,
  body: { status: UserAccountStatus; reason?: string },
): Promise<UserAdminDto> => {
  const res = await axiosClient.patch<BaseResponse<UserAdminDto>>(`/admin/users/${id}/status`, body);
  return (res as unknown as BaseResponse<UserAdminDto>).data;
};

export const resetUserPasswordApi = async (id: string, newPassword: string): Promise<void> => {
  await axiosClient.patch(`/admin/users/${id}/reset-password`, { newPassword });
};
