import styled, { keyframes } from 'styled-components';
import { media } from '@/styles/breakpoints';

const shimmerHolo = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding-top: var(--page-top-offset, calc(var(--header-public-height, 80px) + 24px));
  padding-bottom: 80px;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media ${media.sm} {
    padding-top: calc(var(--header-public-height, 68px) + 16px);
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 60px;
  }
`;

export const PassportHeaderCard = styled.div`
  position: relative;
  background: linear-gradient(135deg, #181719 0%, #262428 100%);
  border-radius: 24px;
  border: 1px solid rgba(255, 185, 85, 0.35);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 185, 85, 0.15);
  padding: 32px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ff535a, #ffb955, #52b788, #4cc9f0, #ff535a);
    background-size: 300% 300%;
    animation: ${shimmerHolo} 4s ease infinite;
  }

  @media ${media.sm} {
    padding: 20px 16px;
  }
`;

export const PassportCardInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  @media ${media.md} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const UserIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  .avatar-holo {
    width: 76px;
    height: 76px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff535a 0%, #ffb955 100%);
    padding: 3px;
    box-shadow: 0 0 20px rgba(255, 185, 85, 0.35);

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      background: #1c1b1c;
    }
  }

  .name-block {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .title-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px;
      border-radius: 9999px;
      background: rgba(255, 185, 85, 0.15);
      border: 1px solid rgba(255, 185, 85, 0.4);
      color: #ffb955;
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: 0.5px;
      width: fit-content;
    }

    h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      font-family: 'Be Vietnam Pro', sans-serif;
    }

    .tier-label {
      font-size: 12.5px;
      color: #ae8786;
    }
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media ${media.sm} {
    width: 100%;
    gap: 8px;
  }
`;

export const StatBox = styled.div`
  background: rgba(14, 14, 15, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 100px;

  .stat-val {
    font-size: 20px;
    font-weight: 800;
    color: #ffb955;
    font-family: 'Be Vietnam Pro', sans-serif;
  }

  .stat-label {
    font-size: 11px;
    color: #ae8786;
    margin-top: 2px;
    text-align: center;
  }

  @media ${media.sm} {
    padding: 10px 8px;
    .stat-val {
      font-size: 16px;
    }
    .stat-label {
      font-size: 10px;
    }
  }
`;

export const TabBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 8px;
`;

export const TabButton = styled.button<{ $isActive: boolean }>`
  background: transparent;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  color: ${({ $isActive }) => ($isActive ? '#ffb955' : '#8c8994')};
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  background: ${({ $isActive }) =>
    $isActive ? 'rgba(255, 185, 85, 0.12)' : 'transparent'};
  border: 1px solid
    ${({ $isActive }) =>
      $isActive ? 'rgba(255, 185, 85, 0.3)' : 'transparent'};

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.06);
  }
`;

export const StampGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
`;

export const StampCard = styled.div<{ $effect?: string }>`
  position: relative;
  background: rgba(24, 23, 25, 0.85);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  transition: all 0.3s;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 185, 85, 0.5);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 185, 85, 0.2);
  }

  .stamp-seal {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    border: 2px dashed #ffb955;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 185, 85, 0.08);
    color: #ffb955;
    box-shadow: 0 0 12px rgba(255, 185, 85, 0.25);
  }

  .movie-name {
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
  }

  .theater-info {
    font-size: 11.5px;
    color: #ae8786;
  }

  .date-badge {
    font-size: 10.5px;
    color: #52b788;
    background: rgba(82, 183, 136, 0.1);
    padding: 2px 8px;
    border-radius: 4px;
  }
`;

export const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

export const BadgeCard = styled.div<{ $unlocked: boolean }>`
  background: rgba(24, 23, 25, 0.85);
  border-radius: 16px;
  border: 1px solid
    ${({ $unlocked }) =>
      $unlocked ? 'rgba(255, 185, 85, 0.35)' : 'rgba(255, 255, 255, 0.06)'};
  padding: 18px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  opacity: ${({ $unlocked }) => ($unlocked ? 1 : 0.6)};
  transition: all 0.3s;

  &:hover {
    border-color: rgba(255, 185, 85, 0.5);
  }

  .badge-icon-box {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    background: ${({ $unlocked }) =>
      $unlocked
        ? 'linear-gradient(135deg, rgba(255, 185, 85, 0.25), rgba(255, 83, 90, 0.25))'
        : 'rgba(255, 255, 255, 0.05)'};
    border: 1px solid
      ${({ $unlocked }) =>
        $unlocked ? 'rgba(255, 185, 85, 0.4)' : 'rgba(255, 255, 255, 0.08)'};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: ${({ $unlocked }) => ($unlocked ? '#ffb955' : '#8c8994')};
  }

  .badge-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;

    h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
    }

    p {
      margin: 0;
      font-size: 12px;
      color: #ae8786;
      line-height: 1.4;
    }

    .claim-btn {
      margin-top: 8px;
      padding: 6px 14px;
      background: linear-gradient(135deg, #ff535a 0%, #ffb955 100%);
      border: none;
      border-radius: 8px;
      color: #3b0008;
      font-family: 'Be Vietnam Pro', sans-serif;
      font-size: 11.5px;
      font-weight: 800;
      cursor: pointer;
      align-self: flex-start;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 14px rgba(255, 185, 85, 0.4);
      }

      &:disabled {
        background: rgba(255, 255, 255, 0.1);
        color: #8c8994;
        cursor: not-allowed;
      }
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #8c8994;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;
