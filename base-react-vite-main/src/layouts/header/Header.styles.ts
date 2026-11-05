import styled from 'styled-components';
import { media } from '@/styles/breakpoints';

export const OuterHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: var(--header-public-height, 80px);
  z-index: 100;
  background: rgba(14, 14, 15, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0px 16px 40px -8px rgba(0, 0, 0, 0.7);

  @media ${media.md} {
    height: var(--header-public-height, 68px);
  }
`;

export const InnerContainer = styled.div`
  width: 100%;
  max-width: var(--content-max-width, 1280px);
  height: var(--header-public-height, 80px);
  margin: 0 auto;
  padding: 0 var(--page-gutter, 24px);
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media ${media.md} {
    padding: 0 var(--page-gutter-compact, 16px);
    height: var(--header-public-height, 68px);
  }

  @media ${media.sm} {
    padding: 0 12px;
  }
`;

export const NavLeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  height: 42px;
  min-width: 0;
  flex-shrink: 0;
`;

export const SearchCenterGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  max-width: 440px;
  min-width: 200px;
  margin: 0 24px;

  @media ${media.xl} {
    max-width: 360px;
    margin: 0 16px;
  }

  @media ${media.lg} {
    max-width: 260px;
    margin: 0 10px;
  }

  @media ${media.md} {
    display: none;
  }
`;

export const EdgeMenuTrigger = styled.button<{ $isOpen?: boolean }>`
  display: none; /* Ẩn trên desktop/màn hình lớn */
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: ${({ $isOpen }) =>
    $isOpen ? 'rgba(255, 185, 85, 0.2)' : 'rgba(28, 27, 28, 0.9)'};
  border: 1px solid
    ${({ $isOpen }) =>
      $isOpen ? 'rgba(255, 185, 85, 0.5)' : 'rgba(255, 255, 255, 0.12)'};
  color: ${({ $isOpen }) =>
    $isOpen ? 'var(--secondary, #ffb955)' : 'var(--text-primary, #e5e2e3)'};
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
  backdrop-filter: blur(12px);

  @media ${media.lg} {
    display: flex; /* Xuất hiện trên tablet và mobile */
  }

  &:hover {
    background: rgba(255, 83, 90, 0.2);
    color: var(--secondary, #ffb955);
    border-color: rgba(255, 185, 85, 0.45);
    box-shadow: 0px 0px 18px rgba(255, 185, 85, 0.35);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.96);
  }

  @media ${media.sm} {
    width: 34px;
    height: 34px;
    border-radius: 8px;
  }
`;

export const ActionsGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  height: 37px;
  flex-shrink: 0;

  @media ${media.xl} {
    gap: 8px;
  }

  @media ${media.md} {
    gap: 8px;
  }

  @media ${media.sm} {
    gap: 6px;
  }
`;
