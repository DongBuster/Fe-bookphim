import styled from 'styled-components';

export const CineMateCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 83, 90, 0.08) 0%, rgba(255, 185, 85, 0.08) 100%);
  border: 1px solid rgba(255, 185, 85, 0.25);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 14px;
`;

export const CineMateHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;

    .icon {
      color: #ff535a;
    }

    h4 {
      margin: 0;
      font-size: 13.5px;
      font-weight: 700;
      color: #ffffff;
    }
  }

  .switch-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #ffb955;
    cursor: pointer;
  }
`;

export const MatchesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 6px;

  .match-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background: rgba(28, 27, 29, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;

      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #ff535a;
        color: #ffffff;
        font-weight: 700;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .text {
        display: flex;
        flex-direction: column;

        .name {
          font-size: 12.5px;
          font-weight: 700;
          color: #ffffff;
        }

        .meta {
          font-size: 11px;
          color: #ae8786;
        }
      }
    }

    .match-rate {
      font-size: 12px;
      font-weight: 800;
      color: #52b788;
      background: rgba(82, 183, 136, 0.12);
      padding: 3px 8px;
      border-radius: 6px;
    }

    .greet-btn {
      padding: 6px 12px;
      border-radius: 6px;
      background: rgba(255, 185, 85, 0.15);
      border: 1px solid rgba(255, 185, 85, 0.4);
      color: #ffb955;
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        background: #ffb955;
        color: #3b0008;
      }
    }
  }
`;
