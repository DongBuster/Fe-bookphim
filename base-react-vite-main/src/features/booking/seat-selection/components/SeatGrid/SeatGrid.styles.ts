import styled from 'styled-components';

export const SeatMapGrid = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 10px 0 16px;
  scrollbar-gutter: stable both-edges;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 999px;
  }
`;

export const SeatMapInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  /* A cinema map must preserve a usable seat target; it scrolls locally on
     small screens instead of forcing the whole document to overflow. */
  min-width: max-content;
  margin: 0 auto;
  padding: 0 16px;
`;

export const MobileScrollHint = styled.div`
  display: none;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11px;
  color: #ae8786;
  margin-top: -16px;
  margin-bottom: 6px;
  user-select: none;

  @media (max-width: 768px) {
    display: flex;
  }

  svg {
    color: #ffb955;
  }
`;

export const SeatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .row-label {
    width: 16px;
    font-size: 12px;
    font-weight: 800;
    color: #ae8786;
    text-align: center;
  }

  .seats-cluster {
    display: flex;
    gap: 6px;
  }

  .aisle-gap {
    width: 18px;
  }
`;

export const SeatBox = styled.button<{
  $type: 'standard' | 'vip' | 'sweetbox';
  $isSelected?: boolean;
  $isSold?: boolean;
}>`
  width: 30px;
  height: 28px;
  border-radius: 6px;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 10.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $isSold }) => ($isSold ? 'not-allowed' : 'pointer')};
  transition: all 0.15s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    z-index: 1;
  }
  user-select: none;

  ${({ $isSold }) =>
    $isSold
      ? `
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.45);
  `
      : ''}

  ${({ $type, $isSelected, $isSold }) => {
    if ($isSold) return '';
    if ($isSelected) {
      return `
        background: #ff535a;
        border: 1px solid #ff7b54;
        color: #ffffff;
        box-shadow: 0 0 12px rgba(255, 83, 90, 0.6);
        transform: scale(1.1);
      `;
    }
    if ($type === 'vip') {
      return `
        background: rgba(255, 185, 85, 0.1);
        border: 1px solid rgba(255, 185, 85, 0.45);
        color: #ffb955;
        &:hover {
          background: rgba(255, 185, 85, 0.25);
          border-color: #ffb955;
          transform: scale(1.08);
        }
      `;
    }
    if ($type === 'sweetbox') {
      return `
        background: rgba(255, 83, 90, 0.12);
        border: 1px solid rgba(255, 83, 90, 0.45);
        color: #ff9e9e;
        &:hover {
          background: rgba(255, 83, 90, 0.25);
          border-color: #ff535a;
          transform: scale(1.08);
        }
      `;
    }
    return `
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #dedede;
      &:hover {
        background: rgba(255, 255, 255, 0.16);
        border-color: rgba(255, 255, 255, 0.3);
        transform: scale(1.08);
      }
    `;
  }}
`;

export const SweetboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;

  .row-label {
    width: 16px;
    font-size: 12px;
    font-weight: 800;
    color: #ae8786;
    text-align: center;
  }

  .sweetbox-cluster {
    display: flex;
    gap: 10px;
  }
`;

export const SweetboxCouple = styled.button<{
  $isSelected?: boolean;
  $isSold?: boolean;
}>`
  width: 72px;
  height: 30px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 10.5px;
  font-weight: 700;
  cursor: ${({ $isSold }) => ($isSold ? 'not-allowed' : 'pointer')};
  transition: all 0.15s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    z-index: 1;
  }

  ${({ $isSold }) =>
    $isSold
      ? `
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.45);
  `
      : ''}

  ${({ $isSelected, $isSold }) => {
    if ($isSold) return '';
    if ($isSelected) {
      return `
        background: #ff535a;
        border: 1px solid #ff7b54;
        color: #ffffff;
        box-shadow: 0 0 12px rgba(255, 83, 90, 0.6);
        transform: scale(1.06);
      `;
    }
    return `
      background: rgba(255, 83, 90, 0.1);
      border: 1px solid rgba(255, 83, 90, 0.35);
      color: #ffb3b0;
      &:hover {
        background: rgba(255, 83, 90, 0.22);
        border-color: #ff535a;
        transform: scale(1.06);
      }
    `;
  }}
`;

export const SeatPreviewTooltip = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(18, 17, 24, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 185, 85, 0.4);
  border-radius: 8px;
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 50;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8), 0 0 12px rgba(255, 185, 85, 0.2);

  .seat-code {
    font-size: 11px;
    font-weight: 800;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .seat-type-tag {
    font-size: 9px;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 4px;
    text-transform: uppercase;
  }
  .seat-price {
    font-size: 11px;
    font-weight: 700;
    color: var(--secondary, #ffb955);
  }
  .seat-angle-score {
    font-size: 9.5px;
    color: #a0aec0;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: rgba(18, 17, 24, 0.95);
  }
`;
