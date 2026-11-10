/**
 * CinemaAuroraBackground Component
 * Adapted from Lucian UX/UI Prompt #319 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#319
 * And React Bits Aurora Background pattern.
 *
 * Ultra-performant, zero-jank living aurora mesh with film grain noise.
 * Renders on a tiny offscreen canvas with hardware bilinear GPU blur, delivering 60-120 FPS at near 0% CPU.
 */
import { useEffect, useRef, type FC } from 'react';
import * as S from './CinemaAuroraBackground.styles';

export interface CinemaAuroraBackgroundProps {
  className?: string;
}

interface BlobDef {
  bx: number;
  by: number;
  r: number;
  ph: number;
  sp: number;
}

export const CinemaAuroraBackground: FC<CinemaAuroraBackgroundProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const grain = grainRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const S_SIZE = 96;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Cinema Noir Signature Colors (RGB)
    const BG_RGB = [11, 11, 14];
    const COLORS_RGB = [
      [255, 83, 90],   // Crimson Velvet
      [255, 185, 85],  // Amber Gold
      [123, 97, 255],  // Midnight Violet
      [225, 29, 72],   // Deep Rose
      [192, 132, 252], // Lavender Glow
    ];

    // Procedural film grain pattern (created once)
    if (grain) {
      const gCanvas = document.createElement('canvas');
      gCanvas.width = 96;
      gCanvas.height = 96;
      const gCtx = gCanvas.getContext('2d');
      if (gCtx) {
        const imgData = gCtx.createImageData(96, 96);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const v = Math.random() * 255;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = 255;
        }
        gCtx.putImageData(imgData, 0, 0);
        grain.style.backgroundImage = `url(${gCanvas.toDataURL()})`;
      }
    }

    const blobs: BlobDef[] = [
      { bx: 0.5, by: 0.45, r: 0.45, ph: 0, sp: 0.22 },
      { bx: 0.25, by: 0.3, r: 0.42, ph: 1.5, sp: 0.18 },
      { bx: 0.75, by: 0.65, r: 0.44, ph: 2.8, sp: 0.24 },
      { bx: 0.65, by: 0.32, r: 0.4, ph: 4.1, sp: 0.16 },
      { bx: 0.32, by: 0.72, r: 0.38, ph: 5.3, sp: 0.2 },
    ];

    let ptr: { x: number; y: number } | null = null;
    const follow = { x: 0.5, y: 0.5 };

    const draw = (time: number) => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `rgb(${BG_RGB[0]}, ${BG_RGB[1]}, ${BG_RGB[2]})`;
      ctx.fillRect(0, 0, S_SIZE, S_SIZE);

      ctx.globalCompositeOperation = 'lighter';

      blobs.forEach((b, i) => {
        let x = b.bx + Math.sin(time * b.sp + b.ph) * 0.18;
        let y = b.by + Math.cos(time * b.sp * 0.8 + b.ph * 1.3) * 0.16;

        if (ptr) {
          x += (ptr.x - x) * 0.22;
          y += (ptr.y - y) * 0.22;
        }

        if (i === 0) {
          x = follow.x;
          y = follow.y;
        }

        const c = COLORS_RGB[i];
        const rad = b.r * S_SIZE;
        const grad = ctx.createRadialGradient(
          x * S_SIZE,
          y * S_SIZE,
          0,
          x * S_SIZE,
          y * S_SIZE,
          rad,
        );
        grad.addColorStop(0, `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0.82)`);
        grad.addColorStop(0.5, `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0.35)`);
        grad.addColorStop(1, `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, S_SIZE, S_SIZE);
      });
    };

    if (reducedMotion) {
      draw(1.2);
      return;
    }

    let isVisible = true;
    let rafId = 0;
    let lastTime = performance.now();
    let simTime = 0;

    const frame = (now: number) => {
      rafId = 0;
      if (!isVisible) return;

      const dt = Math.min(0.05, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;
      simTime += dt;

      const target = ptr || {
        x: 0.5 + Math.sin(simTime * 0.25) * 0.18,
        y: 0.5 + Math.cos(simTime * 0.2) * 0.14,
      };

      follow.x += (target.x - follow.x) * (1 - Math.pow(0.08, dt));
      follow.y += (target.y - follow.y) * (1 - Math.pow(0.08, dt));

      draw(simTime);
      rafId = requestAnimationFrame(frame);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        ptr = {
          x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
          y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
        };
      }
    };

    const handlePointerLeave = () => {
      ptr = null;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible && !rafId) {
          lastTime = performance.now();
          rafId = requestAnimationFrame(frame);
        }
      });
      observer.observe(container);
    } else {
      rafId = requestAnimationFrame(frame);
    }

    lastTime = performance.now();
    rafId = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      if (observer) observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <S.AuroraContainer ref={containerRef} className={className} aria-hidden="true">
      <S.AuroraCanvas ref={canvasRef} width={96} height={96} />
      <S.FilmGrainOverlay ref={grainRef} />
      <S.VignetteOverlay />
    </S.AuroraContainer>
  );
};

export default CinemaAuroraBackground;
