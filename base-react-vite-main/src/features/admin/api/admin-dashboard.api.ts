import axiosClient from '@config/axios-instance';
import type { BaseResponse } from '@shared/types/api.types';
import type {
  DashboardOverviewDto,
  RevenueChartDto,
  TopMovieRevenueDto,
  ShowtimeAdminDto,
} from '../types/admin.types';

export const getDashboardOverviewApi = async (): Promise<DashboardOverviewDto> => {
  const res = await axiosClient.get<BaseResponse<DashboardOverviewDto>>('/admin/dashboard/overview');
  return res as unknown as DashboardOverviewDto;
};

export const getRevenueChartApi = async (params: {
  from?: string;
  to?: string;
  groupBy?: 'day' | 'week' | 'month';
}): Promise<RevenueChartDto> => {
  const res = await axiosClient.get<BaseResponse<RevenueChartDto>>('/admin/dashboard/revenue-chart', { params });
  return res as unknown as RevenueChartDto;
};

export const getTopMoviesApi = async (limit = 5): Promise<TopMovieRevenueDto[]> => {
  const res = await axiosClient.get<BaseResponse<TopMovieRevenueDto[]>>('/admin/dashboard/top-movies', {
    params: { limit },
  });
  return res as unknown as TopMovieRevenueDto[];
};

export const getUpcomingShowtimesApi = async (withinHours = 2): Promise<ShowtimeAdminDto[]> => {
  const res = await axiosClient.get<BaseResponse<ShowtimeAdminDto[]>>('/admin/dashboard/upcoming-showtimes', {
    params: { withinHours },
  });
  return res as unknown as ShowtimeAdminDto[];
};
