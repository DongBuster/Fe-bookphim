import { Fragment, useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MoveHorizontal } from 'lucide-react';
import { useBooking } from '../../../context/useBooking';
import type { SeatDto } from '@shared/types/api.types';
import { SeatMapSkeleton } from '@shared/components/skeleton';
import * as S from './SeatGrid.styles';

interface SeatGridProps {
  seats?: SeatDto[];
  isLoading?: boolean;
  onSeatClick: (seat: SeatDto) => void;
}

export const SeatGrid: FC<SeatGridProps> = ({
  seats = [],
  isLoading = false,
  onSeatClick,
}) => {
  const { t } = useTranslation();
  const { state } = useBooking();
  // Lucian UX/UI Prompt #106 & #278 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#106
  const [hoveredSeatId, setHoveredSeatId] = useState<string | number | null>(null);

  // Group seats by row label (A, B, C, ...)
  const rows = useMemo(() => {
    if (!seats || seats.length === 0) return [];

    const rowMap = new Map<string, SeatDto[]>();
    for (const seat of seats) {
      const row = seat.seatRow || seat.rowLabel || 'A';
      if (!rowMap.has(row)) {
        rowMap.set(row, []);
      }
      rowMap.get(row)!.push(seat);
    }

    // Sort rows alphabetically (A -> Z)
    const sortedRowKeys = Array.from(rowMap.keys()).sort();
    return sortedRowKeys.map((rowKey) => {
      const rowSeats = rowMap.get(rowKey)!;
      // Sort seats within each row by seatNumber ascending (1 -> N)
      rowSeats.sort((a, b) => a.seatNumber - b.seatNumber);
      return {
        row: rowKey,
        seats: rowSeats,
      };
    });
  }, [seats]);

  // Divide seats into 3 visual clusters separated by cinema aisles
  const clusterSeats = (rowSeats: SeatDto[]): SeatDto[][] => {
    const total = rowSeats.length;
    if (total <= 6) return [rowSeats];
    if (total <= 12) {
      const c1 = Math.floor(total / 3);
      const c2 = Math.floor(total / 3);
      return [
        rowSeats.slice(0, c1),
        rowSeats.slice(c1, c1 + c2),
        rowSeats.slice(c1 + c2),
      ];
    }
    // E.g. 15 seats -> 5 - 5 - 5
    const left = Math.ceil(total / 3);
    const center = Math.round(total / 3);
    return [
      rowSeats.slice(0, left),
      rowSeats.slice(left, left + center),
      rowSeats.slice(left + center),
    ];
  };

  if (isLoading) {
    return <SeatMapSkeleton />;
  }

  return (
    <>
      <S.MobileScrollHint>
        <MoveHorizontal size={14} />
        <span>{t('booking:scroll_hint')}</span>
      </S.MobileScrollHint>

      <S.SeatMapGrid>
        <S.SeatMapInner>
          {rows.map(({ row, seats: rowSeats }) => {
            const clusters = clusterSeats(rowSeats);

            return (
              <S.SeatRow key={row}>
                <span className="row-label">{row}</span>

                {clusters.map((cluster, clusterIdx) => (
                  <Fragment key={clusterIdx}>
                    <div className="seats-cluster">
                      {cluster.map((seat) => {
                        const seatLabel =
                          seat.seatLabel || `${row}${seat.seatNumber}`;
                        const isSold =
                          seat.status === 'BOOKED' ||
                          (seat.status === 'LOCKED' &&
                            !seat.isLockedByCurrentUser);

                        const isSelected =
                          state.selectedSeats.some(
                            (s) =>
                              s.id === seatLabel || s.seatId === seat.seatId,
                          ) || Boolean(seat.isLockedByCurrentUser);

                        const normalizedType = (
                          seat.seatType?.toLowerCase() || 'standard'
                        ) as 'standard' | 'vip' | 'sweetbox';

                        const getDisplayContent = () => {
                          if (seat.status === 'BOOKED') return '✕';
                          if (
                            seat.status === 'LOCKED' &&
                            !seat.isLockedByCurrentUser
                          )
                            return '🔒';
                          return seat.seatNumber;
                        };



                        const isHovered = hoveredSeatId === (seat.seatId || seatLabel);
                        const centerDist = Math.abs(seat.seatNumber - 6);
                        const viewScore = Math.max(76, 99 - centerDist * 4);

                        return (
                          <S.SeatBox
                            key={seat.seatId || seatLabel}
                            $type={normalizedType}
                            $isSelected={isSelected}
                            $isSold={isSold}
                            disabled={isSold}
                            onClick={() => !isSold && onSeatClick(seat)}
                            onPointerEnter={() => !isSold && setHoveredSeatId(seat.seatId || seatLabel)}
                            onPointerLeave={() => setHoveredSeatId(null)}
                            role="button"
                            tabIndex={isSold ? -1 : 0}
                            aria-label={`${seatLabel}, ${seat.seatType || 'Ghế'}, ${isSold ? 'Đã bán' : isSelected ? 'Đang chọn' : 'Còn trống'}`}
                            aria-pressed={isSelected}
                            onKeyDown={(e) => {
                              if (!isSold && (e.key === 'Enter' || e.key === ' ')) {
                                e.preventDefault();
                                onSeatClick(seat);
                              }
                            }}
                          >
                            {getDisplayContent()}
                            {isHovered && !isSold && (
                              <S.SeatPreviewTooltip>
                                <div className="seat-code">
                                  <span>{seatLabel}</span>
                                  <span
                                    className="seat-type-tag"
                                    style={{
                                      background:
                                        normalizedType === 'vip'
                                          ? 'rgba(255, 185, 85, 0.2)'
                                          : normalizedType === 'sweetbox'
                                            ? 'rgba(255, 83, 90, 0.2)'
                                            : 'rgba(255, 255, 255, 0.1)',
                                      color:
                                        normalizedType === 'vip'
                                          ? '#ffb955'
                                          : normalizedType === 'sweetbox'
                                            ? '#ff9e9e'
                                            : '#e2e8f0',
                                    }}
                                  >
                                    {seat.seatType || 'Standard'}
                                  </span>
                                </div>
                                <span className="seat-price">{seat.price.toLocaleString('vi-VN')}đ</span>
                                <span className="seat-angle-score">
                                  <span>Góc nhìn:</span>
                                  <strong style={{ color: viewScore > 90 ? '#52B788' : '#FFB955' }}>
                                    {viewScore}%
                                  </strong>
                                </span>
                              </S.SeatPreviewTooltip>
                            )}
                          </S.SeatBox>
                        );
                      })}
                    </div>

                    {clusterIdx < clusters.length - 1 && (
                      <div className="aisle-gap" />
                    )}
                  </Fragment>
                ))}

                <span className="row-label">{row}</span>
              </S.SeatRow>
            );
          })}
        </S.SeatMapInner>
      </S.SeatMapGrid>
    </>
  );
};
