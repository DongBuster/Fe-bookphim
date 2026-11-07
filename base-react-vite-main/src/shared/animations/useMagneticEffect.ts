import { useEffect, type RefObject } from 'react';
import { gsap } from './gsap';

interface MagneticOptions {
  /** Strength of magnetic pull (default: 0.35) */
  strength?: number;
  /** Maximum pixel displacement allowed (default: 24) */
  maxDisplacement?: number;
  /** Ease for quickTo tracking (default: 'power2.out') */
  ease?: string;
  /** Duration of tracking in seconds (default: 0.25) */
  duration?: number;
  /** Whether magnetic effect is enabled */
  enabled?: boolean;
}

/**
 * High-Performance Magnetic Attraction Hook:
 * - Uses gsap.quickTo() to reuse running tweens rather than creating new objects on every move.
 * - Caches getBoundingClientRect() on pointerenter to completely eliminate layout reflow / thrashing during pointermove.
 * - Promotes layer with will-change: transform only while hovered, releasing GPU memory on leave.
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
    const xTo = gsap.quickTo(el, 'x', { duration, ease, overwrite: 'auto' });
    const yTo = gsap.quickTo(el, 'y', { duration, ease, overwrite: 'auto' });

    let cachedRect: DOMRect | null = null;

    const handlePointerEnter = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      cachedRect = el.getBoundingClientRect();
      el.style.willChange = 'transform';
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!cachedRect) {
        cachedRect = el.getBoundingClientRect();
      }
      const centerX = cachedRect.left + cachedRect.width / 2;
      const centerY = cachedRect.top + cachedRect.height / 2;

      let deltaX = (e.clientX - centerX) * strength;
      let deltaY = (e.clientY - centerY) * strength;

      // Clamp displacement so button stays within interactive range
      deltaX = Math.max(-maxDisplacement, Math.min(maxDisplacement, deltaX));
      deltaY = Math.max(-maxDisplacement, Math.min(maxDisplacement, deltaY));

      xTo(deltaX);
      yTo(deltaY);
    };

    const handlePointerLeave = () => {
      cachedRect = null;
      // Elastic spring back to center
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.65,
        ease: 'elastic.out(1.1, 0.4)',
        overwrite: 'auto',
        onComplete: () => {
          if (el) {
            el.style.willChange = 'auto';
          }
        },
      });
    };

    const handleScroll = () => {
      cachedRect = null;
    };

    el.addEventListener('pointerenter', handlePointerEnter);
    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      el.removeEventListener('pointerenter', handlePointerEnter);
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('scroll', handleScroll);
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0, clearProps: 'willChange' });
    };
  }, [targetRef, strength, maxDisplacement, ease, duration, enabled]);
}
