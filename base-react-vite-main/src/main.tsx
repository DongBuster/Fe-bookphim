// Disable styled-components speedy mode in production for React 19 hydration stability
if (typeof window !== 'undefined') {
  (window as any).SC_DISABLE_SPEEDY = true;
}

// Styles
import 'antd/dist/reset.css';

// i18n - kích hoạt trước khi render app
import './i18n/i18n-config';

import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Ant Design
import { StyleProvider, px2remTransformer } from '@ant-design/cssinjs';
import AntdLocaleProvider from '@config/AntdLocaleProvider';
import { App as AntdApp } from 'antd';

// React Query
import queryClient from '@config/reactQuery/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Error Boundary & Network
import ErrorBoundary from '@shared/components/error-boundary/ErrorBoundary.tsx';
import { NetworkDetector } from '@shared/components/online-offline';

/**
 * PX_2_REM: Chuyển px sang rem (rootValue = 10 → 10px = 1rem)
 * Giúp Ant Design component co giãn theo font-size gốc.
 * Bỏ comment dòng dưới nếu không dùng rem.
 */
const PX_2_REM = px2remTransformer({ rootValue: 10 });

/**
 * Bật/tắt detector mạng (online/offline notification)
 */
const SHOW_NETWORK_DETECTOR = true;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AntdLocaleProvider>
      <AntdApp>
        <StyleProvider transformers={[PX_2_REM]}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </StyleProvider>
      </AntdApp>
    </AntdLocaleProvider>

    {/* React Query Devtools - chỉ hiện ở development */}
    <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />

    {/* Theo dõi trạng thái kết nối mạng */}
    {SHOW_NETWORK_DETECTOR && <NetworkDetector />}
  </QueryClientProvider>,
);
