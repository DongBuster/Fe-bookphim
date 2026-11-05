import styled from 'styled-components';

export const ModalBackdrop = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 2000;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: fadeIn 0.2s ease-out;
`;

export const ModalContent = styled.div`
  width: 100%;
  max-width: 520px;
  background: #181719;
  border: 1px solid rgba(255, 185, 85, 0.35);
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 185, 85, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  background: rgba(28, 27, 29, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  .title-area {
    display: flex;
    align-items: center;
    gap: 10px;

    .icon-box {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: linear-gradient(135deg, #ff535a 0%, #ffb955 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3b0008;
    }

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
    }
  }

  .close-btn {
    background: transparent;
    border: none;
    color: #8c8994;
    cursor: pointer;
    padding: 6px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

export const ModalBody = styled.div`
  padding: 22px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const PinBox = styled.div`
  background: rgba(255, 185, 85, 0.08);
  border: 1px dashed #ffb955;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;

  .pin-title {
    font-size: 12px;
    color: #ae8786;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .pin-code {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: 6px;
    color: #ffb955;
    font-family: monospace;
  }

  .pin-desc {
    font-size: 12px;
    color: #e5e2e3;
  }
`;

export const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  .member-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: rgba(28, 27, 29, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;

    .member-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #353436;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffb955;
        font-weight: 700;
        font-size: 13px;
      }

      .info {
        display: flex;
        flex-direction: column;

        .name {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .seats {
          font-size: 11.5px;
          color: #ae8786;
        }
      }
    }

    .member-status {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;

      .share-amt {
        font-size: 13px;
        font-weight: 700;
        color: #ffb955;
      }

      .status-tag {
        font-size: 10.5px;
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 600;

        &.paid {
          background: rgba(82, 183, 136, 0.15);
          color: #52b788;
        }

        &.pending {
          background: rgba(255, 185, 85, 0.15);
          color: #ffb955;
        }
      }
    }
  }
`;

export const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  width: 100%;
  padding: 12px 18px;
  border-radius: 12px;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  border: none;

  background: ${({ $variant }) =>
    $variant === 'secondary'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'linear-gradient(135deg, #ff535a 0%, #ffb955 100%)'};
  color: ${({ $variant }) => ($variant === 'secondary' ? '#e5e2e3' : '#3b0008')};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(255, 185, 85, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
