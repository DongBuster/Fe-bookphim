/**
 * ScratchTicketModal component
 * Adapted from Lucian UX/UI Prompt #320 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#320
 *
 * Canvas scratch-off mystery ticket modal in Cinema Noir Dark Luxury styling.
 */
import { useEffect, useRef, useState, type FC } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as S from './ScratchTicketModal.styles';

export interface ScratchTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimPrize?: (prizeName: string) => void;
}

const PRIZES = [
  { tag: 'ĐẶC BIỆT', value: 'VÉ 0Đ PHIM IMAX', desc: 'Áp dụng cho mọi suất chiếu trong tuần tại PHIMBOOK' },
  { tag: 'MAY MẮN', value: 'VOUCHER 50.000₫', desc: 'Trừ trực tiếp vào đơn đặt vé tiếp theo của bạn' },
  { tag: 'QUÀ TẶNG', value: 'FREE BẮP RANG BƠ', desc: 'Nhận ngay 1 phần bắp rang bơ vị Caramel tại quầy' },
  { tag: 'ƯU ĐÃI VIP', value: 'GIẢM 20% COMBO', desc: 'Giảm 20% khi mua combo bắp nước Sweetbox Couple' },
];

export const ScratchTicketModal: FC<ScratchTicketModalProps> = ({
  isOpen,
  onClose,
  onClaimPrize,
}) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [prevOpen, setPrevOpen] = useState(isOpen);

  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen);
    if (isOpen) {
      setIsRevealed(false);
      setProgress(0);
    }
  }

  const currentPrize = PRIZES[prizeIndex % PRIZES.length];

  // Canvas dimensions
  const W = 280;
  const H = 180;

  // Initialize or reset canvas coating
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // Silver metallic gradient
    ctx.globalCompositeOperation = 'source-over';
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#94A3B8');
    grad.addColorStop(0.35, '#CBD5E1');
    grad.addColorStop(0.65, '#64748B');
    grad.addColorStop(1, '#94A3B8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Hologram sparkles pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let i = 0; i < 220; i++) {
      ctx.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5);
    }

    // Diagonal texture lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let k = -H; k < W; k += 12) {
      ctx.beginPath();
      ctx.moveTo(k, 0);
      ctx.lineTo(k + H, H);
      ctx.stroke();
    }

    // Cinema Noir emblem stamp
    ctx.fillStyle = '#1E293B';
    ctx.font = '800 13px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★ PHIMBOOK LUCKY TICKET ★', W / 2, H / 2 - 12);

    ctx.font = '600 11px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('Cào nhẹ để mở quà bí ẩn', W / 2, H / 2 + 12);
  };

  useEffect(() => {
    if (isOpen) {
      initCanvas();
    }
  }, [isOpen, prizeIndex]);

  // Scratch handler
  const scratch = (x0: number, y0: number, x1: number, y1: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 28;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  };

  // Calculate scratched ratio
  const calculateRatio = (): number => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const step = 8 * dpr;
    let total = 0;
    let clear = 0;

    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        total++;
        if (data[(y * canvas.width + x) * 4 + 3] < 50) {
          clear++;
        }
      }
    }
    return total > 0 ? clear / total : 0;
  };

  const handleReveal = () => {
    if (isRevealed) return;
    setIsRevealed(true);
    setProgress(100);
    if (onClaimPrize) {
      onClaimPrize(currentPrize.value);
    }
  };

  // Pointer tracking
  const isPointerDown = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const lastCheckTime = useRef<number>(0);

  const getCanvasPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scale = W / (rect.width || 1);
    return {
      x: (e.clientX - rect.left) * scale,
      y: (e.clientY - rect.top) * scale,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isRevealed) return;
    isPointerDown.current = true;
    const pos = getCanvasPos(e);
    lastPos.current = pos;
    scratch(pos.x, pos.y, pos.x + 0.1, pos.y);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored: setPointerCapture fallback
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDown.current || isRevealed || !lastPos.current) return;
    const currentPos = getCanvasPos(e);
    scratch(lastPos.current.x, lastPos.current.y, currentPos.x, currentPos.y);
    lastPos.current = currentPos;

    const now = performance.now();
    if (now - lastCheckTime.current > 100) {
      lastCheckTime.current = now;
      const ratio = calculateRatio();
      const percent = Math.min(100, Math.round(ratio * 100));
      setProgress(percent);

      if (ratio > 0.52) {
        handleReveal();
      }
    }
  };

  const handlePointerUp = () => {
    isPointerDown.current = false;
    lastPos.current = null;
    if (!isRevealed) {
      const ratio = calculateRatio();
      if (ratio > 0.52) {
        handleReveal();
      }
    }
  };

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <S.ModalOverlay onClick={onClose} role="dialog" aria-modal="true">
      <S.ModalCard ref={containerRef} onClick={(e) => e.stopPropagation()}>
        <S.HeaderRow>
          <div className="title-group">
            <Ticket size={18} color="#FF535A" />
            <span>{t('interactive:mystery_scratch', 'Vé Cào May Mắn')}</span>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </S.HeaderRow>

        <S.TicketContainer>
          {/* Underlay Prize Display */}
          <S.PrizeUnderlay $isRevealed={isRevealed}>
            <span className="prize-tag">{currentPrize.tag}</span>
            <span className="prize-value">{currentPrize.value}</span>
            <span className="prize-desc">{currentPrize.desc}</span>
          </S.PrizeUnderlay>

          {/* Silver Scratch Canvas */}
          <S.ScratchCanvas
            ref={canvasRef}
            $isGone={isRevealed}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            tabIndex={0}
            role="button"
            aria-label="Khu vực cào vé, nhấn Enter để mở nhanh"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleReveal();
              }
            }}
          />
        </S.TicketContainer>

        <S.FooterRow>
          <span className="progress-text">
            {isRevealed ? (
              <span style={{ color: '#52B788', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Sparkles size={13} />
                {t('interactive:prize_unlocked', 'Đã mở thưởng 100%')}
              </span>
            ) : (
              `${t('interactive:scratched', 'Đã cào')}: ${progress}%`
            )}
          </span>

          <button
            type="button"
            className="action-btn"
            onClick={() => setPrizeIndex((p) => p + 1)}
          >
            {t('interactive:new_ticket', 'Đổi Vé Mới')}
          </button>
        </S.FooterRow>
      </S.ModalCard>
    </S.ModalOverlay>,
    document.body,
  );
};
