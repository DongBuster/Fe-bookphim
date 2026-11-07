import { type FC, useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/shared/animations';

interface CountUpScoreProps {
  score: number;
  duration?: number;
}

export const CountUpScore: FC<CountUpScoreProps> = ({ score, duration = 1.0 }) => {
  const [displayValue, setDisplayValue] = useState('0.0');
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(score.toFixed(1));
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
        setDisplayValue(proxy.val.toFixed(1));
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getById(el.id)?.kill();
    };
  }, [score, duration]);

  return <span ref={spanRef}>{displayValue}</span>;
};
