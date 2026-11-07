import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

export interface UseSpotlightCarouselOptions {
  autoPlay?: boolean;
  interval?: number;
  isExternalPaused?: boolean;
}

export interface UseSpotlightCarouselReturn {
  emblaRef: ReturnType<typeof useEmblaCarousel>[0];
  selectedIndex: number;
  handlePrev: (e?: React.MouseEvent) => void;
  handleNext: (e?: React.MouseEvent) => void;
  handleDotClick: (targetIndex: number) => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
}

export function useSpotlightCarousel(
  options: UseSpotlightCarouselOptions = {},
): UseSpotlightCarouselReturn {
  const {
    autoPlay = true,
    interval = 5000,
    isExternalPaused = false,
  } = options;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 25,
    watchDrag: (_emblaApi, event) => {
      // Allow touch events on mobile/tablet
      if (
        'touches' in event ||
        ('pointerType' in event && event.pointerType === 'touch')
      ) {
        return true;
      }
      // On desktop, don't drag if clicking text or interactive elements
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          "h1, h2, h3, p, span, button, a, input, [role='button'], .no-drag",
        )
      ) {
        return false;
      }
      return true;
    },
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isInternalPaused, setIsInternalPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isPaused = !autoPlay || isExternalPaused || isInternalPaused;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (!autoPlay || !emblaApi || isPaused) return;
    if (
      typeof document !== 'undefined' &&
      document.visibilityState === 'hidden'
    ) {
      return;
    }

    timerRef.current = setInterval(() => {
      if (
        typeof document !== 'undefined' &&
        document.visibilityState === 'visible' &&
        emblaApi
      ) {
        emblaApi.scrollNext();
      }
    }, interval);
  }, [autoPlay, emblaApi, isPaused, interval, clearTimer]);

  // Restart timer whenever pause state or interval changes
  useEffect(() => {
    if (isPaused) {
      clearTimer();
    } else {
      startTimer();
    }
    return () => clearTimer();
  }, [isPaused, startTimer, clearTimer]);

  // Listen to tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startTimer();
      } else {
        clearTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startTimer, clearTimer]);

  // Pause on pointer down / drag, resume on pointer up
  useEffect(() => {
    if (!emblaApi) return;

    const onPointerDown = () => {
      setIsInternalPaused(true);
    };

    const onPointerUp = () => {
      setIsInternalPaused(false);
    };

    emblaApi.on('pointerDown', onPointerDown);
    emblaApi.on('pointerUp', onPointerUp);

    return () => {
      emblaApi.off('pointerDown', onPointerDown);
      emblaApi.off('pointerUp', onPointerUp);
    };
  }, [emblaApi]);

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (emblaApi) {
        emblaApi.scrollPrev();
        startTimer();
      }
    },
    [emblaApi, startTimer],
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (emblaApi) {
        emblaApi.scrollNext();
        startTimer();
      }
    },
    [emblaApi, startTimer],
  );

  const handleDotClick = useCallback(
    (targetIndex: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(targetIndex);
        startTimer();
      }
    },
    [emblaApi, startTimer],
  );

  return {
    emblaRef,
    selectedIndex,
    handlePrev,
    handleNext,
    handleDotClick,
    isPaused,
    setIsPaused: setIsInternalPaused,
  };
}
