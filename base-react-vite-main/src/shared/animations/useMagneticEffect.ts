import { useEffect, type RefObject } from 'react';
import { gsap } from './gsap';

interface MagneticOptions {
  /** Strength of magnetic pull (default: 0.35) */
  strength?: number;
  /** Maximum pixel displacement allowed (default: 24) */
  maxDisplacement?: number;
  /** Ease for quickTo tracking (default: 'power2.out') */
  ease?: string;
  /** Duration of tracking in seconds (default: 0.3) */
  duration?: number;
  /** Whether magnetic effect is enabled */
  enabled?: boolean;
}

/**
 * Hook: attaches magnetic attraction to a button/card so it pulls toward
 * the user's cursor on hover and bounces back smoothly with elastic physics.
 * Uses gsap.quickTo() for 60FPS GPU performance without layout reflow.
 */
export function useMagneticEffect<T extends HTMLElement>(
  targetRef: RefObject<T | null>,
  options: MagneticOptions = {},
) {
  const {
    strength = 0.35,
    maxDisplacement = 24,
    ease = 'power2.out',
    duration = 0.25,
    enabled = true,
  } = options;

  useEffect(() => {
    const el = targetRef.current;
    if (!el || !enabled) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Prepare quickTo tweens for x and y
    const xTo = gsap.quickTo(el, 'x', { duration, ease });
    const yTo = gsap.quickTo(el, 'y', { duration, ease });

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let deltaX = (e.clientX - centerX) * strength;
      let deltaY = (e.clientY - centerY) * strength;

      // Clamp displacement so button stays within interactive range
      deltaX = Math.max(-maxDisplacement, Math.min(maxDisplacement, deltaX));
      deltaY = Math.max(-maxDisplacement, Math.min(maxDisplacement, deltaY));

      xTo(deltaX);
      yTo(deltaY);
    };

    const handlePointerLeave = () => {
      // Elastic spring back to center
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1.1, 0.4)',
        overwrite: 'auto',
      });
    };

    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [targetRef, strength, maxDisplacement, ease, duration, enabled]);
}
