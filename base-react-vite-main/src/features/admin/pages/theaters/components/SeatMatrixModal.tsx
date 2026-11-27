import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { Spin, Button, Space, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wrench, CheckCircle2 } from 'lucide-react';
import { getRoomSeatMatrixApi, updateRoomSeatsStatusApi } from '@features/admin/api/admin-theaters.api';
import type { RoomSeatMatrixDto } from '@features/admin/types/admin.types';
import { AdminBaseModal } from '@features/admin/components/AdminBaseModal';
import { adminDangerButtonStyle, adminPrimaryButtonStyle } from '@features/admin/styles/adminUi';

type SeatItem = RoomSeatMatrixDto['seats'][number];

export interface SeatMatrixModalProps {
  open: boolean;
  onClose: () => void;
  roomId?: string | null;
  roomName?: string;
}

export const SeatMatrixModal: FC<SeatMatrixModalProps> = ({
  open,
  onClose,
  roomId,
  roomName,
}) => {
  const queryClient = useQueryClient();
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setSelectedSeatIds([]);
    }
  }, [open, roomId]);

  const { data: matrix, isLoading } = useQuery({
    queryKey: ['admin', 'rooms', roomId, 'seat-matrix'],
    queryFn: () => getRoomSeatMatrixApi(roomId!),
    enabled: Boolean(open && roomId),
  });

  const statusMutation = useMutation({
    mutationFn: (status: 'ACTIVE' | 'MAINTENANCE') =>
      updateRoomSeatsStatusApi(roomId!, {
        seatIds: selectedSeatIds,
        status,
        reason: status === 'MAINTENANCE' ? 'Bảo trì từ Admin' : undefined,
      }),
    onSuccess: (_, status) => {
      message.success(
        status === 'MAINTENANCE'
          ? `Đã chuyển ${selectedSeatIds.length} ghế sang Bảo trì`
          : `Đã kích hoạt lại ${selectedSeatIds.length} ghế`,
      );
      setSelectedSeatIds([]);
      queryClient.invalidateQueries({ queryKey: ['admin', 'rooms', roomId, 'seat-matrix'] });
    },
    onError: (err: unknown) => {
      message.error(err instanceof Error ? err.message : 'Không thể cập nhật trạng thái ghế');
    },
  });

  const toggleSeatSelection = (seatId: string) => {
    setSelectedSeatIds((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId],
    );
  };

  // Group seats by rowLabel
  const rowsMap = useMemo(() => {
    const seats = matrix?.seats;
    if (!seats) return new Map<string, SeatItem[]>();
    const map = new Map<string, SeatItem[]>();
    seats.forEach((seat) => {
      const row = seat.rowLabel;
      if (!map.has(row)) {
        map.set(row, []);
      }
      map.get(row)!.push(seat);
    });
    // Sort each row by seatNumber
    map.forEach((seatList) => {
      seatList.sort((a, b) => a.seatNumber - b.seatNumber);
    });
    return map;
  }, [matrix]);

  const getSeatColor = (seat: SeatItem, isSelected: boolean) => {
    if (isSelected) {
      return { bg: '#38BDF8', color: '#0B0C0E', border: '#FFFFFF' };
    }
    if (seat.status === 'MAINTENANCE') {
      return { bg: '#334155', color: '#94A3B8', border: '#F59E0B' };
    }
    const t = seat.seatType?.toUpperCase();
    if (t === 'VIP') {
      return { bg: '#FFB955', color: '#000000', border: '#FFB955' };
    }
    if (t === 'SWEETBOX' || t === 'COUPLE') {
      return { bg: '#FF535A', color: '#FFFFFF', border: '#FF535A' };
    }
    return { bg: '#1E222D', color: '#E5E7EB', border: '#3A4258' };
  };

  return (
    <AdminBaseModal
      title={
        <div style={{ color: '#FFFFFF' }}>
          <span style={{ fontWeight: 700, fontSize: 17 }}>Sơ Đồ Ghế Phòng Chiếu</span>
          {roomName && <span style={{ color: '#FFB955', marginLeft: 8 }}>— {roomName}</span>}
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button
          key="close"
          danger
          className="admin-btn-danger"
          onClick={onClose}
          style={adminDangerButtonStyle}
        >
          Đóng
        </Button>,
      ]}
      width={800}
    >
      {isLoading ? (
        <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin tip="Đang tải sơ đồ ghế..." />
        </div>
      ) : !matrix || rowsMap.size === 0 ? (
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A0A6B8' }}>
          Không có dữ liệu sơ đồ ghế cho phòng chiếu này.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          {/* Screen illustration */}
          <div style={{ width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: '100%',
                height: 8,
                background: 'linear-gradient(90deg, rgba(255, 185, 85, 0.2) 0%, #FFB955 50%, rgba(255, 185, 85, 0.2) 100%)',
                borderRadius: 4,
                boxShadow: '0 0 12px rgba(255, 185, 85, 0.4)',
              }}
            />
            <span style={{ fontSize: 11, letterSpacing: 2, color: '#A0A6B8', textTransform: 'uppercase' }}>
              Màn Hình Chính
            </span>
          </div>

          {/* Seat Grid */}
          <div
            style={{
              overflowX: 'auto',
              maxWidth: '100%',
              padding: '16px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {Array.from(rowsMap.entries()).map(([rowLabel, seats]) => (
              <div key={rowLabel} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 20,
                    textAlign: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#A0A6B8',
                  }}
                >
                  {rowLabel}
                </span>

                <div style={{ display: 'flex', gap: 6 }}>
                  {seats.map((seat) => {
                    const isSelected = selectedSeatIds.includes(seat.seatId);
                    const style = getSeatColor(seat, isSelected);
                    const isCouple = seat.seatType?.toUpperCase() === 'SWEETBOX' || seat.seatType?.toUpperCase() === 'COUPLE';
                    return (
                      <div
                        key={seat.seatId}
                        onClick={() => toggleSeatSelection(seat.seatId)}
                        title={`Ghế ${seat.rowLabel}${seat.seatNumber} (${seat.seatType})${seat.status === 'MAINTENANCE' ? ' - Đang bảo trì' : ''}`}
                        style={{
                          width: isCouple ? 58 : 28,
                          height: 28,
                          borderRadius: 4,
                          background: style.bg,
                          color: style.color,
                          border: `1px solid ${style.border}`,
                          fontSize: 11,
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          userSelect: 'none',
                          cursor: 'pointer',
                          opacity: seat.status === 'MAINTENANCE' && !isSelected ? 0.7 : 1,
                        }}
                      >
                        {seat.seatNumber}
                      </div>
                    );
                  })}
                </div>

                <span
                  style={{
                    width: 20,
                    textAlign: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#A0A6B8',
                  }}
                >
                  {rowLabel}
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
              paddingTop: 12,
              borderTop: '1px solid #252A36',
              width: '100%',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 3,
                  background: '#1E222D',
                  border: '1px solid #323846',
                }}
              />
              <span style={{ fontSize: 12, color: '#A0A6B8' }}>Ghế Thường (Standard)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 3,
                  background: '#FFB955',
                  border: '1px solid #FFB955',
                }}
              />
              <span style={{ fontSize: 12, color: '#A0A6B8' }}>Ghế VIP</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 18,
                  borderRadius: 3,
                  background: '#FF535A',
                  border: '1px solid #FF535A',
                }}
              />
              <span style={{ fontSize: 12, color: '#A0A6B8' }}>Ghế Đôi (Sweetbox)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 3,
                  background: '#334155',
                  border: '1px solid #F59E0B',
                }}
              />
              <span style={{ fontSize: 12, color: '#CBD5E1' }}>Đang Bảo Trì</span>
            </div>

            <div style={{ fontSize: 12, color: '#94A3B8' }}>
              Tổng: <strong style={{ color: '#FFFFFF' }}>{matrix.seats.length}</strong> ghế ({matrix.totalRows} hàng x {matrix.totalColumns} cột)
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '10px 14px',
              background: '#1E222E',
              border: '1px solid #3A4258',
              borderRadius: 8,
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 13, color: '#CBD5E1' }}>
              {selectedSeatIds.length > 0 ? (
                <>
                  Đã chọn <strong style={{ color: '#FFB955' }}>{selectedSeatIds.length}</strong> ghế
                </>
              ) : (
                'Click vào ghế để chọn và cập nhật trạng thái bảo trì'
              )}
            </span>
            <Space>
              <Button
                size="small"
                icon={<CheckCircle2 size={14} />}
                disabled={selectedSeatIds.length === 0}
                loading={statusMutation.isPending}
                onClick={() => statusMutation.mutate('ACTIVE')}
                style={adminPrimaryButtonStyle}
              >
                Mở Hoạt Động
              </Button>
              <Button
                size="small"
                danger
                icon={<Wrench size={14} />}
                disabled={selectedSeatIds.length === 0}
                loading={statusMutation.isPending}
                onClick={() => statusMutation.mutate('MAINTENANCE')}
                style={adminDangerButtonStyle}
              >
                Đánh Dấu Bảo Trì
              </Button>
            </Space>
          </div>
        </div>
      )}
    </AdminBaseModal>
  );
};

export default SeatMatrixModal;
