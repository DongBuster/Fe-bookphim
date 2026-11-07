import styled from 'styled-components';

export const Overlay = styled.div<{ $isDone: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 99999;
  pointer-events: none;
  overflow: hidden;
  display: ${({ $isDone }) => ($isDone ? 'none' : 'block')};
`;

export const TopCurtain = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50.5vh;
  background: #09090b;
  border-bottom: 1px solid rgba(255, 185, 85, 0.25);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.9);
  will-change: transform;
`;

export const BottomCurtain = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50.5vh;
  background: #09090b;
  border-top: 1px solid rgba(255, 185, 85, 0.25);
  box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.9);
  will-change: transform;
`;

export const CenterBranding = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 10;
  text-align: center;
  pointer-events: none;

  .brand-logo {
    display: flex;
    align-items: center;
    gap: 8px;

    .icon-reel {
      width: 32px;
      height: 32px;
      color: #ffb955;
      filter: drop-shadow(0 0 12px rgba(255, 185, 85, 0.6));
    }

    h1 {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 4px;
      color: #ffffff;
      margin: 0;
      text-transform: uppercase;
      font-family: 'Be Vietnam Pro', sans-serif;

      span {
        color: #ffb955;
      }
    }
  }

  .tagline {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2.5px;
    color: #ae8786;
    text-transform: uppercase;
  }

  .flare-glow {
    position: absolute;
    width: 200px;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 185, 85, 0.9),
      transparent
    );
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 20px #ffb955;
  }
`;
