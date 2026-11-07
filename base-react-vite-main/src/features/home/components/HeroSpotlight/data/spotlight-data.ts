// ─── Spotlight Movie Type ─────────────────────────────────────────────────────

export interface SpotlightMovie {
  id: number;
  detailMovieId: string;
  mainTitle: string;
  subTitle: string;
  exclusiveTitle: string;
  bgImage: string;
  imaxBadge: string;
  ageBadge: string;
  ratingScore: string;
  ratingCount: string;
  genre: string;
  synopsis: string;
  duration: string;
  audioSub: string;
  director: string;
  trailerUrl: string;
}

// ─── Spotlight Carousel Data ──────────────────────────────────────────────────

export const SPOTLIGHT_MOVIES: SpotlightMovie[] = [
  {
    id: 1,
    detailMovieId: 'dune-phan-hai',
    mainTitle: 'Dune: Part Two',
    subTitle: 'Hành Tinh Cát - Phần Hai (2024)',
    exclusiveTitle: 'KIỆT TÁC VIỄN TƯỞNG HOÀNH TRÁNG',
    bgImage:
      'https://image.tmdb.org/t/p/original/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    imaxBadge: 'IMAX LASER 70MM',
    ageBadge: 'T16 - PHỔ BIẾN TỪ 16 TUỔI',
    ratingScore: '9.5',
    ratingCount: '/10 (35.1k đánh giá)',
    genre: 'Khoa Học Viễn Tưởng • Sử Thi • Phiêu Lưu',
    synopsis:
      'Paul Atreides liên minh cùng Chani và tộc người Fremen khi anh bắt đầu cuộc chiến trả thù những kẻ đã hủy diệt gia tộc của mình, đồng thời đối mặt với lựa chọn nghiệt ngã giữa tình yêu và số phận toàn vũ trụ.',
    duration: '166 Phút',
    audioSub: 'Tiếng Anh • Phụ đề Tiếng Việt',
    director: 'Denis Villeneuve',
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
  },
  {
    id: 2,
    detailMovieId: 'deadpool-va-wolverine',
    mainTitle: 'Deadpool & Wolverine',
    subTitle: 'Đại chiến đa vũ trụ (2024)',
    exclusiveTitle: 'BOM TẤN HÀNH ĐỘNG MARVEL',
    bgImage:
      'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    imaxBadge: 'IMAX 3D',
    ageBadge: 'T18 - DÀNH CHO KHÁN GIẢ TỪ 18 TUỔI',
    ratingScore: '9.2',
    ratingCount: '/10 (28.6k đánh giá)',
    genre: 'Hành Động • Hài Hước • Siêu Anh Hùng',
    synopsis:
      'Sau thời gian dài rửa tay gác kiếm, Wade Wilson buộc phải tái xuất khi cơ quan quản lý phương sai thời gian kéo anh vào một sứ mệnh giải cứu đa vũ trụ cùng người bạn đồng hành Wolverine cộc cằn, tạo nên bộ đôi bùng nổ màn ảnh rộng.',
    duration: '128 Phút',
    audioSub: 'Tiếng Anh • Phụ đề Tiếng Việt',
    director: 'Shawn Levy',
    trailerUrl: 'https://www.youtube.com/embed/73_1biulkYk',
  },
  {
    id: 3,
    detailMovieId: 'nhim-sonic-3',
    mainTitle: 'Nhím Sonic 3',
    subTitle: 'Sonic The Hedgehog 3 (2024)',
    exclusiveTitle: 'SIÊU PHẨM HÀNH ĐỘNG GIA ĐÌNH',
    bgImage:
      'https://image.tmdb.org/t/p/original/d8Ryb8AunYAuycVKDp5HpdWPKgC.jpg',
    imaxBadge: 'DOLBY ATMOS 2D',
    ageBadge: 'P - PHỔ BIẾN MỌI ĐỘ TUỔI',
    ratingScore: '9.0',
    ratingCount: '/10 (15.2k đánh giá)',
    genre: 'Hành Động • Phiêu Lưu • Hoạt Hình',
    synopsis:
      'Sonic, Tails và Knuckles tái hợp để chống lại một kẻ thù bí ẩn và mạnh mẽ mới mang tên Shadow the Hedgehog, một nhân vật có sức mạnh vượt xa mọi thứ họ từng đối mặt trước đây.',
    duration: '110 Phút',
    audioSub: 'Tiếng Anh • Phụ đề Tiếng Việt',
    director: 'Jeff Fowler',
    trailerUrl: 'https://www.youtube.com/embed/qSu6i2iFMO0',
  },
  {
    id: 4,
    detailMovieId: 'nhung-manh-ghep-cam-xuc-2',
    mainTitle: 'Những Mảnh Ghép Cảm Xúc 2',
    subTitle: 'Inside Out 2 (2024)',
    exclusiveTitle: 'SIÊU PHẨM HOẠT HÌNH TOÀN CẦU',
    bgImage:
      'https://image.tmdb.org/t/p/original/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    imaxBadge: '3D DIGITAL',
    ageBadge: 'P - PHỔ BIẾN MỌI ĐỘ TUỔI',
    ratingScore: '9.0',
    ratingCount: '/10 (19.8k đánh giá)',
    genre: 'Hoạt Hình • Hài Hước • Gia Đình',
    synopsis:
      'Bước vào tuổi dậy thì, trụ sở cảm xúc của Riley chào đón những vị khách bất ngờ: Lo Âu, Ganh Tị, Xấu Hổ và Chán Nản, tạo nên chuỗi biến cố dở khóc dở cười và hành trình tìm lại sự cân bằng cảm xúc.',
    duration: '96 Phút',
    audioSub: 'Lồng tiếng & Phụ đề Tiếng Việt',
    director: 'Kelsey Mann',
    trailerUrl: 'https://www.youtube.com/embed/LEjhY15eCx0',
  },
];

// ─── Quick Booking Bar Dropdown Data ─────────────────────────────────────────

export const BOOKING_MOVIES = [
  'Dune: Part Two',
  'Nhím Sonic 3',
  'Deadpool & Wolverine',
  'Mai',
  'Lật Mặt 7: Một Điều Ước',
];

export const BOOKING_CINEMAS = [
  'CGV Landmark 81 (IMAX Laser)',
  'Lotte Cinema Nam Sài Gòn',
  'BHD Star Bitexco',
  'Galaxy Sala (IMAX Laser)',
];

export const BOOKING_DATES = [
  { key: 'today', defaultLabel: 'Hôm nay, 24 Tháng 03' },
  { key: 'tomorrow', defaultLabel: 'Ngày mai, 25 Tháng 03' },
  { key: 'wed', defaultLabel: 'Thứ Tư, 26 Tháng 03' },
  { key: 'thu', defaultLabel: 'Thứ Năm, 27 Tháng 03' },
];

export const BOOKING_SHOWTIMES = [
  { key: 'time_1', defaultLabel: '14:30 • 2D Phụ đề' },
  { key: 'time_2', defaultLabel: '16:00 • 3D Lồng tiếng' },
  { key: 'time_3', defaultLabel: '18:15 • 2D Phụ đề' },
  { key: 'time_4', defaultLabel: '19:45 • Phòng IMAX' },
  { key: 'time_5', defaultLabel: '21:30 • 2D Phụ đề' },
  { key: 'time_6', defaultLabel: '22:15 • 3D Phụ đề' },
];
