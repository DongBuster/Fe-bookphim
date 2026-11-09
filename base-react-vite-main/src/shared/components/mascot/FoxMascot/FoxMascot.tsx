/**
 * FoxMascot Component
 * Adapted from Page Mascot (Kamran Ahmed / nilbuild/page-mascot) · MIT License · https://koboyo.com/page-mascot
 *
 * Interactive cursor-tracking Fox Mascot for PHIMBOOK Auth (Login & Register).
 * Supports cursor orientation tracking, interactive boop reactions, and smart password-field detection (covering eyes/looking away).
 */
import { useEffect, useRef, useState, type FC } from 'react';
import * as S from './FoxMascot.styles';

const DIRECTIONS = [
  'up-left',
  'up',
  'up-right',
  'left',
  'center',
  'right',
  'down-left',
  'down',
  'down-right',
] as const;

const REACTIONS = [
  'blink',
  'heart',
  'sparkle',
  'surprised',
  'wink',
  'bashful',
  'sleepy',
  'dizzy',
  'delighted',
] as const;

type DirectionType = (typeof DIRECTIONS)[number];
type ReactionType = (typeof REACTIONS)[number];

const CLOCKWISE: DirectionType[] = [
  'right',
  'down-right',
  'down',
  'down-left',
  'left',
  'up-left',
  'up',
  'up-right',
];

const SECTOR = (Math.PI * 2) / CLOCKWISE.length;
const HYSTERESIS = 0.12;
const DEAD_ZONE = 65;
const PAYOFFS: ReactionType[] = ['heart', 'sparkle', 'delighted'];
const BOOP_PAYOFF = 130;
const BOOP_END = 600;
const SQUASH_MS = 420;
const DIZZY_AFTER = 4;
const DIZZY_WINDOW = 1600;
const DIZZY_END = 1200;

const SQUASH_KEYFRAMES: Keyframe[] = [
  { transform: 'scale(1, 1)', easing: 'ease-in' },
  { transform: 'scale(1.10, 0.86)', offset: 0.18, easing: 'ease-out' },
  { transform: 'scale(0.95, 1.08)', offset: 0.45, easing: 'ease-in-out' },
  { transform: 'scale(1.03, 0.97)', offset: 0.72, easing: 'ease-in-out' },
  { transform: 'scale(1, 1)' },
];

function getCellPosition(index: number) {
  return {
    x: (index % 3) * 50,
    y: Math.floor(index / 3) * 50,
  };
}

