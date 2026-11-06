import styled from 'styled-components';

export const TrailerModal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  @media (max-width: 480px) {
    align-items: flex-start;
    padding: max(16px, env(safe-area-inset-top)) 12px 16px;
  }

  .modal-content {
    position: relative;
    width: 100%;
    max-width: 900px;
    max-height: calc(100dvh - 40px);
    aspect-ratio: 16 / 9;
    background: #000;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.1);

    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    .trailer-fallback {
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
        color: #ff535a;
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
    }

    .close-btn {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      z-index: 10;
      transition: background 0.2s;

      &:hover {
        background: #ff535a;
      }
    }

    @media (max-width: 480px) {
      border-radius: 12px;

      .close-btn {
        top: 8px;
        right: 8px;
        width: 34px;
        height: 34px;
      }
    }
  }
`;
