import styled from 'styled-components';

export const LeftPanel = styled.div`
  position: relative;
  padding: 28px 36px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 560px;
  background-color: #0d0c0f;
  background-image:
    radial-gradient(
      ellipse 90% 60% at 50% 0%,
      rgba(255, 83, 90, 0.28) 0%,
      transparent 75%
    ),
    radial-gradient(
      ellipse 70% 50% at 80% 90%,
      rgba(255, 185, 85, 0.16) 0%,
      transparent 70%
    ),
    repeating-linear-gradient(
      90deg,
      rgba(255, 83, 90, 0.03) 0px,
      rgba(255, 83, 90, 0.03) 24px,
      rgba(0, 0, 0, 0.15) 24px,
      rgba(0, 0, 0, 0.15) 48px
    ),
    linear-gradient(180deg, #181114 0%, #100f12 50%, #0a090b 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.06);

  /* Dual dark overlay for readability */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(14, 14, 15, 0.75) 0%,
      rgba(14, 14, 15, 0.45) 45%,
      rgba(14, 14, 15, 0.9) 100%
    );
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }

  @media (max-width: 992px) {
    display: none;
  }
`;

export const LeftTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LeftBrandGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .brand-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #ff535a 0%, #ff7b54 100%);
    box-shadow: 0 4px 16px rgba(255, 83, 90, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
  }

  .brand-text-col {
    display: flex;
    flex-direction: column;

    .brand-title {
      font-family: 'Be Vietnam Pro', sans-serif;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #ffffff;
      line-height: 1.2;
    }

    .brand-sub {
      font-family: 'Be Vietnam Pro', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.2px;
      color: #ffb955;
      text-transform: uppercase;
      margin-top: 2px;
    }
  }
`;

export const ShowtimeBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(28, 27, 28, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  padding: 6px 14px;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #e5e2e3;

  .red-dot {
    width: 7px;
    height: 7px;
    border-radius: 9999px;
    background: #ff535a;
    box-shadow: 0 0 10px #ff535a;
  }
`;

export const LeftCenterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 40px 0;
`;

export const StandardPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 185, 85, 0.08);
  border: 1px solid rgba(255, 185, 85, 0.3);
  border-radius: 9999px;
  padding: 6px 14px;
  width: fit-content;
  color: #ffb955;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 11.5px;
  font-weight: 700;
`;

export const LeftMainTitle = styled.h1`
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 34px;
  font-weight: 800;
  line-height: 1.2;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.5px;

  .gradient-highlight {
    background: linear-gradient(90deg, #ff535a 0%, #ffb955 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const LeftDescription = styled.p`
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 13.5px;
  line-height: 1.6;
  color: #ae8786;
  margin: 0;
  max-width: 480px;
`;

export const BenefitsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 10px;
`;

export const BenefitCard = styled.div`
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 185, 85, 0.25);
  }

  .stat-val {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 20px;
    font-weight: 800;
    line-height: 1;

    &.red {
      color: #ff535a;
    }
    &.gold {
      color: #ffb955;
    }
    &.white {
      color: #ffffff;
    }
  }

  .stat-desc {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #ae8786;
    margin-top: 4px;
  }
`;

export const LeftBottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

export const SocialProofGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .avatar-cluster {
    display: flex;
    align-items: center;

    .avatar-dot {
      width: 26px;
      height: 26px;
      border-radius: 9999px;
      border: 2px solid #141315;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      color: #ffffff;
      margin-left: -8px;

      &:first-child {
        margin-left: 0;
      }

      &:nth-child(1) {
        background: #ff535a;
      }
      &:nth-child(2) {
        background: #ffb955;
      }
      &:nth-child(3) {
        background: #c2c5db;
      }
    }
  }

  .proof-text {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #ae8786;
  }
`;

export const StarRatingGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  color: #ffb955;
`;
