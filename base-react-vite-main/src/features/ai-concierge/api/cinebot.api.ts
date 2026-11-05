import axiosClient from '@config/axios-instance';
import type {
  BaseResponse,
  ConciergeChatRequest,
  ConciergeChatResponseData,
  QuickRecommendResponseData,
} from '@shared/types/api.types';

/**
 * Trợ lý ảo CineBot AI (Gemini AI Concierge) - Chat tự nhiên đa lượt tiếng Việt
 * Endpoint: POST /api/v1/ai/concierge/chat
 */
export const chatWithConciergeAiApi = async (
  body: ConciergeChatRequest,
): Promise<ConciergeChatResponseData> => {
  const res = (await axiosClient.post<BaseResponse<ConciergeChatResponseData>>(
    '/ai/concierge/chat',
    body,
  )) as unknown as
    | BaseResponse<ConciergeChatResponseData>
    | ConciergeChatResponseData;

  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as ConciergeChatResponseData;
};

/**
 * Gợi ý nhanh các phim bom tấn phòng vé nổi bật tuần này từ CineBot AI
 * Endpoint: GET /api/v1/ai/concierge/quick-recommend
 */
export const getQuickAiRecommendationsApi = async (): Promise<QuickRecommendResponseData> => {
  const res = (await axiosClient.get('/ai/concierge/quick-recommend')) as unknown as
    | BaseResponse<QuickRecommendResponseData>
    | QuickRecommendResponseData;

  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as QuickRecommendResponseData;
};
