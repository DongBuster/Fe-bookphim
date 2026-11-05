// ==================== BASE WRAPPER ====================
export interface BaseResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
  metaData?: MetaData | null;
}

export interface MetaData {
  page: number;
  pageSize: number;
  total: number;
  totalPage?: number;
}

// ==================== CONSTANTS & TYPES (erasableSyntaxOnly compatible) ====================
export const MovieStatus = {
  NOW_SHOWING: 'NOW_SHOWING',
  COMING_SOON: 'COMING_SOON',
} as const;
export type MovieStatus = (typeof MovieStatus)[keyof typeof MovieStatus];

export const AgeRating = {
  P: 'P', // Phổ biến cho mọi độ tuổi
  K: 'K', // Dưới 13 tuổi có người bảo trợ đi kèm
  T13: 'T13', // Được phép xem cho khán giả từ 13 tuổi trở lên
  T16: 'T16', // Được phép xem cho khán giả từ 16 tuổi trở lên
  T18: 'T18', // Được phép xem cho khán giả từ 18 tuổi trở lên
  C: 'C', // Cấm chiếu / phổ biến
} as const;
export type AgeRating = (typeof AgeRating)[keyof typeof AgeRating];

export const MovieSortBy = {
  RELEASE_DATE_DESC: 'RELEASE_DATE_DESC',
  RATING_DESC: 'RATING_DESC',
  TITLE_ASC: 'TITLE_ASC',
} as const;
export type MovieSortBy = (typeof MovieSortBy)[keyof typeof MovieSortBy];

export const ScreenType = {
  STANDARD_2D: 'STANDARD_2D',
  STANDARD_3D: 'STANDARD_3D',
  IMAX_LASER: 'IMAX_LASER',
  DOLBY_CINEMA: 'DOLBY_CINEMA',
  GOLD_CLASS: 'GOLD_CLASS',
  FOUR_DX: 'FOUR_DX',
} as const;
export type ScreenType = (typeof ScreenType)[keyof typeof ScreenType];

export const SeatType = {
  STANDARD: 'STANDARD',
  VIP: 'VIP',
  SWEETBOX: 'SWEETBOX',
} as const;
export type SeatType = (typeof SeatType)[keyof typeof SeatType];

export const SeatState = {
  AVAILABLE: 'AVAILABLE',
  LOCKED: 'LOCKED',
  BOOKED: 'BOOKED',
} as const;
export type SeatState = (typeof SeatState)[keyof typeof SeatState];

export const PaymentMethodType = {
  MOMO: 'MOMO',
  VNPAY: 'VNPAY',
  ZALOPAY: 'ZALOPAY',
  CREDIT_CARD: 'CREDIT_CARD',
  QUICK_PAY: 'QUICK_PAY',
} as const;
export type PaymentMethodType =
  (typeof PaymentMethodType)[keyof typeof PaymentMethodType];

export const MembershipTier = {
  STANDARD: 'STANDARD',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  VIP_ELITE: 'VIP_ELITE',
} as const;
export type MembershipTier =
  (typeof MembershipTier)[keyof typeof MembershipTier];

export const OrderStatus = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
  EXPIRED: 'EXPIRED',
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const TicketPassStatus = {
  VALID: 'VALID',
  CHECKED_IN: 'CHECKED_IN',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const;
export type TicketPassStatus =
  (typeof TicketPassStatus)[keyof typeof TicketPassStatus];

// ==================== AUTH & PROFILE TYPES ====================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  phone: string;
  fullName: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  membershipTier?: MembershipTier | string;
  totalPoints?: number;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType?: string;
  user: AuthUser;
}

export interface UserProfileDto {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  avatarUrl?: string;
  birthDate?: string;
  membershipTier: MembershipTier | string;
  totalPoints: number;
  moviesWatchedCount: number;
  theatersVisitedCount: number;
  nickname?: string;
  favoriteTheaterId?: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  phone: string;
  birthDate?: string;
  nickname?: string;
  favoriteTheaterId?: string;
}

export interface CineMatchAiDto {
  tasteMatchRate: number;
  favoriteGenres: string[];
  favoriteDirectors: string[];
  favoriteActors: string[];
}

// ==================== MOVIE TYPES ====================
export interface MovieDto {
  id: string;
  title: string;
  slug: string;
  durationMinutes: number;
  ageRating: AgeRating | string;
  releaseDate: string;
  posterUrl: string;
  bannerUrl: string;
  genres: string[];
  formats: string[];
  imdbRating: number;
  rottenTomatoesRating: number;
  isNowShowing: boolean;
  isComingSoon: boolean;
}

