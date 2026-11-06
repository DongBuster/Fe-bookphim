import type { FC } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Award,
  Stamp,
  Sparkles,
  Trophy,
  Film,
  Building2,
  Coins,
  CheckCircle2,
} from 'lucide-react';
import { message } from '@config/notification';
import {
  getMyPassportApi,
  getPassportBadgesApi,
  claimBadgeRewardApi,
} from './api/passport.api';
import type { PassportDto, BadgeDto, HologramStampDto } from '@shared/types/api.types';
import * as S from './PassportPage.styles';

export const PassportPage: FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'stamps' | 'badges'>('stamps');

  // Fetch live passport
  const { data: passport } = useQuery<PassportDto>({
    queryKey: ['my-passport'],
    queryFn: getMyPassportApi,
  });

  // Fetch badges
  const { data: badgesData } = useQuery<BadgeDto[]>({
    queryKey: ['passport-badges'],
    queryFn: getPassportBadgesApi,
  });

  // Claim Reward Mutation
  const claimMutation = useMutation({
    mutationFn: (badgeId: string) => claimBadgeRewardApi({ badgeId }),
    onSuccess: (data) => {
      message.success(
        t('profile:badge_claimed_success', {
          points: data.rewardPoints,
          defaultValue: `Chúc mừng! Bạn đã nhận thành công +${data.rewardPoints} điểm thưởng vào tài khoản!`,
        }),
      );
      queryClient.invalidateQueries({ queryKey: ['my-passport'] });
      queryClient.invalidateQueries({ queryKey: ['passport-badges'] });
    },
    onError: () => {
      message.error(
        t('profile:badge_claim_error', 'Không thể nhận thưởng lúc này. Vui lòng thử lại sau.'),
      );
    },
  });

  // Fallback passport for display
  const effectivePassport: PassportDto = {
    userId: passport?.userId || 'current-user',
    fullName: passport?.fullName || localStorage.getItem('user_name') || 'VIP Elite Cinephile',
    avatarUrl:
      passport?.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    membershipTier: passport?.membershipTier || 'STANDARD',
    cinephileTitle: passport?.cinephileTitle || (passport as any)?.cinephileRank || 'Tân Binh Điện Ảnh',
    totalPoints: passport?.totalPoints ?? 0,
    moviesWatchedCount: passport?.moviesWatchedCount ?? (passport as any)?.totalStamps ?? 0,
    theatersVisitedCount: passport?.theatersVisitedCount ?? 0,
    stamps:
      passport?.stamps && passport.stamps.length > 0
        ? passport.stamps
        : (passport as any)?.recentStamps && (passport as any).recentStamps.length > 0
          ? (passport as any).recentStamps.map((s: any) => ({
              stampId: s.id || s.stampId || Math.random().toString(),
              movieTitle: s.movieTitle,
              theaterName: s.theaterName || 'Rạp PhimBook',
              format: s.format || '2D Digital',
              acquiredAt: s.watchedAt || s.acquiredAt || new Date().toISOString(),
              hologramEffect: s.hologramTheme || s.hologramEffect || 'GOLDEN_EMBOSS',
            }))
          : [],
    badges: passport?.badges || [],
  };

  const rawBadges =
    badgesData && badgesData.length > 0
      ? badgesData
      : passport?.badges && passport.badges.length > 0
        ? passport.badges
        : null;

  const effectiveBadges: BadgeDto[] = rawBadges
    ? rawBadges.map((b: any) => ({
        badgeId: b.badgeId || b.id || b.code,
        code: b.code,
        name: b.name,
        description: b.description,
        iconUrl: b.iconUrl || '',
        category: b.category,
        isUnlocked: !!b.isUnlocked,
        unlockedAt: b.unlockedAt,
        rewardPoints: b.rewardPoints ?? b.bonusPoints ?? 0,
        isRewardClaimed: !!b.isRewardClaimed,
      }))
    : [
          {
            badgeId: 'b-1',
            code: 'FIRST_TICKET',
            name: 'Khai Màn Màn Bạc',
            description: 'Đặt và xem bộ phim đầu tiên tại hệ thống PhimBook.',
            iconUrl: '',
            category: 'WATCH_COUNT',
            isUnlocked: true,
            unlockedAt: '2025-01-15',
            rewardPoints: 100,
            isRewardClaimed: true,
          },
          {
            badgeId: 'b-2',
            code: 'IMAX_EXPLORER',
            name: 'Đại Sứ IMAX Laser',
            description: 'Trải nghiệm 3 suất chiếu định dạng IMAX Laser siêu thực.',
            iconUrl: '',
            category: 'SPECIAL_EVENT',
            isUnlocked: true,
            unlockedAt: '2025-02-28',
            rewardPoints: 300,
            isRewardClaimed: false,
          },
          {
            badgeId: 'b-3',
            code: 'THEATER_HOPPER',
            name: 'Dạo Bước Rạp Chiếu',
            description: 'Check-in thành công tại 5 cụm rạp khác nhau trong thành phố.',
            iconUrl: '',
            category: 'THEATER_VISIT',
            isUnlocked: true,
            unlockedAt: '2025-03-02',
            rewardPoints: 250,
            isRewardClaimed: false,
          },
          {
            badgeId: 'b-4',
            code: 'CINE_MARATHON',
            name: 'Kỷ Lục Gia Điện Ảnh',
            description: 'Xem 20 phim trong vòng 3 tháng liên tiếp.',
            iconUrl: '',
            category: 'WATCH_COUNT',
            isUnlocked: false,
            rewardPoints: 500,
            isRewardClaimed: false,
          },
        ];

  const stamps: HologramStampDto[] = effectivePassport.stamps || [];

  return (
    <S.Container>
      {/* Top 3D Hologram Passport Card */}
      <S.PassportHeaderCard>
        <S.PassportCardInner>
          <S.UserIdentity>
            <div className="avatar-holo">
              <img
                src={effectivePassport.avatarUrl}
                alt={effectivePassport.fullName}
              />
            </div>
            <div className="name-block">
              <div className="title-badge">
                <Sparkles size={12} />
                <span>{effectivePassport.cinephileTitle}</span>
              </div>
              <h2>{effectivePassport.fullName}</h2>
              <span className="tier-label">
                {t('profile:passport_member_tier', {
                  tier: effectivePassport.membershipTier,
                  defaultValue: `Hạng Thành Viên: ${effectivePassport.membershipTier} ELITE`,
                })}
              </span>
            </div>
          </S.UserIdentity>

          {/* Stats Counters */}
          <S.StatsGrid>
            <S.StatBox>
              <span className="stat-val">
                <Coins size={16} style={{ display: 'inline', marginRight: 4 }} />
                {(effectivePassport.totalPoints ?? 0).toLocaleString('vi-VN')}
              </span>
              <span className="stat-label">{t('profile:accumulated_points_label', 'Điểm Tích Lũy')}</span>
            </S.StatBox>

            <S.StatBox>
              <span className="stat-val">
                <Film size={16} style={{ display: 'inline', marginRight: 4 }} />
                {effectivePassport.moviesWatchedCount ?? 0}
              </span>
              <span className="stat-label">{t('profile:movies_watched_label', 'Phim Đã Thưởng Thức')}</span>
            </S.StatBox>

            <S.StatBox>
              <span className="stat-val">
                <Building2
                  size={16}
                  style={{ display: 'inline', marginRight: 4 }}
                />
                {effectivePassport.theatersVisitedCount ?? 0}
              </span>
              <span className="stat-label">{t('profile:theaters_visited_label', 'Cụm Rạp Check-in')}</span>
            </S.StatBox>
          </S.StatsGrid>
        </S.PassportCardInner>
      </S.PassportHeaderCard>

      {/* Tabs */}
      <S.TabBar>
        <S.TabButton
          type="button"
          $isActive={activeTab === 'stamps'}
          onClick={() => setActiveTab('stamps')}
        >
          <Stamp size={16} />
          <span>
            {t('profile:passport_tab_stamps', {
              count: stamps.length,
              defaultValue: `Con Dấu Điện Ảnh (${stamps.length})`,
            })}
          </span>
        </S.TabButton>

        <S.TabButton
          type="button"
          $isActive={activeTab === 'badges'}
          onClick={() => setActiveTab('badges')}
        >
          <Trophy size={16} />
          <span>
            {t('profile:passport_tab_badges', {
              count: effectiveBadges.length,
              defaultValue: `Huy Hiệu & Đổi Thưởng (${effectiveBadges.length})`,
            })}
          </span>
        </S.TabButton>
      </S.TabBar>

      {/* TAB 1: STAMPS */}
      {activeTab === 'stamps' && (
        <>
          {stamps.length === 0 ? (
            <S.EmptyState>
              <Stamp size={48} color="#8c8994" />
              <p>
                {t(
                  'profile:passport_empty_stamps',
                  'Bạn chưa có con dấu nào. Hãy check-in suất chiếu tiếp theo để đóng dấu hộ chiếu!',
                )}
              </p>
            </S.EmptyState>
          ) : (
            <S.StampGrid>
              {stamps.map((s) => (
                <S.StampCard key={s.stampId} $effect={s.hologramEffect}>
                  <div className="stamp-seal">
                    <Stamp size={32} />
                  </div>
                  <h3 className="movie-name">{s.movieTitle}</h3>
                  <span className="theater-info">{s.theaterName}</span>
                  <span className="date-badge">
                    {s.format} • {new Date(s.acquiredAt).toLocaleDateString('vi-VN')}
                  </span>
                </S.StampCard>
              ))}
            </S.StampGrid>
          )}
        </>
      )}

      {/* TAB 2: BADGES */}
      {activeTab === 'badges' && (
        <S.BadgeGrid>
          {effectiveBadges.map((badge) => {
            const canClaim = badge.isUnlocked && !badge.isRewardClaimed;

            return (
              <S.BadgeCard key={badge.badgeId} $unlocked={badge.isUnlocked}>
                <div className="badge-icon-box">
                  <Award size={26} />
                </div>
                <div className="badge-content">
                  <h4>{badge.name}</h4>
                  <p>{badge.description}</p>

                  {canClaim ? (
                    <button
                      type="button"
                      className="claim-btn"
                      disabled={claimMutation.isPending}
                      onClick={() => claimMutation.mutate(badge.badgeId)}
                    >
                      {t('profile:passport_claim_reward', {
                        points: badge.rewardPoints,
                        defaultValue: `Nhận +${badge.rewardPoints} Điểm`,
                      })}
                    </button>
                  ) : badge.isRewardClaimed ? (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11.5,
                        color: '#52b788',
                        marginTop: 6,
                        fontWeight: 600,
                      }}
                    >
                      <CheckCircle2 size={13} />
                      {t('profile:passport_claimed', 'Đã Nhận Thưởng')} (+{badge.rewardPoints})
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: 11.5,
                        color: '#8c8994',
                        marginTop: 6,
                      }}
                    >
                      🔒 {t('profile:passport_locked', 'Chưa Mở Khóa')} (+{badge.rewardPoints})
                    </span>
                  )}
                </div>
              </S.BadgeCard>
            );
          })}
        </S.BadgeGrid>
      )}
    </S.Container>
  );
};

export default PassportPage;
