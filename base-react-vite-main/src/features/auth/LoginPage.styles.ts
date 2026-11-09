import styled from 'styled-components';

export const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #0e0e0f;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 12px;
  position: relative;
  overflow-x: hidden;

  @media (min-height: 700px) and (min-width: 993px) {
    height: 100vh;
    padding: 8px 16px;
    overflow-y: hidden;
  }

  /* Ambient light blur in background */
  &::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 20%;
    width: 500px;
    height: 500px;
    background: radial-gradient(
      circle,
      rgba(255, 83, 90, 0.12) 0%,
      transparent 70%
    );
    filter: blur(80px);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 10%;
    right: 20%;
    width: 450px;
    height: 450px;
    background: radial-gradient(
      circle,
      rgba(255, 185, 85, 0.08) 0%,
      transparent 70%
    );
    filter: blur(80px);
    pointer-events: none;
  }
`;

export const MainContainer = styled.div`
  width: 100%;
  max-width: 1120px;
  background: #141315;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  box-shadow: 0 24px 64px -12px rgba(0, 0, 0, 0.9);
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  overflow: hidden;
  position: relative;
  z-index: 1;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    max-width: 580px;
  }
`;
