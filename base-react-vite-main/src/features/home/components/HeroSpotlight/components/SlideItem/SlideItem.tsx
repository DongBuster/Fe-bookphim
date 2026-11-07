import type { FC } from 'react';
import { Clock, Globe, Clapperboard, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { SpotlightMovie } from '../../data/spotlight-data';
import { SlideCTA } from '../SlideCta/SlideCta';
import { SlidePagination } from '../SlidePagination/SlidePagination';
import * as S from './SlideItem.styles';

interface SlideItemProps {
  movie: SpotlightMovie;
  selectedIndex: number;
  onDotClick: (index: number) => void;
  onTrailerStateChange?: (isOpen: boolean) => void;
}

/**
 * A single carousel slide: backdrop image, gradient overlays, movie details,
 * CTA buttons, and the shared pagination dots.
 */
export const SlideItem: FC<SlideItemProps> = ({
  movie,
  selectedIndex,
  onDotClick,
  onTrailerStateChange,
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

  return (
    <S.SlideItem key={movie.id}>
      {/* Backdrop Image */}
      <S.SlideBackdrop
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
            <S.FormatsBadgesRow>
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

            {/* Master Title */}
            <S.TitleContainer>
              <S.TitleLabel>{exclusiveTitle}</S.TitleLabel>
              <S.TitleGroup>
                <S.MainTitle>{movie.mainTitle} </S.MainTitle>
                <S.SubTitle>{subTitle}</S.SubTitle>
              </S.TitleGroup>
            </S.TitleContainer>

            {/* Synopsis */}
            <S.Synopsis>{synopsis}</S.Synopsis>

            {/* Key Metas */}
            <S.KeyMetas>
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

            {/* Action CTAs */}
            <SlideCTA
              movieId={movie.detailMovieId || movie.id}
              onTrailerStateChange={onTrailerStateChange}
            />

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
