/**
 * Centralized GSAP registration & high-performance configuration.
 * Configured for maximum 60FPS smoothness, zero layout thrashing, and battery efficiency.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register core plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

// Engine-level performance tuning
gsap.config({
  autoSleep: 60, // Sleeps GSAP ticker after 60 frames of inactivity (saves CPU/battery)
  nullTargetWarn: false, // Suppresses warnings when optional ref targets are null
});

ScrollTrigger.config({
  limitCallbacks: true, // Limits callback execution to requestAnimationFrame boundaries
  syncInterval: 50, // Optimizes resize recalculation frequency
});

export { gsap, ScrollTrigger, useGSAP };

/**
 * Utility: create a stagger scroll-reveal for a list of elements.
 * Uses fromTo with once: true for zero state-locking and fastScrollEnd for smooth fast fling.
 *
 * @param container - The wrapper ref whose children to animate.
 * @param trigger   - The element that triggers the scroll event (defaults to container).
 */
export function scrollRevealChildren(
  container: Element,
  trigger?: Element,
  vars?: gsap.TweenVars,
) {
  const defaults: gsap.TweenVars = {
    opacity: 1,
    y: 0,
    duration: 0.55,
    stagger: 0.065,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: trigger ?? container,
      start: 'top 88%',
      once: true,
      fastScrollEnd: true,
    },
  };
  return gsap.fromTo(
    container.children,
    { opacity: 0, y: 32 },
    { ...defaults, ...vars },
  );
}

/**
 * Utility: robust fade-up for a single element (section header, banner, etc.)
 */
export function fadeUp(
  el: Element | null,
  delay = 0,
  trigger?: Element,
) {
  if (!el) return;
  return gsap.fromTo(
    el,
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: trigger ?? el,
        start: 'top 90%',
        once: true,
      },
    },
  );
}
