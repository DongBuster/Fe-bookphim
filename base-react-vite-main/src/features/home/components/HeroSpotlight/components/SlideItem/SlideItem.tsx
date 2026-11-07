import { type FC, useRef } from 'react';
import { Clock, Globe, Clapperboard, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { SpotlightMovie } from '../../data/spotlight-data';
import { SlideCTA } from '../SlideCta/SlideCta';
import { SlidePagination } from '../SlidePagination/SlidePagination';
import * as S from './SlideItem.styles';
import { gsap, useGSAP, splitTextToWordElements, animateWordReveal } from '@/shared/animations';

interface SlideItemProps {
  movie: SpotlightMovie;
  selectedIndex: number;
  onDotClick: (index: number) => void;
  onWatchTrailer?: () => void;
  /** True when this slide is the currently visible one */
  isActive?: boolean;
}

/**
 * A single carousel slide: backdrop image, gradient overlays, movie details,
 * CTA buttons, and the shared pagination dots.
 *
 * WOW #2: Word-by-word masked reveal for the main movie title.
 * Orchestrated with useGSAP and revertOnUpdate for zero animation collisions.
 */
export const SlideItem: FC<SlideItemProps> = ({
  movie,
  selectedIndex,
  onDotClick,
  onWatchTrailer,
  isActive = false,
}) => {
  const { t } = useTranslation();

  const exclusiveTitle = t(`home:hero.movies.${movie.id}.exclusiveTitle`, movie.exclusiveTitle);
  const subTitle = t(`home:hero.movies.${movie.id}.subTitle`, movie.subTitle);
  const synopsis = t(`home:hero.movies.${movie.id}.synopsis`, movie.synopsis);
  const duration = t(`home:hero.movies.${movie.id}.duration`, movie.duration);
  const audioSub = t(`home:hero.movies.${movie.id}.audioSub`, movie.audioSub);
  const genre = t(`home:hero.movies.${movie.id}.genre`, movie.genre);
  const ageBadge = t(`home:hero.movies.${movie.id}.ageBadge`, movie.ageBadge);
  const ageShort = t(`home:hero.movies.${movie.id}.ageShort`, movie.ageBadge.split(' - ')[0]);
  const ratingCount = t(`home:hero.movies.${movie.id}.ratingCount`, movie.ratingCount);
  const ratingCountShort = t(
    `home:hero.movies.${movie.id}.ratingCountShort`,
    movie.ratingCount.match(/\((.*?)\)/)?.[0] || movie.ratingCount,
  );

  // ── Refs ──────────────────────────────────────────────────────────────────
  const slideRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const badgesRowRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const synopsisRef = useRef<HTMLParagraphElement>(null);
  const metasRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // ── Cinematic Entrance Timeline ───────────────────────────────────────────
  useGSAP(
    () => {
      if (!isActive) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Backdrop Ken Burns zoom: scale 1.05 → 1 over 1.6s
        if (backdropRef.current) {
          gsap.fromTo(
            backdropRef.current,
            { scale: 1.05 },
            { scale: 1, duration: 1.6, ease: 'power2.out', overwrite: 'auto' },
          );
        }

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
        });

        // 1. Badges row drops in from above
        if (badgesRowRef.current) {
          tl.fromTo(
            badgesRowRef.current.children,
            { y: -16, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.05, duration: 0.4 },
            0.15,
          );
        }

        // 2. WOW #2: Word-by-word reveal for the title
        if (titleContainerRef.current) {
          animateWordReveal(titleContainerRef.current, {
            delay: 0.25,
            duration: 0.7,
            stagger: 0.07,
            ease: 'power3.out',
          });
        }

        // 3. Synopsis fades in softly
        if (synopsisRef.current) {
          tl.fromTo(
            synopsisRef.current,
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45 },
            0.4,
          );
        }

        // 4. Meta items stagger from left
        if (metasRef.current) {
          tl.fromTo(
            metasRef.current.children,
            { x: -14, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.06, duration: 0.4 },
            0.5,
          );
        }

        // 5. CTA buttons appear
        if (ctaRef.current) {
          tl.fromTo(
            ctaRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45 },
            0.6,
          );
        }
      });

      return () => mm.revert();
    },
    { scope: slideRef, dependencies: [isActive], revertOnUpdate: true },
  );

  return (
    <S.SlideItem key={movie.id} ref={slideRef as React.Ref<HTMLDivElement>}>
      {/* Backdrop Image */}
      <S.SlideBackdrop
        ref={backdropRef as React.Ref<HTMLDivElement>}
        role="img"
        aria-label={t('home:hero.poster_alt', {
          defaultValue: `Poster phim ${movie.mainTitle}`,
          title: movie.mainTitle,
        })}
        $bgImage={movie.bgImage}
      />

      {/* Cinematic Gradients */}
      <S.GradientOverlayRight />
      <S.GradientOverlayTop />
      <S.GradientOverlayRadial />

      {/* Movie Content */}
      <S.SlideContentContainer>
        <S.SlideContentInner>
          <S.HeroDetails>
            {/* Formats & Badges Row */}
            <S.FormatsBadgesRow ref={badgesRowRef as React.Ref<HTMLDivElement>}>
              <S.ImaxBadge>
                <S.ImaxText>{movie.imaxBadge}</S.ImaxText>
              </S.ImaxBadge>
              <S.AgeBadge>
                <S.AgeText>
                  <span className="badge-full">{ageBadge}</span>
                  <span className="badge-short">{ageShort}</span>
                </S.AgeText>
              </S.AgeBadge>
              <S.RatingBadge>
                <Star size={12} color="#FFB955" fill="#FFB955" />
                <S.RatingScore>{movie.ratingScore}</S.RatingScore>
                <S.RatingCount>
                  <span className="badge-full">{ratingCount}</span>
                  <span className="badge-short">{ratingCountShort}</span>
                </S.RatingCount>
              </S.RatingBadge>
              <S.GenreBadge>
                <S.GenreText>{genre}</S.GenreText>
              </S.GenreBadge>
            </S.FormatsBadgesRow>

            {/* Master Title (WOW #2: Word-by-Word Masked Reveal) */}
            <S.TitleContainer ref={titleContainerRef as React.Ref<HTMLDivElement>}>
              <S.TitleLabel>{exclusiveTitle}</S.TitleLabel>
              <S.TitleGroup>
                <S.MainTitle>
                  {splitTextToWordElements(movie.mainTitle)}
                </S.MainTitle>
                <S.SubTitle>{subTitle}</S.SubTitle>
              </S.TitleGroup>
            </S.TitleContainer>

            {/* Synopsis */}
            <S.Synopsis ref={synopsisRef as React.Ref<HTMLParagraphElement>}>
              {synopsis}
            </S.Synopsis>

            {/* Key Metas */}
            <S.KeyMetas ref={metasRef as React.Ref<HTMLDivElement>}>
              <S.MetaItem>
                <Clock size={15} color="#FFB955" />
                <S.MetaText>{duration}</S.MetaText>
              </S.MetaItem>
              <S.MetaItem>
                <Globe size={15} color="#FFB955" />
                <S.MetaText>{audioSub}</S.MetaText>
              </S.MetaItem>
              <S.MetaItem>
                <Clapperboard size={15} color="#FFB955" />
                <S.MetaText>
                  {t('home:hero.director_prefix', 'Đạo diễn:')} {movie.director}
                </S.MetaText>
              </S.MetaItem>
            </S.KeyMetas>

            {/* Action CTAs (WOW #3: Magnetic buttons inside) */}
            <div ref={ctaRef}>
              <SlideCTA
                movieId={movie.detailMovieId || movie.id}
                onWatchTrailer={onWatchTrailer}
              />
            </div>

            {/* Slide Pagination Indicators */}
            <SlidePagination
              selectedIndex={selectedIndex}
              onDotClick={onDotClick}
            />
          </S.HeroDetails>
        </S.SlideContentInner>
      </S.SlideContentContainer>
    </S.SlideItem>
  );
};
