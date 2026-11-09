import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const scaleUp = keyframes`
  from {
    opacity: 0;
    transform: scale(0.96) translateY(12px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 14px rgba(255, 83, 90, 0.4);
  }
  50% {
    box-shadow: 0 0 24px rgba(255, 83, 90, 0.7);
  }
`;

export const TrailerModalOverlay = styled.div<{ $isDocked?: boolean }>`
  position: fixed;
  inset: 0;
  background: ${({ $isDocked }) => ($isDocked ? 'transparent' : 'rgba(0, 0, 0, 0.88)')};
  backdrop-filter: ${({ $isDocked }) => ($isDocked ? 'none' : 'blur(16px)')};
  -webkit-backdrop-filter: ${({ $isDocked }) => ($isDocked ? 'none' : 'blur(16px)')};
  z-index: 99999;
  display: flex;
  align-items: ${({ $isDocked }) => ($isDocked ? 'flex-end' : 'center')};
  justify-content: ${({ $isDocked }) => ($isDocked ? 'flex-end' : 'center')};
  padding: ${({ $isDocked }) => ($isDocked ? '0 24px 24px 0' : '24px')};
  pointer-events: ${({ $isDocked }) => ($isDocked ? 'none' : 'auto')};
  overflow-y: ${({ $isDocked }) => ($isDocked ? 'visible' : 'auto')};
  animation: ${fadeIn} 0.25s ease-out;
  transition: background-color 0.3s ease, backdrop-filter 0.3s ease;

  @media (max-width: 768px) {
    padding: ${({ $isDocked }) => ($isDocked ? '0 12px 12px 0' : '12px')};
  }
`;

export const ModalContainer = styled.div<{ $isDocked?: boolean }>`
  position: relative;
  width: 100%;
  max-width: ${({ $isDocked }) => ($isDocked ? '340px' : '1060px')};
  max-height: ${({ $isDocked }) => ($isDocked ? '240px' : 'calc(100vh - 48px)')};
  background: #0f0e13;
  border-radius: ${({ $isDocked }) => ($isDocked ? '16px' : '20px')};
  border: 1px solid ${({ $isDocked }) => ($isDocked ? 'rgba(255, 83, 90, 0.4)' : 'rgba(255, 255, 255, 0.12)')};
  box-shadow: ${({ $isDocked }) =>
    $isDocked
      ? '0 24px 48px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 83, 90, 0.25)'
      : '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 40px rgba(255, 83, 90, 0.15)'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto;
  transition: max-width 0.38s cubic-bezier(0.16, 1, 0.3, 1),
              max-height 0.38s cubic-bezier(0.16, 1, 0.3, 1),
              border-radius 0.3s ease,
              box-shadow 0.3s ease;
  animation: ${scaleUp} 0.28s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 768px) {
    border-radius: 14px;
    max-height: ${({ $isDocked }) => ($isDocked ? '220px' : 'calc(100vh - 24px)')};
  }
`;

export const ModalHeaderBar = styled.div<{ $isDocked?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $isDocked }) => ($isDocked ? '8px 12px' : '14px 20px')};
  background: rgba(18, 17, 24, 0.96);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  gap: ${({ $isDocked }) => ($isDocked ? '8px' : '14px')};
  flex-wrap: ${({ $isDocked }) => ($isDocked ? 'nowrap' : 'wrap')};

  @media (max-width: 640px) {
    padding: 10px 14px;
    gap: 10px;
  }
`;

export const MovieInfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;

  .badge-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .trailer-tag {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--primary);
    background: rgba(255, 83, 90, 0.15);
    padding: 2px 8px;
    border-radius: 9999px;
  }

  .trailer-title {
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 640px) {
      font-size: 14px;
    }
  }

  .trailer-sub {
    color: #94a3b8;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 640px) {
      display: none;
    }
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  .playlist-counter-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 9999px;
    color: #f1f5f9;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .step-btn {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: var(--primary);
      border-color: var(--primary);
      transform: scale(1.08);
    }

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }

  .external-link-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #f1f5f9;
    font-size: 12.5px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 83, 90, 0.2);
      border-color: var(--primary);
      color: #ffffff;
      transform: translateY(-1px);
    }

    @media (max-width: 640px) {
      padding: 5px 8px;
      span {
        display: none;
      }
    }
  }

  .close-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.15);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--primary);
      border-color: var(--primary);
      transform: scale(1.08);
    }

    @media (max-width: 640px) {
      width: 30px;
      height: 30px;
    }
  }
`;

export const PlayerWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000000;
  overflow: hidden;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }
`;

export const FloatingNavButton = styled.button<{ $direction: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  ${({ $direction }) => ($direction === 'prev' ? 'left: 14px;' : 'right: 14px;')}
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(15, 14, 19, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  opacity: 0.7;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    opacity: 1;
    background: rgba(255, 83, 90, 0.35);
    border-color: var(--primary);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 0 20px rgba(255, 83, 90, 0.6);
  }

  @media (max-width: 640px) {
    width: 36px;
    height: 36px;
    ${({ $direction }) => ($direction === 'prev' ? 'left: 8px;' : 'right: 8px;')}
  }
`;

export const PlaylistSection = styled.div`
  padding: 14px 20px 16px;
  background: rgba(14, 13, 19, 0.98);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 640px) {
    padding: 10px 14px 12px;
  }
`;

export const PlaylistHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .playlist-title {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1px;
    color: #ae8786;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .playlist-hint {
    font-size: 11px;
    color: #7d6b6a;

    @media (max-width: 640px) {
      display: none;
    }
  }
`;

export const PlaylistRow = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
`;

export const PlaylistItemCard = styled.button<{ $isActive: boolean }>`
  flex: 0 0 200px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 12px;
  background: ${({ $isActive }) =>
    $isActive ? 'rgba(255, 83, 90, 0.16)' : 'rgba(255, 255, 255, 0.04)'};
  border: 1px solid
    ${({ $isActive }) =>
      $isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)'};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  animation: ${({ $isActive }) => ($isActive ? pulseGlow : 'none')} 3s infinite;

  &:hover {
    background: rgba(255, 83, 90, 0.12);
    border-color: rgba(255, 83, 90, 0.6);
    transform: translateY(-2px);
  }

  .item-thumb-box {
    position: relative;
    width: 54px;
    height: 38px;
    border-radius: 6px;
    overflow: hidden;
    flex-shrink: 0;
    background: #1a1a20;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .play-icon-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
    }
  }

  .item-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    flex: 1;

    .item-title {
      color: ${({ $isActive }) => ($isActive ? '#ffffff' : '#cbd5e1')};
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-status {
      font-size: 10.5px;
      font-weight: 600;
      color: ${({ $isActive }) => ($isActive ? 'var(--primary)' : '#7d6b6a')};
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }

  @media (max-width: 640px) {
    flex: 0 0 170px;
    padding: 6px 8px;

    .item-thumb-box {
      width: 44px;
      height: 32px;
    }

    .item-meta .item-title {
      font-size: 11px;
    }
  }
`;

export const FallbackContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  text-align: center;
  background: radial-gradient(circle at center, #1f1f23 0%, #0d0d0e 100%);

  .fallback-icon {
    color: var(--primary);
    margin-bottom: 16px;
    opacity: 0.9;
  }

  .fallback-title {
    color: #ffffff;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .fallback-desc {
    color: #94a3b8;
    font-size: 14px;
    max-width: 420px;
    line-height: 1.5;
    margin: 0;
  }
`;
