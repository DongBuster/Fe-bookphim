import { useState, useMemo, type FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Star, Ticket } from "lucide-react";
import { MovieGridSkeleton } from "@shared/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getMoviesApi } from "@features/movie-discovery/api/movie.api";
import type { MovieDto } from "@shared/types/api.types";
import * as S from "./NowShowing.styles";
import { useRef } from "react";
import { useGSAP, gsap } from "@/shared/animations";
import { CountUpScore } from "./components/CountUpScore/CountUpScore";

const getTabs = (t: (key: string) => string) => [
  t('home:now_showing.tab_all'),
  "IMAX / 3D",
  t('home:now_showing.tab_action'),
  t('home:now_showing.tab_horror'),
  t('home:now_showing.tab_animation'),
];

// Helper tính màu cho huy hiệu độ tuổi
const getAgeBadgeStyle = (ageRating: string) => {
  switch (ageRating) {
    case 'P':
      return { bg: '#252939', text: '#8C90A4' };
    case 'K':
      return { bg: '#1B4332', text: '#52B788' };
    case 'T13':
      return { bg: '#FF535A', text: '#5B000D' };
    case 'T16':
      return { bg: '#DC9100', text: '#4F3100' };
    case 'T18':
    case 'C':
      return { bg: '#93000A', text: '#FFDAD6' };
    default:
      return { bg: '#8C90A4', text: '#252939' };
  }
};

