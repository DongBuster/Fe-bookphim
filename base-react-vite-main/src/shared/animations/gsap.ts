/**
 * Centralized GSAP registration — import once at app root (or feature root).
 * All plugins registered here are available globally after this module loads.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

/**
 * matchMedia wrapper for prefers-reduced-motion.
 * Returns a GSAP matchMedia context — animations inside the callback only
 * run when the user has NOT requested reduced motion.
 */
export const motionSafe = gsap.matchMedia();

/**
 * Utility: create a stagger scroll-reveal for a list of elements.
 * @param container - The wrapper ref whose children to animate.
 * @param trigger   - The element that triggers the scroll event (defaults to container).
 */
export function scrollRevealChildren(
  container: Element,
  trigger?: Element,
  vars?: gsap.TweenVars,
) {
  const defaults: gsap.TweenVars = {
    opacity: 0,
    y: 32,
    duration: 0.55,
    stagger: 0.075,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: trigger ?? container,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  };
  return gsap.from(container.children, { ...defaults, ...vars });
}

/**
 * Utility: simple fade-up for a single element (section header, etc.)
 */
export function fadeUp(
  el: Element | null,
  delay = 0,
  trigger?: Element,
) {
  if (!el) return;
  return gsap.from(el, {
    opacity: 0,
    y: 24,
    duration: 0.6,
    delay,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: trigger ?? el,
      start: 'top 90%',
      toggleActions: 'play none none reverse',
    },
  });
}
