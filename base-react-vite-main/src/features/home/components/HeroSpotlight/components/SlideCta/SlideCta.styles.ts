import styled from 'styled-components';
import { media } from '@/styles/breakpoints';

// ─── CTA Wrapper ──────────────────────────────────────────────────────────────

export const ActionCtas = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 14px;
  width: 100%;
  max-width: 100%;
  height: auto;
  padding-top: 4px;

  @media ${media.sm} {
    gap: 8px;
    padding-top: 2px;
  }
`;

// ─── Book Button ──────────────────────────────────────────────────────────────

export const BookButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 270px;
  max-width: 100%;
  height: 44px;
  padding: 10px 22px;
  background-image: linear-gradient(
    to right,
    var(--primary),
    var(--primary-sub)
  );
  box-shadow: 0px 0px 32px rgba(255, 83, 90, 0.5);
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }

  @media ${media.sm} {
    flex: 1 1 auto;
    min-width: 0;
    width: auto;
    padding: 8px 12px;
    height: 40px;
    gap: 6px;
    box-shadow: 0px 0px 18px rgba(255, 83, 90, 0.4);
  }
`;

export const BookButtonText = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: var(--on-primary-dark);
  letter-spacing: 0.7px;
  text-transform: uppercase;
  font-family: 'Be Vietnam Pro', sans-serif;
  white-space: nowrap;

  .btn-short {
    display: none;
  }

  @media ${media.sm} {
    font-size: 12px;
    letter-spacing: 0.2px;

    .btn-full {
      display: none;
    }
    .btn-short {
      display: inline;
    }
  }

  @media (max-width: 380px) {
    font-size: 11px;
    letter-spacing: 0;
  }
`;

// ─── Trailer Button (Cinema Noir Luxury Frosted Glass - Pill Shape) ───────────

export const TrailerButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: auto;
  min-width: 164px;
  height: 44px;
  padding: 8px 20px 8px 10px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
    border-color: rgba(255, 255, 255, 0.35);
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.5),
      0 0 16px rgba(255, 83, 90, 0.25);
  }

  &:active {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }

  @media ${media.sm} {
    flex-shrink: 0;
    width: auto;
    min-width: unset;
    padding: 6px 16px 6px 8px;
    height: 40px;
    gap: 8px;
    border-radius: 9999px;
  }

  @media (max-width: 380px) {
    padding: 6px 12px 6px 6px;
    gap: 6px;
  }
`;

export const PlayIconContainer = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(255, 83, 90, 0.35) 0%,
    rgba(224, 30, 53, 0.2) 100%
  );
  border: 1.5px solid rgba(255, 83, 90, 0.65);
  box-shadow: 0 0 10px rgba(255, 83, 90, 0.3);
  transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  flex-shrink: 0;

  ${TrailerButton}:hover & {
    transform: scale(1.08);
    background: linear-gradient(
      135deg,
      rgba(255, 83, 90, 0.5) 0%,
      rgba(224, 30, 53, 0.35) 100%
    );
    border-color: rgba(255, 83, 90, 0.9);
    box-shadow: 0 0 14px rgba(255, 83, 90, 0.55);
  }

  @media ${media.sm} {
    width: 24px;
    height: 24px;
  }
`;

export const TrailerButtonText = styled.span`
  font-size: 13.5px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.4px;
  font-family: 'Be Vietnam Pro', sans-serif;
  white-space: nowrap;
  line-height: 1;

  .btn-short {
    display: none;
  }

  @media ${media.sm} {
    font-size: 12px;
    letter-spacing: 0.1px;

    .btn-full {
      display: none;
    }
    .btn-short {
      display: inline;
    }
  }

  @media (max-width: 380px) {
    font-size: 11px;
  }
`;
