import type { FC } from 'react';
import { Bot, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ChatSuggestions } from './components/ChatSuggestions/ChatSuggestions';
import { ChatMessage } from './components/ChatMessage/ChatMessage';
import { ChatInput } from './components/ChatInput/ChatInput';
import * as S from './AiCineAdvisor.styles';
import { useRef } from 'react';
import { useGSAP, gsap } from '@/shared/animations';

export const AiCineAdvisor: FC = () => {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (cardRef.current) {
          gsap.fromTo(
            cardRef.current,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: cardRef.current,
                start: 'top 88%',
                once: true,
              },
            },
          );
        }

        if (badgeRef.current) {
          // GPU-optimized pulse: animates transform scale only and pauses when off-screen
          gsap.to(badgeRef.current, {
            scale: 1.045,
            duration: 1.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            scrollTrigger: {
              trigger: cardRef.current,
              toggleActions: 'play pause resume pause',
            },
          });
        }
      });
      return () => mm.revert();
    },
    { scope: cardRef },
  );

  return (
    <S.SectionWrapper>
      <S.OuterContainer>
        {/* Section Container with Gradient & Ambient Glow */}
        <S.MainCard ref={cardRef}>
          {/* Ambient Glows */}
          <S.TopRightGlow />
          <S.BottomCenterGlow />

          {/* Section Header */}
          <S.HeaderRow>
            {/* Left Header */}
            <S.LeftHeaderGroup>
              <S.EngineRow>
                <S.EngineBadge ref={badgeRef}>
                  <Bot color="#5B000D" size={18} fill="currentColor" />
                  <S.EngineText>{t('home:advisor.engine_name')}</S.EngineText>
                </S.EngineBadge>
                <S.Subtext>{t('home:advisor.subtext')}</S.Subtext>
              </S.EngineRow>
              <S.MainHeading>{t('home:advisor.heading')}</S.MainHeading>
            </S.LeftHeaderGroup>

            {/* Right Header Controls */}
            <S.RightControls>
              <S.TasteBadge>
                <S.TasteIndicator />
                <S.TasteTextCol>
                  <S.TasteText>
                    {t('home:advisor.taste_label')}{' '}
                    <S.TasteHighlight>
                      {t('home:advisor.taste_highlight')}
                    </S.TasteHighlight>
                  </S.TasteText>
                </S.TasteTextCol>
              </S.TasteBadge>
              <S.RefreshButton aria-label={t('home:advisor.refresh_label')}>
                <RefreshCw color="#E7BCBA" size={20} />
              </S.RefreshButton>
            </S.RightControls>
          </S.HeaderRow>

          {/* Bento Grid */}
          <S.GridContainer>
            <ChatSuggestions />

            {/* Card 3: AI Chat */}
            <S.AICard>
              <ChatMessage />
              <ChatInput />
            </S.AICard>
          </S.GridContainer>
        </S.MainCard>
      </S.OuterContainer>
    </S.SectionWrapper>
  );
};
