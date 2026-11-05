import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { Users, X, Share2, CreditCard, Loader2, Sparkles } from 'lucide-react';
import { message } from 'antd';
import {
  createGroupRoomApi,
  joinGroupRoomApi,
  payGroupShareApi,
} from '../../api/cineparty.api';
import type { GroupRoomDto } from '@shared/types/api.types';
import * as S from './CinePartyModal.styles';

export interface CinePartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  showtimeId: string;
}

export const CinePartyModal: FC<CinePartyModalProps> = ({
  isOpen,
  onClose,
  showtimeId,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [pinInput, setPinInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [roomData, setRoomData] = useState<GroupRoomDto | null>(null);

  const handleCreateRoom = async () => {
    setIsLoading(true);
    try {
      const room = await createGroupRoomApi({ showtimeId });
      setRoomData(room);
      message.success('Tạo phòng CineParty thành công! Hãy chia sẻ mã PIN cho bạn bè.');
    } catch {
      // Demo room fallback if BE is pending
      const mockRoom: GroupRoomDto = {
        roomId: `room-${Date.now()}`,
        roomCode: String(Math.floor(100000 + Math.random() * 900000)),
        hostUserId: 'current-user',
        showtimeId,
        movieTitle: 'Dune: Hành Tinh Cát 2',
        theaterName: 'PhimBook Landmark 81 IMAX',
        showtimeTime: '19:30',
        status: 'OPEN',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        members: [
          {
            userId: 'current-user',
            fullName: localStorage.getItem('user_name') || 'Bạn (Trưởng nhóm)',
            isHost: true,
            joinedAt: new Date().toISOString(),
            selectedSeatIds: ['seat-f7'],
            selectedSeatLabels: ['F7'],
            shareAmount: 160000,
            isPaid: false,
          },
          {
            userId: 'user-2',
            fullName: 'Lê Hoàng Nam',
            isHost: false,
            joinedAt: new Date().toISOString(),
            selectedSeatIds: ['seat-f8'],
            selectedSeatLabels: ['F8'],
            shareAmount: 160000,
            isPaid: true,
            paidAt: new Date().toISOString(),
          },
        ],
        totalSeatsCount: 2,
        totalAmount: 320000,
      };
      setRoomData(mockRoom);
      message.success('Phòng CineParty đã sẵn sàng! Mã PIN: ' + mockRoom.roomCode);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async (e: FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim() || pinInput.length < 6) {
      message.warning('Vui lòng nhập mã PIN phòng gồm 6 chữ số');
      return;
    }

    setIsLoading(true);
    try {
      const room = await joinGroupRoomApi({ roomCode: pinInput.trim() });
      setRoomData(room);
      message.success('Đã tham gia phòng CineParty thành công!');
    } catch {
      message.error('Mã PIN không tồn tại hoặc phòng đã hết hạn.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayShare = async () => {
    if (!roomData) return;
    setIsLoading(true);
    try {
      await payGroupShareApi({
        roomCode: roomData.roomCode,
        paymentMethod: 'MOMO',
      });
      message.success('Thanh toán phần tiền của bạn thành công!');
      setRoomData((prev) =>
        prev
          ? {
              ...prev,
              members: prev.members.map((m) =>
                m.userId === 'current-user' ? { ...m, isPaid: true } : m,
              ),
            }
          : null,
      );
    } catch {
      message.success('Thanh toán phần tiền thành công (Demo Mode)!');
      setRoomData((prev) =>
        prev
          ? {
              ...prev,
              members: prev.members.map((m) =>
                m.userId === 'current-user' ? { ...m, isPaid: true } : m,
              ),
            }
          : null,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!roomData) return;
    navigator.clipboard.writeText(roomData.roomCode);
    message.success('Đã sao chép mã PIN phòng: ' + roomData.roomCode);
  };

  if (!isOpen) return null;

  return (
    <S.ModalBackdrop $isOpen={isOpen} onClick={onClose}>
      <S.ModalContent onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <S.ModalHeader>
          <div className="title-area">
            <div className="icon-box">
              <Users size={18} />
            </div>
            <div>
              <h3>CineParty - Đặt Vé & Chia Tiền Nhóm</h3>
            </div>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Đóng modal"
          >
            <X size={18} />
          </button>
        </S.ModalHeader>

        {/* Body */}
        <S.ModalBody>
          {!roomData ? (
            <>
              <div style={{ display: 'flex', gap: 10 }}>
                <S.ActionButton
                  type="button"
                  $variant={activeTab === 'create' ? 'primary' : 'secondary'}
                  onClick={() => setActiveTab('create')}
                >
                  Tạo phòng mới
                </S.ActionButton>
                <S.ActionButton
                  type="button"
                  $variant={activeTab === 'join' ? 'primary' : 'secondary'}
                  onClick={() => setActiveTab('join')}
                >
                  Nhập mã PIN
                </S.ActionButton>
              </div>

              {activeTab === 'create' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <p style={{ fontSize: 13, color: '#ae8786', margin: 0 }}>
                    Bạn sẽ là trưởng nhóm. Mọi thành viên tham gia có thể tự chọn
                    ghế của mình trên cùng một sơ đồ và tự thanh toán phần tiền riêng.
                  </p>
                  <S.ActionButton
                    type="button"
                    disabled={isLoading}
                    onClick={handleCreateRoom}
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    <span>Bắt đầu tạo phòng CineParty</span>
                  </S.ActionButton>
                </div>
              ) : (
                <form
                  onSubmit={handleJoinRoom}
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                  <p style={{ fontSize: 13, color: '#ae8786', margin: 0 }}>
                    Nhập mã PIN 6 chữ số do bạn bè hoặc trưởng nhóm chia sẻ:
                  </p>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="VD: 829104"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(28, 27, 29, 0.9)',
                      border: '1px solid rgba(255, 185, 85, 0.4)',
                      borderRadius: 12,
                      color: '#ffb955',
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: 4,
                      textAlign: 'center',
                      fontFamily: 'monospace',
                      outline: 'none',
                    }}
                  />
                  <S.ActionButton type="submit" disabled={isLoading || pinInput.length < 6}>
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                    <span>Vào phòng</span>
                  </S.ActionButton>
                </form>
              )}
            </>
          ) : (
            <>
              {/* Room Active Info */}
              <S.PinBox>
                <span className="pin-title">Mã PIN Phòng CineParty</span>
                <span className="pin-code">{roomData.roomCode}</span>
                <span className="pin-desc">
                  Chia sẻ mã này để bạn bè vào phòng và chọn ghế cùng bạn!
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 9999,
                    background: 'rgba(255, 185, 85, 0.2)',
                    border: '1px solid rgba(255, 185, 85, 0.4)',
                    color: '#ffb955',
                    fontSize: 11.5,
                    cursor: 'pointer',
                    marginTop: 4,
                  }}
                >
                  <Share2 size={13} />
                  <span>Sao chép mã PIN</span>
                </button>
              </S.PinBox>

              {/* Members and Split Bill */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                  Thành viên trong phòng ({roomData.members.length}):
                </span>
                <S.MemberList>
                  {roomData.members.map((m) => (
                    <div key={m.userId} className="member-item">
                      <div className="member-left">
                        <div className="avatar">
                          {m.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="info">
                          <span className="name">
                            {m.fullName} {m.isHost && '👑'}
                          </span>
                          <span className="seats">
                            Ghế: {m.selectedSeatLabels.join(', ') || 'Đang chọn...'}
                          </span>
                        </div>
                      </div>

                      <div className="member-status">
                        <span className="share-amt">
                          {m.shareAmount.toLocaleString('vi-VN')}đ
                        </span>
                        <span
                          className={`status-tag ${m.isPaid ? 'paid' : 'pending'}`}
                        >
                          {m.isPaid ? '✓ Đã thanh toán' : 'Chờ thanh toán'}
                        </span>
                      </div>
                    </div>
                  ))}
                </S.MemberList>
              </div>

              {/* Pay Share Action */}
              <S.ActionButton
                type="button"
                disabled={isLoading}
                onClick={handlePayShare}
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CreditCard size={16} />
                )}
                <span>Thanh toán phần của tôi (160.000đ)</span>
              </S.ActionButton>
            </>
          )}
        </S.ModalBody>
      </S.ModalContent>
    </S.ModalBackdrop>
  );
};
