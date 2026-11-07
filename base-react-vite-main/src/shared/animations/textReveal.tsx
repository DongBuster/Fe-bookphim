import React from 'react';
import { gsap } from './gsap';

/**
 * Splits a text string into an array of masked word elements suitable for
 * cinematic word-by-word reveal animations.
 *
 * Structure:
 * <span className="word-mask">
 *   <span className="word-inner">{word}</span>
 * </span>
 */
export function splitTextToWordElements(text: string): React.ReactNode[] {
  if (!text) return [];

  const words = text.trim().split(/\s+/);
  return words.map((word, idx) => (
    <React.Fragment key={`${word}-${idx}`}>
      <span
        className="word-mask"
        style={{
          display: 'inline-block',
          overflow: 'hidden',
          verticalAlign: 'bottom',
          lineHeight: 'inherit',
        }}
      >
        <span
          className="word-inner"
          style={{
            display: 'inline-block',
            willChange: 'transform, opacity',
          }}
        >
          {word}
        </span>
      </span>
      {idx < words.length - 1 && ' '}
    </React.Fragment>
  ));
}

/**
 * Animates all `.word-inner` elements inside a container with a dramatic
 * cinematic entrance from below the mask.
 */
export function animateWordReveal(
  container: HTMLElement | null,
  options: {
    duration?: number;
    stagger?: number;
    delay?: number;
    ease?: string;
  } = {},
) {
  if (!container) return null;
  const inners = container.querySelectorAll('.word-inner');
  if (inners.length === 0) return null;

  const {
    duration = 0.7,
    stagger = 0.065,
    delay = 0,
    ease = 'power3.out',
  } = options;

  return gsap.fromTo(
    inners,
    {
      yPercent: 120,
      rotateZ: 2.5,
      opacity: 0,
    },
    {
      yPercent: 0,
      rotateZ: 0,
      opacity: 1,
      duration,
      stagger,
      delay,
      ease,
      overwrite: 'auto',
    },
  );
}

/**
 * Smoothly counts a numeric value from start to target (e.g. rating 0.0 -> 9.2).
 */
export function animateCounter(
  onUpdate: (value: string) => void,
  targetNumber: number,
  options: {
    startNumber?: number;
    duration?: number;
    decimals?: number;
    delay?: number;
    ease?: string;
  } = {},
) {
  const {
    startNumber = 0,
    duration = 1.2,
    decimals = 1,
    delay = 0,
    ease = 'power2.out',
  } = options;

  const proxy = { val: startNumber };

  return gsap.to(proxy, {
    val: targetNumber,
    duration,
    delay,
    ease,
    onUpdate: () => {
      onUpdate(proxy.val.toFixed(decimals));
    },
  });
}
