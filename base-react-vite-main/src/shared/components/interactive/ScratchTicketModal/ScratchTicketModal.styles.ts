import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scalePop = keyframes`
  0% { transform: scale(0.92) translateY(16px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
`;

const prizePop = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  70% { transform: scale(1.12); }
  100% { transform: scale(1); opacity: 1; }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.25s ease-out;
`;

export const ModalCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 380px;
  background: #141318;
  border-radius: 24px;
  border: 1px solid rgba(255, 185, 85, 0.35);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 83, 90, 0.15);
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${scalePop} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
`;

export const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  .title-group {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #ffffff;
    font-size: 16px;
    font-weight: 800;
  }

  .close-btn {
    background: none;
    border: none;
    color: #a1a1aa;
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s ease, background 0.15s ease;

    &:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

export const TicketContainer = styled.div`
  position: relative;
  width: 280px;
  height: 180px;
  border-radius: 16px;
  background: #1d1b24;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PrizeUnderlay = styled.div<{ $isRevealed: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
  background: radial-gradient(circle at center, #2a2536, #16151c);

  .prize-tag {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #ffb955;
    background: rgba(255, 185, 85, 0.15);
    padding: 2px 10px;
    border-radius: 9999px;
    margin-bottom: 6px;
  }

  .prize-value {
    font-size: 22px;
    font-weight: 900;
    color: #ff535a;
    letter-spacing: -0.5px;
    margin-bottom: 4px;
    animation: ${({ $isRevealed }) => ($isRevealed ? prizePop : 'none')} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .prize-desc {
    font-size: 11px;
    color: #d4d4d8;
    max-width: 220px;
  }
`;

export const ScratchCanvas = styled.canvas<{ $isGone: boolean }>`
  position: absolute;
  inset: 0;
  width: 280px;
  height: 180px;
  border-radius: 16px;
  cursor: grab;
  touch-action: none;
  transition: opacity 0.5s ease;
  opacity: ${({ $isGone }) => ($isGone ? 0 : 1)};
  pointer-events: ${({ $isGone }) => ($isGone ? 'none' : 'auto')};

  &:active {
    cursor: grabbing;
  }
`;

export const FooterRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18px;

  .progress-text {
    font-size: 12px;
    font-weight: 700;
    color: #a1a1aa;
    font-variant-numeric: tabular-nums;
  }

  .action-btn {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 6px 14px;
    border-radius: 9999px;
    font-size: 11.5px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background: var(--primary, #ff535a);
      border-color: var(--primary, #ff535a);
      color: #fff;
    }
  }
`;
