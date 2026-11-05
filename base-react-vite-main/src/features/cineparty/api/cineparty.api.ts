import axiosClient from '@config/axios-instance';
import type {
  BaseResponse,
  CreateGroupRoomRequest,
  GroupRoomDto,
  JoinGroupRoomRequest,
  PayGroupShareRequest,
  SelectGroupSeatsRequest,
} from '@shared/types/api.types';

/**
 * Khởi tạo phòng đặt vé nhóm CineParty
 * Endpoint: POST /api/v1/group/rooms
 */
export const createGroupRoomApi = async (
  body: CreateGroupRoomRequest,
): Promise<GroupRoomDto> => {
  const res = (await axiosClient.post<BaseResponse<GroupRoomDto>>(
    '/group/rooms',
    body,
  )) as unknown as BaseResponse<GroupRoomDto> | GroupRoomDto;

  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as GroupRoomDto;
};

/**
 * Xem chi tiết phòng đặt vé nhóm và danh sách thành viên/ghế realtime
 * Endpoint: GET /api/v1/group/rooms/{roomCode}
 */
export const getGroupRoomDetailsApi = async (
  roomCode: string,
): Promise<GroupRoomDto> => {
  const res = (await axiosClient.get(`/group/rooms/${encodeURIComponent(roomCode)}`)) as unknown as
    | BaseResponse<GroupRoomDto>
    | GroupRoomDto;

  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as GroupRoomDto;
};

/**
 * Tham gia phòng đặt vé nhóm qua mã PIN 6 số
 * Endpoint: POST /api/v1/group/rooms/join
 */
export const joinGroupRoomApi = async (
  body: JoinGroupRoomRequest,
): Promise<GroupRoomDto> => {
  const res = (await axiosClient.post<BaseResponse<GroupRoomDto>>(
    '/group/rooms/join',
    body,
  )) as unknown as BaseResponse<GroupRoomDto> | GroupRoomDto;

  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as GroupRoomDto;
};

/**
 * Chọn ghế cho bản thân trong phòng CineParty
 * Endpoint: POST /api/v1/group/rooms/select-seats
 */
export const selectGroupSeatsApi = async (
  body: SelectGroupSeatsRequest,
): Promise<GroupRoomDto> => {
  const res = (await axiosClient.post<BaseResponse<GroupRoomDto>>(
    '/group/rooms/select-seats',
    body,
  )) as unknown as BaseResponse<GroupRoomDto> | GroupRoomDto;

  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as GroupRoomDto;
};

/**
 * Trưởng nhóm (Host) chốt danh sách chọn ghế và chuyển phòng sang giai đoạn thanh toán
 * Endpoint: POST /api/v1/group/rooms/{roomCode}/finalize-bill
 */
export const finalizeGroupBillApi = async (
  roomCode: string,
): Promise<GroupRoomDto> => {
  const res = (await axiosClient.post<BaseResponse<GroupRoomDto>>(
    `/group/rooms/${encodeURIComponent(roomCode)}/finalize-bill`,
  )) as unknown as BaseResponse<GroupRoomDto> | GroupRoomDto;

  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as GroupRoomDto;
};

/**
 * Thành viên thanh toán phần tiền vé của mình trong phòng nhóm
 * Endpoint: POST /api/v1/group/rooms/pay-share
 */
export const payGroupShareApi = async (
  body: PayGroupShareRequest,
): Promise<GroupRoomDto> => {
  const res = (await axiosClient.post<BaseResponse<GroupRoomDto>>(
    '/group/rooms/pay-share',
    body,
  )) as unknown as BaseResponse<GroupRoomDto> | GroupRoomDto;

  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as GroupRoomDto;
};
