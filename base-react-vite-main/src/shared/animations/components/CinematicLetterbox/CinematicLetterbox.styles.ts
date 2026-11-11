import styled, { keyframes } from 'styled-components';

const auraRotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const flarePulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scaleX(0.85); }
  50% { opacity: 1; transform: scaleX(1.2); }
`;

export const Overlay = styled.div<{ $isDone: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 99999;
  pointer-events: none;
  overflow: hidden;
  display: ${({ $isDone }) => ($isDone ? 'none' : 'block')};
`;

const curtainBase = `
  position: absolute;
  left: 0;
  width: 100%;
  height: 50.5vh;
  background-color: #0b0b0e;
  background-image:
    radial-gradient(rgba(255, 185, 85, 0.08) 1px, transparent 0),
    radial-gradient(rgba(255, 83, 90, 0.05) 1px, transparent 0);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
  will-change: transform;
  overflow: hidden;
`;

export const TopCurtain = styled.div`
  ${curtainBase}
  top: 0;
  border-bottom: 1.5px solid rgba(255, 185, 85, 0.45);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.95);
`;

export const BottomCurtain = styled.div`
  ${curtainBase}
  bottom: 0;
  border-top: 1.5px solid rgba(255, 83, 90, 0.45);
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.95);
`;

export const AmbientEdgeGlow = styled.div<{ $position: 'top' | 'bottom' }>`
  position: absolute;
  ${({ $position }) => ($position === 'top' ? 'bottom: 0;' : 'top: 0;')}
  left: 50%;
  transform: translateX(-50%);
  width: min(600px, 90vw);
  height: 100px;
  background: ${({ $position }) =>
    $position === 'top'
      ? 'radial-gradient(ellipse at bottom, rgba(255, 83, 90, 0.22), rgba(255, 185, 85, 0.12), transparent 75%)'
      : 'radial-gradient(ellipse at top, rgba(255, 83, 90, 0.22), rgba(255, 185, 85, 0.12), transparent 75%)'};
  filter: blur(24px);
  pointer-events: none;
`;

export const SeamGlowLine = styled.div<{ $position: 'top' | 'bottom' }>`
  position: absolute;
  ${({ $position }) => ($position === 'top' ? 'bottom: 0;' : 'top: 0;')}
  left: 0;
  right: 0;
  height: 2px;
  background: ${({ $position }) =>
    $position === 'top'
      ? 'linear-gradient(90deg, transparent, rgba(255, 185, 85, 0.9), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(255, 83, 90, 0.9), transparent)'};
  box-shadow: 0 0 12px
    ${({ $position }) =>
      $position === 'top' ? 'rgba(255, 185, 85, 0.7)' : 'rgba(255, 83, 90, 0.7)'};
  pointer-events: none;
`;

export const SprocketColumn = styled.div<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 0;
  bottom: 0;
  ${({ $side }) => ($side === 'left' ? 'left: 12px;' : 'right: 12px;')}
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 8px 0;
  pointer-events: none;
  opacity: 0.65;

  .sprocket-hole {
    width: 14px;
    height: 22px;
    background: #000000;
    border: 1px solid rgba(255, 185, 85, 0.35);
    border-radius: 3px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.95),
      0 0 6px rgba(255, 185, 85, 0.15);
  }

  @media (max-width: 640px) {
    ${({ $side }) => ($side === 'left' ? 'left: 6px;' : 'right: 6px;')}
    .sprocket-hole {
      width: 10px;
      height: 16px;
    }
  }
`;

export const DecoCorner = styled.div<{
  $top?: boolean;
  $left?: boolean;
  $right?: boolean;
  $bottom?: boolean;
}>`
  position: absolute;
  ${({ $top }) => $top && 'top: 14px;'}
  ${({ $bottom }) => $bottom && 'bottom: 14px;'}
  ${({ $left }) => $left && 'left: 42px;'}
  ${({ $right }) => $right && 'right: 42px;'}
  font-family: 'JetBrains Mono', monospace, sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  color: ${({ $top }) =>
    $top ? 'rgba(255, 185, 85, 0.55)' : 'rgba(174, 135, 134, 0.6)'};
  pointer-events: none;
  text-transform: uppercase;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const CenterBranding = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  z-index: 30;
  text-align: center;
  pointer-events: none;

  .aura-badge-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .aura-ring {
      position: absolute;
      width: 90px;
      height: 90px;
      border-radius: 9999px;
      border: 1px dashed rgba(255, 185, 85, 0.4);
      animation: ${auraRotate} 20s linear infinite;
    }

    .aura-glow {
      position: absolute;
      width: 64px;
      height: 64px;
      border-radius: 9999px;
      background: rgba(255, 185, 85, 0.2);
      filter: blur(14px);
    }

    .badge-icon-box {
      position: relative;
      width: 52px;
      height: 52px;
      border-radius: 16px;
      background: linear-gradient(145deg, #1c1b1c, #0b0b0e);
      border: 1px solid rgba(255, 185, 85, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 24px rgba(255, 185, 85, 0.35);

      .icon-reel {
        width: 26px;
        height: 26px;
        color: #ffb955;
        filter: drop-shadow(0 0 8px rgba(255, 185, 85, 0.6));
      }
    }
  }

  .brand-logo {
    h1 {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 5px;
      color: #ffffff;
      margin: 0;
      text-transform: uppercase;
      font-family: 'Be Vietnam Pro', sans-serif;
      filter: drop-shadow(0 4px 14px rgba(0, 0, 0, 0.8));

      span {
        color: #ffb955;
        text-shadow: 0 0 16px rgba(255, 185, 85, 0.6);
      }
    }
  }

  .tagline-row {
    display: flex;
    align-items: center;
    gap: 8px;

    .dot-crimson {
      width: 5px;
      height: 5px;
      border-radius: 9999px;
      background: #ff535a;
      box-shadow: 0 0 6px #ff535a;
    }

    .dot-gold {
      width: 5px;
      height: 5px;
      border-radius: 9999px;
      background: #ffb955;
      box-shadow: 0 0 6px #ffb955;
    }

    .tagline-text {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 3px;
      color: #ae8786;
      text-transform: uppercase;
    }
  }

  .flare-glow {
    position: relative;
    width: 240px;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 185, 85, 0.95),
      transparent
    );
    box-shadow: 0 0 20px #ffb955;
    animation: ${flarePulse} 2.2s ease-in-out infinite;
  }
`;
