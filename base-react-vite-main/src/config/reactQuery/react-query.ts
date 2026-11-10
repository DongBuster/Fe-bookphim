import { QueryClient } from '@tanstack/react-query';

export const DEFAULT_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 phút - dữ liệu vẫn được coi là fresh trong 5 phút
  gcTime: 10 * 60 * 1000, // 10 phút - giữ dữ liệu trong cache 10 phút sau khi không còn component nào sử dụng
  refetchOnWindowFocus: false, // Không refetch khi focus vào window
  refetchOnMount: false, // Không refetch khi component mount nếu dữ liệu vẫn fresh
  placeholderData: (previousData: unknown) => previousData, // Giữ dữ liệu cũ khi đang fetch dữ liệu mới
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 60 * 1000, // 3 phút mặc định cho toàn bộ queries tránh refetch thừa
      gcTime: 10 * 60 * 1000, // 10 phút trong garbage collector cache
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});

export default queryClient;