export interface MovieDetailDto extends MovieDto {
  originalTitle?: string;
  synopsis: string;
  trailerUrl?: string;
  director?: string;
  cast: string[];
}

export interface GetMoviesParams {
  Status?: MovieStatus | string;
  Genre?: string;
  Format?: string;
  AgeRating?: AgeRating | string;
  SortBy?: MovieSortBy | string;
  Search?: string;
  Page?: number;
  PageSize?: number;
}

// ==================== SHOWTIME TYPES ====================
export interface ShowtimeItemDto {
  showtimeId: string;
  startTime: string;
  endTime: string;
  format: string;
  subtitleLanguage: string;
  basePrice: number;
  auditoriumName: string;
  isMysteryShowtime?: boolean;
  mysteryHint?: string;
  mysteryDiscountRate?: number;
}

export interface TheaterShowtimesGroupDto {
  theaterId: string;
  theaterName: string;
  address: string;
  city: string;
  chainName: string;
  chainLogo?: string;
  distanceKm?: number;
  showtimes: ShowtimeItemDto[];
}

export interface GetShowtimesParams {
  MovieId?: string;
  Date?: string; // YYYY-MM-DD
  City?: string;
  ScreenType?: ScreenType | string;
  UserLat?: number;
  UserLon?: number;
}

// ==================== SEAT TYPES ====================
export interface SeatDto {
  seatId: string;
  rowLabel?: string;
  seatRow?: string;
  seatNumber: number;
  seatLabel?: string;
  seatType: SeatType | string;
  state?: SeatState | string;
  status?: string;
  price: number;
  isMine?: boolean;
  isLockedByCurrentUser?: boolean;
  lockRemainingSeconds?: number | null;
}

export interface SeatMapDto {
  showtimeId: string;
  movieTitle?: string;
  auditoriumName: string;
  isMysteryShowtime?: boolean;
  mysteryHint?: string;
  mysteryDiscountRate?: number;
  screenType?: ScreenType | string;
  startTime?: string;
  basePrice?: number;
  totalRows?: number;
  totalColumns?: number;
  seats: SeatDto[];
}

export interface LockSeatsRequest {
  seatIds: string[];
  lockToken?: string | null;
}

export interface LockSeatsResponseData {
  success: boolean;
  lockToken: string;
  lockedSeatIds: string[];
  failedSeatIds?: string[];
  expiresAt?: string;
  expiresInSeconds: number;
  message?: string;
}

export interface UnlockSeatsRequest {
  lockToken: string;
  seatIds: string[];
}

// ==================== ORDER & PAYMENT TYPES ====================
export interface OrderConcessionItem {
  itemId: string;
  quantity: number;
}

export interface TaxInvoiceRequest {
  companyName: string;
  taxCode: string;
  address: string;
  recipientEmail: string;
}

export interface CreateOrderRequest {
  showtimeId: string;
  lockToken: string;
  seatIds: string[];
  concessions?: OrderConcessionItem[];
  voucherCode?: string;
  pointsToRedeem?: number;
  taxInvoice?: TaxInvoiceRequest;
}

