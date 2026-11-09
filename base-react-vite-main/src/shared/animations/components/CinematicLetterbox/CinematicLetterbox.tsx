import { type FC, useEffect, useRef, useState } from 'react';
import { Film } from 'lucide-react';
import { gsap } from '@/shared/animations/gsap';
import * as S from './CinematicLetterbox.styles';

interface CinematicLetterboxProps {
  /** If true, ignore sessionStorage and always play (useful for testing) */
  forcePlay?: boolean;
  onComplete?: () => void;
}

// In-memory flag: Tự động reset về false khi người dùng F5 hoặc Ctrl + F5 (Full Page Reload),
// đồng thời giữ nguyên true khi chuyển đổi qua lại giữa các trang trong ứng dụng SPA để không bị lặp lại.
let hasPlayedInSpaSession = false;

/**
 * WOW #1: Cinematic Letterbox Opening Overlay
 * Dramatic opening curtain that splits vertically, simulating the theatre
 * screen letterbox opening when the movie starts.
 */
export const CinematicLetterbox: FC<CinematicLetterboxProps> = ({
  forcePlay = false,
  onComplete,
}) => {
  const shouldSkip =
    (!forcePlay && hasPlayedInSpaSession) ||
    (!forcePlay && typeof navigator !== 'undefined' && /HeadlessChrome/.test(navigator.userAgent)) ||
    (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const [isDone, setIsDone] = useState(shouldSkip);
  const containerRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const brandingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldSkip) {
      return;
    }

    // Đánh dấu đã chạy cho phiên SPA hiện tại
    hasPlayedInSpaSession = true;

    // Dọn dẹp cờ sessionStorage cũ nếu có để luôn kích hoạt lại mượt mà khi F5 / Ctrl + F5
    try {
      sessionStorage.removeItem('phimbook_letterbox_shown');
    } catch {
      // Ignore private mode write restriction
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsDone(true);
        onComplete?.();
      },
    });

    // 1. Hiệu ứng thương hiệu xuất hiện trang trọng & giữ nhịp hồi hộp điện ảnh (Cinematic Suspense)
    if (brandingRef.current) {
      tl.fromTo(
        brandingRef.current,
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: 'power2.out',
        },
      );
      // Giữ nhịp để người dùng cảm nhận trọn vẹn thương hiệu PhimBook
      tl.to({}, { duration: 0.65 });

      // 2. Logo tan dần vào không gian rạp trước khi mở màn trập
      tl.to(brandingRef.current, {
        opacity: 0,
        scale: 1.05,
        duration: 0.55,
        ease: 'power2.in',
      });
    } else {
      tl.to({}, { duration: 0.9 });
    }

    // 3. Màn trập trên & dưới tách ra uyển chuyển, chậm rãi hơn tạo cảm giác màn chiếu IMAX mở ra
    if (topBarRef.current && bottomBarRef.current) {
      tl.to(
        topBarRef.current,
        {
          yPercent: -100,
          duration: 1.55,
          ease: 'power3.inOut',
        },
        '-=0.15',
      );

      tl.to(
        bottomBarRef.current,
        {
          yPercent: 100,
          duration: 1.55,
          ease: 'power3.inOut',
        },
        '<',
      );
    }

    const fallbackTimer = setTimeout(() => {
      setIsDone(true);
    }, 3800);

    return () => {
      clearTimeout(fallbackTimer);
      tl.kill();
    };
  }, [forcePlay, onComplete, shouldSkip]);

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
