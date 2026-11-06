import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Ticket,
  Clock,
  CheckCircle2,
  Film,
  Popcorn,
  Wallet,
  Download,
  Share2,
} from 'lucide-react';
import type { ActiveTicketData } from '../../data/active-ticket.data';
import { getTicketQrUrl } from '@features/booking/api/booking.api';
import * as S from './ActiveTicket.styles';

interface ActiveTicketProps {
  ticket: ActiveTicketData;
  onToast: (msg: string) => void;
  onCheckIn?: () => void;
  onRefund?: () => void;
}

export function ActiveTicket({
  ticket,
  onToast,
  onCheckIn,
  onRefund,
}: ActiveTicketProps) {
  const { t } = useTranslation();
  const qrCodeStr =
    ticket.qrCodeValue ||
    ticket.orderCode ||
    ticket.orderId?.replace('#', '').trim() ||
    'PBK-8849204';

  const backendQrUrl = getTicketQrUrl(qrCodeStr);
  const fallbackQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    qrCodeStr,
  )}&color=0d0c0f&bgcolor=ffffff`;

  const [qrSrc, setQrSrc] = useState(backendQrUrl);

  const handleAddToWallet = () => {
    onToast(t('booking:add_wallet_success', 'Đã thêm vé vào Apple / Google Wallet thành công!'));
  };

  const handleDownloadPdf = () => {
    onToast(t('booking:opening_qr', 'Đang mở mã QR vé chuẩn mã hóa từ hệ thống PhimBook...'));
    window.open(backendQrUrl, '_blank');
  };

  const handleShareTicket = () => {
    onToast(t('booking:share_link_created', 'Đã tạo liên kết vé quà tặng. Sẵn sàng chia sẻ qua Zalo/SMS!'));
  };

  const handleRequestRefund = () => {
    if (onRefund) {
      onRefund();
    } else {
      onToast(
        t('booking:refund_requested', 'Hệ thống đã ghi nhận yêu cầu đổi/hoàn vé. Hotline sẽ liên hệ trong 5 phút.'),
      );
    }
  };

  const handleSimulateCheckIn = () => {
    if (onCheckIn) {
      onCheckIn();
    } else {
      onToast(t('booking:scan_success', 'Đã mô phỏng quét mã vào cửa thành công!'));
    }
  };

  return (
    <S.UpcomingSection>
      <div className="section-top-bar">
        <div className="section-title">
          <Ticket size={20} className="icon" />
          <span>{t('booking:upcoming_badge', 'VÉ ĐIỆN TỬ SẮP XEM • XÁC NHẬN VÀO CỬA TRỰC TIẾP')}</span>
        </div>
        <div className="countdown-pill">
          <Clock size={13} />
          <span>{t('booking:starts_in', 'Suất chiếu bắt đầu sau: 02 giờ 45 phút')}</span>
        </div>
      </div>

      {/* Perforated Ticket Stub Container */}
      <S.TicketStubContainer>
        {/* Left side: Ticket Details */}
        <S.TicketLeftInfo>
          <div className="status-order-row">
            <div className="paid-status">
              <span className="dot" />
              <span>{ticket.status}</span>
            </div>
            <span className="order-id">
              {t('booking:order_code_label', 'MÃ ĐƠN HÀNG:')} <strong>{ticket.orderId}</strong>
            </span>
          </div>

          <div className="movie-block">
            <div className="poster-wrap">
              <img src={ticket.posterUrl} alt={ticket.movieTitle} />
              <span className="badge">{ticket.format}</span>
            </div>

            <div className="details-wrap">
              <div className="highlight-tag">
                <Film size={12} />
                <span>{t('booking:vip_screening', 'SUẤT CHIẾU ĐẶC BIỆT VIP')}</span>
              </div>
              <h2 className="movie-title">{ticket.movieTitle}</h2>
              <div className="movie-meta-line">
                {ticket.movieOriginalTitle} • {t('booking:subtitle_vn', 'Phụ đề tiếng Việt')} • T16
              </div>

              <div className="facts-grid">
                <div className="fact-col">
                  <span className="label">{t('booking:time_label', 'THỜI GIAN')}</span>
                  <span className="val">{ticket.showtime}</span>
                  <span className="sub">{ticket.date}</span>
                </div>
                <div className="fact-col">
                  <span className="label">{t('booking:cinema_room_label', 'RẠP & PHÒNG')}</span>
                  <span className="val">{ticket.cinemaRoom}</span>
                  <span className="sub">{ticket.cinemaName}</span>
                </div>
                <div className="fact-col">
                  <span className="label">{t('booking:seat_pos_label', 'VỊ TRÍ GHẾ')}</span>
                  <span className="val">{ticket.seats}</span>
                  <span className="sub">{ticket.seatsType}</span>
                </div>
                <div className="fact-col">
                  <span className="label">{t('booking:format_label', 'ĐỊNH DẠNG')}</span>
                  <span className="val">{ticket.format}</span>
                  <span className="sub">{t('booking:dolby_atmos_sub', 'Âm thanh Dolby Atmos')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Concessions inclusion */}
          {ticket.combo && (
            <div className="concessions-inclusion-bar">
              <Popcorn size={20} className="icon" />
              <div className="text">
                <span className="title">{ticket.combo}</span>
                <span className="sub">
                  {t('booking:combo_pickup_hint', 'Nhận trực tiếp tại quầy Fast-Track riêng hoặc nhân viên phục vụ tận ghế trước giờ chiếu 10 phút.')}
                </span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="ticket-actions-bar">
            <button
              className="action-chip"
              onClick={handleAddToWallet}
            >
              <Wallet size={14} />
              <span>{t('booking:add_to_wallet', 'Thêm vào Apple / Google Wallet')}</span>
            </button>

            <button
              className="action-chip"
              onClick={handleDownloadPdf}
            >
              <Download size={14} />
              <span>{t('booking:download_ticket', 'Tải vé PDF / Ảnh QR')}</span>
            </button>

            <button
              className="action-chip"
              onClick={handleShareTicket}
            >
              <Share2 size={14} />
              <span>{t('booking:gift_ticket', 'Tặng vé bạn bè')}</span>
            </button>

            <span
              className="refund-link"
              onClick={handleRequestRefund}
            >
              {t('booking:refund_ticket_action', 'Đổi / Hoàn vé (Còn 1h 45p)')}
            </span>
          </div>
        </S.TicketLeftInfo>

        {/* Right side: Perforated Fast-Track QR */}
        <S.TicketRightQR>
          <div className="qr-header">
            <span className="label">{t('booking:fast_track_qr_label', 'MÃ SOÁT VÉ NHANH FAST-TRACK')}</span>
            <span className="code-str">{ticket.qrCodeValue}</span>
          </div>

          <div
            className="qr-box"
            style={{ cursor: 'pointer' }}
            onClick={handleSimulateCheckIn}
            title={t('booking:click_simulate_qr', 'Nhấn để mô phỏng quét mã vào rạp Fast-Track')}
          >
            <img
              src={qrSrc}
              onError={() => setQrSrc(fallbackQrUrl)}
              alt="QR Code Soát Vé"
            />
          </div>

          <div className="qr-note">
            <span
              className="direct-tag"
              style={{ cursor: 'pointer' }}
              onClick={handleSimulateCheckIn}
              title={t('booking:click_scan_at_gate', 'Nhấn để quét mã soát vé tại cổng')}
            >
              <CheckCircle2 size={13} />
              <span>{t('booking:scan_direct_gate', 'Quét trực tiếp tại cửa (Bấm thử)')}</span>
            </span>
            <span className="instructions">
              {t('booking:qr_instructions', 'Đưa mã QR này cho nhân viên soát vé tại cửa phòng chiếu để vào rạp ngay mà không cần in vé giấy.')}
            </span>
          </div>
        </S.TicketRightQR>
      </S.TicketStubContainer>
    </S.UpcomingSection>
  );
}