export interface OrderItemDto {
  itemType: 'TICKET' | 'CONCESSION' | string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderDto {
  orderId: string;
  orderCode: string;
  ticketSubtotal: number;
  concessionSubtotal: number;
  discountAmount: number;
  pointsDiscount: number;
  totalAmount: number;
  status: OrderStatus | string;
  createdAt: string;
  items: OrderItemDto[];
}

export interface CheckoutPaymentRequest {
  orderId: string;
  paymentMethod: PaymentMethodType | string;
  returnUrl?: string;
}

export interface PaymentCheckoutResponseData {
  orderId: string;
  orderCode: string;
  amount: number;
  paymentMethod: PaymentMethodType | string;
  paymentUrl?: string;
  qrCodeUrl?: string;
  transactionRef?: string;
  status: string;
  expiresAt: string;
}

// ==================== TICKET TYPES ====================
export interface TicketDto {
  ticketId: string;
  passCode: string;
  movieTitle: string;
  theaterName: string;
  auditoriumName: string;
  isMysteryShowtime?: boolean;
  mysteryHint?: string;
  mysteryDiscountRate?: number;
  seatLabel: string;
  format: string;
  startTime: string;
  endTime: string;
  status: TicketPassStatus | string;
  checkedInAt?: string | null;
  qrCodeBase64?: string;
  qrCodeUrl?: string;
  appleWalletUrl?: string;
  googleWalletUrl?: string;
  isEligibleForRefund: boolean;
}

export interface TurnstileCheckInRequest {
  passCode: string;
  deviceId: string;
  gateNumber: string;
}


// ==================== 7.1 PASSPORT & GAMIFICATION TYPES ====================
export interface HologramStampDto {
  stampId: string;
  movieTitle: string;
  moviePosterUrl?: string;
  theaterName: string;
  format: string;
  acquiredAt: string;
  hologramEffect: 'GOLD_SHINE' | 'IRIDESCENT' | 'LASER_FIRE' | 'PLATINUM' | string;
}

export interface BadgeDto {
  badgeId: string;
  code: string;
  name: string;
  description: string;
  iconUrl: string;
  category: 'WATCH_COUNT' | 'THEATER_VISIT' | 'GENRE_EXPLORER' | 'SPECIAL_EVENT' | string;
  isUnlocked: boolean;
  unlockedAt?: string | null;
  rewardPoints: number;
  isRewardClaimed: boolean;
}

export interface PassportDto {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  membershipTier: MembershipTier | string;
  cinephileTitle:
    | 'Tân Binh'
    | 'Khán Giả Quen Mặt'
    | 'Tín Đồ Màn Bạc'
    | 'Đại Sứ Điện Ảnh VIP'
    | string;
  totalPoints: number;
  moviesWatchedCount: number;
  theatersVisitedCount: number;
  stamps: HologramStampDto[];
  badges: BadgeDto[];
}

export interface ClaimRewardRequest {
  badgeId: string;
}

export interface ClaimRewardResponseData {
  success: boolean;
  badgeId: string;
  rewardPoints: number;
  newTotalPoints: number;
}

// ==================== 7.2 CINEBOT AI CONCIERGE TYPES ====================
export interface ConciergeChatMessage {
  role: 'user' | 'model' | 'assistant';
  content: string;
}

export interface ConciergeChatRequest {
  message: string;
  conversationHistory?: ConciergeChatMessage[];
}

export interface RecommendedMovieDto {
  id: string;
  title: string;
  slug: string;
  posterUrl: string;
  imdbRating?: number;
  genre: string;
  matchReason?: string;
}

export interface BookingDraftDto {
  movieId?: string;
  movieTitle?: string;
  theaterId?: string;
  theaterName?: string;
  showtimeId?: string;
  time?: string;
  format?: string;
  seatIds?: string[];
  totalEstimate?: number;
}

export interface ConciergeChatResponseData {
  reply: string;
  recommendedMovies?: RecommendedMovieDto[];
  bookingDraft?: BookingDraftDto;
  suggestedReplies?: string[];
}

export interface QuickRecommendResponseData {
  trendingMovies: MovieDto[];
  recommendationTopic: string;
}

// ==================== 7.3 CINEPARTY GROUP BOOKING TYPES ====================
export const GroupRoomStatus = {
  OPEN: 'OPEN',
  LOCKED: 'LOCKED',
  SETTLING: 'SETTLING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;
export type GroupRoomStatus =
  (typeof GroupRoomStatus)[keyof typeof GroupRoomStatus];

export interface GroupMemberDto {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  isHost: boolean;
  joinedAt: string;
  selectedSeatIds: string[];
  selectedSeatLabels: string[];
  shareAmount: number;
  isPaid: boolean;
  paidAt?: string | null;
}

export interface GroupRoomDto {
  roomId: string;
  roomCode: string;
  hostUserId: string;
  showtimeId: string;
  movieTitle: string;
  theaterName: string;
  showtimeTime: string;
  status: GroupRoomStatus | string;
  expiresAt: string;
  members: GroupMemberDto[];
  totalSeatsCount: number;
  totalAmount: number;
}

export interface CreateGroupRoomRequest {
  showtimeId: string;
}

export interface JoinGroupRoomRequest {
  roomCode: string;
}

export interface SelectGroupSeatsRequest {
  roomCode: string;
  seatIds: string[];
}

export interface PayGroupShareRequest {
  roomCode: string;
  paymentMethod: PaymentMethodType | string;
}

// ==================== 7.4 CINEMATE & MYSTERY NIGHT TYPES ====================
export interface CineMateOptInRequest {
  showtimeId: string;
  seatLabel: string;
  favoriteGenres?: string[];
}

export interface CineMateMatchDto {
  userId: string;
  fullName: string;
  nickname?: string;
  avatarUrl?: string;
  seatLabel: string;
  tasteMatchRate: number;
  sharedGenres: string[];
  sharedDirectors: string[];
}

export interface CineMateSendHiRequest {
  targetUserId: string;
  showtimeId: string;
  greetingMessage?: string;
}
