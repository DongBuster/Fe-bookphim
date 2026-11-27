import { unwrapArray, unwrapPaginated } from './admin-api.utils';
import axiosClient from '@config/axios-instance';
import type { BaseResponse, MetaData } from '@shared/types/api.types';
import type {
  ConcessionDto,
  UpsertConcessionDto,
  VoucherDto,
  CreateVoucherDto,
} from '../types/admin.types';

export const getAdminConcessionsApi = async (): Promise<ConcessionDto[]> => {
  const res = await axiosClient.get<BaseResponse<ConcessionDto[]>>('/admin/concessions');
  return unwrapArray<ConcessionDto>(res);
};

export const upsertAdminConcessionApi = async (body: UpsertConcessionDto): Promise<ConcessionDto> => {
  const res = await axiosClient.post<BaseResponse<ConcessionDto>>('/admin/concessions', body);
  return (res as unknown as BaseResponse<ConcessionDto>).data;
};

export const toggleConcessionAvailabilityApi = async (id: string, isAvailable: boolean): Promise<void> => {
  await axiosClient.patch(`/admin/concessions/${id}/availability`, { isAvailable });
};

export const getAdminVouchersApi = async (params?: {
  page?: number;
  pageSize?: number;
  status?: string;
}): Promise<{ data: VoucherDto[]; metaData?: MetaData }> => {
  const res = await axiosClient.get('/admin/vouchers', { params });
  return unwrapPaginated<VoucherDto>(res);
};

export const createAdminVoucherApi = async (body: CreateVoucherDto): Promise<VoucherDto> => {
  const res = await axiosClient.post<BaseResponse<VoucherDto>>('/admin/vouchers', body);
  return (res as unknown as BaseResponse<VoucherDto>).data;
};

export const deactivateAdminVoucherApi = async (id: string): Promise<void> => {
  await axiosClient.patch(`/admin/vouchers/${id}/deactivate`);
};
