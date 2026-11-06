export interface ActiveTicketData {
  orderId: string;
  orderCode?: string;
  status: string;
  movieTitle: string;
  movieOriginalTitle: string;
  posterUrl: string;
  cinemaName: string;
  cinemaRoom: string;
  showtime: string;
  date: string;
  format: string;
  seats: string;
  seatsType: string;
  combo: string;
  totalAmount: number;
  qrCodeValue: string;
}

export const DEFAULT_ACTIVE_TICKET: ActiveTicketData = {
  orderId: '#VN-8849204',
  orderCode: 'VN-8849204',
  status: 'ĐÃ THANH TOÁN THÀNH CÔNG • SẴN SÀNG VÀO RẠP',
  movieTitle: 'DUNE: HÀNH TINH CÁT - PHẦN HAI',
  movieOriginalTitle: 'Dune: Part Two (2024)',
  posterUrl:
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
  cinemaName: 'CGV Vincom Center Landmark 81',
  cinemaRoom: 'Cinema 06 (IMAX Laser)',
  showtime: '19:45 ~ 22:30',
  date: `Hôm nay, ${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()}`,
  format: 'IMAX Laser 2D',
  seats: 'H8, H9',
  seatsType: 'VIP Prime Center',
  combo: '1x Combo Độc Quyền: Dune Sandworm Bucket & 02 Pepsi Zero 32oz',
  totalAmount: 510000,
  qrCodeValue: 'PBK-8849204',
};
