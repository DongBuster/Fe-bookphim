import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as S from './LuxuryCinemas.styles';
import { useRef } from 'react';
import { useGSAP, gsap } from '@/shared/animations';

const cinemas = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
    brand: 'CGV Flagship',
    brandColor: '#FFB3B0',
    format: 'IMAX LASER • GOLD CLASS',
    formatBg: '#DC9100',
    formatText: '#4F3100',
    name: 'CGV Vincom Landmark 81',
    address:
      'Tầng B1, TTTM Vincom Landmark 81, 720A Điện Biên Phủ, P.22, Bình Thạnh, TP.HCM',
    desc: 'Trang bị màn hình IMAX lớn nhất Việt Nam cùng hệ thống âm thanh vòm 12 kênh thế hệ mới. Phòng chiếu Gold Class phục vụ trà chiều và chăn len riêng biệt.',
    shows: '28',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
    brand: 'Galaxy Premium',
    brandColor: '#FFB955',
    format: 'IMAX LASER • LA ROSA BED',
    formatBg: '#FF535A',
    formatText: '#5B000D',
    name: 'Galaxy Sala Thủ Thiêm',
    address:
      'Tầng 3, TTTM Thiso Mall Sala, 10 Mai Chí Thọ, Thủ Thiêm, TP. Thủ Đức, TP.HCM',
    desc: 'Cụm rạp tích hợp công nghệ chiếu Laser 4K thế hệ mới nhất với phòng chiếu La Rosa trang bị giường nằm bọc da cao cấp cùng quầy bar ẩm thực riêng.',
    shows: '34',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800&auto=format&fit=crop',
    brand: 'Lotte Diamond',
    brandColor: '#FFB3B0',
    format: 'CHARLOTTE • CINEUM LED',
    formatBg: '#4F3100',
    formatText: '#FFB955',
    name: 'Lotte Cinema Diamond Plaza',
    address:
      'Tầng 13, Diamond Plaza, 34 Lê Duẩn, Bến Nghé, Quận 1, TP.HCM',
    desc: 'Phòng chiếu Charlotte Suite đỉnh cao với phòng chờ riêng phục vụ rượu vang, ghế massage chỉnh điện đa điểm và màn hình công nghệ LED Cineum không viền.',
    shows: '42',
  },
];

export const LuxuryCinemas: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (headerRef.current) {
          gsap.from(headerRef.current, {
            opacity: 0,
            y: 28,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          });
        }

        if (gridRef.current) {
          // Stagger card reveal
          gsap.from(gridRef.current.children, {
            opacity: 0,
            y: 40,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          });

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
    { scope: sectionRef },
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
