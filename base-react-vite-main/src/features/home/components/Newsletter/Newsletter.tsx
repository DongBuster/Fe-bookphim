import { useState } from 'react';
import type { FC } from 'react';
import { Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as S from './Newsletter.styles';
import { useRef } from 'react';
import { useGSAP, gsap } from '@/shared/animations';

export const Newsletter: FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const bannerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (bannerRef.current) {
          gsap.from(bannerRef.current, {
            y: 32,
            opacity: 0,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: bannerRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      });
      return () => mm.revert();
    },
    { scope: bannerRef },
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: implement newsletter subscribe logic
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <S.SectionContainer>
      <S.ContentWrapper>
        {/* Banner Container */}
        <S.BannerContainer ref={bannerRef}>
          {/* Left Content */}
          <S.LeftContent>
            <S.Subtitle>{t('home:newsletter.subtitle')}</S.Subtitle>
            <S.Title>{t('home:newsletter.title')}</S.Title>
            <S.Description>{t('home:newsletter.desc')}</S.Description>
          </S.LeftContent>

          {/* Right Content (Form) */}
          <S.RightContent onSubmit={handleSubmit}>
            {/* Input Wrapper */}
            <S.InputWrapper>
              <Mail size={16} />
              <S.EmailInput
                type="email"
                placeholder={t('home:newsletter.placeholder')}
                value={email}
                onChange={handleEmailChange}
                aria-label={t('home:newsletter.placeholder')}
                required
              />
            </S.InputWrapper>

            {/* Submit Button */}
            <S.SubmitButton type="submit">
              <S.ButtonText>{t('home:newsletter.submit_btn')}</S.ButtonText>
            </S.SubmitButton>
          </S.RightContent>
        </S.BannerContainer>
      </S.ContentWrapper>
    </S.SectionContainer>
  );
};
