import { sanitizeErrorMessage } from '@/shared/utils/error-sanitizer';
import { useState, useEffect } from 'react';
import { DEFAULT_ACTIVE_TICKET } from '../data/active-ticket.data';
import type { ActiveTicketData } from '../data/active-ticket.data';
import { PAST_TICKETS, type PastTicketData } from '../data/past-tickets.data';
import {
  getTicketPassApi,
  getOrderByCodeApi,
  turnstileCheckInApi,
  refundTicketApi,
} from '../../api/booking.api';

export type TabType = 'upcoming' | 'history' | 'vouchers';

export function useMyTickets() {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [historyFilter, setHistoryFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active ticket initialized from localStorage or fallback
  const [activeTicket, setActiveTicket] = useState<ActiveTicketData>(() => {
    try {
      const savedTicketStr = localStorage.getItem('phimbook_active_ticket');
      if (savedTicketStr) {
        const parsed = JSON.parse(savedTicketStr);
        if (parsed && parsed.movieTitle) {
          return { ...DEFAULT_ACTIVE_TICKET, ...parsed };
        }
      }
    } catch {
      // Keep default
    }
    return DEFAULT_ACTIVE_TICKET;
  });

  // Ticket history with newly created local orders prepended
  const [pastTickets] = useState<PastTicketData[]>(() => {
    try {
      const stored = localStorage.getItem('phimbook_order_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed, ...PAST_TICKETS];
        }
      }
    } catch {
      // ignore
    }
    return PAST_TICKETS;
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    triggerToast(`Đã sao chép mã ưu đãi: ${code}`);
  };

  // Đồng bộ trạng thái vé thật từ Backend Railway khi load trang
  useEffect(() => {
    const rawCode = (
      activeTicket.orderCode ||
      (activeTicket.orderId ? activeTicket.orderId.replace(/[\s#]/g, '') : null)
    )?.trim();

    // Bỏ qua không gọi API nếu chưa có mã vé hoặc là mã vé mẫu mặc định
    if (!rawCode || rawCode === 'VN-8849204' || rawCode === 'PBK-8849204') return;

    let isMounted = true;

    // 1. Thử gọi API lấy thông tin vé điện tử theo passCode (chế độ silent để không spam toast)
    getTicketPassApi(rawCode, { silent: true })
      .then((ticketDto) => {
        if (!isMounted || !ticketDto) return;
        setActiveTicket((prev) => ({
          ...prev,
          status:
            ticketDto.status === 'VALID'
              ? 'ĐÃ THANH TOÁN THÀNH CÔNG • SẴN SÀNG VÀO RẠP'
              : ticketDto.status === 'CHECKED_IN'
                ? 'ĐÃ CHECK-IN VÀO CỬA'
                : ticketDto.status,
          movieTitle: ticketDto.movieTitle || prev.movieTitle,
          cinemaName: ticketDto.theaterName || prev.cinemaName,
          cinemaRoom: ticketDto.auditoriumName || prev.cinemaRoom,
          seats: ticketDto.seatLabel || prev.seats,
          format: ticketDto.format || prev.format,
          qrCodeValue: ticketDto.passCode || prev.qrCodeValue,
        }));
      })
      .catch(() => {
        // 2. Nếu vé chưa có mã passCode độc lập, kiểm tra trạng thái đơn hàng thật
        getOrderByCodeApi(rawCode, { silent: true })
          .then((orderDto) => {
            if (!isMounted || !orderDto) return;
            if (orderDto.status === 'PAID') {
              setActiveTicket((prev) => ({
                ...prev,
                status: 'ĐÃ THANH TOÁN THÀNH CÔNG • SẴN SÀNG VÀO RẠP',
                totalAmount: orderDto.totalAmount,
              }));
            }
          })
          .catch(() => {});
      });

    return () => {
      isMounted = false;
    };
  }, [activeTicket.orderCode, activeTicket.orderId]);

  // Xử lý mô phỏng soát vé tự động qua POST /api/v1/tickets/turnstile-checkin
  const handleTurnstileCheckIn = async () => {
    const rawCode =
      activeTicket.qrCodeValue ||
      activeTicket.orderCode ||
      activeTicket.orderId;

    if (!rawCode) {
      triggerToast('Không tìm thấy mã vé hợp lệ!');
      return;
    }

    const code = rawCode.replace(/[\s#]/g, '').trim();

    // Nếu là mã vé demo/mẫu mặc định, mô phỏng thành công trực quan trên UI
    if (code === 'PBK-8849204' || code === 'VN-8849204') {
      setActiveTicket((prev) => ({
        ...prev,
        status: 'ĐÃ CHECK-IN VÀO CỬA • CHÚC BẠN XEM PHIM VUI VẺ',
      }));
      triggerToast('Soát vé tự động thành công! Cổng vào rạp đã mở.');
      return;
    }

    try {
      const checkinResult = await turnstileCheckInApi(
        {
          passCode: code,
          deviceId: 'GATE_TURNSTILE_01',
          gateNumber: 'Cổng VIP Fast-Track 01',
        },
        { silent: true },
      );

      setActiveTicket((prev) => ({
        ...prev,
        status: 'ĐÃ CHECK-IN VÀO CỬA • CHÚC BẠN XEM PHIM VUI VẺ',
      }));
      triggerToast(
        checkinResult?.message ||
          'Soát vé tự động thành công! Cổng vào rạp đã mở.',
      );
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMsg =
        errorObj?.response?.data?.message ||
        errorObj?.message ||
        'Không thể check-in vé lúc này.';
      triggerToast(sanitizeErrorMessage(errorMsg));
    }
  };

  // Xử lý yêu cầu hoàn vé qua POST /api/v1/tickets/{passCode}/refund
  const handleRefund = async () => {
    const rawCode =
      activeTicket.qrCodeValue ||
      activeTicket.orderCode ||
      activeTicket.orderId;

    if (!rawCode) {
      triggerToast('Không tìm thấy mã vé!');
      return;
    }

    const code = rawCode.replace(/[\s#]/g, '').trim();

    // Nếu là mã vé demo/mẫu mặc định, mô phỏng hoàn vé trực quan trên UI
    if (code === 'PBK-8849204' || code === 'VN-8849204') {
      setActiveTicket((prev) => ({
        ...prev,
        status: 'ĐÃ HỦY VÉ & HOÀN TIỀN THÀNH CÔNG',
      }));
      triggerToast('Yêu cầu đổi/hoàn vé đã được hệ thống phê duyệt thành công!');
      return;
    }

    try {
      const refundResult = await refundTicketApi(code, { silent: true });
      setActiveTicket((prev) => ({
        ...prev,
        status: 'ĐÃ HỦY VÉ & HOÀN TIỀN THÀNH CÔNG',
      }));
      triggerToast(
        refundResult?.message ||
          'Yêu cầu hoàn vé đã được hệ thống phê duyệt thành công!',
      );
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMsg =
        errorObj?.response?.data?.message ||
        errorObj?.message ||
        'Không thể hoàn vé (yêu cầu trước giờ chiếu tối thiểu 60 phút)!';
      triggerToast(sanitizeErrorMessage(errorMsg));
    }
  };

  return {
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
  };
}

