import styled, { keyframes } from 'styled-components';

const shineSweep = keyframes`
  0% {
    transform: translateX(-150%) skewX(-20deg);
  }
  100% {
    transform: translateX(200%) skewX(-20deg);
  }
`;

export const CardWrapper = styled.div`
  perspective: 1000px;
  width: 100%;
  min-height: 190px;
`;

export const FlipContainer = styled.div<{ $isFlipped: boolean; $isUnlocked: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 190px;
  transform-style: preserve-3d;
  transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
  transform: ${({ $isFlipped }) => ($isFlipped ? 'rotateY(180deg)' : 'none')};
  cursor: pointer;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const CardFace = styled.div<{ $isBack?: boolean; $isUnlocked?: boolean }>`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 18px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  overflow: hidden;

  /* Metallic sheen pseudo-element */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    transform: translateX(-150%) skewX(-20deg);
    pointer-events: none;
    display: ${({ $isUnlocked, $isBack }) => ($isUnlocked && !$isBack ? 'block' : 'none')};
  }

  &:hover::after {
    animation: ${shineSweep} 0.85s ease-out;
  }

  ${({ $isBack }) =>
    $isBack &&
    `
    transform: rotateY(180deg);
    background: linear-gradient(145deg, #18171f, #0e0d13);
    border: 1px solid rgba(255, 185, 85, 0.4);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(255, 185, 85, 0.08);
  `}

  ${({ $isBack, $isUnlocked }) =>
    !$isBack &&
    ($isUnlocked
      ? `
    background: linear-gradient(145deg, #22202a, #131218);
    border: 1px solid rgba(255, 185, 85, 0.35);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6), 0 0 24px rgba(255, 185, 85, 0.12);
  `
      : `
    background: #15141a;
    border: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    opacity: 0.82;
  `)}
`;

export const MedalCircle = styled.div<{ $isUnlocked: boolean }>`
  position: relative;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;

  ${({ $isUnlocked }) =>
    $isUnlocked
      ? `
    background: radial-gradient(circle at 35% 35%, #FFE066, #DC9100 65%, #935B00);
    box-shadow: 0 8px 20px rgba(220, 145, 0, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.6);
    color: #4F3100;
  `
      : `
    background: #23222a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #71717a;
  `}
`;

export const Title = styled.h4`
  font-size: 13.5px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 4px;
  letter-spacing: -0.2px;
`;

export const Description = styled.p`
  font-size: 11px;
  color: #a1a1aa;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ProgressBar = styled.div`
  width: 100%;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 3px;

  .bar-track {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 2px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #ff535a, #ffb955);
    border-radius: 2px;
    transition: width 0.35s ease;
  }

  .bar-text {
    font-size: 9.5px;
    font-weight: 700;
    color: #71717a;
    display: flex;
    justify-content: space-between;
  }
`;

export const ClaimButton = styled.button`
  margin-top: 8px;
  background: linear-gradient(135deg, #ff535a, #dc2626);
  color: #ffffff;
  border: none;
  border-radius: 9999px;
  padding: 6px 14px;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(255, 83, 90, 0.4);
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 6px 18px rgba(255, 83, 90, 0.55);
  }
`;

export const FlipHint = styled.span`
  font-size: 9.5px;
  color: #ffb955;
  margin-top: 4px;
  opacity: 0.85;
`;
