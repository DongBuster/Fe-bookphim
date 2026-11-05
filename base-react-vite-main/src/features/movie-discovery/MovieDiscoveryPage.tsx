import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MovieGridSkeleton } from '@shared/components/skeleton';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getMoviesApi } from './api/movie.api';
import { DiscoveryHero } from './components/DiscoveryHero/DiscoveryHero';
import { MoviesFilter } from './components/MovieFilter/MovieFilter';
import type { FilterState } from './components/MovieFilter/MovieFilter';
import { MovieShowcaseGrid } from './components/MovieShowcaseGrid/MovieShowcaseGrid';
import { PaginationAndVipTeaser } from './components/PaginationAndVipTeaser/PaginationAndVipTeaser';
import type { DiscoveryMovie } from './data/mock-movies';
import { getAgeBadgeStyle, getFormatBadgeStyle } from './data/mock-movies';
import * as S from './MovieDiscoveryPage.styles';

const ITEMS_PER_PAGE = 8;

export const MovieDiscoveryPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State tìm kiếm và lọc
  const urlQuery = searchParams.get('search') || searchParams.get('q') || '';
  const [userQuery, setUserQuery] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<FilterState | null>(null);

  const searchQuery = userQuery !== null ? userQuery : urlQuery;

  // State phân trang thực tế
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayedLimit, setDisplayedLimit] = useState<number>(ITEMS_PER_PAGE);

  const statusParam =
    filterState?.statusTab === 'coming-soon'
      ? 'COMING_SOON'
      : filterState?.statusTab === 'now-showing'
        ? 'NOW_SHOWING'
        : undefined;

  const genreParam =
    filterState?.genre && filterState.genre !== 'Tất cả thể loại'
      ? filterState.genre
      : undefined;

  const formatParam =
    filterState?.format && filterState.format !== 'Tất cả định dạng'
      ? filterState.format.split(' ')[0]
      : undefined;

  const sortByParam =
    filterState?.sortBy === 'Được đánh giá cao nhất'
      ? 'RATING_DESC'
      : filterState?.sortBy === 'Mới nhất'
        ? 'RELEASE_DATE_DESC'
        : filterState?.sortBy === 'Tên phim A-Z'
          ? 'TITLE_ASC'
          : 'RATING_DESC';

  const { data: moviesResponse, isLoading } = useQuery({
    queryKey: [
      'movies-discovery',
      statusParam,
      genreParam,
      formatParam,
      sortByParam,
      searchQuery,
      currentPage,
      displayedLimit,
    ],
    queryFn: () =>
      getMoviesApi({
        Status: statusParam,
        Genre: genreParam,
        Format: formatParam,
        SortBy: sortByParam,
        Search: searchQuery.trim() || undefined,
        Page: currentPage,
        PageSize: displayedLimit,
      }),
    staleTime: 3 * 60 * 1000,
  });

  const moviesData = moviesResponse?.data;
  const movies: DiscoveryMovie[] = useMemo(() => {
    if (!moviesData) return [];
    return moviesData.map((m) => {
      const genresStr =
        m.genres && m.genres.length > 0 ? m.genres.join(', ') : 'Điện ảnh';
      const formatTag =
        m.formats && m.formats.length > 0 ? m.formats[0] : '2D KỸ THUẬT SỐ';
      const ageBadge = getAgeBadgeStyle(m.ageRating || 'P');
      const formatBadge = getFormatBadgeStyle(formatTag);

      return {
        id: m.id,
        slug: m.slug,
        title: m.title,
        poster: m.posterUrl || m.bannerUrl,
        duration: `${m.durationMinutes} ${t('common:minutes', 'phút')}`,
        genre: genresStr,
        description: m.isNowShowing
          ? t('discovery:now_showing_desc')
          : t('discovery:coming_soon_desc'),
        rating: m.imdbRating ? m.imdbRating.toFixed(1) : '8.8',
        age: m.ageRating || 'P',
        ageBg: ageBadge.bg,
        ageColor: ageBadge.color,
        formatTag: formatTag,
        formatBg: formatBadge.bg,
        formatColor: formatBadge.color,
      };
    });
  }, [moviesData, t]);

  // Tổng số phim & tính toán số trang
  const totalMovies = moviesResponse?.metaData?.total ?? movies.length;
  const totalPages = Math.max(1, Math.ceil(totalMovies / ITEMS_PER_PAGE));

  // Xử lý tìm kiếm và tag nhanh
  const handleSearch = (query: string) => {
    setUserQuery(query);
    setCurrentPage(1);
    setDisplayedLimit(ITEMS_PER_PAGE);
  };

  const handleTagClick = (tag: string) => {
    setUserQuery(tag);
    setCurrentPage(1);
    setDisplayedLimit(ITEMS_PER_PAGE);
  };

  const handleFilterChange = (filters: FilterState) => {
    setFilterState(filters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setDisplayedLimit(ITEMS_PER_PAGE);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    setDisplayedLimit((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleMovieDetail = (movie: DiscoveryMovie) => {
    navigate(`/phim/${movie.slug || movie.id}`);
  };

  const handleBookMovie = (movie: DiscoveryMovie) => {
    navigate(`/phim/${movie.slug || movie.id}`);
  };

  const handleVipBooking = () => {
    navigate('/profile/vip-elite');
  };

  const handleResetFilters = () => {
    setUserQuery('');
    setFilterState(null);
    setCurrentPage(1);
    setDisplayedLimit(ITEMS_PER_PAGE);
    navigate('/kham-pha');
  };

  return (
    <S.PageWrapper>
      {/* Ambient Atmospheric Backdrop */}
      <S.AmbientBackdrop />

      <S.MainContainer>
        {/* SECTION 1: Dynamic Discovery Banner & Quick Query Filter */}
        <DiscoveryHero onSearch={handleSearch} onTagClick={handleTagClick} />

        {/* SECTION 2: Master Filter Console & Release Status Tabs */}
        <MoviesFilter
          displayingCount={movies.length}
          totalCount={totalMovies}
          onFilterChange={handleFilterChange}
        />

        {/* SECTION 3: Movie Showcase Grid (Cinematic Cards) */}
        {isLoading ? (
          <MovieGridSkeleton count={8} />
        ) : (
          <MovieShowcaseGrid
            movies={movies}
            viewMode={filterState?.viewMode || 'grid'}
            onResetFilters={handleResetFilters}
            onMovieClick={handleMovieDetail}
            onBookClick={handleBookMovie}
          />
        )}

        {/* SECTION 4: Pagination & VIP Concierge Teaser */}
        {totalMovies > 0 && !isLoading && (
          <PaginationAndVipTeaser
            currentPage={currentPage}
            totalPages={totalPages}
            totalMovies={totalMovies}
            currentShowingCount={movies.length}
            onLoadMore={handleLoadMore}
            onPageChange={handlePageChange}
            onVipBookingClick={handleVipBooking}
          />
        )}
      </S.MainContainer>
    </S.PageWrapper>
  );
};

export default MovieDiscoveryPage;
