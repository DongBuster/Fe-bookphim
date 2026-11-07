import styled from 'styled-components';
import { Container } from '@/shared/components/layout';
import { media } from '@/styles/breakpoints';

export const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  background-color: var(--bg-primary);
`;

export const InnerContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 24px;
  gap: 20px;

  @media ${media.lg} {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

export const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
`;

export const SubtitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const RedDot = styled.div`
  width: 10px;
  height: 10px;
  background-color: var(--primary);
  border-radius: 9999px;
`;

export const SubtitleText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: var(--secondary);
  letter-spacing: 1.1px;
  text-transform: uppercase;
  font-family: 'Be Vietnam Pro', sans-serif;
`;

export const MainTitle = styled.h2`
  font-size: 40px;
  font-weight: 800;
  color: var(--primary-text);
  line-height: 48px;
  text-transform: uppercase;
  letter-spacing: -1px;
  font-family: 'Be Vietnam Pro', sans-serif;
  max-width: 430px;

  @media (max-width: 768px) {
    font-size: 24px;
    line-height: 30px;
    letter-spacing: -0.5px;
  }

  @media (max-width: 440px) {
    font-size: 20px;
    line-height: 26px;
    letter-spacing: 0;
  }
`;

export const MainTitleHighlight = styled.span`
  color: var(--primary);
`;

export const CategoryPillsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  overflow-x: auto;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  flex: 1;
  justify-content: flex-end;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;

  @media ${media.lg} {
    justify-content: flex-start;
  }

  @media ${media.sm} {
    gap: 8px;
  }

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TabButton = styled.button<{ $active: boolean }>`
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  border-radius: 9999px;
  white-space: nowrap;
  transition-property:
    color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;

  ${({ $active }) =>
    $active
      ? `
    background-color: var(--primary);
    color: var(--on-primary-darker);
    box-shadow: 0px 4px 12px rgba(255,83,90,0.3);
  `
      : `
    background-color: rgba(42, 42, 43, 0.8);
    color: var(--text-secondary-alt);
    
    &:hover {
      background-color: var(--bg-disabled);
    }
  `}
`;

export const TabText = styled.span<{ $active: boolean }>`
  font-size: 14px;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-weight: ${({ $active }) => ($active ? '700' : '600')};
  letter-spacing: 0.28px;
`;

export const MoviesGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 24px;

  @media ${media.xl} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
  }
  @media ${media.lg} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
  @media ${media.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  @media ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

export const MovieCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--bg-card);
  border-radius: 16px;
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  cursor: pointer;
  will-change: transform;
  transform-style: preserve-3d;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;

  &:hover {
    box-shadow: 0px 16px 40px rgba(255, 185, 85, 0.16), 0 0 24px rgba(255, 83, 90, 0.12);
    border-color: rgba(255, 185, 85, 0.45);
  }
`;

export const PosterContainer = styled.div`
  position: relative;
  width: 100%;
  height: 341px;
  overflow: hidden;
  isolation: isolate;

  @media (max-width: 680px) {
    height: 280px;
  }
`;

export const PosterImage = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
  z-index: -10;

  ${MovieCard}:hover & {
    transform: scale(1.05);
  }
`;

export const PosterGradient = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: linear-gradient(
    to top,
    var(--bg-primary),
    rgba(14, 14, 15, 0.3),
    transparent
  );
  z-index: 1;
`;

export const TopLeftBadges = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 10;
`;

export const RatingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  height: 22px;
  background-color: rgba(14, 14, 15, 0.85);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 185, 85, 0.2);
  border-radius: 6px;
`;

export const RatingText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: var(--secondary);
  letter-spacing: 0.66px;
  font-family: 'Be Vietnam Pro', sans-serif;
`;

export const AgeBadge = styled.div<{ $bgColor: string }>`
  padding: 2px 8px;
  height: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $bgColor }) => $bgColor};
`;

export const AgeText = styled.span<{ $color: string }>`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.66px;
  font-family: 'Be Vietnam Pro', sans-serif;
  text-transform: uppercase;
  color: ${({ $color }) => $color};
`;

export const FormatBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 2px 8px;
  height: 22px;
  background-color: rgba(42, 42, 43, 0.85);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

export const FormatText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: var(--primary-text);
  letter-spacing: 0.66px;
  text-transform: uppercase;
  font-family: 'Be Vietnam Pro', sans-serif;
`;

export const BottomMetaContainer = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  z-index: 10;
`;

export const MetaText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: var(--secondary);
  letter-spacing: 0.66px;
  font-family: 'Be Vietnam Pro', sans-serif;
`;

export const MovieTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-text);
  line-height: 25px;
  font-family: 'Be Vietnam Pro', sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const BottomInfoArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 10px;
  height: 60px;
  background-color: var(--bg-elevated);
  position: relative;
  margin-top: auto;

  @media (max-width: 680px) {
    padding: 8px 6px;
    gap: 6px;
    height: 54px;
  }
`;

export const DetailButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 8px;
  height: 38px;
  flex: 1;
  min-width: 0;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 680px) {
    height: 36px;
    padding: 4px 6px;
    border-radius: 8px;
  }
`;

export const DetailButtonText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: var(--primary-text);
  letter-spacing: 0.4px;
  text-transform: uppercase;
  font-family: 'Be Vietnam Pro', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const BuyButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  height: 38px;
  flex: 1;
  min-width: 0;
  background-color: var(--primary);
  border-radius: 10px;
  border: none;
  cursor: pointer;
  box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 83, 90, 0.35);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 680px) {
    height: 36px;
    padding: 4px 6px;
    border-radius: 8px;
  }
`;

export const TicketIconContainer = styled.div`
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const BuyButtonText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: var(--on-primary-darker);
  letter-spacing: 0.4px;
  text-transform: uppercase;
  font-family: 'Be Vietnam Pro', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
