import type { ScreenType, AgeRating, OrderStatus, PaymentMethodType } from '@shared/types/api.types';

export type UserRole = 'CUSTOMER' | 'STAFF' | 'MANAGER' | 'ADMIN';
export type UserAccountStatus = 'ACTIVE' | 'LOCKED';
export type MembershipTier = 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface UserAdminDto {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserAccountStatus;
  membershipTier?: MembershipTier | string;
  loyaltyPoints?: number;
  assignedTheaterId?: string | null;
  assignedTheaterName?: string | null;
  lockedReason?: string | null;
  createdAt: string;
}

export interface UserDetailAdminDto extends UserAdminDto {
  totalBookings: number;
  totalSpent: number;
  recentBookings: BookingAdminDto[];
}

export interface CreateStaffRequestDto {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: Extract<UserRole, 'STAFF' | 'MANAGER' | 'ADMIN'>;
  assignedTheaterId?: string;
}

export interface RevenueReportDto {
  totalRevenue: number;
  ticketRevenue: number;
  concessionRevenue: number;
  refundedAmount: number;
  netRevenue: number;
  items: {
    period: string;
    theaterName?: string;
    ticketsSold: number;
    ticketRevenue: number;
    concessionRevenue: number;
    refundedAmount: number;
    netRevenue: number;
  }[];
}

export interface PaymentMethodReportDto {
  paymentMethod: string;
  transactionCount: number;
  totalAmount: number;
  refundedAmount: number;
}

export interface BannerAdminDto {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  displayOrder: number;
  isActive: boolean;
  startAt?: string;
  endAt?: string;
}

export interface UpsertBannerDto {
  title: string;
  imageUrl: string;
  linkUrl?: string;
  displayOrder: number;
  isActive: boolean;
  startAt?: string;
  endAt?: string;
}

export interface ReviewAdminDto {
  id: string;
  movieId: string;
  movieTitle: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  isHidden: boolean;
  createdAt: string;
}

export interface SystemSettingsDto {
  seatHoldMinutes: number;
  weekendSurchargePercent: number;
  imaxSurchargePercent: number;
  refundDeadlineHours: number;
  bookingFeePercent: number;
}

export interface AuditLogDto {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole | string;
  action: string;
  resourceType: string;
  targetId?: string;
  summary: string;
  ipAddress?: string;
  createdAt: string;
}

export interface DashboardOverviewDto {
  todayRevenue: number;
  todayTicketsSold: number;
  avgOccupancyRate: number;
  activeShowtimesToday: number;
  revenueChangePercent: number;
  ticketsChangePercent: number;
}

export interface RevenueChartDto {
  labels: string[];
  ticketRevenue: number[];
  concessionRevenue: number[];
  totalRevenue: number[];
}

export interface TopMovieRevenueDto {
  movieId: string;
  title: string;
  posterUrl: string;
  ticketsSold: number;
  revenue: number;
}

export interface MovieAdminDto {
  id: string;
  title: string;
  slug: string;
  originalTitle?: string;
  synopsis: string;
  trailerUrl?: string;
  posterUrl: string;
  bannerUrl?: string;
  director?: string;
  cast: string[];
  genres: string[];
  formats: string[];
  durationMinutes: number;
  ageRating: AgeRating | string;
  releaseDate: string;
  status: 'NOW_SHOWING' | 'COMING_SOON' | 'STOPPED';
  imdbRating?: number;
  totalTicketsSold: number;
  totalRevenue: number;
}

export interface CreateMovieRequestDto {
  title: string;
  originalTitle?: string;
  synopsis: string;
  trailerUrl?: string;
  posterUrl: string;
  bannerUrl?: string;
  director?: string;
  cast: string[];
  genres: string[];
  formats: string[];
  durationMinutes: number;
  ageRating: AgeRating | string;
  releaseDate: string;
  status: 'NOW_SHOWING' | 'COMING_SOON';
}

export type UpdateMovieRequestDto = Partial<CreateMovieRequestDto>;

export interface RoomDto {
  roomId: string;
  roomName: string;
  screenType: ScreenType | string;
  totalSeats: number;
  theaterId: string;
}

export interface TheaterWithRoomsDto {
  theaterId: string;
  theaterName: string;
  address: string;
  city: string;
  rooms: RoomDto[];
}

export interface RoomSeatMatrixDto {
  roomId: string;
  roomName: string;
  totalRows: number;
  totalColumns: number;
  seats: {
    seatId: string;
    rowLabel: string;
    seatNumber: number;
    seatType: string;
    status?: 'ACTIVE' | 'MAINTENANCE';
    maintenanceNote?: string;
  }[];
}

export interface CreateRoomDto {
  theaterId: string;
  roomName: string;
  screenType: ScreenType | string;
  totalRows: number;
  totalColumns: number;
}

export interface ShowtimeAdminDto {
  showtimeId: string;
  movieId: string;
  movieTitle: string;
  roomId: string;
  roomName: string;
  theaterId: string;
  theaterName: string;
  startTime: string;
  endTime: string;
  format: ScreenType | string;
  basePrice: number;
  vipPrice: number;
  sweetboxPrice: number;
  ticketsSold: number;
  totalSeats: number;
  occupancyRate: number;
}

export interface CreateShowtimeDto {
  movieId: string;
  roomId: string;
  startTime: string;
  format: ScreenType | string;
  basePrice: number;
  vipPrice: number;
  sweetboxPrice: number;
}

export type UpdateShowtimeDto = Pick<CreateShowtimeDto, 'basePrice' | 'vipPrice' | 'sweetboxPrice'>;

export interface BookingAdminDto {
  bookingId: string;
  passCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  movieTitle: string;
  showtimeDate: string;
  startTime: string;
  theaterName: string;
  seatLabels: string[];
  totalAmount: number;
  status: OrderStatus | string;
  paymentMethod: PaymentMethodType | string;
  createdAt: string;
}

export interface BookingDetailAdminDto extends BookingAdminDto {
  concessions: { name: string; quantity: number; unitPrice: number }[];
  discountAmount: number;
  voucherCode?: string;
  qrCodeBase64?: string;
  checkedInAt?: string | null;
  refundReason?: string | null;
}

export interface ConcessionDto {
  itemId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  isAvailable: boolean;
  soldCount: number;
}

export interface UpsertConcessionDto {
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  isAvailable: boolean;
}

export interface VoucherDto {
  voucherId: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderAmount: number;
  maxUsageCount: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateVoucherDto {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderAmount?: number;
  maxUsageCount: number;
  expiresAt: string;
}
