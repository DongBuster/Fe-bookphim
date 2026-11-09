import styled, { keyframes } from 'styled-components';

const floatIdle = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
`;

const speechPop = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.85) translateY(4px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

export const MascotOuter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-top: 36px;
  margin: 0 auto 6px auto;
  user-select: none;
`;

export const FoxStage = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  animation: ${floatIdle} 3.5s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const FoxButton = styled.button`
  position: relative;
  display: block;
  flex-shrink: 0;
  width: 110px;
  height: 110px;
  padding: 0;
  border: 0;
  background: transparent;
  appearance: none;
  cursor: pointer;
  user-select: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;

  &:focus-visible {
    outline: 2px solid var(--primary, #ff535a);
    outline-offset: 4px;
    border-radius: 50%;
  }
`;

export const SquashSpan = styled.span`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  transform-origin: 50% 78%;
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.45));
`;

export const SpriteLayer = styled.span<{ $bg: string; $posX: number; $posY: number; $opacity: number }>`
  position: absolute;
  inset: 0;
  background-image: url(${({ $bg }) => $bg});
  background-size: 300% 300%;
  background-repeat: no-repeat;
  background-position: ${({ $posX, $posY }) => `${$posX}% ${$posY}%`};
  opacity: ${({ $opacity }) => $opacity};
  transition: opacity 0.12s ease-out;
  pointer-events: none;
`;

export const SpeechBubble = styled.div<{ $variant?: 'normal' | 'secret' | 'dizzy' }>`
  position: absolute;
  bottom: calc(100% - 8px);
  background: ${({ $variant }) =>
    $variant === 'secret'
      ? 'linear-gradient(135deg, rgba(255, 83, 90, 0.95), rgba(180, 20, 30, 0.95))'
      : $variant === 'dizzy'
        ? 'linear-gradient(135deg, rgba(255, 185, 85, 0.95), rgba(210, 130, 20, 0.95))'
        : 'rgba(28, 27, 34, 0.92)'};
  color: ${({ $variant }) => ($variant === 'secret' || $variant === 'dizzy' ? '#ffffff' : '#f4f4f5')};
  border: 1px solid
    ${({ $variant }) =>
      $variant === 'secret'
        ? 'rgba(255, 83, 90, 0.5)'
        : $variant === 'dizzy'
          ? 'rgba(255, 185, 85, 0.5)'
          : 'rgba(255, 255, 255, 0.12)'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 4px 10px;
  border-radius: 12px;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);
  animation: ${speechPop} 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  gap: 5px;
  z-index: 10;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: ${({ $variant }) =>
      $variant === 'secret'
        ? 'rgba(255, 83, 90, 0.95)'
        : $variant === 'dizzy'
          ? 'rgba(255, 185, 85, 0.95)'
          : 'rgba(28, 27, 34, 0.92)'};
  }
`;

export const MascotPedestal = styled.div`
  width: 72px;
  height: 6px;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.6) 0%, transparent 70%);
  border-radius: 50%;
  margin-top: -6px;
`;
