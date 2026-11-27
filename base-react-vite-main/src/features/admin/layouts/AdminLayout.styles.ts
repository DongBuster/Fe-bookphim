import styled from 'styled-components';

export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #0b0c0e;
  color: #ffffff;

  /* Custom Cinema Noir Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #0b0c0e;
  }
  ::-webkit-scrollbar-thumb {
    background: #3a4258;
    border-radius: 999px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #ffb955;
  }

  /* Ant Design Form Controls Contrast inside Admin */
  .ant-input,
  .ant-input-affix-wrapper,
  .ant-input-number,
  .ant-picker,
  .ant-select:not(.ant-select-customize-input),
  .ant-select.ant-select-outlined:not(.ant-select-customize-input) {
    --select-background: #1e222e;
    --select-border-color: #3a4258;
    --select-color: #ffffff;
    background-color: #1e222e !important;
    border-color: #3a4258 !important;
    color: #ffffff !important;
    border-radius: 8px !important;
  }
  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    background-color: transparent !important;
    border: none !important;
  }
  .ant-input::placeholder,
  .ant-picker-input > input::placeholder,
  .ant-select-selection-placeholder,
  .ant-select-placeholder {
    color: #94a3b8 !important;
  }
  .ant-select-arrow,
  .ant-picker-suffix {
    color: #cbd5e1 !important;
  }
  .ant-input:hover,
  .ant-input-affix-wrapper:hover,
  .ant-picker:hover,
  .ant-select:not(.ant-select-disabled):hover {
    --select-border-color: #ffb955;
    border-color: #ffb955 !important;
  }

  /* Ant Design Table & Card Polish */
  .ant-table-wrapper {
    width: 100%;
    overflow-x: auto;
  }
  .ant-table-wrapper .ant-table {
    background: transparent !important;
    color: #f1f5f9 !important;
  }
  .ant-table-wrapper .ant-table-thead > tr > th {
    background: #1d212d !important;
    color: #e2e8f0 !important;
    font-size: 11.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 10px 12px !important;
    white-space: nowrap;
    border-bottom: 1px solid #32394c !important;
  }
  .ant-table-wrapper .ant-table-tbody > tr > td {
    padding: 10px 12px !important;
    border-bottom: 1px solid #262c3d !important;
    color: #f1f5f9;
    transition: background-color 0.15s ease;
  }
  .ant-table-wrapper .ant-table-cell-fix-right {
    background: #161922 !important;
  }
  .ant-table-wrapper .ant-table-tbody > tr:hover > td,
  .ant-table-wrapper .ant-table-tbody > tr:hover > td.ant-table-cell-fix-right {
    background: #212636 !important;
  }
  .ant-pagination {
    color: #cbd5e1;
  }
  .ant-pagination .ant-pagination-total-text {
    color: #cbd5e1;
  }

  /* Ant Design Menu Active Item Polish */
  .ant-menu-dark .ant-menu-item-selected {
    background: linear-gradient(90deg, rgba(255, 185, 85, 0.16) 0%, rgba(255, 83, 90, 0.06) 100%) !important;
    color: #ffb955 !important;
    border-left: 3px solid #ffb955;
    border-radius: 0 8px 8px 0 !important;
    font-weight: 600;
  }
  .ant-menu-dark .ant-menu-item:hover:not(.ant-menu-item-selected) {
    background: rgba(255, 255, 255, 0.04) !important;
    color: #ffffff !important;
  }
`;

export const MainWrapper = styled.div<{ $collapsed: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${({ $collapsed }) => ($collapsed ? '64px' : '240px')};
  transition: margin-left 0.2s cubic-bezier(0.2, 0, 0, 1);
  min-width: 0;
`;

export const ContentArea = styled.main`
  flex: 1;
  padding: 24px 28px;
  background: radial-gradient(circle at top right, rgba(255, 83, 90, 0.04), transparent 35%),
    radial-gradient(circle at bottom left, rgba(255, 185, 85, 0.03), transparent 35%),
    #0b0c0e;
  overflow-y: auto;
`;