function wrapAngle(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

export interface FoxMascotProps {
  /** Triggered when the user focuses into the password input */
  isPasswordFocused?: boolean;
  /** Whether the user has toggled password visibility to plain text */
  isPasswordVisible?: boolean;
  /** Whether the form is currently in register mode */
  isRegisterMode?: boolean;
  /** Size in pixels (default: 110) */
  size?: number;
}

export const FoxMascot: FC<FoxMascotProps> = ({
  isPasswordFocused = false,
  isPasswordVisible = false,
  isRegisterMode = false,
  size = 110,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const squashRef = useRef<HTMLSpanElement>(null);
  const timersRef = useRef<number[]>([]);
  const boopsRef = useRef({ count: 0, at: 0 });

  const [direction, setDirection] = useState<DirectionType>('center');
  const [reaction, setReaction] = useState<ReactionType | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const directionsUrl = '/mascots/fox-directions.webp';
  const reactionsUrl = '/mascots/fox-reactions.webp';

  // React to mode switch (Register vs Login) with a cute hop
  const prevModeRef = useRef(isRegisterMode);
  useEffect(() => {
    if (prevModeRef.current !== isRegisterMode) {
      prevModeRef.current = isRegisterMode;
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        squashRef.current?.animate(
          [
            { transform: 'translateY(0) scale(1, 1)' },
            { transform: 'translateY(-14px) scale(0.96, 1.08)', offset: 0.4 },
            { transform: 'translateY(0) scale(1.06, 0.94)', offset: 0.75 },
            { transform: 'translateY(0) scale(1, 1)' },
          ],
          { duration: 460, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        );
      }
      const tStart = window.setTimeout(() => setReaction('sparkle'), 0);
      const tEnd = window.setTimeout(() => setReaction(null), 800);
      return () => {
        window.clearTimeout(tStart);
        window.clearTimeout(tEnd);
      };
    }
  }, [isRegisterMode]);

  // Cursor tracking loop
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    let sector = -1;
    let pointer: { x: number; y: number } | null = null;

    const aim = () => {
      // Don't override direction if password input is focused
      if (isPasswordFocused) {
        setDirection('down');
        return;
      }

      const button = buttonRef.current;
      if (!button || !pointer) return;

      const box = button.getBoundingClientRect();
      const dx = pointer.x - (box.left + box.width / 2);
      const dy = pointer.y - (box.top + box.height / 2);

      if (Math.hypot(dx, dy) < DEAD_ZONE) {
        sector = -1;
        setDirection('center');
        return;
      }

      const angle = Math.atan2(dy, dx);
      if (
        sector !== -1 &&
        Math.abs(wrapAngle(angle - sector * SECTOR)) < SECTOR / 2 + HYSTERESIS
      ) {
        return;
      }

      sector = (Math.round(angle / SECTOR) + CLOCKWISE.length) % CLOCKWISE.length;
      setDirection(CLOCKWISE[sector]);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      aim();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', aim, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', aim);
    };
  }, [isPasswordFocused]);

  // Clean up all pending timeout timers
  useEffect(() => {
    return () => {
      timersRef.current.forEach(window.clearTimeout);
    };
  }, []);

  // Poke / Boop click interaction
  const handleBoop = () => {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];

    const later = (ms: number, next: ReactionType | null) => {
      timersRef.current.push(window.setTimeout(() => setReaction(next), ms));
    };

    const now = Date.now();
    const boops = boopsRef.current;
    boops.count = now - boops.at < DIZZY_WINDOW ? boops.count + 1 : 1;
    boops.at = now;

    if (boops.count >= DIZZY_AFTER) {
      boops.count = 0;
      setReaction('dizzy');
      later(DIZZY_END, null);
    } else {
      setReaction('blink');
      later(BOOP_PAYOFF, PAYOFFS[(boops.count - 1) % PAYOFFS.length]);
      later(BOOP_END, null);
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      squashRef.current?.animate(SQUASH_KEYFRAMES, {
        duration: SQUASH_MS,
        easing: 'linear',
      });
    }
  };

  const dirIndex = Math.max(0, DIRECTIONS.indexOf(direction));
  const dirCell = getCellPosition(dirIndex);

  const activeReaction: ReactionType | null = isPasswordFocused
    ? isPasswordVisible
      ? 'surprised'
      : 'sleepy'
    : reaction;
  const reactIndex = Math.max(
    0,
    REACTIONS.indexOf(activeReaction ?? 'blink'),
  );
  const reactCell = getCellPosition(reactIndex);

  // Dynamic speech bubble text
  const getSpeechContent = () => {
    if (activeReaction === 'dizzy') {
      return { text: 'Chóng mặt quá đi! 💫', variant: 'dizzy' as const };
    }
    if (isPasswordFocused) {
      if (isPasswordVisible) {
        return { text: 'Ối, xem mật khẩu kìa! 😲', variant: 'secret' as const };
      }
      return { text: 'Tớ nhắm mắt rồi nha! 🙈', variant: 'secret' as const };
    }
    if (isHovered) {
      return { text: 'Chạm vào tớ nè! 🦊', variant: 'normal' as const };
    }
    return null;
  };

  const speech = getSpeechContent();

  return (
    <S.MascotOuter>
      <S.FoxStage>
        {speech && (
          <S.SpeechBubble $variant={speech.variant} aria-live="polite">
            <span>{speech.text}</span>
          </S.SpeechBubble>
        )}

        <S.FoxButton
          ref={buttonRef}
          type="button"
          onClick={handleBoop}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          aria-label="Chú cáo linh vật PhimBook, nhấn để tương tác"
          style={{ width: size, height: size }}
        >
          <S.SquashSpan ref={squashRef}>
            {/* Layer 1: Head directions */}
            <S.SpriteLayer
              $bg={directionsUrl}
              $posX={dirCell.x}
              $posY={dirCell.y}
              $opacity={activeReaction ? 0 : 1}
            />

            {/* Layer 2: Reactions & Blinks */}
            <S.SpriteLayer
              $bg={reactionsUrl}
              $posX={reactCell.x}
              $posY={reactCell.y}
              $opacity={activeReaction ? 1 : 0}
            />
          </S.SquashSpan>
        </S.FoxButton>
      </S.FoxStage>

      <S.MascotPedestal />
    </S.MascotOuter>
  );
};
