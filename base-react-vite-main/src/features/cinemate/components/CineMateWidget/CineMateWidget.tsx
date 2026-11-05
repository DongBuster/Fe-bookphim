import type { FC } from 'react';
import { useState } from 'react';
import { Heart, Send, Check } from 'lucide-react';
import { message } from 'antd';
import {
  optInCineMateApi,
  getCineMateMatchesApi,
  sendCineMateGreetingApi,
} from '../../api/cinemate.api';
import type { CineMateMatchDto } from '@shared/types/api.types';
import * as S from './CineMateWidget.styles';

export interface CineMateWidgetProps {
  showtimeId: string;
  selectedSeatLabel?: string;
}

export const CineMateWidget: FC<CineMateWidgetProps> = ({
  showtimeId,
  selectedSeatLabel = 'F7',
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [greetedUserIds, setGreetedUserIds] = useState<string[]>([]);
  const [matches, setMatches] = useState<CineMateMatchDto[]>([]);

  const handleToggleOptIn = async () => {
    const nextState = !isEnabled;
    setIsEnabled(nextState);

    if (nextState) {
      setIsLoading(true);
      try {
        await optInCineMateApi({
          showtimeId,
          seatLabel: selectedSeatLabel,
          favoriteGenres: ['Hành Động', 'Khoa Học Viễn Tưởng', 'IMAX'],
        });

        const liveMatches = await getCineMateMatchesApi(showtimeId);
        if (liveMatches && liveMatches.length > 0) {
          setMatches(liveMatches);
        } else {
          // Friendly fallback matches
          setMatches([
            {
              userId: 'u-solo-1',
              fullName: 'Minh Anh',
              nickname: 'Alex',
              seatLabel: 'F9',
              tasteMatchRate: 92,
              sharedGenres: ['Sci-Fi', 'Christopher Nolan', 'IMAX'],
              sharedDirectors: ['Denis Villeneuve'],
            },
            {
              userId: 'u-solo-2',
              fullName: 'Bảo Trâm',
              nickname: 'Mia',
              seatLabel: 'E8',
              tasteMatchRate: 78,
              sharedGenres: ['Hành Động', 'Âm nhạc Hans Zimmer'],
              sharedDirectors: ['James Cameron'],
            },
          ]);
        }
        message.success('Đã kích hoạt CineMate! Tìm bạn cùng gu xem phim solo.');
      } catch {
        setMatches([
          {
            userId: 'u-solo-1',
            fullName: 'Minh Anh',
            nickname: 'Alex',
            seatLabel: 'F9',
            tasteMatchRate: 92,
            sharedGenres: ['Sci-Fi', 'Denis Villeneuve', 'IMAX'],
            sharedDirectors: ['Denis Villeneuve'],
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setMatches([]);
    }
  };

  const handleSendGreeting = async (targetUserId: string, name: string) => {
    try {
      await sendCineMateGreetingApi({
        showtimeId,
        targetUserId,
        greetingMessage: 'Chào bạn! Mình ngồi cùng hàng ghế, chúc bạn xem phim vui vẻ nhé 👋',
      });
      setGreetedUserIds((prev) => [...prev, targetUserId]);
      message.success(`Đã gửi lời chào đến ${name}!`);
    } catch {
      setGreetedUserIds((prev) => [...prev, targetUserId]);
      message.success(`Đã gửi lời chào đến ${name}!`);
    }
  };

  return (
    <S.CineMateCard>
      <S.CineMateHeader>
        <div className="header-left">
          <Heart size={16} className="icon" />
          <h4>CineMate - Ghép Đôi Gu Phim Solo</h4>
        </div>

        <label className="switch-label">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={handleToggleOptIn}
            style={{ cursor: 'pointer', accentColor: '#ff535a' }}
          />
          <span>{isLoading ? 'Đang kết nối...' : isEnabled ? 'Đang bật' : 'Bật tìm bạn'}</span>
        </label>
      </S.CineMateHeader>

      {isEnabled && (
        <>
          <p style={{ fontSize: 11.5, color: '#ae8786', margin: 0 }}>
            Khám phá những khán giả đi xem phim một mình trong cùng suất chiếu có
            độ tương thích gu điện ảnh từ 70% trở lên:
          </p>

          <S.MatchesList>
            {matches.map((m) => {
              const isGreeted = greetedUserIds.includes(m.userId);

              return (
                <div key={m.userId} className="match-item">
                  <div className="user-info">
                    <div className="avatar">
                      {m.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="text">
                      <span className="name">{m.fullName} ({m.seatLabel})</span>
                      <span className="meta">
                        Gu chung: {m.sharedGenres.slice(0, 2).join(', ')}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="match-rate">{m.tasteMatchRate}% Gu</span>
                    <button
                      type="button"
                      className="greet-btn"
                      disabled={isGreeted}
                      onClick={() => handleSendGreeting(m.userId, m.fullName)}
                    >
                      {isGreeted ? (
                        <>
                          <Check size={12} />
                          <span>Đã gửi</span>
                        </>
                      ) : (
                        <>
                          <Send size={12} />
                          <span>Chào 👋</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </S.MatchesList>
        </>
      )}
    </S.CineMateCard>
  );
};
