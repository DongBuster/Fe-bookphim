/**
 * CinephileBadgeCard component
 * Adapted from Lucian UX/UI Prompt #386 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#386
 *
 * 3D flip achievement medal with metallic sheen & lock/unlock progress for Cinema Noir.
 */
import { useState, type FC } from 'react';
import { Award, Lock, CheckCircle2, RotateCw, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { BadgeDto } from '@shared/types/api.types';
import * as S from './CinephileBadgeCard.styles';

export interface CinephileBadgeCardProps {
  badge: BadgeDto;
  onClaim?: (badgeId: string) => void;
  isClaiming?: boolean;
}

export const CinephileBadgeCard: FC<CinephileBadgeCardProps> = ({
  badge,
  onClaim,
  isClaiming = false,
}) => {
  const { t } = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);

  const isUnlocked = Boolean(badge.isUnlocked);
  const canClaim = isUnlocked && !badge.isRewardClaimed;
  const extBadge = badge as Partial<BadgeDto> & { progressCurrent?: number; progressTarget?: number };
  const progressCurrent = extBadge.progressCurrent ?? (isUnlocked ? 1 : 0);
  const progressTarget = extBadge.progressTarget ?? 1;
  const progressPercent = Math.min(100, Math.round((progressCurrent / Math.max(1, progressTarget)) * 100));

  const handleClick = () => {
    setIsFlipped((f) => !f);
  };

  const handleClaimClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canClaim && onClaim) {
      onClaim(badge.badgeId);
    }
  };

  return (
    <S.CardWrapper>
      <S.FlipContainer
        $isFlipped={isFlipped}
        $isUnlocked={isUnlocked}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`${badge.name}, ${isUnlocked ? 'Đã mở khóa' : 'Chưa mở khóa'}`}
        onKeyDown={(e) => {
          if (isUnlocked && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* FRONT FACE */}
        <S.CardFace $isUnlocked={isUnlocked}>
          <S.MedalCircle $isUnlocked={isUnlocked}>
            {isUnlocked ? <Award size={30} /> : <Lock size={24} />}
          </S.MedalCircle>

          <S.Title>{badge.name}</S.Title>
          <S.Description>{badge.description}</S.Description>

          {!isUnlocked ? (
            <S.ProgressBar>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="bar-text">
                <span>{t('profile:passport_locked', 'Tiến độ')}</span>
                <span>{progressCurrent}/{progressTarget}</span>
              </div>
            </S.ProgressBar>
          ) : (
            <S.FlipHint>
              <RotateCw size={10} style={{ display: 'inline', marginRight: 4 }} />
              {t('profile:flip_card_hint', 'Chạm để xem chi tiết')}
            </S.FlipHint>
          )}
        </S.CardFace>

        {/* BACK FACE (FLIPPED 3D) */}
        <S.CardFace $isBack $isUnlocked={isUnlocked}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#FFB955' }}>
            <Sparkles size={16} />
            <S.Title style={{ color: '#FFB955', margin: 0 }}>{badge.name}</S.Title>
          </div>

          <p style={{ fontSize: 11, color: '#e2e8f0', margin: '8px 0', lineHeight: 1.45 }}>
            {badge.description}
          </p>

          {canClaim ? (
            <S.ClaimButton
              type="button"
              disabled={isClaiming}
              onClick={handleClaimClick}
            >
              {t('profile:passport_claim_reward', {
                points: badge.rewardPoints,
                defaultValue: `Nhận +${badge.rewardPoints} Điểm`,
              })}
            </S.ClaimButton>
          ) : badge.isRewardClaimed ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11.5,
                color: '#52B788',
                fontWeight: 700,
              }}
            >
              <CheckCircle2 size={14} />
              {t('profile:passport_claimed', 'Đã Nhận Thưởng')} (+{badge.rewardPoints})
            </span>
          ) : (
            <span style={{ fontSize: 11, color: '#71717a' }}>
              +{badge.rewardPoints} {t('profile:points', 'Điểm VIP')}
            </span>
          )}

          <S.FlipHint style={{ marginTop: 'auto' }}>
            {t('profile:flip_back_hint', 'Chạm để quay lại')}
          </S.FlipHint>
        </S.CardFace>
      </S.FlipContainer>
    </S.CardWrapper>
  );
};
