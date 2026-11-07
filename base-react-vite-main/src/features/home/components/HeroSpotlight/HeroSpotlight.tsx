import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Ticket,
  MapPin,
  Calendar,
  Clock,
  Check,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as S from './HeroSpotlight.styles';
import {
  SPOTLIGHT_MOVIES,
  BOOKING_MOVIES,
  BOOKING_CINEMAS,
  BOOKING_DATES,
  BOOKING_SHOWTIMES,
} from './data/spotlight-data';
import { useSpotlightCarousel } from './hooks/useSpotlightCarousel';
import { SlideItem } from './components/SlideItem/SlideItem';
import { isFeatureEnabled } from '@/config/features.config';

export const HeroSpotlight: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ── Quick Booking Bar State ───────────────────────────────────────────────
  const [selectedMovie, setSelectedMovie] = useState('Dune: Part Two');
  const [selectedCinema, setSelectedCinema] = useState(
    'CGV Landmark 81 (IMAX Laser)',
  );
  const [selectedDateKey, setSelectedDateKey] = useState('today');
  const [selectedShowtimeKey, setSelectedShowtimeKey] = useState('time_4');
  const [activeDropdown, setActiveDropdown] = useState<
    'movie' | 'cinema' | 'date' | 'showtime' | null
  >(null);

  // ── Hover, Focus, Modal & Pause States ────────────────────────────────────
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const isPaused =
    isHovered || isFocused || activeDropdown !== null || isTrailerOpen;

  // ── Carousel ──────────────────────────────────────────────────────────────
  const { emblaRef, selectedIndex, handlePrev, handleNext, handleDotClick } =
    useSpotlightCarousel({ isExternalPaused: isPaused });

  const bookingBarRef = useRef<HTMLDivElement>(null);

  // Sync quick booking bar movie with active slide during render
  const [prevIndex, setPrevIndex] = useState(selectedIndex);
  if (selectedIndex !== prevIndex) {
    setPrevIndex(selectedIndex);
    if (SPOTLIGHT_MOVIES[selectedIndex]) {
      setSelectedMovie(SPOTLIGHT_MOVIES[selectedIndex].mainTitle);
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bookingBarRef.current &&
        !bookingBarRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleDropdown =
    (type: 'movie' | 'cinema' | 'date' | 'showtime') => () => {
      setActiveDropdown((prev) => (prev === type ? null : type));
    };

  const handleToggleDropdownKeyDown =
    (type: 'movie' | 'cinema' | 'date' | 'showtime') =>
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActiveDropdown((prev) => (prev === type ? null : type));
      }
    };

  const handleSelectMovie = (movie: string) => () => {
    setSelectedMovie(movie);
    const movieIdx = SPOTLIGHT_MOVIES.findIndex((m) => m.mainTitle === movie);
    if (movieIdx !== -1) handleDotClick(movieIdx);
    setActiveDropdown(null);
  };

  const handleSelectMovieKeyDown =
    (movie: string) => (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setSelectedMovie(movie);
        const movieIdx = SPOTLIGHT_MOVIES.findIndex(
          (m) => m.mainTitle === movie,
        );
        if (movieIdx !== -1) handleDotClick(movieIdx);
        setActiveDropdown(null);
      }
    };

  const handleSelectCinema = (cinema: string) => () => {
    setSelectedCinema(cinema);
    setActiveDropdown(null);
  };

  const handleSelectCinemaKeyDown =
    (cinema: string) => (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setSelectedCinema(cinema);
        setActiveDropdown(null);
      }
    };

  const handleSelectDate = (dateKey: string) => () => {
    setSelectedDateKey(dateKey);
    setActiveDropdown(null);
  };

  const handleSelectDateKeyDown =
    (dateKey: string) => (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setSelectedDateKey(dateKey);
        setActiveDropdown(null);
      }
    };

  const handleSelectShowtime = (timeKey: string) => () => {
    setSelectedShowtimeKey(timeKey);
    setActiveDropdown(null);
  };

  const handleSelectShowtimeKeyDown =
    (timeKey: string) => (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setSelectedShowtimeKey(timeKey);
        setActiveDropdown(null);
      }
    };

  const handleSectionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setIsFocused(false);
    }
  };

  const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleQuickBookSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const matchedMovie =
      SPOTLIGHT_MOVIES.find((m) => m.mainTitle === selectedMovie) ||
      SPOTLIGHT_MOVIES[0];
    const targetId = matchedMovie?.detailMovieId || 'nhim-sonic-3';
    navigate(`/phim/${targetId}`);
  };

  return (
    <S.SectionContainer
      tabIndex={0}
      onKeyDown={handleSectionKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {/* ── Background / Carousel ── */}
      <S.BackgroundWrapper>
        <S.ImageContainer>
          <S.SliderViewport ref={emblaRef}>
            <S.SliderTrack>
              {SPOTLIGHT_MOVIES.map((movie) => (
                <SlideItem
                  key={movie.id}
                  movie={movie}
                  selectedIndex={selectedIndex}
                  onDotClick={handleDotClick}
                  onTrailerStateChange={setIsTrailerOpen}
                />
              ))}
            </S.SliderTrack>
          </S.SliderViewport>

          {/* Navigation Arrows */}
          <S.SliderArrowButton
            type="button"
            $direction="prev"
            onClick={handlePrev}
            aria-label={t('home:hero.prev_movie', 'Phim trước')}
            className="no-drag"
          >
            <ChevronLeft size={24} />
          </S.SliderArrowButton>

          <S.SliderArrowButton
            type="button"
            $direction="next"
            onClick={handleNext}
            aria-label={t('home:hero.next_movie', 'Phim kế tiếp')}
            className="no-drag"
          >
            <ChevronRight size={24} />
          </S.SliderArrowButton>
        </S.ImageContainer>
      </S.BackgroundWrapper>

      {/* ── Quick Booking Bar ── */}
      {isFeatureEnabled('quickBooking') && (
        <S.QuickBookingBar ref={bookingBarRef} className="no-drag">
          {/* Step 1 – Movie */}
          <S.StepItem
            role="button"
            tabIndex={0}
            $isOpen={activeDropdown === 'movie'}
            onClick={handleToggleDropdown('movie')}
            onKeyDown={handleToggleDropdownKeyDown('movie')}
          >
            <S.StepIconBox $bg="rgba(255, 83, 90, 0.15)">
              <Ticket color="#FFB3B0" size={16} />
            </S.StepIconBox>
            <S.StepContent>
              <S.StepLabel>{t('home:hero.step_movie')}</S.StepLabel>
              <S.StepValueRow>
                <S.StepValue>{selectedMovie}</S.StepValue>
                <S.DropdownChevron $isOpen={activeDropdown === 'movie'}>
                  <ChevronDown color="#AE8786" size={14} />
                </S.DropdownChevron>
              </S.StepValueRow>
            </S.StepContent>

            {activeDropdown === 'movie' && (
              <S.BookingDropdown onClick={handleStopPropagation}>
                {BOOKING_MOVIES.map((movie) => (
                  <S.BookingDropdownItem
                    key={movie}
                    role="button"
                    tabIndex={0}
                    $isSelected={selectedMovie === movie}
                    onClick={handleSelectMovie(movie)}
                    onKeyDown={handleSelectMovieKeyDown(movie)}
                  >
                    <span>{movie}</span>
                    {selectedMovie === movie && (
                      <Check className="check-icon" size={14} />
                    )}
                  </S.BookingDropdownItem>
                ))}
              </S.BookingDropdown>
            )}
          </S.StepItem>

          {/* Step 2 – Cinema */}
          <S.StepItem
            role="button"
            tabIndex={0}
            $isOpen={activeDropdown === 'cinema'}
            onClick={handleToggleDropdown('cinema')}
            onKeyDown={handleToggleDropdownKeyDown('cinema')}
          >
            <S.StepIconBox $bg="rgba(255, 185, 85, 0.15)">
              <MapPin color="#FFB955" size={16} />
            </S.StepIconBox>
            <S.StepContent>
              <S.StepLabel>{t('home:hero.step_cinema')}</S.StepLabel>
              <S.StepValueRow>
                <S.StepValue>{selectedCinema}</S.StepValue>
                <S.DropdownChevron $isOpen={activeDropdown === 'cinema'}>
                  <ChevronDown color="#AE8786" size={14} />
                </S.DropdownChevron>
              </S.StepValueRow>
            </S.StepContent>

            {activeDropdown === 'cinema' && (
              <S.BookingDropdown $alignRight onClick={handleStopPropagation}>
                {BOOKING_CINEMAS.map((cinema) => (
                  <S.BookingDropdownItem
                    key={cinema}
                    role="button"
                    tabIndex={0}
                    $isSelected={selectedCinema === cinema}
                    onClick={handleSelectCinema(cinema)}
                    onKeyDown={handleSelectCinemaKeyDown(cinema)}
                  >
                    <span>{cinema}</span>
                    {selectedCinema === cinema && (
                      <Check className="check-icon" size={14} />
                    )}
                  </S.BookingDropdownItem>
                ))}
              </S.BookingDropdown>
            )}
          </S.StepItem>

          {/* Step 3 – Date */}
          <S.StepItem
            role="button"
            tabIndex={0}
            $isOpen={activeDropdown === 'date'}
            onClick={handleToggleDropdown('date')}
            onKeyDown={handleToggleDropdownKeyDown('date')}
          >
            <S.StepIconBox $bg="rgba(140, 144, 164, 0.2)">
              <Calendar color="#C2C5DB" size={16} />
            </S.StepIconBox>
            <S.StepContent>
              <S.StepLabel>{t('home:hero.step_date')}</S.StepLabel>
              <S.StepValueRow>
                <S.StepValue>
                  {t(
                    `home:hero.dates.${selectedDateKey}`,
                    BOOKING_DATES.find((d) => d.key === selectedDateKey)
                      ?.defaultLabel ||
                      BOOKING_DATES[0]?.defaultLabel ||
                      'Hôm nay',
                  )}
                </S.StepValue>
                <S.DropdownChevron $isOpen={activeDropdown === 'date'}>
                  <ChevronDown color="#AE8786" size={14} />
                </S.DropdownChevron>
              </S.StepValueRow>
            </S.StepContent>

            {activeDropdown === 'date' && (
              <S.BookingDropdown onClick={handleStopPropagation}>
                {BOOKING_DATES.map((date) => (
                  <S.BookingDropdownItem
                    key={date.key}
                    role="button"
                    tabIndex={0}
                    $isSelected={selectedDateKey === date.key}
                    onClick={handleSelectDate(date.key)}
                    onKeyDown={handleSelectDateKeyDown(date.key)}
                  >
                    <span>
                      {t(`home:hero.dates.${date.key}`, date.defaultLabel)}
                    </span>
                    {selectedDateKey === date.key && (
                      <Check className="check-icon" size={14} />
                    )}
                  </S.BookingDropdownItem>
                ))}
              </S.BookingDropdown>
            )}
          </S.StepItem>

          {/* Step 4 – Showtime */}
          <S.StepItem
            role="button"
            tabIndex={0}
            $isOpen={activeDropdown === 'showtime'}
            onClick={handleToggleDropdown('showtime')}
            onKeyDown={handleToggleDropdownKeyDown('showtime')}
          >
            <S.StepIconBox $bg="var(--bg-border-light)">
              <Clock color="#E7BCBA" size={16} />
            </S.StepIconBox>
            <S.StepContent>
              <S.StepLabel>{t('home:hero.step_showtime')}</S.StepLabel>
              <S.StepValueRow>
                <S.StepValue $color="var(--secondary)">
                  {t(
                    `home:hero.showtimes.${selectedShowtimeKey}`,
                    BOOKING_SHOWTIMES.find((s) => s.key === selectedShowtimeKey)
                      ?.defaultLabel || '19:45 • Phòng IMAX',
                  )}
                </S.StepValue>
                <S.DropdownChevron $isOpen={activeDropdown === 'showtime'}>
                  <ChevronDown color="#AE8786" size={14} />
                </S.DropdownChevron>
              </S.StepValueRow>
            </S.StepContent>

            {activeDropdown === 'showtime' && (
              <S.BookingDropdown $alignRight onClick={handleStopPropagation}>
                {BOOKING_SHOWTIMES.map((time) => (
                  <S.BookingDropdownItem
                    key={time.key}
                    role="button"
                    tabIndex={0}
                    $isSelected={selectedShowtimeKey === time.key}
                    onClick={handleSelectShowtime(time.key)}
                    onKeyDown={handleSelectShowtimeKeyDown(time.key)}
                  >
                    <span>
                      {t(`home:hero.showtimes.${time.key}`, time.defaultLabel)}
                    </span>
                    {selectedShowtimeKey === time.key && (
                      <Check className="check-icon" size={14} />
                    )}
                  </S.BookingDropdownItem>
                ))}
              </S.BookingDropdown>
            )}
          </S.StepItem>
          <S.QuickBookSubmitButton
            type="button"
            onClick={handleQuickBookSubmit}
            aria-label={t('home:hero.quick_book_btn', 'Đặt vé ngay')}
          >
            <Ticket size={16} />
            <span>{t('home:hero.quick_book_btn', 'ĐẶT VÉ NGAY')}</span>
          </S.QuickBookSubmitButton>
        </S.QuickBookingBar>
      )}
    </S.SectionContainer>
  );
};
