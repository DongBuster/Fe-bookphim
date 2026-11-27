import { unwrapArray } from './admin-api.utils';
import axiosClient from '@config/axios-instance';
import axiosFileClient from '@config/axios-file-instance';
import type { BaseResponse } from '@shared/types/api.types';
import type { PaymentMethodReportDto, RevenueReportDto } from '../types/admin.types';

export interface GetRevenueReportParams {
  fromDate: string;
  toDate: string;
  theaterId?: string;
  groupBy?: 'day' | 'week' | 'month';
}

export const getAdminRevenueReportApi = async (
  params: GetRevenueReportParams,
): Promise<RevenueReportDto> => {
  const res = await axiosClient.get<BaseResponse<RevenueReportDto>>('/admin/reports/revenue', {
    params,
  });
  return res as unknown as RevenueReportDto;
};

export const getAdminPaymentMethodReportApi = async (
  params: Pick<GetRevenueReportParams, 'fromDate' | 'toDate' | 'theaterId'>,
): Promise<PaymentMethodReportDto[]> => {
  const res = await axiosClient.get<BaseResponse<PaymentMethodReportDto[]>>(
    '/admin/reports/payment-methods',
    { params },
  );
  return unwrapArray<PaymentMethodReportDto>(res);
};

export const exportAdminRevenueCsvApi = async (params: GetRevenueReportParams): Promise<Blob> => {
  const res = await axiosFileClient.get('/admin/reports/export', {
    params,
    responseType: 'blob',
  });
  return res.data as Blob;
};
