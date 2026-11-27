import { ConfigProvider, theme as antdTheme, type ConfigProviderProps, type ThemeConfig } from 'antd';
import viVN from 'antd/locale/vi_VN';

export const palette = {
  bgPrimary: '#0B0B0C',
  borderPrimary: 'rgba(255, 255, 255, 0.20)',
  borderSecondary: 'rgba(255, 255, 255, 0.14)',
  error: '#FF535A',
  goldSoft: 'rgba(255, 185, 85, 0.18)',
  hoverPrimary: 'rgba(255, 83, 90, 0.15)',
  info: '#178fe2',
  primary: '#FF535A',
  primarySub: '#E01E35',
  success: '#34c759',
  surface: '#1E222E',
  tableHeader: '#1D212D',
  textPrimary: '#FFFFFF',
  textSecondary: '#CBD5E1',
  warning: '#FFB955',
} as const;

export const theme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: palette.primary,
    colorLink: palette.primary,
    colorInfo: palette.primary,
    colorSuccess: palette.success,
    colorWarning: palette.warning,
    colorError: palette.error,
    colorText: palette.textPrimary,
    colorTextBase: palette.textPrimary,
    colorTextHeading: '#FFFFFF',
    colorTextDescription: '#CBD5E1',
    colorTextSecondary: palette.textSecondary,
    colorTextPlaceholder: '#94A3B8',
    colorBgBase: palette.bgPrimary,
    colorBgContainer: palette.surface,
    colorBgElevated: '#1E222E',
    colorBgLayout: palette.bgPrimary,
    colorBorder: palette.borderSecondary,
    colorBorderSecondary: palette.borderPrimary,
    borderRadius: 8,
    fontFamily:
      "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Button: {
      borderRadius: 8,
      colorPrimary: palette.primary,
      colorPrimaryHover: palette.primarySub,
      colorPrimaryActive: palette.primarySub,
    },
    Dropdown: {
      colorBgElevated: palette.surface,
      paddingBlock: 4,
      zIndexPopup: 1050,
    },
    Input: {
      activeBorderColor: palette.primary,
      hoverBorderColor: palette.primary,
    },
    Layout: {
      bodyBg: palette.bgPrimary,
      headerBg: palette.surface,
      siderBg: palette.surface,
    },
    Menu: {
      itemSelectedBg: palette.goldSoft,
      itemSelectedColor: palette.primary,
      itemHoverColor: palette.primary,
      popupBg: palette.surface,
    },
    Modal: {
      borderRadiusLG: 16,
    },
    Notification: {
      colorBgElevated: '#18181b',
      colorText: '#ffffff',
      colorTextHeading: '#ffffff',
      colorTextDescription: '#f1f5f9',
      progressBg: 'linear-gradient(90deg, #ff535a, #e01e35)',
    },
    Message: {
      contentBg: palette.surface,
      colorText: palette.textPrimary,
    },
    Select: {
      optionSelectedBg: palette.goldSoft,
      optionSelectedColor: '#FFFFFF',
      optionActiveBg: 'rgba(255, 255, 255, 0.08)',
      multipleItemBg: 'rgba(255, 185, 85, 0.16)',
      multipleItemBorderColor: 'rgba(255, 185, 85, 0.42)',
      selectorBg: palette.surface,
    },
    Table: {
      borderRadius: 8,
      headerBg: palette.tableHeader,
      rowHoverBg: palette.hoverPrimary,
    },
    Tabs: {
      itemSelectedColor: palette.primary,
      itemHoverColor: palette.primarySub,
    },
  },
};

// Set global theme for Ant Design static methods (notification, message, modal)
ConfigProvider.config({
  theme,
});

const antdDefaultConfig: ConfigProviderProps = {
  locale: viVN,
  theme,
};

export default antdDefaultConfig;
