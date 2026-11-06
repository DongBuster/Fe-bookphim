import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Film, Sparkles, Star } from 'lucide-react';
import * as S from './AuthShowcase.styles';

export const AuthShowcase: FC = () => {
  const { t } = useTranslation();

  return (
    <S.LeftPanel>
      {/* Header trái */}
      <S.LeftTopRow>
        <S.LeftBrandGroup>
          <div className="brand-icon">
            <Film size={20} strokeWidth={2.5} />
          </div>
          <div className="brand-text-col">
            <span className="brand-title">PHIMBOOK</span>
            <span className="brand-sub">CINEPASS™ PREMIER CLUB</span>
          </div>
        </S.LeftBrandGroup>

        <S.ShowtimeBadge>
          <div className="red-dot" />
          <span>{t('auth:showcase_badge', 'ĐANG CHIẾU TOÀN QUỐC: 1.420 SUẤT')}</span>
        </S.ShowtimeBadge>
      </S.LeftTopRow>

      {/* Phần giữa trái */}
      <S.LeftCenterContent>
        <S.StandardPill>
          <Sparkles size={14} />
          <span>{t('auth:showcase_pill', 'Trải nghiệm chuẩn IMAX Laser & Dolby Atmos 360°')}</span>
        </S.StandardPill>

        <S.LeftMainTitle>
          {t('auth:showcase_title_1', 'Đặc Quyền Điện Ảnh')} <br />
          <span className="gradient-highlight">{t('auth:showcase_title_2', 'Thượng Hạng')}</span>
        </S.LeftMainTitle>

        <S.LeftDescription>
          {t(
            'auth:showcase_desc',
            'Hòa mình vào không gian rạp chiếu chuẩn quốc tế, tận hưởng ghế đôi Sweetbox bọc nhung và quầy Bar Lounge sang trọng trước mỗi suất chiếu đỉnh cao.',
          )}
        </S.LeftDescription>

        {/* 3 Box đặc quyền */}
        <S.BenefitsRow>
          <S.BenefitCard>
            <span className="stat-val red">0đ</span>
            <span className="stat-desc">{t('auth:benefit_birthday', 'Vé 0đ sinh nhật')}</span>
          </S.BenefitCard>

          <S.BenefitCard>
            <span className="stat-val gold">15%</span>
            <span className="stat-desc">{t('auth:benefit_cinepoint', 'Tích CinePoint')}</span>
          </S.BenefitCard>

          <S.BenefitCard>
            <span className="stat-val white">CinePass</span>
            <span className="stat-desc">{t('auth:benefit_fasttrack', 'Fast-Track lối riêng')}</span>
          </S.BenefitCard>
        </S.BenefitsRow>
      </S.LeftCenterContent>

      {/* Footer trái */}
      <S.LeftBottomRow>
        <S.SocialProofGroup>
          <div className="avatar-cluster">
            <div className="avatar-dot">P</div>
            <div className="avatar-dot">H</div>
            <div className="avatar-dot">S</div>
          </div>
          <span className="proof-text">
            {t('auth:testimonial_rating', '4.9/5 • Hơn 500k lượt khán giả VIP tin chọn')}
          </span>
        </S.SocialProofGroup>

        <S.StarRatingGroup>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={13} fill="currentColor" />
          ))}
        </S.StarRatingGroup>
      </S.LeftBottomRow>
    </S.LeftPanel>
  );
};

export default AuthShowcase;
