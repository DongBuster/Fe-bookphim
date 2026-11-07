import { type FC, useEffect, useRef } from 'react';
import { gsap } from '@/shared/animations';

interface CountUpScoreProps {
  score: number;
  duration?: number;
}

/**
 * High-Performance Counter: updates DOM text directly via GSAP without
 * triggering 60fps React component re-renders.
 */
export const CountUpScore: FC<CountUpScoreProps> = ({ score, duration = 0.85 }) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = score.toFixed(1);
      return;
    }

    const proxy = { val: 0.0 };

    const tween = gsap.to(proxy, {
      val: score,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 95%',
        once: true,
      },
      onUpdate: () => {
        if (el) {
          el.textContent = proxy.val.toFixed(1);
        }
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [score, duration]);

  return <span ref={spanRef}>0.0</span>;
};
