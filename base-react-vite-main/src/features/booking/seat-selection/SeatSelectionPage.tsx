import { useState, useEffect, useMemo, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { message } from '@config/notification';
import { toast } from '@config/notification';
import { ChevronLeft, Clock, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBooking } from '../context/useBooking';
import type { SeatItem } from '../context/booking.types';
import type { SeatDto } from '@shared/types/api.types';
import {
  getSeatMapApi,
  lockSeatsApi,
  unlockSeatsApi,
  sanitizeShowtimeId,
  isValidUUID,
} from '../api/booking.api';
import { useBookingTimer } from '../hooks/useBookingTimer';
import { ScreenView } from './components/ScreenView/ScreenView';
import { SeatLegend } from './components/SeatLegend/SeatLegend';
import { SeatGrid } from './components/SeatGrid/SeatGrid';
import { SeatFeatures } from './components/SeatFeatures/SeatFeatures';
import { SeatSummarySidebar } from './components/SeatSummarySidebar/SeatSummarySidebar';
import { MobileStickyBar } from './components/MobileStickyBar/MobileStickyBar';
import { CinePartyModal } from '@/features/cineparty/components/CinePartyModal';
import { CineMateWidget } from '@/features/cinemate/components/CineMateWidget';
import { isFeatureEnabled } from '@/config/features.config';
import * as S from './SeatSelectionPage.styles';

export const SeatSelectionPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    state,
    toggleSeat,
    clearSeats,
    setLockToken,
    setMovieAndSession,
  } = useBooking();

  const [isLocking, setIsLocking] = useState(false);
  const [isCinePartyOpen, setIsCinePartyOpen] = useState(false);

  // 10-minute live countdown timer
  const { formattedTime, isExpired, setTimeLeft } = useBookingTimer(600);

  // Determine current active showtime ID (sanitize against non-UUID slot IDs)
  const currentShowtimeId = sanitizeShowtimeId(state.session.showtimeId);

  // Fetch real-time seat map and seat statuses from Railway backend
  const {
    data: seatMap,
    isLoading: isLoadingSeatMap,
    refetch: refetchSeatMap,
  } = useQuery({
    queryKey: ['seatmap', currentShowtimeId, state.lockToken],
    queryFn: () => getSeatMapApi(currentShowtimeId, state.lockToken),
    refetchInterval: 15000, // Sync seats every 15s to capture concurrent bookings
  });

  const currentRoom = state.session.room;
  const currentMovieTitle = state.movie.title;

  // Sync auditorium room and movie title if not already loaded in session
  useEffect(() => {
    if (seatMap) {
      const updatesToSession: Record<string, string> = {};
      const updatesToMovie: Record<string, string> = {};

      if (!isValidUUID(state.session.showtimeId)) {
        updatesToSession.showtimeId = currentShowtimeId;
      }
      if (!currentRoom && seatMap.auditoriumName) {
        updatesToSession.room = seatMap.auditoriumName;
      }
      if (!currentMovieTitle && seatMap.movieTitle) {
        updatesToMovie.title = seatMap.movieTitle;
      }

      if (
        Object.keys(updatesToSession).length > 0 ||
        Object.keys(updatesToMovie).length > 0
      ) {
        setMovieAndSession(updatesToMovie, updatesToSession);
      }
    }
  }, [seatMap, currentRoom, currentMovieTitle, state.session.showtimeId, currentShowtimeId, setMovieAndSession]);

  // Handle countdown expiration
  useEffect(() => {
    if (isExpired && state.lockToken) {
      message.warning(t('booking:holding_expired'));
      const seatUuids = state.selectedSeats
        .map((s) => s.seatId)
        .filter(Boolean) as string[];

      if (seatUuids.length > 0) {
        unlockSeatsApi(currentShowtimeId, {
          lockToken: state.lockToken,
          seatIds: seatUuids,
        }).catch(() => {});
      }

      setLockToken(null);
      clearSeats();
      refetchSeatMap();
    }
  }, [isExpired, state.lockToken, currentShowtimeId, state.selectedSeats, setLockToken, clearSeats, refetchSeatMap, t]);

  // Extract reference prices from live seatmap for Legend
  const legendPrices = useMemo(() => {
    if (!seatMap?.seats) {
      return { standard: 135000, vip: 160000, sweetbox: 270000 };
    }
    const standard =
      seatMap.seats.find((s) => s.seatType?.toUpperCase() === 'STANDARD')
        ?.price || 135000;
    const vip =
      seatMap.seats.find((s) => s.seatType?.toUpperCase() === 'VIP')?.price ||
      160000;
    const sweetbox =
      seatMap.seats.find((s) => s.seatType?.toUpperCase() === 'SWEETBOX')
        ?.price || 270000;

    return { standard, vip, sweetbox };
  }, [seatMap]);

  const handleSeatClick = (seat: SeatDto) => {
    const isSold =
      seat.status === 'BOOKED' ||
      (seat.status === 'LOCKED' && !seat.isLockedByCurrentUser);
    if (isSold) return;

    const row = seat.seatRow || seat.rowLabel || 'A';
    const label = seat.seatLabel || `${row}${seat.seatNumber}`;
    const normalizedType = (
      seat.seatType?.toLowerCase() || 'standard'
    ) as 'standard' | 'vip' | 'sweetbox';

    const seatItem: SeatItem = {
      id: label,
      seatId: seat.seatId,
      row,
      number: seat.seatNumber,
      type: normalizedType,
      price: seat.price,
    };

    toggleSeat(seatItem);
  };

  const handleContinue = async () => {
    if (state.selectedSeats.length === 0) {
      message.warning(t('booking:select_at_least_one'));
      return;
    }

    // Resolve all UUIDs for selected seats
    const seatIdsToLock = state.selectedSeats
      .map((s) => {
        if (s.seatId) return s.seatId;
        const matched = seatMap?.seats.find(
          (dbSeat) =>
            dbSeat.seatLabel === s.id ||
            `${dbSeat.seatRow || dbSeat.rowLabel}${dbSeat.seatNumber}` === s.id,
        );
        return matched?.seatId;
      })
      .filter(Boolean) as string[];

    if (seatIdsToLock.length === 0) {
      message.error(t('booking:invalid_seat_info'));
      return;
    }

    setIsLocking(true);
    try {
      const res = await lockSeatsApi(currentShowtimeId, {
        seatIds: seatIdsToLock,
        lockToken: state.lockToken || null,
      });

      if (res && res.success) {
        setLockToken(res.lockToken);
        if (res.expiresInSeconds) {
          setTimeLeft(res.expiresInSeconds);
        }
        message.success(
          t('booking:seats_locked_success', {
            count: res.lockedSeatIds.length,
          }),
        );
        navigate('/booking/snacks-services');
      } else {
        toast.error(res?.message || t('booking:cannot_lock_seats'));
      }
    } catch (err: unknown) {
      console.error('Lỗi chọn ghế:', err);
      const isAlreadyHandled = Boolean(
        (err as { isHandled?: boolean })?.isHandled ||
        (err as { isBusinessError?: boolean })?.isBusinessError
      );
      if (!isAlreadyHandled) {
        const errorObj = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        const errorMsg =
          errorObj?.response?.data?.message ||
          errorObj?.message ||
          t('booking:seat_already_taken');
        toast.error(errorMsg);
      }
      refetchSeatMap();
    } finally {
      setIsLocking(false);
    }
  };

  const handleNavigateBack = () => {
    // Optionally unlock seats if user voluntarily goes back
    if (state.lockToken && state.selectedSeats.length > 0) {
      const seatUuids = state.selectedSeats
        .map((s) => s.seatId)
        .filter(Boolean) as string[];
      if (seatUuids.length > 0) {
        unlockSeatsApi(currentShowtimeId, {
          lockToken: state.lockToken,
          seatIds: seatUuids,
        }).catch(() => {});
      }
      setLockToken(null);
    }
    navigate(-1);
  };

  return (
    <S.PageContainer>
      <S.InnerWrapper>
        {/* Top Navigation & Status Bar */}
        <S.TopBar>
          <div className="breadcrumbs">
            <div className="back-btn" onClick={handleNavigateBack}>
              <ChevronLeft size={16} />
              <span>{t('header:showtimes')}</span>
            </div>
            <span className="sep">/</span>
            <span>{state.movie.title}</span>
            <span className="sep">/</span>
            <span className="current">{t('booking:step_seats')}</span>
          </div>

          <div className="status-badges">
            <div className="timer-badge">
              <Clock size={14} />
              <span>{t('booking:holding_time_badge', { time: formattedTime })}</span>
            </div>
            <div className="live-badge">
              <div className="dot" />
              <span>{t('booking:live_system')}</span>
            </div>
          </div>
        </S.TopBar>

        {/* Main Content Grid (Left: Seat Map, Right: Summary) */}
        <S.MainContentGrid>
          {/* Left Column: Seat Map Area */}
          <S.SeatSelectionArea>
            {/* Cinema & Session Header and Curved Screen */}
            <ScreenView />

            {/* Interactive Seat Map Grid connected to backend */}
            <SeatGrid
              seats={seatMap?.seats}
              isLoading={isLoadingSeatMap}
              onSeatClick={handleSeatClick}
            />

            {/* Seat Legends with live pricing */}
            <SeatLegend
              standardPrice={legendPrices.standard}
              vipPrice={legendPrices.vip}
              sweetboxPrice={legendPrices.sweetbox}
            />

            {/* Feature Guarantees */}
            <SeatFeatures />

            {/* CineParty Group Booking CTA */}
            {isFeatureEnabled('cineParty') && (
              <button
                type="button"
                onClick={() => setIsCinePartyOpen(true)}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(255, 185, 85, 0.15) 0%, rgba(255, 83, 90, 0.15) 100%)',
                  border: '1px solid rgba(255, 185, 85, 0.4)',
                  color: '#ffb955',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '14px',
                  transition: 'all 0.2s',
                }}
              >
                <Users size={16} />
                <span>Đặt vé nhóm & Chia tiền tự động (CineParty)</span>
              </button>
            )}

            {/* CineMate Solo Matchmaker */}
            {isFeatureEnabled('cineMate') && (
              <CineMateWidget
                showtimeId={currentShowtimeId}
                selectedSeatLabel={state.selectedSeats[0]?.id}
              />
            )}
          </S.SeatSelectionArea>

          {/* Right Column: Booking Summary Sidebar */}
          <SeatSummarySidebar
            onContinue={handleContinue}
            isLocking={isLocking}
          />
        </S.MainContentGrid>
      </S.InnerWrapper>

      {/* Mobile Sticky Checkout Bar */}
      <MobileStickyBar onContinue={handleContinue} isLocking={isLocking} />

      {/* CineParty Group Modal */}
      {isFeatureEnabled('cineParty') && (
        <CinePartyModal
          isOpen={isCinePartyOpen}
          onClose={() => setIsCinePartyOpen(false)}
          showtimeId={currentShowtimeId}
        />
      )}
    </S.PageContainer>
  );
};

export default SeatSelectionPage;
