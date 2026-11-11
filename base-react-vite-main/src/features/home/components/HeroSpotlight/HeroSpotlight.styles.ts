import styled from 'styled-components';
import { media } from '@/styles/breakpoints';

// ─── Section Root ─────────────────────────────────────────────────────────────

export const SectionContainer = styled.section`
  width: 100%;
  position: relative;
  background-color: var(--bg-primary);
  z-index: 10;
  overflow: visible;
  padding-top: 0;
  padding-bottom: 40px;

  @media ${media.md} {
    padding-top: 0;
    padding-bottom: 24px;
    padding-left: 0;
    padding-right: 0;
  }
`;

export const BackgroundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 580px;
  margin: 0;
  border-radius: 0;
  isolation: isolate;
  overflow: hidden;

  @media ${media.xl} {
    height: 550px;
  }

  @media ${media.lg} {
    height: 500px;
  }

  @media ${media.md} {
    height: 480px;
    border-radius: 0;
    width: 100%;
  }

  @media (max-width: 380px) {
    height: 460px;
  }
`;

// ─── Embla Carousel Viewport & Track ─────────────────────────────────────────

export const SliderViewport = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  cursor: default;
  user-select: auto;
`;

export const SliderTrack = styled.div`
  display: flex;
  height: 100%;
  user-select: auto;
  touch-action: pan-y pinch-zoom;
`;

// ─── Navigation Arrows ────────────────────────────────────────────────────────

export const SliderArrowButton = styled.button<{ $direction: 'prev' | 'next' }>`
  position: absolute;
  top: 45%;
  ${({ $direction }) =>
    $direction === 'prev'
      ? 'left: max(16px, calc((100% - var(--content-max-width, 1280px)) / 2 - 56px));'
      : 'right: max(16px, calc((100% - var(--content-max-width, 1280px)) / 2 - 56px));'}
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(14, 14, 15, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  cursor: pointer;
  z-index: 40;
  transition: all 0.25s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);

  &:hover {
    background: rgba(255, 83, 90, 0.25);
    border-color: var(--primary);
    color: #ffffff;
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 0 25px rgba(255, 83, 90, 0.45);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  @media ${media.lg} {
    display: none;
  }
`;

// ─── Quick Booking Bar ────────────────────────────────────────────────────────

export const QuickBookingBar = styled.div`
  position: relative;
  margin: -42px auto 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
  width: 100%;
  max-width: calc(var(--content-max-width, 1280px) - (var(--page-gutter, 24px) * 2));
  height: 84px;
  background-color: rgba(28, 27, 28, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0px 24px 60px -12px rgba(0, 0, 0, 0.9);
  gap: 12px;
  z-index: 20;

  @media ${media.lg} {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    height: auto;
    padding: 16px;
    margin: 20px auto 0;
    width: 100%;
    max-width: calc(100% - (var(--page-gutter-compact, 16px) * 2));
    gap: 10px;
  }

  @media ${media.md} {
    margin: 16px auto 0;
    width: 100%;
    max-width: calc(100% - (var(--page-gutter-compact, 16px) * 2));
    grid-template-columns: 1fr;
    padding: 12px;
    gap: 8px;
    border-radius: 14px;
  }

  @media ${media.sm} {
    margin: 16px auto 0;
    width: 100%;
    max-width: calc(100% - 24px);
  }
`;

// ─── Booking Bar Step Items ───────────────────────────────────────────────────

export const StepItem = styled.div<{ $isOpen?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 8px 14px;
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 54px;
  background-color: ${({ $isOpen }) =>
    $isOpen ? 'rgba(42, 42, 43, 0.75)' : 'rgba(42, 42, 43, 0.4)'};
  border: 1px solid
    ${({ $isOpen }) => ($isOpen ? 'rgba(255, 83, 90, 0.5)' : 'transparent')};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  user-select: none;

  @media ${media.sm} {
    height: 52px;
    padding: 6px 12px;
    gap: 10px;
    border-radius: 10px;
  }

  &:hover {
    background-color: rgba(42, 42, 43, 0.65);
  }
`;

export const StepIconBox = styled.div<{ $bg?: string }>`
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ $bg }) => $bg || 'rgba(255, 83, 90, 0.15)'};
  border-radius: 8px;

  @media ${media.sm} {
    width: 34px;
    height: 34px;
    border-radius: 7px;
  }
`;

export const IconBox1 = StepIconBox;
export const IconBox2 = StepIconBox;
export const IconBox3 = StepIconBox;
export const IconBox4 = StepIconBox;

export const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 36px;
  flex: 1;
  min-width: 0;

  @media ${media.sm} {
    height: 34px;
    justify-content: center;
  }
`;

export const StepLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: var(--primary-subtitle);
  letter-spacing: 0.66px;
  text-transform: uppercase;
  font-family: 'Be Vietnam Pro', sans-serif;

  @media ${media.sm} {
    font-size: 10px;
    letter-spacing: 0.5px;
  }
`;

export const StepValueRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 20px;
  gap: 8px;
`;

export const StepValue = styled.span<{ $color?: string }>`
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $color }) => $color || 'var(--primary-text)'};
  letter-spacing: 0.28px;
  font-family: 'Be Vietnam Pro', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StepValue1 = StepValue;
export const StepValue2 = StepValue;
export const StepValue3 = StepValue;
export const StepValue4 = styled(StepValue)`
  color: var(--secondary);
`;

export const DropdownChevron = styled.div<{ $isOpen?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.25s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

// ─── Booking Dropdown ─────────────────────────────────────────────────────────

export const BookingDropdown = styled.div<{ $alignRight?: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  ${({ $alignRight }) => ($alignRight ? 'right: 0;' : 'left: 0;')}
  min-width: 100%;
  width: max-content;
  max-width: 320px;
  max-height: 280px;
  overflow-y: auto;
  background: rgba(24, 23, 24, 0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.9);
  padding: 6px;
  z-index: 40;
  display: flex;
  flex-direction: column;
  gap: 3px;
  animation: slideDownFade 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideDownFade {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media ${media.md} {
    left: 0;
    right: 0;
    width: 100%;
    max-width: 100%;
    max-height: 220px;
    z-index: 40;
    box-shadow: 0px 12px 30px rgba(0, 0, 0, 0.95);
  }

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
`;

export const BookingDropdownItem = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  background: ${({ $isSelected }) =>
    $isSelected ? 'rgba(255, 83, 90, 0.15)' : 'transparent'};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ $isSelected }) =>
      $isSelected ? 'rgba(255, 83, 90, 0.25)' : 'rgba(255, 255, 255, 0.08)'};
  }

  span {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 13px;
    font-weight: ${({ $isSelected }) => ($isSelected ? 700 : 500)};
    color: ${({ $isSelected }) => ($isSelected ? '#FFFFFF' : '#E7BCBA')};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }

  .check-icon {
    color: var(--primary);
    flex-shrink: 0;
  }
`;

export const QuickBookSubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 60px;
  padding: 0 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff535a 0%, #e01e35 100%);
  color: #ffffff;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  border: none;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(255, 83, 90, 0.4);
  transition: all 0.25s ease;
  user-select: none;

  &:hover {
    background: linear-gradient(135deg, #ff6b71 0%, #e01e35 100%);
    box-shadow: 0 6px 20px rgba(255, 42, 66, 0.6);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media ${media.lg} {
    grid-column: span 2;
    height: 52px;
  }

  @media ${media.md} {
    grid-column: span 1;
    height: 48px;
    font-size: 13px;
  }
`;

