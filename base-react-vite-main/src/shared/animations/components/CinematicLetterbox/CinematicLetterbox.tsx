import { type FC, useEffect, useRef, useState } from 'react';
import { Film } from 'lucide-react';
import { gsap } from '@/shared/animations/gsap';
import * as S from './CinematicLetterbox.styles';

interface CinematicLetterboxProps {
  /** If true, ignore sessionStorage and always play (useful for testing) */
  forcePlay?: boolean;
  onComplete?: () => void;
}

/**
 * WOW #1: Cinematic Letterbox Opening Overlay
 * Dramatic opening curtain that splits vertically, simulating the theatre
 * screen letterbox opening when the movie starts.
 */
export const CinematicLetterbox: FC<CinematicLetterboxProps> = ({
  forcePlay = false,
  onComplete,
}) => {
  const [isDone, setIsDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const brandingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if already played in this browser session (safe check for Safari Private Mode)
    let hasPlayed: string | null = null;
    try {
      hasPlayed = sessionStorage.getItem('phimbook_letterbox_shown');
    } catch {
      // Ignore sessionStorage security error in sandboxed or private browsing
    }
    const isHeadless = /HeadlessChrome/.test(navigator.userAgent);
    if ((hasPlayed || isHeadless) && !forcePlay) {
      setIsDone(true);
      return;
    }

    // Check reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsDone(true);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        try {
          sessionStorage.setItem('phimbook_letterbox_shown', 'true');
        } catch {
          // Ignore private mode write restriction
        }
        setIsDone(true);
        onComplete?.();
      },
    });

    // 1. Hold suspense for 0.25s
    tl.to({}, { duration: 0.25 });

    // 2. Branding pulses and fades out
    if (brandingRef.current) {
      tl.to(brandingRef.current, {
        opacity: 0,
        scale: 0.94,
        duration: 0.35,
        ease: 'power2.in',
      });
    }

    // 3. Top and bottom letterbox curtains split dramatically
    if (topBarRef.current && bottomBarRef.current) {
      tl.to(
        topBarRef.current,
        {
          yPercent: -100,
          duration: 0.95,
          ease: 'power4.inOut',
        },
        '-=0.1',
      );

      tl.to(
        bottomBarRef.current,
        {
          yPercent: 100,
          duration: 0.95,
          ease: 'power4.inOut',
        },
        '<',
      );
    }

    const fallbackTimer = setTimeout(() => {
      setIsDone(true);
    }, 2200);

    return () => {
      clearTimeout(fallbackTimer);
      tl.kill();
    };
  }, [forcePlay, onComplete]);

  if (isDone) return null;

  return (
    <S.Overlay ref={containerRef} $isDone={isDone} aria-hidden="true">
      <S.TopCurtain ref={topBarRef} />
      <S.BottomCurtain ref={bottomBarRef} />

      <S.CenterBranding ref={brandingRef}>
        <div className="brand-logo">
          <Film className="icon-reel" />
          <h1>
            PHIM<span>BOOK</span>
          </h1>
        </div>
        <div className="tagline">Trải nghiệm điện ảnh đỉnh cao</div>
        <div className="flare-glow" />
      </S.CenterBranding>
    </S.Overlay>
  );
};
