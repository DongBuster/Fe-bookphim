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
    max-width: 960px;
    max-height: calc(100dvh - 32px);
    background: #0f0f11;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;

    .modal-header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 18px;
      background: rgba(18, 18, 22, 0.95);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      gap: 12px;

      .trailer-title {
        color: #ffffff;
        font-size: 14.5px;
        font-weight: 600;
        letter-spacing: -0.2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;

        .external-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #f1f5f9;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;

          &:hover {
            background: #ff535a;
            border-color: #ff535a;
            color: #ffffff;
            transform: translateY(-1px);
          }
        }

        .close-btn {
          width: 32px;
          height: 32px;
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
            background: #ff535a;
            border-color: #ff535a;
            transform: scale(1.05);
          }
        }
      }
    }

    .player-container {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #000000;

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
    }

    @media (max-width: 480px) {
      border-radius: 12px;

      .modal-header-bar {
        padding: 10px 12px;

        .trailer-title {
          font-size: 13px;
        }

        .header-actions {
          .external-link-btn {
            padding: 4px 8px;
            font-size: 12px;
          }

          .close-btn {
            width: 28px;
            height: 28px;
          }
        }
      }
    }
  }
`;
