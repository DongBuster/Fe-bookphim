import { useTranslation } from 'react-i18next';
import { Headphones, PhoneCall, MessageSquare } from 'lucide-react';
import * as S from '../../MyTicketsPage.styles';

interface UrgentSupportProps {
  onToast: (msg: string) => void;
}

export function UrgentSupport({ onToast }: UrgentSupportProps) {
  const { t } = useTranslation();

  const handleCallHotline = () => {
    onToast(t('booking:calling_hotline', 'Đang kết nối đến Tổng Đài Ưu Tiên PhimBook: 1900 8888...'));
  };

  const handleChatAi = () => {
    onToast(
      t('booking:cinebot_ready_toast', 'Trợ lý AI PhimBook Cine Concierge đã sẵn sàng kết nối hỗ trợ bạn!'),
    );
  };

  return (
    <S.UrgentSupportCard>
      <div className="left-meta">
        <div className="icon-box">
          <Headphones size={22} />
        </div>
        <div className="text">
          <div className="title-line">
            <span className="title">{t('booking:urgent_support_title', 'Cần hỗ trợ khẩn cấp tại rạp chiếu?')}</span>
            <span className="priority-badge">{t('booking:urgent_support_priority', 'HOTLINE ƯU TIÊN 24/7')}</span>
          </div>
          <span className="desc">
            {t(
              'booking:urgent_support_desc',
              'Đội ngũ PhimBook Concierge luôn túc trực tại tất cả cụm rạp để hỗ trợ đổi ghế, in lại vé hoặc hoàn tiền sự cố kỹ thuật trong vòng 3 phút.',
            )}
          </span>
        </div>
      </div>

      <div className="cta-buttons">
        <button
          className="hotline-btn"
          onClick={handleCallHotline}
        >
          <PhoneCall size={15} />
          <span>{t('booking:urgent_support_hotline_btn', '1900 8888 (Phím 1)')}</span>
        </button>

        <button
          className="chat-btn"
          onClick={handleChatAi}
        >
          <MessageSquare size={15} />
          <span>{t('booking:urgent_support_chat_btn', 'Chat Trợ Lý AI (CineBot)')}</span>
        </button>
      </div>
    </S.UrgentSupportCard>
  );
}
