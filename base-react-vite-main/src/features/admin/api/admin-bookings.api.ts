import axiosClient from '@config/axios-instance';
import type { BaseResponse, MetaData } from '@shared/types/api.types';
import type {
  BookingAdminDto,
  BookingDetailAdminDto,
} from '../types/admin.types';

export interface GetAdminBookingsParams {
  search?: string;
  status?: string;
  date?: string;
  page?: number;
  pageSize?: number;
}

export const getAdminBookingsApi = async (
  params?: GetAdminBookingsParams,
): Promise<{ data: BookingAdminDto[]; metaData?: MetaData }> => {
  const res = (await axiosClient.get('/admin/bookings', { params })) as unknown as {
    data: BookingAdminDto[];
    metaData?: MetaData;
  };
  return res;
};

export const getAdminBookingDetailApi = async (id: string): Promise<BookingDetailAdminDto> => {
  const res = await axiosClient.get<BaseResponse<BookingDetailAdminDto>>(`/admin/bookings/${id}`);
  return res as unknown as BookingDetailAdminDto;
};

export const checkInTicketApi = async (passCode: string): Promise<{ success: boolean; message: string }> => {
  const res = await axiosClient.post<BaseResponse<{ success: boolean; message: string }>>(
    '/admin/tickets/check-in',
    { passCode },
  );
  return (res as unknown as BaseResponse<{ success: boolean; message: string }>).data;
};

export const refundBookingApi = async (id: string, reason: string): Promise<void> => {
  await axiosClient.post(`/admin/bookings/${id}/refund`, { reason });
};
