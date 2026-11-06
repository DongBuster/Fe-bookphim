import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import * as S from './MyTicketsPage.styles';
import { useMyTickets } from './hooks/useMyTickets';
import { VOUCHERS } from './data/past-tickets.data';
import { ActiveTicket } from './components/ActiveTicket/ActiveTicket';
import { TicketHistory } from './components/TicketHistory/TicketHistory';
import { VouchersSection } from './components/VouchersSection/VouchersSection';
import { UrgentSupport } from './components/UrgentSupport/UrgentSupport';

export default function MyTicketsPage() {
  const { t } = useTranslation();
  const {
    activeTab,
    setActiveTab,
    historyFilter,
    setHistoryFilter,
    activeTicket,
    pastTickets,
    toastMessage,
    triggerToast,
    handleCopyCode,
    handleTurnstileCheckIn,
    handleRefund,
  } = useMyTickets();

  const handleSelectTab = (tab: 'upcoming' | 'history' | 'vouchers') => () => {
    setActiveTab(tab);
  };

  const handleViewAllHistory = () => {
    setActiveTab('history');
  };

  return (
    <S.PageContainer>
      <S.InnerWrapper>
        {/* Page Header */}
        <S.PageHeader>
          <div className="title-meta">
            <span className="sub-tag">CINEPASS LUXURY SERVICE</span>
            <div className="title-row">
              <h1>{t('booking:my_tickets_title')}</h1>
              <span className="eng-sub">/ My Tickets &amp; Passes</span>
            </div>
          </div>

          <div className="tabs-group">
            <S.TabPill
              $isActive={activeTab === 'upcoming'}
              onClick={handleSelectTab('upcoming')}
            >
              {t('booking:tickets_upcoming')} ( {activeTicket ? 1 : 0} )
            </S.TabPill>
            <S.TabPill
              $isActive={activeTab === 'history'}
              onClick={handleSelectTab('history')}
            >
              {t('booking:tickets_history')} ( {pastTickets.length} )
            </S.TabPill>
            <S.TabPill
              $isActive={activeTab === 'vouchers'}
              onClick={handleSelectTab('vouchers')}
            >
              {t('booking:tickets_vouchers')} ( {VOUCHERS.length} )
            </S.TabPill>
          </div>
        </S.PageHeader>

        {/* TAB 1: VÉ SẮP XEM */}
        {activeTab === 'upcoming' && (
          <>
            <ActiveTicket
              ticket={activeTicket}
              onToast={triggerToast}
              onCheckIn={handleTurnstileCheckIn}
              onRefund={handleRefund}
            />

            {/* Teaser lịch sử gần đây */}
            <TicketHistory
              tickets={pastTickets.slice(0, 3)}
              title={t('booking:recent_history_title', 'Lịch Sử Đặt Vé Gần Đây')}
              subtitle={t(
                'booking:recent_history_subtitle',
                'Các tác phẩm điện ảnh đỉnh cao bạn đã thưởng thức tại hệ thống PhimBook',
              )}
              historyFilter={historyFilter}
              onFilterChange={setHistoryFilter}
              onToast={triggerToast}
              onViewAll={handleViewAllHistory}
            />
          </>
        )}

        {/* TAB 2: LỊCH SỬ ĐẶT VÉ TOÀN DIỆN */}
        {activeTab === 'history' && (
          <TicketHistory
            tickets={pastTickets}
            title={t('booking:full_history_title', {
              defaultValue: 'Toàn Bộ Lịch Sử Đặt Vé ( {{count}} Buổi Chiếu )',
              count: pastTickets.length,
            })}
            subtitle={t(
              'booking:full_history_subtitle',
              'Lưu trữ vĩnh viễn các giao dịch, đánh giá phim và điểm thưởng CinePass',
            )}
            historyFilter={historyFilter}
            onFilterChange={setHistoryFilter}
            onToast={triggerToast}
            exportLabel={t('booking:export_vat_label', 'Xuất Hóa Đơn VAT')}
            exportToast={t('booking:export_vat_toast', 'Đang xuất tệp hóa đơn điện tử VAT (.pdf)...')}
          />
        )}

        {/* TAB 3: VOUCHER & ƯU ĐÃI */}
        {activeTab === 'vouchers' && (
          <VouchersSection vouchers={VOUCHERS} onCopyCode={handleCopyCode} />
        )}

        {/* 24/7 Urgent Support */}
        <UrgentSupport onToast={triggerToast} />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <S.ToastNotification>
            <Sparkles size={16} className="toast-icon" />
            <span>{toastMessage}</span>
          </S.ToastNotification>
        )}
      </S.InnerWrapper>
    </S.PageContainer>
  );
}
