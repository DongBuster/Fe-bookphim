import { Button, Result } from 'antd';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import i18n from 'i18next';
import { ErrorWrapper } from './ErrorBoundary.styles';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary - Bắt lỗi runtime của React component tree.
 * Hiển thị UI fallback thay vì crash toàn bộ ứng dụng.
 *
 * Sử dụng:
 *   <ErrorBoundary>
 *     <Component />
 *   </ErrorBoundary>
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      '[ErrorBoundary] Uncaught error:',
      error,
      info.componentStack,
    );
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      console.log(this.state.error?.message);

      return (
        <ErrorWrapper>
          <Result
            status="500"
            title={i18n.t('common:error_occurred', 'Đã xảy ra lỗi')}
            subTitle={i18n.t(
              'common:error_desc',
              'Ứng dụng gặp sự cố không mong muốn. Vui lòng thử lại.',
            )}
            extra={
              <Button type="primary" onClick={this.handleReset}>
                {i18n.t('common:retry', 'Thử lại')}
              </Button>
            }
          />
        </ErrorWrapper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
