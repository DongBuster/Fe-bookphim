import type { FC } from 'react';
import { useState, useRef, useEffect, useMemo } from 'react';
import {
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useBooking } from '@features/booking/context/useBooking';
import {
  getMovieDetailBySlugApi,
  getShowtimesApi,
} from '@features/movie-discovery/api/movie.api';
import type { MovieDetailDto, TheaterShowtimesGroupDto } from '@shared/types/api.types';
import {
  getMovieDetails,
  DAY_OPTIONS,
  CINEMAS_DATA,
  type ShowtimeSlot,
  type CinemaSchedule,
  type ScreenFormatGroup,
  type MovieDetails,
} from './data/mock-movie-details';
import { MovieHero } from './components/MovieHero/MovieHero';
import { MovieSynopsis } from './components/MovieSynopsis/MovieSynopsis';
import { ShowtimePicker } from './components/ShowtimePicker/ShowtimePicker';
import { StickyBookingBar } from './components/StickyBookingBar/StickyBookingBar';
import { TrailerModal } from './components/TrailerModal/TrailerModal';
import * as S from './MovieDetailsPage.styles';

export const MovieDetailsPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: paramId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { setMovieAndSession } = useBooking();

  // Xác định slug phim từ URL param (/phim/:id) hoặc query param
  const effectiveSlug =
    paramId || searchParams.get('movieId') || searchParams.get('id') || 'nhim-sonic-3';

  // 1. Gọi API lấy thông tin chi tiết phim thật theo slug
  const { data: apiMovie } = useQuery<MovieDetailDto>({
    queryKey: ['movie-detail', effectiveSlug],
    queryFn: () => getMovieDetailBySlugApi(effectiveSlug),
    staleTime: 5 * 60 * 1000,
  });

  // 2. Dùng ID của phim để gọi tiếp API Lịch Chiếu (Dependent Query)
  const { data: apiShowtimes } = useQuery<TheaterShowtimesGroupDto[]>({
    queryKey: ['showtimes', apiMovie?.id],
    queryFn: () => getShowtimesApi({ MovieId: apiMovie?.id }),
    enabled: Boolean(apiMovie?.id),
    staleTime: 2 * 60 * 1000,
  });

  // Khung dữ liệu hiển thị (kết hợp dữ liệu API thật với fallback mẫu)
  const fallbackMovie = useMemo(
    () => getMovieDetails(effectiveSlug),
    [effectiveSlug],
  );

  const movie: MovieDetails = useMemo(() => {
    if (!apiMovie) return fallbackMovie;
    return {
      ...fallbackMovie,
      id: apiMovie.id || fallbackMovie.id,
      title: apiMovie.title || fallbackMovie.title,
      originalTitle:
        apiMovie.originalTitle || apiMovie.title || fallbackMovie.originalTitle,
      posterUrl: apiMovie.posterUrl || fallbackMovie.posterUrl,
      backdropUrl:
        apiMovie.bannerUrl || apiMovie.posterUrl || fallbackMovie.backdropUrl,
      trailerUrl: apiMovie.trailerUrl || fallbackMovie.trailerUrl,
      rating: apiMovie.imdbRating || fallbackMovie.rating,
      rottenTomatoes: apiMovie.rottenTomatoesRating
        ? `${apiMovie.rottenTomatoesRating}%`
        : fallbackMovie.rottenTomatoes,
      ageRating: (apiMovie.ageRating as string) || fallbackMovie.ageRating,
      runtime: `${apiMovie.durationMinutes}'`,
      releaseDate: apiMovie.releaseDate || fallbackMovie.releaseDate,
      formatBadge: apiMovie.formats?.join(' • ') || fallbackMovie.formatBadge,
      genres: apiMovie.genres?.length ? apiMovie.genres : fallbackMovie.genres,
      director: {
        ...fallbackMovie.director,
        name: apiMovie.director || fallbackMovie.director.name,
      },
      synopsisP1: apiMovie.synopsis || fallbackMovie.synopsisP1,
    };
  }, [apiMovie, fallbackMovie]);

  // Chuyển đổi danh sách rạp và suất chiếu thật từ API sang định dạng UI
  const realCinemas: CinemaSchedule[] = useMemo(() => {
    if (!apiShowtimes || apiShowtimes.length === 0) return CINEMAS_DATA;

    return apiShowtimes.map((theater) => ({
      id: theater.theaterId,
      name: theater.theaterName,
      badge: theater.chainName || 'VIP Lounge',
      address: theater.address,
      distance: theater.distanceKm
        ? t('movie:distance_km', { distance: theater.distanceKm })
        : t('movie:nearby'),
      formats: [
        {
          formatName: theater.showtimes[0]?.format || '2D KỸ THUẬT SỐ',
          roomDetails: theater.showtimes[0]?.auditoriumName || 'Phòng chiếu #01',
          slots: theater.showtimes.map((s) => ({
            id: s.showtimeId,
            time: new Date(s.startTime).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
            statusText: t('movie:on_sale'),
            priceText: `${Math.round(s.basePrice / 1000)}k`,
            price: s.basePrice,
            isMystery: s.isMysteryShowtime,
            mysteryDiscount: s.mysteryDiscountRate,
          })),
        },
      ],
    }));
  }, [apiShowtimes, t]);

  const [selectedCity, setSelectedCity] = useState('TP. Hồ Chí Minh');
  const [searchCinema, setSearchCinema] = useState('');
  const [selectedDate, setSelectedDate] = useState(DAY_OPTIONS[0]);
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Selected session state for booking (with automatic fallback to first available slot)
  const [userSelectedSlot, setUserSelectedSlot] = useState<{
    cinema: CinemaSchedule;
    format: ScreenFormatGroup;
    slot: ShowtimeSlot;
  } | null>(null);

  const selectedSlot = useMemo(() => {
    if (userSelectedSlot) return userSelectedSlot;
    if (realCinemas.length > 0 && realCinemas[0].formats.length > 0) {
      const firstFormat = realCinemas[0].formats[0];
      if (firstFormat.slots.length > 0) {
        return {
          cinema: realCinemas[0],
          format: firstFormat,
          slot: firstFormat.slots[0],
        };
      }
    }
    return null;
  }, [userSelectedSlot, realCinemas]);

  const showtimesRef = useRef<HTMLDivElement>(null);

  // Luôn nhảy lên đầu trang phim khi mở hoặc chuyển sang trang chi tiết phim
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [effectiveSlug]);

  const handleScrollToBooking = () => {
    showtimesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigateBack = () => {
    navigate('/kham-pha');
  };

  const handleOpenTrailer = () => {
    setIsTrailerOpen(true);
  };

  const handleCloseTrailer = () => {
    setIsTrailerOpen(false);
  };

  const handleToggleBookmark = () => {
    setIsBookmarked((prev) => !prev);
  };

  const handleSelectSlot = (
    cinema: CinemaSchedule,
    format: ScreenFormatGroup,
    slot: ShowtimeSlot,
  ) => {
    setUserSelectedSlot({ cinema, format, slot });
  };

  const handleProceedToSeatSelection = () => {
    if (!selectedSlot) return;

    setMovieAndSession(
      {
        id: movie.id.toString(),
        title: movie.title,
        originalTitle: movie.originalTitle,
        posterUrl: movie.posterUrl,
        backdropUrl: movie.backdropUrl,
        rating:
          typeof movie.rating === 'number'
            ? movie.rating
            : parseFloat(movie.rating) || 8.8,
        ageRating: movie.ageRating,
        duration: movie.runtime,
        format: selectedSlot.format.formatName,
      },
      {
        showtimeId: selectedSlot.slot.id,
        cinemaId: selectedSlot.cinema.id,
        cinemaName: selectedSlot.cinema.name,
        cinemaAddress: selectedSlot.cinema.address,
        room: selectedSlot.format.roomDetails,
        date: selectedDate.fullDate,
        time: selectedSlot.slot.time,
        format: selectedSlot.format.formatName,
        soundSystem: 'DOLBY ATMOS • 64 LOA',
      },
    );

    navigate('/booking/seat-selection');
  };

  // Filter cinemas
  const filteredCinemas = realCinemas.filter((cinema: CinemaSchedule) => {
    const matchesSearch =
      cinema.name.toLowerCase().includes(searchCinema.toLowerCase()) ||
      cinema.address.toLowerCase().includes(searchCinema.toLowerCase());
    return matchesSearch;
  });

  return (
    <S.PageContainer>
      <S.InnerWrapper>
        {/* 1. Breadcrumbs */}
        <S.BreadcrumbNav>
          <div className="back-btn" onClick={handleNavigateBack}>
            <ChevronLeft size={16} />
            <span>{t('movie:movie_breadcrumb')}</span>
          </div>
          <span className="separator">/</span>
          <span>{t('movie:details_breadcrumb')}</span>
          <span className="separator">/</span>
          <span className="current">{movie.title}</span>
        </S.BreadcrumbNav>

        {/* 2. Hero Section */}
        <MovieHero
          movie={movie}
          onOpenTrailer={handleOpenTrailer}
          onBookNow={handleScrollToBooking}
          isBookmarked={isBookmarked}
          onToggleBookmark={handleToggleBookmark}
        />

        {/* 3. Details Block (Synopsis + Critical Acclaim) */}
        <MovieSynopsis movie={movie} />

        {/* 4. Showtimes Section */}
        <ShowtimePicker
          ref={showtimesRef}
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          searchCinema={searchCinema}
          onSearchCinema={setSearchCinema}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          selectedFormat={selectedFormat}
          onSelectFormat={setSelectedFormat}
          cinemas={filteredCinemas}
          selectedSlot={selectedSlot}
          onSelectSlot={handleSelectSlot}
        />
      </S.InnerWrapper>

      {/* 5. Sticky Bottom Bar */}
      <StickyBookingBar
        selectedSlot={selectedSlot}
        selectedDate={selectedDate}
        onProceed={handleProceedToSeatSelection}
      />

      {/* 6. Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={handleCloseTrailer}
        trailerUrl={movie.trailerUrl}
        title={movie.title}
      />
    </S.PageContainer>
  );
};

export default MovieDetailsPage;
