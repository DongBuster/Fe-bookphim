import React, { useState, useEffect } from 'react';
import { BookingContext } from './useBooking';
import type { BookingState, SeatItem, SnackItem, VoucherItem } from './booking.types';

const getInitialRecipient = () => {
  try {
    const userInfoStr = localStorage.getItem('user_info');
    if (userInfoStr) {
      const user = JSON.parse(userInfoStr);
      return {
        name: user.fullName || localStorage.getItem('user_name') || '',
        phone: user.phone || '',
        email: user.email || '',
        isSendZalo: true,
      };
    }
  } catch {
    // fallback
  }
  return {
    name: localStorage.getItem('user_name') || '',
    phone: '',
    email: '',
    isSendZalo: true,
  };
};

const defaultState: BookingState = {
  movie: {
    id: '',
    title: '',
    originalTitle: '',
    posterUrl: '',
    backdropUrl: '',
    rating: 8.8,
    ageRating: 'P',
    duration: '',
    format: '2D Tiêu Chuẩn',
  },
  session: {
    cinemaId: '',
    cinemaName: '',
    cinemaAddress: '',
    room: '',
    date: '',
    time: '',
    format: '',
    soundSystem: 'DOLBY ATMOS',
  },
  selectedSeats: [],
  selectedSnacks: [],
  pickupMethod: 'at-seat',
  appliedVoucher: null,
  recipient: getInitialRecipient(),
  paymentMethod: 'momo',
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<BookingState>(() => {
    try {
      const saved = localStorage.getItem('phimbook_booking_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.recipient?.name === 'Nguyễn Thanh Tùng' ||
          parsed.session?.date === 'Thứ Năm, 24/10/2024'
        ) {
          return defaultState;
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return defaultState;
  });

  useEffect(() => {
    try {
      localStorage.setItem('phimbook_booking_state', JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const setMovieAndSession = (
    movie: Partial<BookingState['movie']>,
    session: Partial<BookingState['session']>,
  ) => {
    setState((prev) => {
      const showtimeChanged = Boolean(
        session.showtimeId && session.showtimeId !== prev.session.showtimeId,
      );
      return {
        ...prev,
        movie: { ...prev.movie, ...movie },
        session: { ...prev.session, ...session },
        selectedSeats: showtimeChanged ? [] : prev.selectedSeats,
        lockToken: showtimeChanged ? null : prev.lockToken,
      };
    });
  };

  const toggleSeat = (seat: SeatItem) => {
    setState((prev) => {
      const exists = prev.selectedSeats.find((s) => s.id === seat.id);
      if (exists) {
        return {
          ...prev,
          selectedSeats: prev.selectedSeats.filter((s) => s.id !== seat.id),
        };
      }
      return {
        ...prev,
        selectedSeats: [...prev.selectedSeats, seat],
      };
    });
  };

  const clearSeats = () => {
    setState((prev) => ({ ...prev, selectedSeats: [] }));
  };

  const updateSnackQuantity = (snack: SnackItem, delta: number) => {
    setState((prev) => {
      const existingIndex = prev.selectedSnacks.findIndex(
        (s) => s.id === snack.id,
      );
      if (existingIndex > -1) {
        const updated = [...prev.selectedSnacks];
        const newQty = updated[existingIndex].quantity + delta;
        if (newQty <= 0) {
          updated.splice(existingIndex, 1);
        } else {
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
          };
        }
        return { ...prev, selectedSnacks: updated };
      } else if (delta > 0) {
        return {
          ...prev,
          selectedSnacks: [
            ...prev.selectedSnacks,
            { ...snack, quantity: delta },
          ],
        };
      }
      return prev;
    });
  };

  const setPickupMethod = (method: 'at-seat' | 'fast-track') => {
    setState((prev) => ({ ...prev, pickupMethod: method }));
  };

  const applyVoucher = (voucher: VoucherItem) => {
    setState((prev) => ({ ...prev, appliedVoucher: voucher }));
  };

  const removeVoucher = () => {
    setState((prev) => ({ ...prev, appliedVoucher: null }));
  };

  const setRecipient = (recipient: Partial<BookingState['recipient']>) => {
    setState((prev) => ({
      ...prev,
      recipient: { ...prev.recipient, ...recipient },
    }));
  };

  const setPaymentMethod = (
    method: 'momo' | 'vnpay' | 'credit-card' | 'atm' | 'phimpoints',
  ) => {
    setState((prev) => ({ ...prev, paymentMethod: method }));
  };

  const calculateSeatsTotal = () => {
    return state.selectedSeats.reduce((acc, s) => acc + s.price, 0);
  };

  const calculateSnacksTotal = () => {
    return state.selectedSnacks.reduce(
      (acc, s) => acc + s.price * s.quantity,
      0,
    );
  };

  const calculateGrandTotal = () => {
    const seats = calculateSeatsTotal();
    const snacks = calculateSnacksTotal();
    const discount = state.appliedVoucher?.discount || 0;
    return Math.max(0, seats + snacks - discount);
  };

  const resetBooking = () => {
    setState(defaultState);
  };

  const setLockToken = (token: string | null) => {
    setState((prev) => ({ ...prev, lockToken: token }));
  };

  return (
    <BookingContext.Provider
      value={{
        state,
        setMovieAndSession,
        toggleSeat,
        clearSeats,
        updateSnackQuantity,
        setPickupMethod,
        applyVoucher,
        removeVoucher,
        setRecipient,
        setPaymentMethod,
        calculateSeatsTotal,
        calculateSnacksTotal,
        calculateGrandTotal,
        resetBooking,
        setLockToken,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
