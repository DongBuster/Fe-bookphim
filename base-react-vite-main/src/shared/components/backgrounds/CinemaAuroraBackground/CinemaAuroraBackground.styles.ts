import styled from 'styled-components';

export const AuroraContainer = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  background-color: #0b0b0e;
`;

export const AuroraCanvas = styled.canvas`
  position: absolute;
  inset: -15%;
  width: 130%;
  height: 130%;
  filter: blur(55px) saturate(1.25);
  will-change: transform;
  transform: translate3d(0, 0, 0);
  pointer-events: none;

  @media (prefers-reduced-motion: reduce) {
    filter: blur(50px) saturate(1.1);
  }
`;

export const FilmGrainOverlay = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.18;
  mix-blend-mode: overlay;
  pointer-events: none;
`;

export const VignetteOverlay = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at 50% 50%,
    transparent 35%,
    rgba(11, 11, 14, 0.6) 75%,
    rgba(7, 7, 9, 0.92) 100%
  );
  pointer-events: none;
`;
