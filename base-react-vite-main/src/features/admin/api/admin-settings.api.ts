import { unwrapPaginated } from './admin-api.utils';
import axiosClient from '@config/axios-instance';
import type { BaseResponse, MetaData } from '@shared/types/api.types';
import type { AuditLogDto, SystemSettingsDto } from '../types/admin.types';

export const getAdminSettingsApi = async (): Promise<SystemSettingsDto> => {
  const res = await axiosClient.get<BaseResponse<SystemSettingsDto>>('/admin/settings');
  return res as unknown as SystemSettingsDto;
};

export const updateAdminSettingsApi = async (
  body: SystemSettingsDto,
): Promise<SystemSettingsDto> => {
  const res = await axiosClient.put<BaseResponse<SystemSettingsDto>>('/admin/settings', body);
  return (res as unknown as BaseResponse<SystemSettingsDto>).data;
};

export const getAdminAuditLogsApi = async (params?: {
  action?: string;
  resourceType?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ data: AuditLogDto[]; metaData?: MetaData }> => {
  const res = await axiosClient.get('/admin/audit-logs', { params });
  return unwrapPaginated<AuditLogDto>(res);
};
