import styled from 'styled-components';

// ─── Slide Shell ──────────────────────────────────────────────────────────────

export const SlideItem = styled.div`
  position: relative;
  flex: 0 0 100%;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  isolation: isolate;
`;

export const SlideBackdrop = styled.div<{ $bgImage: string }>`
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 0;
  background-image: url('${({ $bgImage }) => $bgImage}');
  -webkit-user-drag: none;
  user-select: none;
`;

// ─── Cinematic Gradient Overlays ──────────────────────────────────────────────

export const GradientOverlayRight = styled.div`
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    to right,
    var(--bg-primary),
    rgba(14, 14, 15, 0.8),
    transparent
  );
  z-index: 1;
`;

export const GradientOverlayTop = styled.div`
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    to top,
    var(--bg-primary),
    rgba(14, 14, 15, 0.4),
    transparent
  );
  z-index: 2;
`;

export const GradientOverlayRadial = styled.div`
  position: absolute;
  inset: 0;
  z-index: 3;
  background: radial-gradient(
    141.42% 141.42% at 100% 0%,
    rgba(255, 83, 90, 0.1) 0%,
    rgba(255, 83, 90, 0) 50%,
    var(--bg-primary) 100%
  );
`;

// ─── Content Layout ───────────────────────────────────────────────────────────

export const SlideContentContainer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  pointer-events: none;
`;

export const SlideContentInner = styled.div`
  width: 100%;
  max-width: var(--content-max-width, 1280px);
  margin: 0 auto;
  padding: 40px var(--page-gutter, 24px) 24px;
  height: 100%;

  /* Vùng đệm an toàn (Safe Zone) chống nút điều hướng carousel che chữ trên màn laptop/desktop */
  @media (min-width: 1025px) and (max-width: 1480px) {
    padding-left: 76px;
    padding-right: 76px;
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  pointer-events: auto;
  user-select: text;
  -webkit-user-select: text;
  cursor: default;

  @media (max-width: 1024px) {
    padding-top: 36px;
    padding-bottom: 20px;
  }

  @media (max-width: 768px) {
    padding: 32px var(--page-gutter-compact, 16px) 16px;
  }

  @media (max-width: 480px) {
    padding: 28px 12px 12px;
  }

  @media (max-width: 380px) {
    padding: 24px 12px 10px;
  }
`;

export const HeroDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 680px;

  @media (max-width: 1024px) {
    gap: 8px;
  }

  @media (max-width: 640px) {
    gap: 6px;
  }

  @media (max-width: 380px) {
    gap: 5px;
  }
`;

// ─── Badges Row ───────────────────────────────────────────────────────────────

export const FormatsBadgesRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  min-height: 28px;
  height: auto;
  flex-wrap: wrap;
  position: relative;
  width: 100%;
  margin-bottom: 2px;

  @media (max-width: 640px) {
    gap: 6px;
    min-height: auto;
  }
`;

export const ImaxBadge = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 16px;
  height: 24px;
  background-color: var(--secondary-hover);
  border-radius: 9999px;
  box-shadow:
    0px 10px 15px -3px rgba(220, 145, 0, 0.2),
    0px 4px 6px -4px rgba(220, 145, 0, 0.2);

  @media (max-width: 640px) {
    padding: 3px 10px;
    height: 22px;
  }
`;

export const ImaxText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: var(--on-secondary-dark);
  letter-spacing: 0.55px;
  text-transform: uppercase;
  font-family: 'Be Vietnam Pro', sans-serif;
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 10px;
    letter-spacing: 0.2px;
  }
`;

export const AgeBadge = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  height: 24px;
  background-color: rgba(42, 42, 43, 0.8);
  backdrop-filter: blur(6px);
  border-radius: 9999px;

  @media (max-width: 640px) {
    padding: 3px 8px;
    height: 22px;
  }
`;

export const AgeText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: var(--primary-tint);
  letter-spacing: 0.66px;
  text-transform: uppercase;
  font-family: 'Be Vietnam Pro', sans-serif;
  white-space: nowrap;

  .badge-short {
    display: none;
  }

  @media (max-width: 1024px) {
    font-size: 10px;
    letter-spacing: 0.2px;

    .badge-full {
      display: none;
    }
    .badge-short {
      display: inline;
    }
  }
