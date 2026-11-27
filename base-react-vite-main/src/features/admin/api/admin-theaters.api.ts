import { unwrapArray } from './admin-api.utils';
import axiosClient from '@config/axios-instance';
import type { BaseResponse } from '@shared/types/api.types';
import type {
  TheaterWithRoomsDto,
  RoomSeatMatrixDto,
  CreateRoomDto,
  RoomDto,
} from '../types/admin.types';

export const getAdminTheatersApi = async (): Promise<TheaterWithRoomsDto[]> => {
  const res = await axiosClient.get<BaseResponse<TheaterWithRoomsDto[]>>('/admin/theaters');
  return unwrapArray<TheaterWithRoomsDto>(res);
};

export const getRoomSeatMatrixApi = async (roomId: string): Promise<RoomSeatMatrixDto> => {
  const res = await axiosClient.get<BaseResponse<RoomSeatMatrixDto>>(`/admin/rooms/${roomId}/seat-matrix`);
  return res as unknown as RoomSeatMatrixDto;
};

export const createAdminRoomApi = async (body: CreateRoomDto): Promise<RoomDto> => {
  const res = await axiosClient.post<BaseResponse<RoomDto>>('/admin/rooms', body);
  return (res as unknown as BaseResponse<RoomDto>).data;
};

export const updateRoomSeatsStatusApi = async (
  roomId: string,
  body: { seatIds: string[]; status: 'ACTIVE' | 'MAINTENANCE'; reason?: string },
): Promise<void> => {
  await axiosClient.patch(`/admin/rooms/${roomId}/seats/status`, body);
};
