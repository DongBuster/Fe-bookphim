import { useState, type FC } from 'react';
import { ScratchTicketModal } from '@/shared/components/interactive/ScratchTicketModal';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Gift,
  ShoppingCart,
  Crown,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as S from './ExclusiveOffers.styles';
import { useRef } from 'react';
import { useGSAP, gsap } from '@/shared/animations';

export const ExclusiveOffers: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isScratchModalOpen, setIsScratchModalOpen] = useState(false);
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
          // Wave stagger entrance
          gsap.fromTo(
            gridRef.current.children,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: gridRef.current,
                start: 'top 85%',
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

  const handleNavigateExplore = () => {
    navigate('/kham-pha');
  };

  const handleNavigateBooking = () => {
    navigate('/dat-ve/1?booking=true');
  };

  const handleNavigateVipElite = () => {
    navigate('/profile/vip-elite');
  };

  return (
    <S.ExclusiveOffersSection ref={sectionRef}>
      <S.Container>
        {/* Header Section */}
        <S.HeaderWrapper ref={headerRef}>
          <S.HeaderTextGroup>
            <S.HeaderSubtitle>{t('home:offers.subtitle')}</S.HeaderSubtitle>
            <S.HeaderTitle>{t('home:offers.title')}</S.HeaderTitle>
          </S.HeaderTextGroup>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <S.HeaderButton
              type="button"
              onClick={() => setIsScratchModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, rgba(255,83,90,0.18), rgba(255,185,85,0.18))',
                borderColor: 'rgba(255,185,85,0.45)',
                color: '#FFB955',
              }}
            >
              <Sparkles size={14} color="#FFB955" />
              <S.HeaderButtonText style={{ color: '#FFB955' }}>
                {t('interactive:mystery_scratch', 'Vé Cào May Mắn')}
              </S.HeaderButtonText>
            </S.HeaderButton>
            <S.HeaderButton className="group" onClick={handleNavigateExplore}>
              <S.HeaderButtonText>{t('home:offers.view_all_btn')}</S.HeaderButtonText>
              <ChevronRight color="#FFB3B0" size={14} />
            </S.HeaderButton>
          </div>
        </S.HeaderWrapper>

        {/* Promotional Cards Triplet */}
        <S.CardsGrid ref={gridRef}>
          {/* Card 1: Bank Partners */}
          <S.CardWrapper>
            <S.Card1Blur />

            <S.CardContent>
              <S.CardHeader>
                <S.Badge $bg="#2A2A2B">
                  <S.BadgeText $color="#FFB955">{t('home:offers.card1_badge')}</S.BadgeText>
                </S.Badge>
                <S.CardStatus $color="#AE8786">{t('home:offers.card1_expiry')}</S.CardStatus>
              </S.CardHeader>
              <S.CardTitle>{t('home:offers.card1_title')}</S.CardTitle>
              <S.CardDescription>
                {t('home:offers.card1_desc')}
              </S.CardDescription>

              {/* Bank Icons */}
              <S.BankIconsWrapper>
                <S.BankIcon>
                  <S.BankIconText>VISA</S.BankIconText>
                </S.BankIcon>
                <S.BankIcon>
                  <S.BankIconText>Mastercard</S.BankIconText>
                </S.BankIcon>
                <S.BankIcon>
                  <S.BankIconText>JCB Elite</S.BankIconText>
                </S.BankIcon>
              </S.BankIconsWrapper>
            </S.CardContent>

            <S.CardButton $variant="dark" onClick={handleNavigateExplore}>
              <S.CardButtonText $color="#E5E2E3" $weight={600}>
                {t('home:offers.card1_btn')}
              </S.CardButtonText>
              <Gift color="#E5E2E3" size={14} />
            </S.CardButton>
          </S.CardWrapper>

          {/* Card 2: Exclusive Popcorn Combo */}
          <S.CardWrapper>
            <S.Card2Blur />

            <S.CardContent>
              <S.CardHeader>
                <S.Badge $bg="#DC9100">
                  <S.BadgeText $color="#4F3100">{t('home:offers.card2_badge')}</S.BadgeText>
                </S.Badge>
                <S.CardStatus $color="#FFB955">{t('home:offers.card2_limit')}</S.CardStatus>
              </S.CardHeader>
              <S.CardTitle>{t('home:offers.card2_title')}</S.CardTitle>
              <S.CardDescription>
                {t('home:offers.card2_desc')}
              </S.CardDescription>

              <S.CheckmarkItem>
                <CheckCircle2 color="#FFB955" size={13} />
                <S.CardStatus $color="#AE8786">
                  {t('home:offers.card2_pickup')}
                </S.CardStatus>
              </S.CheckmarkItem>
            </S.CardContent>

            <S.CardButton $variant="gradient" onClick={handleNavigateBooking}>
              <S.CardButtonText $color="#5B000D">
                {t('home:offers.card2_btn')}
              </S.CardButtonText>
              <ShoppingCart color="#5B000D" size={16} />
            </S.CardButton>
          </S.CardWrapper>

          {/* Card 3: CinePass Subscription */}
          <S.GradientCardWrapper>
            <S.CardContent>
              <S.CardHeader>
                <S.Badge $bg="#FFB3B0">
                  <S.BadgeText $color="#680010">{t('home:offers.card3_badge')}</S.BadgeText>
                </S.Badge>
                <S.CardStatus
                  $color="#FFB955"
                  $uppercase={true}
                >
                  {t('home:offers.card3_status')}
                </S.CardStatus>
              </S.CardHeader>
              <S.CardTitle>{t('home:offers.card3_title')}</S.CardTitle>
              <S.CardDescription>
                {t('home:offers.card3_desc')}
              </S.CardDescription>

              <S.CheckmarkList>
                <S.CheckmarkListItem>
                  <CheckCircle2 color="#FFB955" size={14} />
                  <S.CheckmarkListText>
                    {t('home:offers.card3_feat1')}
                  </S.CheckmarkListText>
                </S.CheckmarkListItem>
                <S.CheckmarkListItem>
                  <CheckCircle2 color="#FFB955" size={14} />
                  <S.CheckmarkListText>
                    {t('home:offers.card3_feat2')}
                  </S.CheckmarkListText>
                </S.CheckmarkListItem>
              </S.CheckmarkList>
            </S.CardContent>

            <S.CardButton $variant="black" onClick={handleNavigateVipElite}>
              <S.CardButtonText $color="#FFB3B0">
                {t('home:offers.card3_btn')}
              </S.CardButtonText>
              <Crown color="#FFB3B0" size={15} />
            </S.CardButton>
          </S.GradientCardWrapper>
        </S.CardsGrid>
      </S.Container>
      <ScratchTicketModal
        isOpen={isScratchModalOpen}
        onClose={() => setIsScratchModalOpen(false)}
      />
    </S.ExclusiveOffersSection>
  );
};
