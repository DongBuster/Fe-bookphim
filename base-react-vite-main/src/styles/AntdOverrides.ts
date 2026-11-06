import { createGlobalStyle } from 'styled-components';

export const AntdOverrides = createGlobalStyle`
/* ===== _breadcrumb.scss ===== */
.ant-breadcrumb {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: var(--primary-title);
  font-size: 1.8rem;
  line-height: 1.5;
  font-weight: 500;
  list-style: none;
  font-family: 'Be Vietnam Pro', sans-serif;
}

/* ===== _button.scss ===== */
.ant-btn,
.ant-btn-primary,
.ant-btn-default,
.ant-btn-secondary {
  padding: 0 1rem !important;
  line-height: 1 !important;
}

/* ===== SIZE ===== */
.ant-btn-lg {
  font-size: 1.6rem;
  height: 3.5rem;
  padding: 0 1.5rem;
  border-radius: 0.4rem;
}

/* ===== PRIMARY ===== */
.ant-btn-primary {
  background-color: var(--primary);
  /* color: var(--primary-text); */
  border-color: var(--primary);

  &:hover,
  &:focus {
    opacity: 0.8;
  }
  .anticon-loading {
    color: var(--primary-text);
  }
}
/* ===== SECONDARY ===== */
.ant-btn-secondary {
  background-color: rgba(255, 255, 255, 0.08);
  color: var(--text-primary, #ffffff);
  border-color: var(--primary-border, rgba(255, 255, 255, 0.12));

  &:hover,
  &:focus {
    background-color: rgba(255, 255, 255, 0.14);
    color: var(--primary, #ff535a);
    border-color: var(--primary-sub, #e01e35);
  }
}

/* ===== DEFAULT ===== */
.ant-btn-default {
  background-color: var(--bg-card, #1c1b1c);
  color: var(--text-primary, #ffffff);
  border-color: var(--primary-border, rgba(255, 255, 255, 0.12));

  .anticon {
    transition: color 0.25s linear;
  }

  &:hover,
  &:focus {
    background-color: var(--bg-elevated, #201f20);
    color: var(--primary, #ff535a);
    border-color: var(--primary, #ff535a);

    .anticon {
      color: var(--primary, #ff535a) !important;
    }
  }
}

/* ===== TAG BUTTON ===== */
.ant-btn-tag {
  cursor: default;
  pointer-events: none;
  padding: 0 1.2rem;
  background: transparent;
  border-color: transparent;
  color: var(--primary-subtitle);

  &:hover,
  &:focus {
    background: unset;
    border-color: unset;
    color: unset;
  }
}

/* ===== LINK ===== */
.ant-btn-color-link.ant-btn-link {
  color: inherit;
}

/* ===== CIRCLE ===== */
.ant-btn-circle {
  &.--active {
    background-color: var(--primary-bg-hover);

    svg {
      color: var(--primary);
    }
  }
}

.ant-btn.ant-btn-circle.ant-btn-link:hover {
  background-color: var(--primary-bg-hover);
  color: var(--primary);
}

/* ===== _checkbox.scss ===== */
.ant-checkbox-inner {
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 0;
}

/* ===== _collapse.scss ===== */
.ant-collapse > .ant-collapse-item .ant-collapse-header-collapsible-only .ant-collapse-header-text {
  flex: unset;
}

.ant-collapse-large > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box {
  padding: 1.2rem;
}

.ant-collapse .ant-collapse-header {
  background-color: var(--bg-primary);
  padding: 1.2rem !important;
}

/* ===== _datepicker.scss ===== */
.ant-picker {
  height: 3.5rem;
  .ant-picker-input > input {
    font-size: 1.4rem;
  }
}

.ant-picker-dropdown .ant-picker-cell-in-view.ant-picker-cell-selected:not(.ant-picker-cell-disabled) .ant-picker-cell-inner {
  color: var(--primary);
  background: var(--white);
  font-weight: 600;
}

/* ===== _drawer.scss ===== */
.ant-drawer {
  .ant-drawer-body {
    padding: 12px !important;
  }
}

/* ===== _dropdown.scss ===== */
.ant-dropdown-menu {
  .ant-dropdown-menu-item {
    padding: 0.8rem 1.6rem !important;

    &:hover {
      background-color: var(--bg-hover-primary) !important;
    }
  }

  .ant-dropdown-menu-title-content {
    line-height: 2.8rem;
    position: relative;
    top: 1px;

    .ant-dropdown-menu-item-icon {
      margin-right: 1.2rem;
    }
  }
}

/* ===== _form.scss ===== */
.ant-form-item {
  margin-bottom: 1.2rem;
}

.ant-form-item-label > label {
  color: var(--text-primary) !important;
}
.ant-form.readOnly {
  .ant-form-item,
  .ant-form-item-label,
  .ant-input,
  .ant-select,
  .ant-select-selector,
  .ant-picker,
  .ant-input-number,
  .ant-checkbox-wrapper,
  .ant-tree-treenode {
    pointer-events: none;
  }

  .ant-select-multiple .ant-select-selection-item-remove,
  .ant-form-item-label
    > label.ant-form-item-required:not(.ant-form-item-required-mark-optional):before,
  .ant-select-clear,
  .ant-select-arrow {
    display: none;
  }
}

.enabled-pointer-event {
  pointer-events: inherit !important;

  .ant-form-item,
  .ant-form-item-label,
  .ant-input,
  .ant-select,
  .ant-select-selector,
  .ant-picker,
  .ant-input-number,
  .ant-checkbox-wrapper,
  .ant-tree-treenode {
    pointer-events: inherit !important;
  }
}

.ant-form-item-explain-error {
  text-align: left;
}

/* ===== _icon.scss ===== */
/* .anticon {
  font-size: 2rem;
} */

/* ===== _input.scss ===== */
input.ant-input,
.ant-picker,
.ant-input-affix-wrapper,
.ant-select.ant-select-in-form-item,
.ant-input-number {
  max-width: 100%;
  width: 100%;
}

.ant-input,
.ant-input-number-input {
  font-size: 1.4rem;
  line-height: 2.8rem;
  height: 3.5rem;
}

.ant-form-item-label
  > label.ant-form-item-required:not(
    .ant-form-item-required-mark-optional
  ):before {
  order: 1;
  position: relative;
  right: 4px;
  bottom: 4px;
}

.ant-form-vertical {
  .ant-form-item-label
    > label.ant-form-item-required:not(
      .ant-form-item-required-mark-optional
    ):before {
    right: -4px;
  }
}

.ant-input-affix-wrapper {
  height: 3.5rem;

  .ant-input {
    height: auto;
  }
}

.ant-input-number-handler-wrap {
  display: none;
}

.ant-input-number-lg input.ant-input-number-input {
  height: 3.3rem;
  padding: 0.2rem 1.1rem;
}

.ant-input-search-large .ant-input-affix-wrapper,
.ant-input-search-large .ant-input-search-button {
  height: 3.5rem;
}
.ant-card .ant-card-head {
  font-weight: 400 !important;
}
/* .ant-input-group-wrapper {
    display: inline-block;
    width: 100%;
    text-align: start;
    vertical-align: top;
}
.ant-input[disabled]::placeholder {
  color: var(--text-primary);
} */

.ant-select:not(.ant-select-customize-input) .ant-select-selector {
  border-width: 1px;
}

/* ===== _menu.scss ===== */
.ant-dropdown-menu-item {
  padding: 0.8rem 1.6rem;

  &:hover {
    background-color: var(--bg-hover-primary);

    .ant-dropdown-menu-title-content {
      color: var(--primary);
    }

    svg {
      color: var(--primary);
    }
  }
}

.ant-dropdown-menu-item-icon {
  margin-right: 1.2rem;
}

.ant-dropdown-menu-title-content {
  line-height: 2.8rem;
  position: relative;
  top: 1px;
}

/* ===== _message.scss ===== */
.ant-message {
  top: 20px !important;
  right: 20px !important;
  left: auto !important; 
  transform: none !important; 
  z-index: 9999; 

  animation: slide-in 0.25s ease-out;
}

.ant-message-notice-content {
  padding: 16px 24px; 
  min-width: 280px; 
  border-radius: 8px;
  font-size: 16px; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.ant-message-success .ant-message-notice-content {
  background-color: var(--success);
  color: var(--white);
}

.ant-message-error .ant-message-notice-content {
  background-color: var(--error);
  color: var(--white);
}

.ant-message-warning .ant-message-notice-content {
  background-color: var(--warning);
  color: var(--white);
}

.ant-message-loading .ant-message-notice-content {
  background-color: var(--info);
  color: var(--white);
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(40px); 
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ===== _modal.scss ===== */
.ant-modal {
  .ant-modal-content {
    padding: 0;
  }

  .ant-modal-footer {
    padding: 1.6rem !important;
    background-color: var(--bg-primary) !important;
    display: flex;
    justify-content: flex-end;
    position: relative;
    margin-top: 0;

    .ant-btn .anticon {
      display: flex;
    }
  }

  &.fullScreen {
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 -1.6rem;

    .ant-modal-content {
      height: 100vh;
    }

    .ant-modal-body {
      max-height: 100vh !important;
    }

    .modal-body {
      max-height: calc(100vh - 6rem) !important;
      overflow-y: auto;
      padding: 0;
    }
  }
}

.custom-confirm-modal .ant-modal-confirm {
  .ant-modal-body {
    padding: 0;

    .anticon-exclamation-circle {
      display: none;
    }

    .ant-modal-confirm-paragraph {
      max-width: 100%;
    }
  }

  .ant-modal-confirm-btns {
    padding: 1.6rem;
    margin-top: 0;
    padding-top: 0;
  }
}

.ant-modal-confirm-body .ant-modal-confirm-content {
  margin-top: 0;
}

.ant-modal-footer .ant-btn + .ant-btn:not(.ant-dropdown-trigger) {
  margin-left: 1.2rem;
}

/* ===== _notification.scss ===== */
.ant-notification {
  .ant-notification-notice {
    background: #18181b !important;
    border: 1px solid rgba(255, 255, 255, 0.14) !important;
    border-radius: 12px !important;
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
    backdrop-filter: blur(16px) !important;
    padding: 16px 20px !important;

    /* Title: Ultra-crisp high contrast white for both AntD 6 and AntD 5 */
    .ant-notification-notice-title,
    .ant-notification-notice-title > *,
    .ant-notification-notice-message,
    .ant-notification-notice-message > * {
      color: #ffffff !important;
      font-size: 15px !important;
      font-weight: 700 !important;
      letter-spacing: -0.2px !important;
      margin-bottom: 4px !important;
      line-height: 1.4 !important;
    }

    /* Description: High-contrast crisp light slate white for ultra-clear readability */
    .ant-notification-notice-description,
    .ant-notification-notice-description > *,
    .ant-notification-notice-description p {
      color: #f1f5f9 !important;
      font-size: 13.5px !important;
      font-weight: 400 !important;
      line-height: 1.55 !important;
      opacity: 0.96 !important;
    }

    /* Close button */
    .ant-notification-notice-close {
      color: rgba(255, 255, 255, 0.65) !important;
      transition: all 0.2s ease !important;
      top: 16px !important;
      right: 16px !important;
      &:hover {
        color: #ffffff !important;
        transform: scale(1.1);
      }
    }

    /* Progress bar base */
    .ant-notification-notice-progress {
      background: transparent !important;
      &::-webkit-progress-bar {
        background-color: rgba(255, 255, 255, 0.12) !important;
      }
    }

    /* Type-specific left borders, glows and progress bars */
    &.ant-notification-notice-error {
      border-left: 4px solid #ff535a !important;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.85), -4px 0 20px rgba(255, 83, 90, 0.25) !important;

      .ant-notification-notice-progress {
        background: #ff535a !important;
        &::-webkit-progress-value {
          background: #ff535a !important;
        }
        &::-moz-progress-bar {
          background: #ff535a !important;
        }
      }
    }

    &.ant-notification-notice-success {
      border-left: 4px solid #34c759 !important;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.85), -4px 0 20px rgba(52, 199, 89, 0.25) !important;

      .ant-notification-notice-progress {
        background: #34c759 !important;
        &::-webkit-progress-value {
          background: #34c759 !important;
        }
        &::-moz-progress-bar {
          background: #34c759 !important;
        }
      }
    }

    &.ant-notification-notice-warning {
      border-left: 4px solid #ffb955 !important;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.85), -4px 0 20px rgba(255, 185, 85, 0.25) !important;

      .ant-notification-notice-progress {
        background: #ffb955 !important;
        &::-webkit-progress-value {
          background: #ffb955 !important;
        }
        &::-moz-progress-bar {
          background: #ffb955 !important;
        }
      }
    }

    &.ant-notification-notice-info {
      border-left: 4px solid #178fe2 !important;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.85), -4px 0 20px rgba(23, 143, 226, 0.25) !important;

      .ant-notification-notice-progress {
        background: #178fe2 !important;
        &::-webkit-progress-value {
          background: #178fe2 !important;
        }
        &::-moz-progress-bar {
          background: #178fe2 !important;
        }
      }
    }
  }
}

/* Fallback un-nested rules for portaled elements */
.ant-notification-notice-title,
.ant-notification-notice-title > *,
.ant-notification-notice-message,
.ant-notification-notice-message > * {
  color: #ffffff !important;
}

.ant-notification-notice-description,
.ant-notification-notice-description > *,
.ant-notification-notice-description p {
  color: #f1f5f9 !important;
}

/* Fallback un-nested progress bar rules for semantic colors */
.ant-notification-notice-error .ant-notification-notice-progress::-webkit-progress-value,
.ant-notification-notice.ant-notification-notice-error .ant-notification-notice-progress::-webkit-progress-value {
  background: #ff535a !important;
  background-color: #ff535a !important;
}
.ant-notification-notice-error .ant-notification-notice-progress::-moz-progress-bar,
.ant-notification-notice.ant-notification-notice-error .ant-notification-notice-progress::-moz-progress-bar {
  background: #ff535a !important;
  background-color: #ff535a !important;
}

.ant-notification-notice-warning .ant-notification-notice-progress::-webkit-progress-value,
.ant-notification-notice.ant-notification-notice-warning .ant-notification-notice-progress::-webkit-progress-value {
  background: #ffb955 !important;
  background-color: #ffb955 !important;
}
.ant-notification-notice-warning .ant-notification-notice-progress::-moz-progress-bar,
.ant-notification-notice.ant-notification-notice-warning .ant-notification-notice-progress::-moz-progress-bar {
  background: #ffb955 !important;
  background-color: #ffb955 !important;
}

.ant-notification-notice-success .ant-notification-notice-progress::-webkit-progress-value,
.ant-notification-notice.ant-notification-notice-success .ant-notification-notice-progress::-webkit-progress-value {
  background: #34c759 !important;
  background-color: #34c759 !important;
}
.ant-notification-notice-success .ant-notification-notice-progress::-moz-progress-bar,
.ant-notification-notice.ant-notification-notice-success .ant-notification-notice-progress::-moz-progress-bar {
  background: #34c759 !important;
  background-color: #34c759 !important;
}

.ant-notification-notice-info .ant-notification-notice-progress::-webkit-progress-value,
.ant-notification-notice.ant-notification-notice-info .ant-notification-notice-progress::-webkit-progress-value {
  background: #178fe2 !important;
  background-color: #178fe2 !important;
}
.ant-notification-notice-info .ant-notification-notice-progress::-moz-progress-bar,
.ant-notification-notice.ant-notification-notice-info .ant-notification-notice-progress::-moz-progress-bar {
  background: #178fe2 !important;
  background-color: #178fe2 !important;
}

/* ===== _message.scss ===== */
.ant-message .ant-message-notice .ant-message-notice-content {
  background: #1c1b1c !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.14) !important;
  border-radius: 9999px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6) !important;
  font-size: 13.5px !important;
  font-weight: 600 !important;
  padding: 8px 18px !important;
}

/* ===== _pagination.scss ===== */
.ant-pagination-next,
.ant-pagination-prev,
.ant-pagination-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  white-space: nowrap;
}

.ant-pagination-options {
  position: absolute;
  right: 0;
}

.ant-pagination-total-text {
  line-height: 4rem;
  height: 4rem;
  position: absolute;
  left: 0;
}

.ant-table-pagination.ant-pagination {
  justify-content: center;
}

.ant-select-single.ant-select-show-arrow .ant-select-selection-item,
.ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder {
  line-height: 4rem;
}

.ant-pagination-prev,
.ant-pagination-next,
.ant-pagination-jump-prev,
.ant-pagination-jump-next {
  height: 4rem;
  min-width: 4rem;
  line-height: 4rem;
}

.ant-pagination.ant-table-pagination {
  height: 6.4rem;
  margin: 0 !important;
  padding: 1.2rem 0;
  align-items: center;
  background-color: var(--bg-elevated, #201f20);
}

.ant-pagination-options .ant-select-single {
  height: 4rem;
}

/* ===== _popover.scss ===== */
.ant-popover {
  .ant-popover-arrow {
    /* display: none; */
  }

  .ant-popover-inner {
    padding: 0;
  }
}

/* ===== _select.scss ===== */
.ant-select-single.ant-select-lg:not(.ant-select-customize-input) .ant-select-selector::after,
.ant-select-single.ant-select-lg:not(.ant-select-customize-input)
  .ant-select-selector
  .ant-select-selection-item,
.ant-select-single.ant-select-lg:not(.ant-select-customize-input)
  .ant-select-selector
  .ant-select-selection-placeholder {
  line-height: 3.3rem;
}

.ant-select-selection-placeholder,
.ant-select-selection-item {
  font-size: 1.4rem;
  line-height: 3.3rem;
  height: 3.3rem;
  color: var(--text-primary);
}

.ant-select-focused .ant-select-selection-placeholder {
  color: var(--text-primary);
}

.ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector {
  color: var(--text-primary);
}

.ant-select-selector {
  height: 3.5rem !important;
  align-items: center;
}

.ant-select-multiple .ant-select-selector {
  height: auto !important;
  align-items: center;
}
.ant-select-dropdown .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background-color: transparent !important; 
}

.ant-select.ant-select-in-form-item {
  border: none !important;
}
.ant-form-item .ant-input-group-wrapper {
  border: none !important;
}

/* ===== _steps.scss ===== */
.ant-steps-item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ant-steps-item-process
  > .ant-steps-item-container
  > .ant-steps-item-content
  > .ant-steps-item-title::after {
  background-color: var(--border-primary);
}

.ant-steps-item-process
  > .ant-steps-item-container
  > .ant-steps-item-content
  > .ant-steps-item-title {
  font-weight: 500;
  font-size: 1.8rem;
  color: var(--primary);
}

.ant-steps-item-finish .ant-steps-item-icon {
  background-color: var(--primary) !important;
}

.ant-steps-finish-icon {
  color: #fff;
}

/* ===== _table.scss ===== */
.ant-table-wrapper {
  &.--disabled {
    pointer-events: none;
    tbody tr {
      background-color: var(--bg-disabled, #2a2a2b);
    }
  }
  &.--border-last-row .ant-table-body tr:last-child td {
    border-bottom: 1px solid var(--border-primary);
  }
}

tr.ant-table-expanded-row > td,
tr.ant-table-expanded-row:hover > td {
  background-color: var(--bg-primary);
}

.ant-table {
  border: 1px solid var(--border-primary);
  border-radius: 0;
  /* .ant-table-container table {
    border-radius: 0;
  } */
}

.ant-table-thead {
  height: var(--table-row-height);

  & > tr > th {
    padding: 0.8rem 1.2rem !important;

    &::before {
      display: none;
    }
  }
}

.ant-table-body {
  overflow-y: auto !important;

  tr.ant-table-measure-row td {
    padding: 0 !important;
  }
}

.ant-table-tbody > tr {
  /* height: var(--table-row-height); */

  &.--disabled td {
    background-color: var(--table-row-disabled) !important;
    pointer-events: none;
  }

  &.--return td {
    background-color: rgba(175, 82, 222, 0.1);
  }

  &.--error td {
    background-color: rgba(230, 50, 50, 0.1);
  }

  &.--warning td {
    background-color: rgba(255, 149, 0, 0.1);
  }

  &.--active {
    background-color: var(--table-row-hover-color);
  }

  &.--selected {
    background-color: var(--table-row-hover-color);
  }

  &.--updating {
    opacity: 0.6;
    pointer-events: none;
  }

  &.--deleting {
    background-color: rgba(230, 50, 50, 0.2);
    pointer-events: none;
  }

  .row-actions {
    display: none;
  }

  &:last-child td {
    border-bottom: none;
  }

  & > td {
    padding: 0.8rem 1.2rem !important;
  }

  &:hover {
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.12);

    .row-actions {
      display: flex;
    }
  }
}

.ant-table-column-sorters {
  justify-content: unset;
}

.ant-table-column-title {
  flex: unset;
}

/* ===== _tag.scss ===== */
.ant-tag {
  font-size: 1.4rem;
  line-height: 2.8rem;
}

/* ===== _tooltip.scss ===== */
.ant-tooltip-arrow-content:before,
.ant-tooltip-inner {
  background-color: var(--bg-tooltip) !important;
}
.ant-tooltip,
.ant-tooltip-arrow-content {
  --antd-arrow-background-color: var(--bg-tooltip) !important;
}

/* ===== _tree.scss ===== */
.ant-tree {
  margin-bottom: 1.2rem;

  &.--disabled-switcher {
    .ant-tree-switcher {
      opacity: 0;
      visibility: hidden;
      display: none;
    }
  }

  .ant-tree-treenode {
    padding-bottom: 1.2rem;
  }

  .ant-tree-checkbox-inner {
    border-radius: 0;
    width: 1.8rem;
    height: 1.8rem;
  }

  .ant-tree-node-content-wrapper {
    line-height: 2.8rem;
    &.ant-tree-node-selected {
      background-color: transparent;
    }
  }
}

/* ===== _typography.scss ===== */
h1,
h2,
h3,
h4,
h5,
h6 {
  &.ant-typography {
    color: var(--text-primary);
    font-weight: 500;
    margin-bottom: 0;
  }
}

h5.ant-typography {
  font-size: 1.8rem;
}

h3.ant-typography {
  font-size: 2.3rem;
}

.ant-typography + .ant-typography {
  margin-top: 0 !important;
}

.ant-typography.ant-typography-secondary {
  color: var(--text-secondary);
}
`;
