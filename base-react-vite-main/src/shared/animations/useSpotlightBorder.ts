/**
 * useSpotlightBorder hook
 * Adapted from Lucian UX/UI Prompt #228 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#228
 *
 * Casts a soft radial spotlight glow centered on the user's cursor along the borders of an element.
 * Updates --cursor-x, --cursor-y, and --border-glow-opacity directly on the element via requestAnimationFrame,
 * achieving 60-120 FPS performance with zero React component re-renders and zero layout reflows.
 */
import { useEffect, type RefObject } from 'react';

export interface SpotlightBorderOptions {
  /** Size radius of the glow circle in pixels (default: 200) */
  radius?: number;
  /** Primary glow color in rgba (default: 'rgba(255, 83, 90, 0.95)' Cinema Coral) */
  primaryColor?: string;
  /** Secondary glow color in rgba (default: 'rgba(255, 185, 85, 0.5)' Amber Gold) */
  secondaryColor?: string;
  /** Smoothing factor for fade in/out (default: 0.12) */
  easing?: number;
  /** Whether the effect is active */
  enabled?: boolean;
}

export function useSpotlightBorder<T extends HTMLElement>(
  targetRef: RefObject<T | null>,
  options: SpotlightBorderOptions = {},
) {
  const {
    radius = 200,
    primaryColor = 'rgba(255, 83, 90, 0.95)',
    secondaryColor = 'rgba(255, 185, 85, 0.5)',
    easing = 0.14,
    enabled = true,
  } = options;

  useEffect(() => {
    const el = targetRef.current;
    if (!el || !enabled) return;

    // Check reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Set initial custom properties for glow colors and radius
    el.style.setProperty('--spotlight-radius', `${radius}px`);
    el.style.setProperty('--spotlight-primary', primaryColor);
    el.style.setProperty('--spotlight-secondary', secondaryColor);

    let cachedRect: DOMRect | null = null;
    let targetOpacity = 0;
    let currentOpacity = 0;
    let targetX = -500;
    let targetY = -500;
    let currentX = -500;
    let currentY = -500;
    let rafId = 0;

    const render = () => {
      rafId = 0;
      if (!el.isConnected) return;

      if (prefersReduced) {
        currentOpacity = targetOpacity;
        currentX = targetX;
        currentY = targetY;
      } else {
        currentOpacity += (targetOpacity - currentOpacity) * easing;
        currentX += (targetX - currentX) * 0.28;
        currentY += (targetY - currentY) * 0.28;
      }

      el.style.setProperty('--cursor-x', `${currentX.toFixed(1)}px`);
      el.style.setProperty('--cursor-y', `${currentY.toFixed(1)}px`);
      el.style.setProperty('--border-glow-opacity', currentOpacity.toFixed(3));

      // Continue animation loop while opacity is transitioning or hovering
      if (Math.abs(targetOpacity - currentOpacity) > 0.005 || targetOpacity > 0.01) {
        rafId = requestAnimationFrame(render);
      }
    };

    const startLoop = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    };

    const handlePointerEnter = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      cachedRect = el.getBoundingClientRect();
      targetOpacity = 1;
      targetX = e.clientX - cachedRect.left;
      targetY = e.clientY - cachedRect.top;
      startLoop();
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!cachedRect) {
        cachedRect = el.getBoundingClientRect();
      }
      targetX = e.clientX - cachedRect.left;
      targetY = e.clientY - cachedRect.top;
      targetOpacity = 1;
      startLoop();
    };

    const handlePointerLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      cachedRect = null;
      targetOpacity = 0;
      startLoop();
    };

    const handleScroll = () => {
      // Invalidate bounding box cache when page scrolls
      cachedRect = null;
    };

    el.addEventListener('pointerenter', handlePointerEnter);
    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.removeEventListener('pointerenter', handlePointerEnter);
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('scroll', handleScroll);
      el.style.removeProperty('--cursor-x');
      el.style.removeProperty('--cursor-y');
      el.style.removeProperty('--border-glow-opacity');
    };
  }, [targetRef, radius, primaryColor, secondaryColor, easing, enabled]);
}
