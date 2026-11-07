import styled from 'styled-components';
import { Star, MapPin } from 'lucide-react';
import { Container as BaseContainer } from '@/shared/components/layout';
import { media } from '@/styles/breakpoints';

export const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  background-color: var(--bg-primary);
`;

export const Container = styled(BaseContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 24px;

  @media ${media.lg} {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 707px;
`;

export const Subtitle = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: var(--primary-tint);
  letter-spacing: 1.1px;
  text-transform: uppercase;
  font-family: 'Be Vietnam Pro', sans-serif;
`;

export const Title = styled.h2`
  font-size: 40px;
  font-weight: 800;
  color: var(--primary-text);
  line-height: 48px;
  text-transform: uppercase;
  letter-spacing: -1px;
  font-family: 'Be Vietnam Pro', sans-serif;
  margin: 0;

  @media ${media.md} {
    font-size: 28px;
    line-height: 36px;
  }
`;

export const HeaderStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
`;

export const HeaderStarIcon = styled(Star)`
  color: var(--secondary);
  fill: var(--secondary);
`;

export const HeaderStatusText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary-alt);
  letter-spacing: 0.28px;
  font-family: 'Be Vietnam Pro', sans-serif;
`;

export const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;

  @media ${media.lg} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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

export const CardImage = styled.img`
  position: absolute;
  top: -12%;
  right: 0;
  left: 0;
  width: 100%;
  height: 124%;
  will-change: transform;
  object-fit: cover;
  object-position: center;
  transition: filter 0.4s ease;
  z-index: -10;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 481px;
  background-color: var(--bg-card);
  box-shadow:
    0px 20px 25px -5px rgba(0, 0, 0, 0.1),
    0px 8px 10px -6px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;

  &:hover ${CardImage} {
    filter: brightness(1.08);
  }
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 224px;
  flex-shrink: 0;
  overflow: hidden;
  isolation: isolate;
`;

export const ImageGradient = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: linear-gradient(
    to top,
    var(--bg-card),
    rgba(28, 27, 28, 0.2),
    transparent
  );
  z-index: 1;
`;

export const BrandBadge = styled.div`
  position: absolute;
  top: 15px;
  left: 12px;
  padding: 3px 10px;
  background-color: rgba(14, 14, 15, 0.8);
  backdrop-filter: blur(6px);
  border-radius: 8px;
  z-index: 10;
`;

export const BrandText = styled.span<{ $color?: string }>`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.66px;
  font-family: 'Be Vietnam Pro', sans-serif;
  color: ${({ $color }) => $color || 'inherit'};
`;

export const FormatBadge = styled.div<{ $bg?: string }>`
  position: absolute;
  bottom: 11px;
  right: 12px;
  padding: 3px 10px;
  border-radius: 6px;
  z-index: 10;
  box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.2);
  background-color: ${({ $bg }) => $bg || 'transparent'};
`;

export const FormatText = styled.span<{ $color?: string }>`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.66px;
  text-transform: uppercase;
  font-family: 'Be Vietnam Pro', sans-serif;
  color: ${({ $color }) => $color || 'inherit'};
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  padding: 24px;
  padding-bottom: 16px;
`;

export const CardTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: var(--primary-text);
  line-height: 30px;
  letter-spacing: -0.22px;
  font-family: 'Be Vietnam Pro', sans-serif;
  margin: 0;
`;

export const AddressGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 6px;
`;

export const LocationIcon = styled(MapPin)`
  color: var(--primary-subtitle);
  flex-shrink: 0;
  margin-top: 2px;
`;

export const AddressText = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: var(--primary-subtitle);
  line-height: 18px;
  letter-spacing: 0.18px;
  font-family: 'Be Vietnam Pro', sans-serif;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
`;

export const DescriptionText = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: var(--text-secondary-alt);
  line-height: 22px;
  letter-spacing: 0.14px;
  font-family: 'Be Vietnam Pro', sans-serif;
  margin: 16px 0 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px 24px 24px;
  margin-top: auto;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 480px) {
    padding: 0 16px 16px 16px;
    gap: 8px;
  }
`;

export const StatusGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const StatusIndicator = styled.div`
  width: 10px;
  height: 10px;
  background-color: var(--secondary);
  border-radius: 9999px;
  box-shadow: 0px 0px 8px rgba(255, 185, 85, 0.6);
  flex-shrink: 0;
`;

export const StatusText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: var(--primary-text);
  letter-spacing: 0.66px;
  font-family: 'Be Vietnam Pro', sans-serif;
  white-space: nowrap;
`;

export const ActionButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 14px;
  height: 32px;
  background-color: var(--bg-disabled);
  border-radius: 12px;
  transition-property:
    color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-duration: 150ms;
  border: none;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background-color: var(--bg-border-light);
  }
`;

export const ActionButtonText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: var(--primary-text);
  letter-spacing: 0.66px;
  font-family: 'Be Vietnam Pro', sans-serif;
  white-space: nowrap;
`;
