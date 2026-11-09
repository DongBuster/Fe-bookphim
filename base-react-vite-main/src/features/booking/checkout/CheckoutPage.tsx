import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Lock } from 'lucide-react';
import { message } from '@config/notification';
import { toast } from '@config/notification';
import { useTranslation } from 'react-i18next';
import { useBooking } from '../context/useBooking';
import { useBookingTimer } from '../hooks/useBookingTimer';
import {
  createOrderApi,
  checkoutPaymentApi,
  lockSeatsApi,
} from '../api/booking.api';
import {
  PaymentMethodType,
  type OrderDto,
  type PaymentCheckoutResponseData,
} from '@shared/types/api.types';
import { RecipientForm } from './components/RecipientForm/RecipientForm';
import { PaymentMethods } from './components/PaymentMethods/PaymentMethods';
import { OrderSummary } from './components/OrderSummary/OrderSummary';
import tokenManager from '@shared/utils/tokenManager';
import { PaymentModal } from './components/PaymentModal';
import { sanitizeShowtimeId } from '../api/booking.api';
import * as S from './CheckoutPage.styles';

export const CheckoutPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    state,
    applyVoucher,
    calculateGrandTotal,
    clearSeats,
    setLockToken,
  } = useBooking();

  // Guard: Redirect if no seats are selected
  useEffect(() => {
    if (state.selectedSeats.length === 0) {
      navigate('/booking/seat-selection', { replace: true });
    }
  }, [state.selectedSeats.length, navigate]);

  const { formattedTime } = useBookingTimer(433); // 07:13

  const [voucherCode, setVoucherCode] = useState('');
  const [isAgreed, setIsAgreed] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal data for QR/external payment (MoMo, VNPAY, Credit Card)
  const [paymentModalData, setPaymentModalData] = useState<{
    order: OrderDto;
    payment: PaymentCheckoutResponseData;
  } | null>(null);

  const grandTotal = calculateGrandTotal();
  const seatNames = state.selectedSeats.map((s) => s.id).join(', ');

  const mapPaymentMethod = (method: string): PaymentMethodType => {
    switch (method) {
      case 'momo':
        return PaymentMethodType.MOMO;
      case 'vnpay':
      case 'atm':
        return PaymentMethodType.VNPAY;
      case 'credit-card':
        return PaymentMethodType.CREDIT_CARD;
      case 'phimpoints':
        return PaymentMethodType.QUICK_PAY;
      default:
        return PaymentMethodType.MOMO;
    }
  };

  const saveTicketToLocalStorage = (
    order: OrderDto,
    payment?: PaymentCheckoutResponseData,
  ) => {
    const newTicket = {
      orderId: `#${order.orderCode || 'VN-SUCCESS'}`,
      orderCode: order.orderCode,
      backendOrderId: order.orderId,
      status: 'ĐÃ THANH TOÁN THÀNH CÔNG • SẴN SÀNG VÀO RẠP',
      paymentMethod: payment?.paymentMethod || state.paymentMethod,
      movieTitle: state.movie.title,
      movieOriginalTitle: state.movie.originalTitle,
      posterUrl: state.movie.posterUrl,
      cinemaName: state.session.cinemaName,
      cinemaRoom: state.session.room,
      showtime: state.session.time,
      date: state.session.date,
      format: state.session.format,
      seats: seatNames || 'Ghế tiêu chuẩn',
      seatsType: state.selectedSeats.some((s) => s.type === 'vip')
        ? 'VIP Prime Center'
        : state.selectedSeats.some((s) => s.type === 'sweetbox')
          ? 'Sweetbox Couple'
          : 'Tiêu Chuẩn (Standard)',
      combo:
        state.selectedSnacks.length > 0
          ? state.selectedSnacks.map((s) => `${s.quantity}x ${s.name}`).join(', ')
          : 'Không kèm bắp nước',
      totalAmount: order.totalAmount || grandTotal,
      qrCodeValue: order.orderCode || 'PBK-SUCCESS',
    };

    try {
      localStorage.setItem(
        'phimbook_active_ticket',
        JSON.stringify(newTicket),
      );

      // Lưu thêm vào danh sách lịch sử đặt vé phimbook_order_history
      const historyItem = {
        id: order.orderId || 'order-' + Date.now(),
        movieName: `${state.movie.title} (${state.movie.format || '2D'})`,
        genre: `${state.movie.ageRating} • ${state.movie.duration}`,
        poster: state.movie.posterUrl,
        date: `${state.session.date} • ${state.session.time}`,
        cinema: `${state.session.cinemaName} - ${state.session.room}`,
        cost: `${(order.totalAmount || grandTotal).toLocaleString('vi-VN')}đ`,
        seats: seatNames || 'Ghế tiêu chuẩn',
        rating: 5,
      };

      const existingHistoryStr = localStorage.getItem('phimbook_order_history');
      const existingHistory = existingHistoryStr ? JSON.parse(existingHistoryStr) : [];
      localStorage.setItem(
        'phimbook_order_history',
        JSON.stringify([historyItem, ...existingHistory]),
      );
    } catch {
      // ignore
    }
  };

  const handleApplyVoucher = (codeToApply?: string) => {
    const code = (codeToApply || voucherCode).trim().toUpperCase();
    if (code === 'GIAM30K') {
      applyVoucher({
        code: 'GIAM30K',
        discount: 30000,
        title: 'Giảm 30K combo phim bom tấn',
      });
    } else if (code === 'TECHCOMVIP') {
      applyVoucher({
        code: 'TECHCOMVIP',
        discount: Math.round(grandTotal * 0.15) || 45000,
        title: 'Giảm 15% khi thanh toán thẻ Techcombank',
      });
    }
  };

  const handleCompleteOrder = async () => {
    // 0. Bắt buộc đăng nhập trước khi tạo đơn và thanh toán
    const accessToken = tokenManager.getAccessToken();
    if (!accessToken) {
      message.warning(t('booking:login_required_checkout'));
      navigate('/login', { state: { from: '/booking/checkout' } });
      return;
    }

    if (!isAgreed) {
      message.warning(t('booking:terms_required'));
      return;
    }
    if (!state.recipient.name.trim() || !state.recipient.phone.trim()) {
      message.warning(t('booking:recipient_required'));
      return;
    }
    if (state.selectedSeats.length === 0) {
      message.warning(t('booking:select_seats_required'));
      navigate('/booking/seat-selection');
      return;
    }

    const showtimeId = sanitizeShowtimeId(state.session.showtimeId);

    const seatIds = state.selectedSeats
      .map((s) => s.seatId)
      .filter(Boolean) as string[];

    if (seatIds.length === 0) {
      message.error(t('booking:invalid_seat_info'));
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Kiểm tra & đảm bảo lockToken hợp lệ
      let activeLockToken = state.lockToken;
      if (!activeLockToken) {
        const lockRes = await lockSeatsApi(showtimeId, {
          seatIds,
          lockToken: null,
        });
        if (lockRes && lockRes.success) {
          activeLockToken = lockRes.lockToken;
          setLockToken(lockRes.lockToken);
        } else {
          toast.error(lockRes?.message || t('booking:cannot_lock_seats'));
          setIsProcessing(false);
          return;
        }
      }

      // 2. Tạo đơn hàng qua POST /api/v1/orders
      const voucherToUse =
        state.appliedVoucher?.code ||
        (voucherCode.trim() ? voucherCode.trim() : undefined);

      const order = await createOrderApi({
        showtimeId,
        lockToken: activeLockToken,
        seatIds,
        voucherCode: voucherToUse,
      });

      if (!order?.orderId) {
        throw new Error('Không nhận được mã đơn hàng từ hệ thống.');
      }

      // 3. Khởi tạo thanh toán qua POST /api/v1/payments/checkout
      const targetPaymentMethod = mapPaymentMethod(state.paymentMethod);
      const payment = await checkoutPaymentApi({
        orderId: order.orderId,
        paymentMethod: targetPaymentMethod,
        returnUrl: `${window.location.origin}/ve-cua-toi`,
      });

      // 4. Xử lý kết quả thanh toán
      if (payment.status === 'PAID') {
        // Quick-Pay hoặc tự động khớp thanh toán thành công
        message.success(
          t('booking:quick_pay_success', { code: order.orderCode }),
        );
        saveTicketToLocalStorage(order, payment);
        clearSeats();
        setLockToken(null);
        navigate('/ve-cua-toi');
      } else if (payment.qrCodeUrl || payment.paymentUrl) {
        // Cổng MoMo / VNPAY: mở Modal hiển thị QR Code & link thanh toán
        setPaymentModalData({
          order,
          payment,
        });
      } else {
        message.success(
          t('booking:payment_order_init', { code: order.orderCode }),
        );
        saveTicketToLocalStorage(order, payment);
        clearSeats();
        setLockToken(null);
        navigate('/ve-cua-toi');
      }
    } catch (err: unknown) {
      console.error('Lỗi thanh toán:', err);
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
          t('booking:payment_failed_toast');
        toast.error(errorMsg);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentConfirmed = () => {
    if (paymentModalData) {
      message.success(t('booking:payment_confirmed_toast'));
      saveTicketToLocalStorage(
        paymentModalData.order,
        paymentModalData.payment,
      );
      clearSeats();
      setLockToken(null);
      setPaymentModalData(null);
      navigate('/ve-cua-toi');
    }
  };

  const handleClosePaymentModal = () => {
    setPaymentModalData(null);
  };

  const handleNavigateToMovieDetails = () => {
    navigate('/movie-details');
  };

  const handleNavigateToSeatSelection = () => {
    navigate('/booking/seat-selection');
  };

  const handleNavigateToSnacks = () => {
    navigate('/booking/snacks-services');
  };

  return (
    <S.PageContainer>
      <S.InnerWrapper>
        {/* Top Stepper & Countdown Bar */}
        <S.TopBar>
          <S.StepperRow>
            <div
              className="step-item completed"
              onClick={handleNavigateToMovieDetails}
            >
              <div className="step-num">✓</div>
              <span>{t('booking:step_showtime')}</span>
            </div>
            <span className="step-arrow">&gt;</span>

            <div
              className="step-item completed"
              onClick={handleNavigateToSeatSelection}
            >
              <div className="step-num">✓</div>
              <span>{t('booking:step_seats')}</span>
            </div>
            <span className="step-arrow">&gt;</span>

            <div
              className="step-item completed"
              onClick={handleNavigateToSnacks}
            >
              <div className="step-num">✓</div>
              <span>{t('booking:step_snacks')}</span>
            </div>
            <span className="step-arrow">&gt;</span>

            <div className="step-item active">
              <div className="step-num">
                <Lock size={11} />
              </div>
              <span>{t('booking:step_checkout')}</span>
            </div>
          </S.StepperRow>

          <S.TimerBadge>
            <Clock size={14} />
            <span>{t('booking:checkout_time_badge', { time: formattedTime })}</span>
          </S.TimerBadge>
        </S.TopBar>

        {/* Main 2-Column Grid */}
        <S.MainGrid>
          {/* Left Column: Form Details & Payment Methods */}
          <S.LeftContent>
            <RecipientForm />
            <PaymentMethods
              voucherCode={voucherCode}
              onVoucherCodeChange={setVoucherCode}
              onApplyVoucher={handleApplyVoucher}
              isAgreed={isAgreed}
              onToggleAgreed={setIsAgreed}
            />
          </S.LeftContent>

          {/* Right Column: Phiếu Xác Nhận Vé */}
          <OrderSummary
            isAgreed={isAgreed}
            isProcessing={isProcessing}
            onCompleteOrder={handleCompleteOrder}
          />
        </S.MainGrid>
      </S.InnerWrapper>

      {/* MoMo / VNPAY QR Code & Gateway Modal */}
      {paymentModalData && (
        <PaymentModal
          isOpen={Boolean(paymentModalData)}
          onClose={handleClosePaymentModal}
          order={paymentModalData.order}
          payment={paymentModalData.payment}
          onPaymentConfirmed={handlePaymentConfirmed}
        />
      )}
    </S.PageContainer>
  );
};

export default CheckoutPage;

