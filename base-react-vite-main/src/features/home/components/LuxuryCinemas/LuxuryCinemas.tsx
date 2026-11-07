import { type FC, useRef, useMemo } from 'react';
import { useSelectedCity } from '@/shared/services/location.service';
import { getLuxuryCinemasByCity } from '@/shared/data/city-theaters-data';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as S from './LuxuryCinemas.styles';
import { useGSAP, gsap } from '@/shared/animations';

export const LuxuryCinemas: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedCity] = useSelectedCity();
  const cinemas = useMemo(() => getLuxuryCinemasByCity(selectedCity), [selectedCity]);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 90%',
                once: true,
              },
            },
          );
        }

        if (gridRef.current) {
          // Stagger card reveal
          gsap.fromTo(
            gridRef.current.children,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: gridRef.current,
                start: 'top 85%',
                once: true,
              },
            },
          );

          // Parallax depth scrub on room images
          const images = gridRef.current.querySelectorAll('.parallax-cinema-img');
          images.forEach((img) => {
            gsap.to(img, {
              yPercent: 12,
              ease: 'none',
              scrollTrigger: {
                trigger: img.closest('div'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
              },
            });
          });
        }
      });
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [selectedCity] },
  );

  const handleNavigateSchedule = () => {
    navigate('/lich-chieu');
  };

  return (
    <S.Section ref={sectionRef}>
      <S.Container>
        {/* Header Section */}
        <S.HeaderContainer ref={headerRef}>
          <S.TitleGroup>
            <S.Subtitle>{t('home:luxury.subtitle')}</S.Subtitle>
            <S.Title>{t('home:luxury.title')}</S.Title>
          </S.TitleGroup>
          <S.HeaderStatus>
            <S.HeaderStarIcon size={18} />
            <S.HeaderStatusText>{t('home:luxury.status')}</S.HeaderStatusText>
          </S.HeaderStatus>
        </S.HeaderContainer>

        {/* Luxury Cinemas Grid */}
        <S.Grid ref={gridRef}>
          {cinemas.map((cinema) => (
            <S.Card key={cinema.id}>
              {/* Image Container */}
              <S.ImageContainer>
                {/* Image */}
                <S.CardImage className="parallax-cinema-img" src={cinema.image} alt={cinema.name} />

                {/* Gradient */}
                <S.ImageGradient />

                {/* Top Left Badge */}
                <S.BrandBadge>
                  <S.BrandText $color={cinema.brandColor}>
                    {cinema.brand}
                  </S.BrandText>
                </S.BrandBadge>

                {/* Bottom Right Badge */}
                <S.FormatBadge $bg={cinema.formatBg}>
                  <S.FormatText $color={cinema.formatText}>
                    {cinema.format}
                  </S.FormatText>
                </S.FormatBadge>
              </S.ImageContainer>

              {/* Content Container */}
              <S.ContentContainer>
                <S.CardTitle>{cinema.name}</S.CardTitle>

                <S.AddressGroup>
                  <S.LocationIcon size={14} />
                  <S.AddressText>{cinema.address}</S.AddressText>
                </S.AddressGroup>

                <S.DescriptionText>
                  {t(`home:luxury.cinema${cinema.id}_desc`, cinema.desc)}
                </S.DescriptionText>
              </S.ContentContainer>

              {/* Bottom Action Row */}
              <S.ActionRow>
                <S.StatusGroup>
                  <S.StatusIndicator />
                  <S.StatusText>
                    {t('home:luxury.shows_status', {
                      count: parseInt(cinema.shows, 10) || 0,
                    })}
                  </S.StatusText>
                </S.StatusGroup>

                <S.ActionButton onClick={handleNavigateSchedule}>
                  <S.ActionButtonText>
                    {t('home:luxury.view_schedule_btn')}
                  </S.ActionButtonText>
                </S.ActionButton>
              </S.ActionRow>
            </S.Card>
          ))}
        </S.Grid>
      </S.Container>
    </S.Section>
  );
};