`;

export const RatingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  height: 28px;
  background-color: rgba(42, 42, 43, 0.8);
  backdrop-filter: blur(6px);
  border-radius: 9999px;

  @media (max-width: 640px) {
    padding: 3px 8px;
    height: 22px;
    gap: 3px;
  }
`;

export const RatingScore = styled.span`
  font-size: 14px;
  font-weight: 900;
  color: var(--primary-text);
  letter-spacing: 0.28px;
  font-family: 'Be Vietnam Pro', sans-serif;

  @media (max-width: 640px) {
    font-size: 11px;
  }
`;

export const RatingCount = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--secondary);
  letter-spacing: 0.28px;
  font-family: 'Be Vietnam Pro', sans-serif;
  white-space: nowrap;

  .badge-short {
    display: none;
  }

  @media (max-width: 1024px) {
    font-size: 11px;

    .badge-full {
      display: none;
    }
    .badge-short {
      display: inline;
    }
  }

  @media (max-width: 640px) {
    font-size: 10.5px;
  }
`;

export const GenreBadge = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  height: 24px;
  background-color: rgba(42, 42, 43, 0.6);
  backdrop-filter: blur(6px);
  border-radius: 9999px;
  margin-top: 4px;

  @media (max-width: 640px) {
    margin-top: 0;
    height: 22px;
    padding: 2px 8px;
  }
`;

export const GenreText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary-alt);
  letter-spacing: 0.66px;
  font-family: 'Be Vietnam Pro', sans-serif;
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 10px;
    letter-spacing: 0.2px;
  }
`;

// ─── Title Block ──────────────────────────────────────────────────────────────

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
`;

export const TitleLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: var(--primary-subtitle);
  letter-spacing: 2.75px;
  text-transform: uppercase;
  font-family: 'Be Vietnam Pro', sans-serif;

  @media (max-width: 640px) {
    font-size: 10px;
    letter-spacing: 1px;
  }
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 2px;
  gap: 6px;

  @media (max-width: 640px) {
    gap: 4px;
    padding-top: 0;
  }
`;

export const MainTitle = styled.h1`
  font-size: 44px;
  font-weight: 800;
  color: var(--primary-text);
  line-height: 48px;
  letter-spacing: -1px;
  text-transform: uppercase;
  font-family: 'Be Vietnam Pro', sans-serif;
  margin: 0;

  @media (max-width: 1280px) {
    font-size: 38px;
    line-height: 42px;
  }

  @media (max-width: 1024px) {
    font-size: 32px;
    line-height: 36px;
    letter-spacing: -0.6px;
  }

  @media (max-width: 640px) {
    font-size: 24px;
    line-height: 28px;
    letter-spacing: -0.2px;
  }

  @media (max-width: 400px) {
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0;
  }
`;

export const SubTitle = styled.h2`
  font-size: 24px;
  font-weight: 300;
  color: var(--text-ternary-alt);
  line-height: 28px;
  letter-spacing: -0.8px;
  text-transform: uppercase;
  font-family: 'Be Vietnam Pro', sans-serif;
  margin: 0;

  @media (max-width: 1024px) {
    font-size: 20px;
    line-height: 24px;
    letter-spacing: -0.4px;
  }

  @media (max-width: 640px) {
    font-size: 15px;
    line-height: 19px;
    letter-spacing: 0;
  }

  @media (max-width: 400px) {
    font-size: 13px;
    line-height: 17px;
    letter-spacing: 0;
  }
`;

// ─── Synopsis ─────────────────────────────────────────────────────────────────

export const Synopsis = styled.p`
  width: 100%;
  max-width: 640px;
  height: auto;
  font-size: 14px;
  font-weight: 400;
  color: var(--text-secondary-alt);
  line-height: 22px;
  font-family: 'Be Vietnam Pro', sans-serif;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 12.5px;
    line-height: 18px;
    -webkit-line-clamp: 2;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    line-height: 16px;
    -webkit-line-clamp: 2;
  }
`;

// ─── Key Metas ────────────────────────────────────────────────────────────────

export const KeyMetas = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  width: 100%;
  height: auto;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    gap: 4px 10px;
  }
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  @media (max-width: 640px) {
    gap: 4px;
  }
`;

export const MetaText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-text);
  letter-spacing: 0.28px;
  font-family: 'Be Vietnam Pro', sans-serif;

  @media (max-width: 640px) {
    font-size: 11px;
    letter-spacing: 0;
  }
`;