export const NowShowing: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const tabs = useMemo(() => getTabs(t), [t]);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // 3D Card Gyroscope Tilt with quickTo & cached dimensions (zero layout reflow)
  const cardTweens = useRef<
    WeakMap<
      HTMLElement,
      {
        rect: DOMRect;
        rotX: (v: number) => void;
        rotY: (v: number) => void;
        scale: (v: number) => void;
      }
    >
  >(new WeakMap());

  const handleCardPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const rotX = gsap.quickTo(card, 'rotateX', { duration: 0.22, ease: 'power2.out', overwrite: 'auto' });
    const rotY = gsap.quickTo(card, 'rotateY', { duration: 0.22, ease: 'power2.out', overwrite: 'auto' });
    const scale = gsap.quickTo(card, 'scale', { duration: 0.22, ease: 'power2.out', overwrite: 'auto' });

    gsap.set(card, { transformPerspective: 900 });
    scale(1.025);
    card.style.willChange = 'transform';
    cardTweens.current.set(card, { rect, rotX, rotY, scale });
  };

  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = e.currentTarget;
    const tracker = cardTweens.current.get(card);
    if (!tracker) return;

    const x = e.clientX - tracker.rect.left;
    const y = e.clientY - tracker.rect.top;
    const centerX = tracker.rect.width / 2;
    const centerY = tracker.rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6.5;
    const rotateY = ((x - centerX) / centerX) * 6.5;

    tracker.rotX(rotateX);
    tracker.rotY(rotateY);
  };

  const handleCardPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    cardTweens.current.delete(card);
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.65,
      ease: 'elastic.out(1.1, 0.4)',
      overwrite: 'auto',
      onComplete: () => {
        card.style.willChange = 'auto';
      },
    });
  };

  // Gọi API lấy danh sách phim đang chiếu thật bằng TanStack Query
  const { data: moviesResponse, isLoading } = useQuery({
    queryKey: ['movies', 'now-showing'],
    queryFn: () => getMoviesApi({ Status: 'NOW_SHOWING', PageSize: 10 }),
    staleTime: 5 * 60 * 1000, // Cache dữ liệu trong 5 phút
  });

  const movies: MovieDto[] = useMemo(() => {
    return moviesResponse?.data || [];
  }, [moviesResponse]);

  const handleSelectTab = (index: number) => () => {
    setActiveTab(index);
  };

  const handleMovieCardClick = (movie: MovieDto) => () => {
    navigate(`/phim/${movie.slug || movie.id}`);
  };

  const handleMovieDetailClick = (movie: MovieDto) => (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/phim/${movie.slug || movie.id}`);
  };

  const handleMovieBuyClick = (movie: MovieDto) => (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/phim/${movie.slug || movie.id}`);
  };

  // Lọc phim theo các danh mục tabs trên thanh điều hướng nhanh
  const filteredMovies = useMemo(() => {
    if (!movies.length) return [];
    if (activeTab === 0) return movies;
    if (activeTab === 1) {
      // IMAX / 3D
      return movies.filter((m) =>
        m.formats.some(
          (f) => f.includes('IMAX') || f.includes('3D') || f.includes('4DX'),
        ),
      );
    }
    if (activeTab === 2) {
      // Hành động • Bom tấn
      return movies.filter((m) =>
        m.genres.some(
          (g) =>
            g.toLowerCase().includes('hành động') ||
            g.toLowerCase().includes('phiêu lưu'),
        ),
      );
    }
    if (activeTab === 3) {
      // Kinh dị • Hồi hộp
      return movies.filter((m) =>
        m.genres.some(
          (g) =>
            g.toLowerCase().includes('kinh dị') ||
            g.toLowerCase().includes('tâm lý'),
        ),
      );
    }
    if (activeTab === 4) {
      // Hoạt hình • Gia đình
      return movies.filter((m) =>
        m.genres.some(
          (g) =>
            g.toLowerCase().includes('hoạt hình') ||
            g.toLowerCase().includes('gia đình'),
        ),
      );
    }
    return movies;
  }, [movies, activeTab]);

  // Section Header reveal: runs ONCE on mount, never flickers on category tab clicks
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (headerRef.current) {
          gsap.fromTo(
            headerRef.current,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 92%',
                once: true,
              },
            },
          );
        }
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  // Movie Cards Grid reveal: re-triggers stagger cleanly when tab changes or API data arrives
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (gridRef.current && gridRef.current.children.length > 0) {
          gsap.fromTo(
            gridRef.current.children,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.06,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: gridRef.current,
                start: 'top 88%',
                once: true,
              },
            },
          );
        }
      });
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [filteredMovies] },
  );

  return (
    <S.Section ref={sectionRef}>
      <S.InnerContainer>
        {/* Header with tabs */}
        <S.Header ref={headerRef}>
          {/* Title Area */}
          <S.TitleArea>
            <S.SubtitleContainer>
              <S.RedDot />
              <S.SubtitleText>
                {t('home:now_showing.subtitle', 'ĐANG PHỔ BIẾN RỘNG RÃI')}
              </S.SubtitleText>
            </S.SubtitleContainer>
            <S.MainTitle>
              {t('home:now_showing.heading_main', 'PHIM ĐANG CHIẾU')}{' '}
              <S.MainTitleHighlight>
                {t('home:now_showing.heading_highlight', 'TẠI RẠP')}
              </S.MainTitleHighlight>
            </S.MainTitle>
          </S.TitleArea>

          {/* Quick Category Pills */}
          <S.CategoryPillsContainer>
            {tabs.map((tab, index) => (
              <S.TabButton
                key={index}
                type="button"
                $active={activeTab === index}
                onClick={handleSelectTab(index)}
              >
                <S.TabText $active={activeTab === index}>{tab}</S.TabText>
              </S.TabButton>
            ))}
          </S.CategoryPillsContainer>
        </S.Header>

        {/* Loading State */}
        {isLoading && <MovieGridSkeleton count={8} />}

        {/* Empty State */}
        {!isLoading && filteredMovies.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 0',
              color: '#ae8786',
              fontSize: '14px',
            }}
          >
            <span>{t('home:now_showing.empty_movies')}</span>
          </div>
        )}

        {/* Movies Grid */}
        {!isLoading && (
          <S.MoviesGrid ref={gridRef}>
            {filteredMovies.map((movie) => {
              const ageStyle = getAgeBadgeStyle(movie.ageRating as string);
              const formatText = movie.formats?.slice(0, 2).join(' • ') || '2D';
              const metaText = `${movie.durationMinutes} ${t('home:now_showing.duration_mins', 'phút')} • ${movie.genres?.slice(0, 2).join(', ')}`;
              
              return (
                <S.MovieCard
                  key={movie.id}
                  onClick={handleMovieCardClick(movie)}
                  onPointerEnter={handleCardPointerEnter}
                  onPointerMove={handleCardPointerMove}
                  onPointerLeave={handleCardPointerLeave}
                >
                  {/* Poster Container */}
                  <S.PosterContainer>
                    {/* Image */}
                    <S.PosterImage
                      src={movie.posterUrl}
                      alt={movie.title}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop';
                      }}
                    />
                    {/* Gradient */}
                    <S.PosterGradient />

                    {/* Top Left Badges */}
                    <S.TopLeftBadges>
                      <S.RatingBadge>
                        <Star color="#FFB955" fill="#FFB955" size={10} />
                        <S.RatingText><CountUpScore score={movie.imdbRating ?? 8.5} /></S.RatingText>
                      </S.RatingBadge>
                      <S.AgeBadge $bgColor={ageStyle.bg}>
                        <S.AgeText $color={ageStyle.text}>{movie.ageRating}</S.AgeText>
                      </S.AgeBadge>
                    </S.TopLeftBadges>

                    {/* Top Right Format Badge */}
                    <S.FormatBadge>
                      <S.FormatText>{formatText}</S.FormatText>
                    </S.FormatBadge>

                    {/* Bottom Meta Inside Poster */}
                    <S.BottomMetaContainer>
                      <S.MetaText>{metaText}</S.MetaText>
                      <S.MovieTitle>{movie.title}</S.MovieTitle>
                    </S.BottomMetaContainer>
                  </S.PosterContainer>

                  {/* Bottom Info & Button */}
                  <S.BottomInfoArea>
                    {/* Nút Chi Tiết */}
                    <S.DetailButton
                      type="button"
                      onClick={handleMovieDetailClick(movie)}
                    >
                      <S.DetailButtonText>{t('home:now_showing.details')}</S.DetailButtonText>
                    </S.DetailButton>

                    {/* Nút Mua Vé */}
                    <S.BuyButton
                      type="button"
                      onClick={handleMovieBuyClick(movie)}
                    >
                      <S.TicketIconContainer>
                        <Ticket color="#5B000D" size={14} />
                      </S.TicketIconContainer>
                      <S.BuyButtonText>{t('home:now_showing.buy_ticket')}</S.BuyButtonText>
                    </S.BuyButton>
                  </S.BottomInfoArea>
                </S.MovieCard>
              );
            })}
          </S.MoviesGrid>
        )}
      </S.InnerContainer>
    </S.Section>
  );
};
