export interface CastMember {
  name: string;
  role: string;
  avatar: string;
}

export interface ShowtimeSlot {
  id: string;
  time: string;
  statusText: string;
  isAlmostFull?: boolean;
  priceText: string;
  price: number;
  isMystery?: boolean;
  mysteryDiscount?: number;
}

export interface ScreenFormatGroup {
  formatName: string;
  roomDetails: string;
  slots: ShowtimeSlot[];
}

export interface CinemaSchedule {
  id: string;
  name: string;
  badge: string;
  address: string;
  distance: string;
  formats: ScreenFormatGroup[];
}

import type { TFunction } from 'i18next';

export interface DayOption {
  dayLabel: string;
  dateStr: string;
  dayOfWeek: string;
  fullDate: string;
}

export const getDayTagLabel = (
  t: TFunction,
  dayLabel: string,
): string => {
  switch (dayLabel.toUpperCase()) {
    case 'HÔM NAY':
      return t('movie:tag_today', 'HÔM NAY');
    case 'NGÀY MAI':
      return t('movie:tag_tomorrow', 'NGÀY MAI');
    case 'CUỐI TUẦN':
      return t('movie:tag_weekend', 'CUỐI TUẦN');
    case 'TUẦN MỚI':
      return t('movie:tag_new_week', 'TUẦN MỚI');
    case 'ƯU ĐÃI':
      return t('movie:tag_promo', 'ƯU ĐÃI');
    default:
      return dayLabel;
  }
};

export const getDayOfWeekLabel = (
  t: TFunction,
  dayOfWeek: string,
): string => {
  switch (dayOfWeek) {
    case 'Thứ Hai':
      return t('movie:weekday_mon', 'Thứ Hai');
    case 'Thứ Ba':
      return t('movie:weekday_tue', 'Thứ Ba');
    case 'Thứ Tư':
      return t('movie:weekday_wed', 'Thứ Tư');
    case 'Thứ Năm':
      return t('movie:weekday_thu', 'Thứ Năm');
    case 'Thứ Sáu':
      return t('movie:weekday_fri', 'Thứ Sáu');
    case 'Thứ Bảy':
      return t('movie:weekday_sat', 'Thứ Bảy');
    case 'Chủ Nhật':
      return t('movie:weekday_sun', 'Chủ Nhật');
    default:
      return dayOfWeek;
  }
};

export const getFormatFilterLabel = (
  t: TFunction,
  formatId: string,
  defaultLabel: string,
): string => {
  switch (formatId) {
    case 'all':
      return t('movie:format_all', defaultLabel);
    case 'imax':
      return t('movie:format_imax', defaultLabel);
    case '2d':
      return t('movie:format_2d', defaultLabel);
    case 'screenx':
      return t('movie:format_screenx', defaultLabel);
    default:
      return defaultLabel;
  }
};

export interface MovieDetails {
  id: string | number;
  title: string;
  originalTitle: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  rating: number;
  ratingCount: string;
  rottenTomatoes: string;
  ageRating: string;
  runtime: string;
  releaseDate: string;
  formatBadge: string;
  badges: string[];
  genres: string[];
  director: {
    name: string;
    role: string;
    works: string;
    avatar: string;
  };
  cast: CastMember[];
  synopsisP1: string;
  synopsisP2: string;
  awards: {
    title: string;
    sub: string;
  }[];
  criticScore: string;
  criticReviewCount: string;
  masterpieceRate: string;
  featuredQuote: string;
  featuredAuthor: string;
}

export const DUNE_MOVIE_DATA: MovieDetails = {
  id: 'dune-2',
  title: 'Dune: Hành Tinh Cát - Phần Hai',
  originalTitle: 'Dune: Part Two (2024)',
  posterUrl:
    'https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_.jpg',
  backdropUrl:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w?autoplay=1',
  rating: 8.9,
  ratingCount: '350k lượt',
  rottenTomatoes: '95%',
  ageRating: 'T16 • IMAX',
  runtime: "166'",
  releaseDate: '01/03/2024',
  formatBadge: 'IMAX GT / 2D',
  badges: ['BOM TẤN QUỐC TẾ', 'DOLBY ATMOS', 'CINELOUNGE VIP'],
  genres: ['Hành Động', 'Viễn Tưởng', 'Phiêu Lưu Sử Thi'],
  director: {
    name: 'Denis Villeneuve',
    role: 'ĐẠO DIỄN',
    works: 'Blade Runner 2049, Arrival',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'T. Chalamet',
      role: 'Paul Atreides',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Zendaya',
      role: 'Chani',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Austin Butler',
      role: 'Feyd-Rautha',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Dune: Hành Tinh Cát - Phần Hai tiếp tục cuộc hành trình huyền thoại của Paul Atreides khi anh hợp nhất với Chani và người Fremen trên sa mạc cằn cỗi Arrakis, đồng thời bắt đầu hành trình trả thù những kẻ đã tàn sát gia tộc Atreides.',
  synopsisP2:
    'Đứng trước ngã ba giữa tình yêu của đời mình và định mệnh cứu rỗi vũ trụ đã được tiên tri hàng ngàn năm, Paul buộc phải dấn thân vào một cuộc chiến tàn khốc không thể tránh khỏi nhằm ngăn chặn tương lai thảm khốc mà chỉ mình anh có thể nhìn thấy trước.',
  awards: [
    {
      title: 'Được Đề Cử 10 Hạng Mục',
      sub: 'Critics Choice Super Awards 2024',
    },
    {
      title: 'Kỷ Lục Doanh Thu Toàn Cầu',
      sub: '+710 Triệu USD phòng vé',
    },
  ],
  criticScore: '9.2',
  criticReviewCount: '185 bài phê bình báo chí',
  masterpieceRate: '92%',
  featuredQuote:
    'Kiệt tác khoa học viễn tưởng vĩ đại của thế kỷ 21. Sự kết hợp chân động thị giác giữa Denis Villeneuve và Hans Zimmer tạo nên trải nghiệm phòng chiếu không thể thay thế.',
  featuredAuthor: 'David Rooney — The Hollywood Reporter',
};

export const FURIOSA_MOVIE_DATA: MovieDetails = {
  id: 2,
  title: 'Furiosa: Khởi Nguyên Mad Max',
  originalTitle: 'Furiosa: A Mad Max Saga (2024)',
  posterUrl:
    'https://static.khenphim.com/khenohim_media/2024/05/Furiosa-pic1-poster_KP-scaled.webp',
  backdropUrl:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/XJMuhwVlca4?autoplay=1',
  rating: 8.8,
  ratingCount: '220k lượt',
  rottenTomatoes: '90%',
  ageRating: 'T18 • 4DX',
  runtime: "148'",
  releaseDate: '24/05/2024',
  formatBadge: '4DX MOTION / 2D',
  badges: ['BOM TẤN HÀNH ĐỘNG', '4DX MOTION', 'DOLBY ATMOS'],
  genres: ['Hành Động', 'Hậu Tận Thế', 'Phiêu Lưu'],
  director: {
    name: 'George Miller',
    role: 'ĐẠO DIỄN',
    works: 'Mad Max: Fury Road, Three Thousand Years of Longing',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Anya Taylor-Joy',
      role: 'Furiosa',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Chris Hemsworth',
      role: 'Dementus',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Tom Burke',
      role: 'Praetorian Jack',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Khi thế giới sụp đổ, nàng Furiosa trẻ tuổi bị bắt cóc khỏi Vùng Xanh của Nhiều Người Mẹ và rơi vào tay của một Biker Horde vĩ đại do Warlord Dementus tàn bạo lãnh đạo.',
  synopsisP2:
    'Băng qua Vùng Đất Hoang, họ chạm trán Thành Trì do Bất Tử Joe cai trị. Trong cuộc chiến giành quyền lực đẫm máu giữa hai bạo chúa, Furiosa phải vượt qua vô vàn thử thách khắc nghiệt để tìm đường trở về quê hương.',
  awards: [
    {
      title: 'Công Chiếu Chính Thức LHP Cannes',
      sub: 'Tràng pháo tay 7 phút tại Cannes 2024',
    },
    {
      title: 'Kỹ Xảo & Hành Động Đỉnh Cao',
      sub: 'Bình chọn bởi Hiệp hội Phê bình Phim Quốc tế',
    },
  ],
  criticScore: '8.9',
  criticReviewCount: '142 bài phê bình báo chí',
  masterpieceRate: '90%',
  featuredQuote:
    'Một thiên sử thi hành động nghẹt thở và mãn nhãn. George Miller một lần nữa khẳng định vị thế bậc thầy của dòng phim hành động hậu tận thế.',
  featuredAuthor: 'Peter Bradshaw — The Guardian',
};

export const CONAN_MOVIE_DATA: MovieDetails = {
  id: 3,
  title: 'Thám Tử Lừng Danh Conan: Ngôi Sao 1 Triệu Đô',
  originalTitle: 'Detective Conan: The Million-dollar Pentagram (2024)',
  posterUrl:
    'https://upload.wikimedia.org/wikipedia/vi/9/9d/Conan_Movie_27.jpg?utm_source=vi.wikipedia.org&utm_campaign=index&utm_content=original',
  backdropUrl:
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/5a4G11566gM?autoplay=1',
  rating: 9.0,
  ratingCount: '410k lượt',
  rottenTomatoes: '96%',
  ageRating: 'K • Phổ biến mọi độ tuổi',
  runtime: "111'",
  releaseDate: '02/08/2024',
  formatBadge: 'LỒNG TIẾNG & PHỤ ĐỀ',
  badges: ['ANIME ĐÌNH ĐÁM', 'KỶ LỤC PHÒNG VÉ', 'LỒNG TIẾNG VIP'],
  genres: ['Hoạt Hình', 'Trinh Thám', 'Hành Động'],
  director: {
    name: 'Chika Nagaoka',
    role: 'ĐẠO DIỄN',
    works: 'Conan: Cú Đấm Sapphire Xanh, Viên Đạn Đỏ',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Minami Takayama',
      role: 'Conan Edogawa',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Kappei Yamaguchi',
      role: 'Kaito Kid',
      avatar:
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Ryo Horikawa',
      role: 'Heiji Hattori',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Tại Hakodate, Hokkaido, một thông báo từ Siêu đạo chích Kid gửi đến nhắm vào thanh kiếm Nhật của một gia tộc danh giá. Lần này mục tiêu của Kid không phải đá quý mà là bảo kiếm cổ.',
  synopsisP2:
    'Cùng lúc đó, Conan và chàng thám tử miền Tây Heiji Hattori cũng có mặt tại Hakodate để tham gia giải kiếm đạo. Một vụ án mạng bí ẩn xảy ra cuốn cả ba vào bí mật lịch sử liên quan đến kho báu thời Mạc Phủ.',
  awards: [
    {
      title: 'Top 1 Doanh Thu Nhật Bản 2024',
      sub: '+15 Tỷ Yên doanh thu nội địa',
    },
    {
      title: 'Kỷ Lục Phòng Vé Anime Tại Việt Nam',
      sub: '+100 Tỷ VNĐ sau 2 tuần công chiếu',
    },
  ],
  criticScore: '9.3',
  criticReviewCount: '98 bài phê bình báo chí',
  masterpieceRate: '95%',
  featuredQuote:
    'Màn đối đầu kịch tính và đầy bất ngờ giữa Conan, Kid và Heiji với cú twist lịch sử gây chấn động người hâm mộ toàn cầu.',
  featuredAuthor: 'Anime News Network',
};

export const LAT_MAT_7_MOVIE_DATA: MovieDetails = {
  id: 4,
  title: 'Lật Mặt 7: Một Điều Ước',
  originalTitle: 'Face Off 7: One Wish (2024)',
  posterUrl:
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
  backdropUrl:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/d2k4K1aY2vA?autoplay=1',
  rating: 8.6,
  ratingCount: '520k lượt',
  rottenTomatoes: '88%',
  ageRating: 'T13 • Gia Đình',
  runtime: "138'",
  releaseDate: '26/04/2024',
  formatBadge: 'TOP 1 PHÒNG VÉ',
  badges: ['PHIM VIỆT ĐẠI THẮNG', 'GIA ĐÌNH CẢM ĐỘNG', 'TOP 1 PHÒNG VÉ'],
  genres: ['Gia Đình', 'Tâm Lý', 'Hài Hước'],
  director: {
    name: 'Lý Hải',
    role: 'ĐẠO DIỄN / BIÊN KỊCH',
    works: 'Lật Mặt 1-6, Nhà Có Năm Nàng Dâu',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Thanh Hiền',
      role: 'Bà Hai (73 tuổi)',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Trương Minh Cường',
      role: 'Hai Khôn',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Quách Ngọc Tuyên',
      role: 'Tư Hậu',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Câu chuyện xoay quanh bà Hai (73 tuổi) ở vùng cao nguyên thơ mộng Lạc Dương. Bà một mình tảo tần nuôi 5 người con khôn lớn rồi chứng kiến từng người lần lượt rời xa tổ ấm đi lập nghiệp.',
  synopsisP2:
    'Khi bà Hai gặp tai nạn chấn thương, 5 người con đùn đẩy trách nhiệm nuôi mẹ giữa những toan tính đời thường, mở ra hành trình chữa lành ấm áp lay động hàng triệu trái tim khán giả.',
  awards: [
    {
      title: 'Top 2 Phim Việt Có Doanh Thu Cao Nhất Mọi Thời Đại',
      sub: '+480 Tỷ VNĐ tại phòng vé Việt Nam',
    },
    {
      title: 'Phim Chiếu Rạp Được Yêu Thích Nhất 2024',
      sub: 'Giải Thưởng Ngôi Sao Xanh',
    },
  ],
  criticScore: '8.7',
  criticReviewCount: '135 bài phê bình báo chí',
  masterpieceRate: '89%',
  featuredQuote:
    'Tác phẩm chạm tới tận cùng cảm xúc về tình mẫu tử thiêng liêng. Lý Hải đã tạo nên một bước ngoặt điện ảnh sâu sắc và giàu tính nhân văn.',
  featuredAuthor: 'VnExpress Phim Ảnh',
};

export const DEADPOOL_WOLVERINE_MOVIE_DATA: MovieDetails = {
  id: 5,
  title: 'Deadpool & Wolverine',
  originalTitle: 'Deadpool & Wolverine (2024)',
  posterUrl:
    'https://image.tmdb.org/t/p/original/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
  backdropUrl:
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/73_1biulkYk?autoplay=1',
  rating: 9.3,
  ratingCount: '680k lượt',
  rottenTomatoes: '94%',
  ageRating: 'T18 • Hài Bựa',
  runtime: "127'",
  releaseDate: '26/07/2024',
  formatBadge: 'SCREENX 270°',
  badges: ['SIÊU PHẨM MARVEL', 'SCREENX 270°', 'IMAX 3D'],
  genres: ['Hành Động', 'Hài Hước', 'Đa Vũ Trụ'],
  director: {
    name: 'Shawn Levy',
    role: 'ĐẠO DIỄN',
    works: 'Free Guy, Stranger Things, Real Steel',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Ryan Reynolds',
      role: 'Wade Wilson / Deadpool',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Hugh Jackman',
      role: 'Logan / Wolverine',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Emma Corrin',
      role: 'Cassandra Nova',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Sau một thời gian lui về ở ẩn làm nhân viên bán ô tô, Wade Wilson bất ngờ bị cơ quan TVA bắt giữ và giao nhiệm vụ có thể thay đổi toàn bộ dòng thời gian của vũ trụ mình.',
  synopsisP2:
    'Để cứu thế giới và những người thân yêu, Wade buộc phải tìm kiếm sự trợ giúp từ một phiên bản Wolverine đang chìm trong đau khổ, tạo nên bộ đôi đối nghịch cùng quẩy tung Đa vũ trụ.',
  awards: [
    {
      title: 'Kỷ Lục Phim Hạng R Cao Nhất Lịch Sử',
      sub: '+1.3 Tỷ USD phòng vé toàn cầu',
    },
    {
      title: 'Bom Tấn Mùa Hè Thành Công Nhất 2024',
      sub: 'Bình chọn bởi Rotten Tomatoes & IMDb',
    },
  ],
  criticScore: '9.1',
  criticReviewCount: '250 bài phê bình báo chí',
  masterpieceRate: '93%',
  featuredQuote:
    'Cặp đôi vàng Ryan Reynolds và Hugh Jackman đem lại năng lượng bùng nổ, sự hài hước vô tiền khoáng hậu và bữa tiệc hành động đỉnh cao cho người hâm mộ MCU.',
  featuredAuthor: 'Empire Magazine',
};

export const QUIET_PLACE_MOVIE_DATA: MovieDetails = {
  id: 6,
  title: 'Vùng Đất Câm Lặng: Ngày Một',
  originalTitle: 'A Quiet Place: Day One (2024)',
  posterUrl:
    'https://static-cgv.vncdn.vn/media/catalog/product/cache/1/image/1800x/71252117777b696995f01934522c402d/a/q/aqpd1_intl_dgtl_online_tsr_1sht_panic_vie_470x700.jpg',
  backdropUrl:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/YPY7J-flzE8?autoplay=1',
  rating: 8.4,
  ratingCount: '180k lượt',
  rottenTomatoes: '86%',
  ageRating: 'T16 • DOLBY ATMOS',
  runtime: "100'",
  releaseDate: '28/06/2024',
  formatBadge: 'DOLBY ATMOS',
  badges: ['KINH DỊ SINH TỒN', 'DOLBY ATMOS', 'IMAX'],
  genres: ['Kinh Dị', 'Sinh Tồn', 'Khoa Học Viễn Tưởng'],
  director: {
    name: 'Michael Sarnoski',
    role: 'ĐẠO DIỄN',
    works: 'Pig, A Quiet Place Universe',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: "Lupita Nyong'o",
      role: 'Sam',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Joseph Quinn',
      role: 'Eric',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Trở về ngày đầu tiên khi thế giới rơi vào tĩnh lặng. Thành phố New York náo nhiệt bất ngờ bị tấn công bởi những sinh vật ngoài hành tinh khát máu định vị bằng âm thanh.',
  synopsisP2:
    'Sam cùng chú mèo cưng và một người bạn đồng hành bất đắc dĩ phải tìm cách sống sót qua một Manhattan đổ nát, nơi một tiếng thở nhẹ cũng có thể đánh đổi bằng tính mạng.',
  awards: [
    {
      title: 'Hiệu Ứng Âm Thanh Xuất Sắc Nhất',
      sub: 'Được khen ngợi bởi giới phê bình quốc tế',
    },
  ],
  criticScore: '8.5',
  criticReviewCount: '160 bài phê bình',
  masterpieceRate: '86%',
  featuredQuote:
    'Căng thẳng tột độ, nghẹt thở đến từng giây. Trải nghiệm âm thanh rạp phim ở đẳng cấp cao nhất.',
  featuredAuthor: 'The Hollywood Reporter',
};

export const INSIDE_OUT_2_MOVIE_DATA: MovieDetails = {
  id: 7,
  title: 'Những Mảnh Ghép Cảm Xúc 2',
  originalTitle: 'Inside Out 2 (2024)',
  posterUrl:
    'https://upload.wikimedia.org/wikipedia/en/f/f7/Inside_Out_2_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original',
  backdropUrl:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/LEjhY15eCx0?autoplay=1',
  rating: 9.1,
  ratingCount: '590k lượt',
  rottenTomatoes: '91%',
  ageRating: 'P • Mọi độ tuổi',
  runtime: "96'",
  releaseDate: '14/06/2024',
  formatBadge: '3D LỒNG TIẾNG',
  badges: ['PIXAR KỶ LỤC', '3D DIGITAL', 'GIA ĐÌNH YÊU THÍCH'],
  genres: ['Hoạt Hình', 'Hài Hước', 'Tâm Lý Tuổi Dậy Thì'],
  director: {
    name: 'Kelsey Mann',
    role: 'ĐẠO DIỄN',
    works: 'Monsters University, The Good Dinosaur',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Amy Poehler',
      role: 'Joy (Vui Vẻ)',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Maya Hawke',
      role: 'Anxiety (Lo Âu)',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Phyllis Smith',
      role: 'Sadness (Buồn Bã)',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Trụ sở đầu não của cô bé Riley bỗng nhiên bị đập phá sửa chữa khi Riley chính thức bước vào tuổi dậy thì với những biến động tâm lý phức tạp.',
  synopsisP2:
    'Nhóm cảm xúc mới xuất hiện do Lo Âu dẫn đầu đã chiếm quyền điều khiển và trục xuất Vui Vẻ, Buồn Bã, Giận Dữ, Sợ Hãi và Chảnh Chọe, buộc họ phải phiêu lưu vào vùng sâu tâm trí để tìm lại Bản sắc cốt lõi của Riley.',
  awards: [
    {
      title: 'Phim Hoạt Hình Có Doanh Thu Cao Nhất Mọi Thời Đại',
      sub: '+1.69 Tỷ USD toàn cầu',
    },
    {
      title: 'Giải Thưởng Sự Lựa Chọn Của Khán Giả 2024',
      sub: "People's Choice Awards",
    },
  ],
  criticScore: '9.2',
  criticReviewCount: '210 bài phê bình báo chí',
  masterpieceRate: '92%',
  featuredQuote:
    'Sâu sắc, xúc động và đầy thấu hiểu. Pixar một lần nữa tạo nên một tuyệt tác chữa lành tâm hồn cho cả trẻ em lẫn người trưởng thành.',
  featuredAuthor: 'Variety',
};

export const JOKER_2_MOVIE_DATA: MovieDetails = {
  id: 8,
  title: 'Joker: Điên Có Đôi',
  originalTitle: 'Joker: Folie à Deux (2024)',
  posterUrl:
    'https://upload.wikimedia.org/wikipedia/vi/7/79/JOKER_FOLIE_%C3%80_DEUX_-_Vietnam_poster.jpg?utm_source=vi.wikipedia.org&utm_campaign=index&utm_content=original',
  backdropUrl:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1',
  rating: 8.9,
  ratingCount: '310k lượt',
  rottenTomatoes: '85%',
  ageRating: 'T18 • IMAX 70MM',
  runtime: "138'",
  releaseDate: '04/10/2024',
  formatBadge: 'IMAX 70MM',
  badges: ['TÂM LÝ NHẠC KỊCH', 'IMAX 70MM', 'HOLLYWOOD'],
  genres: ['Tâm Lý', 'Tội Phạm', 'Nhạc Kịch'],
  director: {
    name: 'Todd Phillips',
    role: 'ĐẠO DIỄN',
    works: 'Joker (2019), The Hangover Trilogy',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Joaquin Phoenix',
      role: 'Arthur Fleck / Joker',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Lady Gaga',
      role: 'Lee Quinzel / Harley Quinn',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Trong khi bị giam giữ tại Bệnh viện Tâm thần Arkham để chờ xét xử cho những tội ác của mình, Arthur Fleck đã tìm thấy tình yêu đích thực của đời mình cùng tài năng âm nhạc luôn ẩn giấu bên trong.',
  synopsisP2:
    'Bản hòa ca điên cuồng giữa Arthur và Lee Quinzel bùng nổ, biến phòng xử án Gotham thành một sân khấu trình diễn của sự hỗn loạn và ảo mộng tình yêu.',
  awards: [
    {
      title: 'Tranh Giải Sư Tử Vàng LHP Venice',
      sub: 'Venice Film Festival 2024',
    },
  ],
  criticScore: '8.8',
  criticReviewCount: '175 bài phê bình',
  masterpieceRate: '88%',
  featuredQuote:
    'Sự kết hợp bùng nổ giữa Joaquin Phoenix và Lady Gaga tạo nên tác phẩm âm nhạc kỳ dị và quyến rũ.',
  featuredAuthor: 'Deadline',
};

export const NAM_BUOC_DE_YEU_DATA: MovieDetails = {
  id: 'nam-buoc-de-yeu',
  title: 'Năm Bước Để Yêu',
  originalTitle: 'Five Feet Apart (2019)',
  posterUrl:
    'https://arena.fpt.edu.vn/wp-content/uploads/2021/04/5-yeu-to-tao-nen-mot-poster-phim-an-tuong.jpeg',
  backdropUrl:
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/XtgCqMZofqM?autoplay=1',
  rating: 9.2,
  ratingCount: '320k lượt',
  rottenTomatoes: '92%',
  ageRating: 'C18 • 2D PHỤ ĐỀ',
  runtime: "131'",
  releaseDate: 'Đang khởi chiếu',
  formatBadge: '2D PHỤ ĐỀ',
  badges: ['TÂM LÝ TÌNH CẢM', 'LÃNG MẠN', 'CẢM ĐỘNG'],
  genres: ['Tình Cảm', 'Lãng Mạn', 'Tâm Lý'],
  director: {
    name: 'Justin Baldoni',
    role: 'ĐẠO DIỄN',
    works: 'Jane the Virgin, Clouds',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Haley Lu Richardson',
      role: 'Stella',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Cole Sprouse',
      role: 'Will',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Stella Grant là một cô gái 17 tuổi mắc chứng xơ nang, phải dành phần lớn cuộc đời mình trong bệnh viện với những quy tắc nghiêm ngặt về kiểm soát lây nhiễm.',
  synopsisP2:
    'Cô gặp Will Newman, một chàng trai cùng cảnh ngộ nhưng nổi loạn. Tình yêu nảy nở giữa hai người với khoảng cách an toàn bắt buộc 6 bước chân, được họ dũng cảm rút ngắn còn 5 bước.',
  awards: [
    {
      title: 'Phim Tình Cảm Được Yêu Thích',
      sub: "People's Choice Awards",
    },
  ],
  criticScore: '9.0',
  criticReviewCount: '125 bài phê bình',
  masterpieceRate: '92%',
  featuredQuote:
    'Một câu chuyện tình yêu đầy day dứt và đẹp đẽ lấy đi nước mắt của hàng triệu khán giả.',
  featuredAuthor: 'The Hollywood Reporter',
};

export const HAM_CA_MAP_DATA: MovieDetails = {
  id: 'ham-ca-map',
  title: 'Hàm Cá Mập',
  originalTitle: 'Jaws (1975) - IMAX Remastered',
  posterUrl: 'https://i.imgur.com/ZF2xgWi.jpg',
  backdropUrl:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/U1Fu_sAAMXg?autoplay=1',
  rating: 8.9,
  ratingCount: '600k lượt',
  rottenTomatoes: '97%',
  ageRating: 'T16 • 4DX HFR',
  runtime: "192'",
  releaseDate: 'Khởi chiếu cuối tuần',
  formatBadge: '4DX HFR',
  badges: ['KINH ĐIỂN MỌI THỜI ĐẠI', 'IMAX 3D', '4DX HFR'],
  genres: ['Kinh Dị', 'Hành Động', 'Viễn Tưởng'],
  director: {
    name: 'Steven Spielberg',
    role: 'ĐẠO DIỄN',
    works: 'Jurassic Park, E.T.',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Roy Scheider',
      role: 'Martin Brody',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Robert Shaw',
      role: 'Quint',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Một thị trấn ven biển thanh bình bị đe dọa bởi con cá mập trắng khổng lồ tấn công người đi biển.',
  synopsisP2:
    'Cảnh sát trưởng Brody cùng một nhà hải dương học và một thợ săn cá mập lão luyện phải ra khơi đối đầu với thủy quái đại dương trên con tàu nhỏ bé.',
  awards: [
    {
      title: '3 Giải Oscar Danh Giá',
      sub: 'Âm thanh & Dựng phim xuất sắc nhất',
    },
  ],
  criticScore: '9.5',
  criticReviewCount: '280 bài phê bình',
  masterpieceRate: '97%',
  featuredQuote:
    'Tuyệt tác kinh dị định hình khái niệm bom tấn mùa hè của điện ảnh thế giới.',
  featuredAuthor: 'Roger Ebert',
};

export const BAY_THI_THE_DATA: MovieDetails = {
  id: '7-thi-the',
  title: '7 Thi Thể',
  originalTitle: 'Dark Figure of Crime (2018)',
  posterUrl:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
  backdropUrl:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/d2k4K1aY2vA?autoplay=1',
  rating: 8.6,
  ratingCount: '140k lượt',
  rottenTomatoes: '89%',
  ageRating: 'C18 • 2D PHỤ ĐỀ',
  runtime: "134'",
  releaseDate: 'Cháy vé cuối tuần',
  formatBadge: '2D PHỤ ĐỀ',
  badges: ['HÌNH SỰ HÀN QUỐC', 'ĐẤU TRÍ KỊCH TÍNH', 'BÍ ẨN'],
  genres: ['Kinh Dị', 'Hình Sự', 'Tâm Lý'],
  director: {
    name: 'Kim Tae-gyun',
    role: 'ĐẠO DIỄN',
    works: 'Spring, Snow',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Kim Yoon-seok',
      role: 'Thanh tra Hyung-min',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Ju Ji-hoon',
      role: 'Kang Tae-oh',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Dựa trên vụ án có thật gây rúng động Hàn Quốc về một tên sát nhân thú nhận đã giết 7 nạn nhân khác khi đang ngồi tù.',
  synopsisP2:
    'Thanh tra Hyung-min dấn thân vào cuộc đấu trí tâm lý nghẹt thở với tên sát nhân hiểm độc để tìm kiếm thi thể các nạn nhân vô tội.',
  awards: [
    {
      title: 'Giải Rồng Xanh Kịch Bản Xuất Sắc',
      sub: 'Blue Dragon Film Awards',
    },
  ],
  criticScore: '8.8',
  criticReviewCount: '95 bài phê bình',
  masterpieceRate: '89%',
  featuredQuote:
    'Màn so tài diễn xuất đỉnh cao giữa Kim Yoon-seok và Ju Ji-hoon làm bừng sáng dòng phim trinh thám hình sự.',
  featuredAuthor: 'Korea Herald',
};

export const SPIDERMAN_DATA: MovieDetails = {
  id: 'spider-man',
  title: 'Spider-Man',
  originalTitle: 'Spider-Man: Across the Spider-Verse',
  posterUrl: 'https://genk.mediacdn.vn/2017/photo-1-1496042071517.jpg',
  backdropUrl:
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/cqGjhVJWtEg?autoplay=1',
  rating: 8.1,
  ratingCount: '450k lượt',
  rottenTomatoes: '96%',
  ageRating: 'P • 2D LỒNG TIẾNG',
  runtime: "94'",
  releaseDate: 'Đang khởi chiếu',
  formatBadge: '2D LỒNG TIẾNG',
  badges: ['HOẠT HÌNH ĐỈNH CAO', 'ĐA VŨ TRỤ', 'MARVEL'],
  genres: ['Hành Động', 'Hài Hước', 'Hoạt Hình'],
  director: {
    name: 'Joaquim Dos Santos',
    role: 'ĐẠO DIỄN',
    works: 'Spider-Verse, Avatar: TLA',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Shameik Moore',
      role: 'Miles Morales',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Hailee Steinfeld',
      role: 'Gwen Stacy',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Miles Morales bất ngờ được Gwen Stacy đưa du hành qua Đa vũ trụ Nhện với hàng trăm Người Nhện bảo vệ sự tồn vong của các chiều không gian.',
  synopsisP2:
    'Đứng trước nguy cơ mất đi người thân vì định mệnh bất di bất dịch, Miles quyết tâm viết lại số phận của chính mình, mở ra cuộc đối đầu với cả Liên Minh Người Nhện.',
  awards: [
    {
      title: 'Phim Hoạt Hình Xuất Sắc Nhất',
      sub: 'Critics Choice Awards',
    },
  ],
  criticScore: '9.4',
  criticReviewCount: '310 bài phê bình',
  masterpieceRate: '96%',
  featuredQuote:
    'Đỉnh cao thị giác và câu chuyện siêu anh hùng sáng tạo bậc nhất trong lịch sử điện ảnh đương đại.',
  featuredAuthor: 'Rolling Stone',
};

export const THOR_DATA: MovieDetails = {
  id: 'thor',
  title: 'Thor: The Dark World',
  originalTitle: 'Thor: The Dark World (2013)',
  posterUrl:
    'https://www.thietkeposter.com.vn/wp-content/uploads/2017/06/23-poster-phim-dep-nhat-2013.jpg',
  backdropUrl:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/npvJ9FTgZbM?autoplay=1',
  rating: 8.4,
  ratingCount: '380k lượt',
  rottenTomatoes: '78%',
  ageRating: 'C13 • SCREENX 4DX',
  runtime: "115'",
  releaseDate: 'Đang khởi chiếu',
  formatBadge: 'SCREENX 4DX',
  badges: ['MARVEL CINEMATIC', 'SCREENX 4DX', 'QUÁI VẬT'],
  genres: ['Hành Động', 'Thần Thoại', 'Quái Vật'],
  director: {
    name: 'Alan Taylor',
    role: 'ĐẠO DIỄN',
    works: 'Game of Thrones, The Sopranos',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Chris Hemsworth',
      role: 'Thor',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Tom Hiddleston',
      role: 'Loki',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Một chủng tộc cổ đại do Malekith độc ác dẫn đầu trở lại với âm mưu đẩy toàn bộ vũ trụ trở về bóng tối vĩnh hằng bằng viên đá vô cực Aether.',
  synopsisP2:
    'Thor buộc phải dấn thân vào hành trình nguy hiểm nhất, thậm chí phải liên minh với người em trai phản trắc Loki để cứu Jane Foster và Asgard.',
  awards: [
    {
      title: 'Kỹ Xảo Điện Ảnh Đề Cử Sao Thổ',
      sub: 'Saturn Awards',
    },
  ],
  criticScore: '8.2',
  criticReviewCount: '190 bài phê bình',
  masterpieceRate: '78%',
  featuredQuote:
    'Sự tung hứng diễn xuất tuyệt vời giữa Thor và Loki mang lại sức hút khó cưỡng cho tác phẩm.',
  featuredAuthor: 'IGN Movies',
};

export const OPPENHEIMER_MOVIE_DATA: MovieDetails = {
  id: 9,
  title: 'Oppenheimer',
  originalTitle: 'Oppenheimer (2023)',
  posterUrl: 'https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
  backdropUrl:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1',
  rating: 9.4,
  ratingCount: '850k lượt',
  rottenTomatoes: '93%',
  ageRating: 'T18 • IMAX 70MM',
  runtime: "180'",
  releaseDate: '21/07/2023',
  formatBadge: 'IMAX 70MM',
  badges: ['7 GIẢI OSCAR', 'IMAX 70MM', 'KIỆT TÁC LỊCH SỬ'],
  genres: ['Lịch Sử', 'Kịch Tính', 'Tiểu Sử'],
  director: {
    name: 'Christopher Nolan',
    role: 'ĐẠO DIỄN / BIÊN KỊCH',
    works: 'Interstellar, Inception, The Dark Knight',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Cillian Murphy',
      role: 'J. Robert Oppenheimer',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Emily Blunt',
      role: 'Kitty Oppenheimer',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Robert Downey Jr.',
      role: 'Lewis Strauss',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Câu chuyện về cuộc đời và sự nghiệp của nhà vật lý lý thuyết J. Robert Oppenheimer, người đóng vai trò then chốt trong Dự án Manhattan phát triển vũ khí nguyên tử đầu tiên trong Thế chiến thứ hai.',
  synopsisP2:
    'Sau chiến thắng, ông phải đối mặt với những dằn vặt lương tâm khôn nguôi về sức tàn phá khủng khiếp của phát minh, cùng những phiên điều trần chính trị khốc liệt.',
  awards: [
    {
      title: '7 Giải Oscar Danh Giá',
      sub: 'Bao gồm Phim hay nhất & Đạo diễn xuất sắc',
    },
  ],
  criticScore: '9.4',
  criticReviewCount: '340 bài phê bình',
  masterpieceRate: '94%',
  featuredQuote:
    'Tác phẩm điện ảnh đỉnh cao của thập kỷ, một màn trình diễn xuất sắc vượt bậc của Cillian Murphy.',
  featuredAuthor: 'The New York Times',
};

export const GODZILLA_KONG_MOVIE_DATA: MovieDetails = {
  id: 10,
  title: 'Godzilla x Kong: Đế Chế Mới',
  originalTitle: 'Godzilla x Kong: The New Empire (2024)',
  posterUrl: 'https://image.tmdb.org/t/p/w780/tMefBSflR6PGQLv7WvFPpKLZkyk.jpg',
  backdropUrl:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/qqrpMRDuPfc?autoplay=1',
  rating: 8.5,
  ratingCount: '290k lượt',
  rottenTomatoes: '91%',
  ageRating: 'T13 • 4DX',
  runtime: "115'",
  releaseDate: '29/03/2024',
  formatBadge: '4DX MOTION',
  badges: ['MONSTERVERSE', '4DX MOTION', 'ĐẠI CHIẾN QUÁI THÚ'],
  genres: ['Hành Động', 'Quái Thú', 'Khoa Học Viễn Tưởng'],
  director: {
    name: 'Adam Wingard',
    role: 'ĐẠO DIỄN',
    works: 'Godzilla vs. Kong, Death Note',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Rebecca Hall',
      role: 'Dr. Ilene Andrews',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Brian Tyree Henry',
      role: 'Bernie Hayes',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Dan Stevens',
      role: 'Trapper',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Hai vị vua hùng mạnh Godzilla và Kong phải gạt bỏ những hiềm khích xưa cũ để hợp sức chống lại mối hiểm họa diệt vong mới đang ẩn mình sâu trong Trái Đất Rỗng.',
  synopsisP2:
    'Cùng nhau, họ bước vào một cuộc chiến sinh tử hoành tráng để bảo vệ sự tồn vong của nhân loại và khám phá nguồn gốc lịch sử của các Titan cổ đại.',
  awards: [
    {
      title: 'Kỷ Lục Doanh Thu Quái Thú Mùa Hè',
      sub: '+570 Triệu USD phòng vé toàn cầu',
    },
  ],
  criticScore: '8.5',
  criticReviewCount: '170 bài phê bình',
  masterpieceRate: '88%',
  featuredQuote:
    'Bữa tiệc kỹ xảo thị giác và âm thanh rung chuyển phòng chiếu dành cho người hâm mộ quái thú.',
  featuredAuthor: 'IGN',
};

export const KUNG_FU_PANDA_4_MOVIE_DATA: MovieDetails = {
  id: 11,
  title: 'Kung Fu Panda 4',
  originalTitle: 'Kung Fu Panda 4 (2024)',
  posterUrl: 'https://image.tmdb.org/t/p/w780/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
  backdropUrl:
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/_inKs4eeHiI?autoplay=1',
  rating: 8.3,
  ratingCount: '210k lượt',
  rottenTomatoes: '87%',
  ageRating: 'P • 2D LỒNG TIẾNG',
  runtime: "94'",
  releaseDate: '08/03/2024',
  formatBadge: '2D LỒNG TIẾNG',
  badges: ['HOẠT HÌNH GIA ĐÌNH', 'VÕ THUẬT HÀI HƯỚC', 'LỒNG TIẾNG VIP'],
  genres: ['Hoạt Hình', 'Võ Thuật', 'Hài Hước'],
  director: {
    name: 'Mike Mitchell',
    role: 'ĐẠO DIỄN',
    works: 'Shrek Forever After, Trolls',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Jack Black',
      role: 'Po (Thần Long Đại Hiệp)',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Awkwafina',
      role: 'Zhen',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Viola Davis',
      role: 'Tắc Kè Hoa',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Gấu Po chuẩn bị đảm nhận vai trò Thủ lĩnh tinh thần của Thung lũng Hòa Bình và cần tìm một Thần Long Đại Hiệp mới để truyền thừa.',
  synopsisP2:
    'Trên hành trình đó, Po phải hợp tác với nàng cáo Zhen lém lỉnh để đối đầu với mụ phù thủy biến hình Tắc Kè Hoa độc ác.',
  awards: [
    {
      title: 'Top Phim Hoạt Hình Bán Vé Chạy Nhất',
      sub: '+540 Triệu USD phòng vé toàn cầu',
    },
  ],
  criticScore: '8.3',
  criticReviewCount: '150 bài phê bình',
  masterpieceRate: '85%',
  featuredQuote:
    'Năng lượng tràn đầy của Jack Black tiếp tục làm sáng bừng hành trình võ thuật hài hước của gấu Po.',
  featuredAuthor: 'Variety',
};

export const MAI_MOVIE_DATA: MovieDetails = {
  id: 12,
  title: 'Mai',
  originalTitle: 'Mai (2024)',
  posterUrl:
    'https://upload.wikimedia.org/wikipedia/vi/3/36/Mai_2024_poster.jpg?utm_source=vi.wikipedia.org&utm_campaign=index&utm_content=original',
  backdropUrl:
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/5a4G11566gM?autoplay=1',
  rating: 8.7,
  ratingCount: '620k lượt',
  rottenTomatoes: '92%',
  ageRating: 'T18 • Tâm Lý',
  runtime: "131'",
  releaseDate: '10/02/2024',
  formatBadge: 'TOP 1 VIỆT NAM',
  badges: ['KỶ LỤC PHÒNG VÉ VIỆT', 'TÂM LÝ TÌNH CẢM', 'TOP 1 VIỆT NAM'],
  genres: ['Tâm Lý', 'Tình Cảm', 'Chính Kịch'],
  director: {
    name: 'Trấn Thành',
    role: 'ĐẠO DIỄN / ĐỒNG BIÊN KỊCH',
    works: 'Bố Già, Nhà Bà Nữ',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Phương Anh Đào',
      role: 'Mai',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Tuấn Trần',
      role: 'Dương',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Hồng Đào',
      role: 'Bà Đào',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Mai là một người phụ nữ làm nghề mát-xa trị liệu, luôn gánh trên vai những mặc cảm về quá khứ và định kiến xã hội khắt khe.',
  synopsisP2:
    'Cuộc gặp gỡ tình cờ với Dương – chàng nhạc công lãng tử nhà bên – đã thắp lên ngọn lửa hy vọng, nhưng khoảng cách cuộc sống và gia đình liệu có để tình yêu của họ cập bến?',
  awards: [
    {
      title: 'Kỷ Lục Phòng Vé Việt Nam Mọi Thời Đại',
      sub: '+550 Tỷ VNĐ doanh thu lịch sử',
    },
  ],
  criticScore: '8.8',
  criticReviewCount: '160 bài phê bình',
  masterpieceRate: '90%',
  featuredQuote:
    'Diễn xuất chạm đáy cảm xúc của Phương Anh Đào và Tuấn Trần đem lại một câu chuyện tình yêu đầy day dứt.',
  featuredAuthor: 'Tuổi Trẻ Phim Ảnh',
};

export const SPIDER_VERSE_MOVIE_DATA: MovieDetails = {
  id: 13,
  title: 'Spider-Man: Du Hành Vũ Trụ Nhện',
  originalTitle: 'Spider-Man: Across the Spider-Verse (2023)',
  posterUrl: 'https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
  backdropUrl:
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/cqGjhVJWtEg?autoplay=1',
  rating: 9.5,
  ratingCount: '780k lượt',
  rottenTomatoes: '96%',
  ageRating: 'K • IMAX LASER',
  runtime: "140'",
  releaseDate: '02/06/2023',
  formatBadge: 'IMAX LASER',
  badges: ['SIÊU PHẨM HOẠT HÌNH', 'ĐA VŨ TRỤ NHỆN', 'IMAX LASER'],
  genres: ['Hoạt Hình', 'Siêu Anh Hùng', 'Hành Động'],
  director: {
    name: 'Joaquim Dos Santos',
    role: 'ĐẠO DIỄN',
    works: 'Spider-Verse',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Shameik Moore',
      role: 'Miles Morales',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Hailee Steinfeld',
      role: 'Gwen Stacy',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Oscar Isaac',
      role: 'Miguel O’Hara',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Miles Morales gặp lại Gwen Stacy và bước vào hành trình xuyên qua đa vũ trụ, nơi anh gặp gỡ Quân đoàn Người Nhện.',
  synopsisP2:
    'Khi các Người Nhện xung đột về cách xử lý một hiểm họa đa chiều, Miles phải tự định nghĩa lại ý nghĩa thực sự của việc làm một người anh hùng.',
  awards: [
    {
      title: 'Đề cử Oscar Phim Hoạt Hình Xuất Sắc Nhất',
      sub: 'Giải Thưởng Viện Hàn Lâm',
    },
  ],
  criticScore: '9.5',
  criticReviewCount: '320 bài phê bình',
  masterpieceRate: '96%',
  featuredQuote:
    'Một tuyệt tác thị giác đỉnh cao, thiết lập tiêu chuẩn mới cho hoạt hình thế giới.',
  featuredAuthor: 'Empire',
};

export const AVATAR_2_MOVIE_DATA: MovieDetails = {
  id: 14,
  title: 'Avatar: Dòng Chảy Của Nước',
  originalTitle: 'Avatar: The Way of Water (2022)',
  posterUrl: 'https://image.tmdb.org/t/p/w780/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
  backdropUrl:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/d9MyW72ELq0?autoplay=1',
  rating: 9.1,
  ratingCount: '920k lượt',
  rottenTomatoes: '92%',
  ageRating: 'T13 • 3D HFR IMAX',
  runtime: "192'",
  releaseDate: '16/12/2022',
  formatBadge: '3D HFR IMAX',
  badges: ['TOP 3 MỌI THỜI ĐẠI', 'KỸ XẢO ĐẠI DƯƠNG', '3D HFR IMAX'],
  genres: ['Khoa Học Viễn Tưởng', 'Phiêu Lưu', 'Hành Động'],
  director: {
    name: 'James Cameron',
    role: 'ĐẠO DIỄN / ĐỒNG BIÊN KỊCH',
    works: 'Titanic, Terminator 2',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Sam Worthington',
      role: 'Jake Sully',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Zoe Saldana',
      role: 'Neytiri',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Sigourney Weaver',
      role: 'Kiri',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Jake Sully và Neytiri đã có gia đình riêng trên hành tinh Pandora, nhưng mối đe dọa cũ từ người Trái Đất quay trở lại.',
  synopsisP2:
    'Họ buộc phải rời khỏi rừng rậm để nương náu ở bộ tộc rạn san hô Metkayina và học cách hòa nhập với đại dương bao la.',
  awards: [
    {
      title: 'Oscar Kỹ Xảo Điện Ảnh Đỉnh Cao',
      sub: '+2.32 Tỷ USD phòng vé toàn cầu',
    },
  ],
  criticScore: '9.1',
  criticReviewCount: '410 bài phê bình',
  masterpieceRate: '92%',
  featuredQuote:
    'Trải nghiệm thị giác vượt qua mọi ranh giới của công nghệ điện ảnh hiện đại.',
  featuredAuthor: 'The Hollywood Reporter',
};

export const DESPICABLE_ME_4_MOVIE_DATA: MovieDetails = {
  id: 15,
  title: 'Kẻ Trộm Mặt Trăng 4',
  originalTitle: 'Despicable Me 4 (2024)',
  posterUrl: 'https://image.tmdb.org/t/p/w780/wWba3TaojhK7NdycRhoQpsG0FaH.jpg',
  backdropUrl:
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/qQlr9-gF32c?autoplay=1',
  rating: 8.2,
  ratingCount: '180k lượt',
  rottenTomatoes: '88%',
  ageRating: 'P • 2D/3D LỒNG TIẾNG',
  runtime: "95'",
  releaseDate: '03/07/2024',
  formatBadge: '2D/3D LỒNG TIẾNG',
  badges: ['MINIONS ĐÌNH ĐÁM', 'HÀI HƯỚC GIA ĐÌNH', 'LỒNG TIẾNG'],
  genres: ['Hoạt Hình', 'Hài Hước', 'Gia Đình'],
  director: {
    name: 'Chris Renaud',
    role: 'ĐẠO DIỄN',
    works: 'Despicable Me 1 & 2',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Steve Carell',
      role: 'Gru',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Kristen Wiig',
      role: 'Lucy',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Will Ferrell',
      role: 'Maxime Le Mal',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Gru chào đón thành viên mới Gru Jr., cậu nhóc luôn quấy phá bố mình nhưng vô cùng thông minh lém lỉnh.',
  synopsisP2:
    'Khi kẻ thù Maxime Le Mal vượt ngục tìm cách báo thù, cả gia đình Gru cùng biệt đội Mega Minions phải bước vào nhiệm vụ giải cứu hài hước.',
  awards: [
    {
      title: 'Top 3 Doanh Thu Hoạt Hình 2024',
      sub: '+950 Triệu USD phòng vé toàn cầu',
    },
  ],
  criticScore: '8.2',
  criticReviewCount: '130 bài phê bình',
  masterpieceRate: '84%',
  featuredQuote:
    'Tràn ngập tiếng cười sảng khoái và sự ngộ nghĩnh không thể cưỡng lại của những chú Minions.',
  featuredAuthor: 'Deadline',
};

export const ALIEN_ROMULUS_MOVIE_DATA: MovieDetails = {
  id: 16,
  title: 'Quái Vật Không Gian: Romulus',
  originalTitle: 'Alien: Romulus (2024)',
  posterUrl:
    'https://bazaarvietnam.vn/wp-content/uploads/2024/08/BZ-ALIEN-ROMULUS-REVIEW-11.jpg',
  backdropUrl:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/x0XDEhP4MQs?autoplay=1',
  rating: 8.6,
  ratingCount: '240k lượt',
  rottenTomatoes: '86%',
  ageRating: 'T18 • SCREENX 270°',
  runtime: "119'",
  releaseDate: '16/08/2024',
  formatBadge: 'SCREENX 270°',
  badges: ['KINH DỊ KHÔNG GIAN', 'SCREENX 270°', 'XENOMORPH'],
  genres: ['Kinh Dị', 'Không Gian', 'Khoa Học Viễn Tưởng'],
  director: {
    name: 'Fede Álvarez',
    role: 'ĐẠO DIỄN',
    works: 'Don’t Breathe, Evil Dead',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Cailee Spaeny',
      role: 'Rain',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'David Jonsson',
      role: 'Andy',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Archie Renaux',
      role: 'Tyler',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Một nhóm bạn trẻ dọn phế liệu trên trạm vũ trụ bỏ hoang nhằm tìm cơ hội đổi đời rời khỏi hành tinh thuộc địa tăm tối.',
  synopsisP2:
    'Tại đây, họ không ngờ đã đánh thức dạng sống kinh hoàng và nguy hiểm nhất trong toàn cõi vũ trụ: quái vật Xenomorph.',
  awards: [
    {
      title: 'Bom Tấn Kinh Dị Đỉnh Cao 2024',
      sub: '+350 Triệu USD phòng vé toàn cầu',
    },
  ],
  criticScore: '8.6',
  criticReviewCount: '190 bài phê bình',
  masterpieceRate: '87%',
  featuredQuote:
    'Sự trở lại nghẹt thở và thuần khiết nhất của thương hiệu huyền thoại Alien.',
  featuredAuthor: 'Rolling Stone',
};

export const INTERSTELLAR_MOVIE_DATA: MovieDetails = {
  id: 17,
  title: 'Hố Đen Tử Thần (Interstellar)',
  originalTitle: 'Interstellar (2014)',
  posterUrl:
    'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
  backdropUrl:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1',
  rating: 9.6,
  ratingCount: '1.2M lượt',
  rottenTomatoes: '95%',
  ageRating: 'T13 • IMAX 70MM',
  runtime: "169'",
  releaseDate: 'Tái chiếu kỷ niệm 10 năm',
  formatBadge: 'IMAX 70MM',
  badges: ['KIỆT TÁC THẾ KỶ', 'IMAX 70MM', 'OSCAR KỸ XẢO'],
  genres: ['Khoa Học Viễn Tưởng', 'Sử Thi', 'Tình Cảm Gia Đình'],
  director: {
    name: 'Christopher Nolan',
    role: 'ĐẠO DIỄN',
    works: 'Oppenheimer, Inception',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Matthew McConaughey',
      role: 'Cooper',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Anne Hathaway',
      role: 'Brand',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Jessica Chastain',
      role: 'Murph',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Khi Trái Đất dần cạn kiệt tài nguyên và sự sống đứng trước bờ vực tuyệt chủng, cựu phi công NASA Cooper được giao sứ mệnh vĩ đại.',
  synopsisP2:
    'Anh cùng các nhà khoa học bay qua một lỗ sâu vũ trụ để tìm kiếm một hành tinh mới có thể duy trì sự sống cho toàn thể nhân loại.',
  awards: [
    {
      title: 'Oscar Hiệu Ứng Thị Giác Xuất Sắc',
      sub: 'Tác phẩm khoa học viễn tưởng kinh điển',
    },
  ],
  criticScore: '9.6',
  criticReviewCount: '450 bài phê bình',
  masterpieceRate: '96%',
  featuredQuote:
    'Tình yêu là thứ duy nhất vượt qua mọi rào cản của không gian và thời gian.',
  featuredAuthor: 'Roger Ebert',
};

export const INCEPTION_MOVIE_DATA: MovieDetails = {
  id: 18,
  title: 'Kẻ Đánh Cắp Giấc Mơ',
  originalTitle: 'Inception (2010)',
  posterUrl:
    'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg',
  backdropUrl:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0?autoplay=1',
  rating: 9.5,
  ratingCount: '1.1M lượt',
  rottenTomatoes: '94%',
  ageRating: 'T16 • DOLBY ATMOS',
  runtime: "148'",
  releaseDate: 'Tái chiếu định dạng IMAX',
  formatBadge: 'DOLBY ATMOS',
  badges: ['4 GIẢI OSCAR', 'ĐẤU TRÍ ĐỈNH CAO', 'DOLBY ATMOS'],
  genres: ['Hành Động', 'Trí Tuệ', 'Khoa Học Viễn Tưởng'],
  director: {
    name: 'Christopher Nolan',
    role: 'ĐẠO DIỄN',
    works: 'Interstellar, The Dark Knight',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Leonardo DiCaprio',
      role: 'Dom Cobb',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Joseph Gordon-Levitt',
      role: 'Arthur',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Elliot Page',
      role: 'Ariadne',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Dom Cobb là một đạo chích bậc thầy chuyên đánh cắp bí mật của mục tiêu khi họ đang chìm trong trạng thái giấc mơ dễ bị tổn thương nhất.',
  synopsisP2:
    'Anh được trao cơ hội chuộc lại cuộc đời tự do thông qua một nhiệm vụ bất khả thi: không phải đánh cắp mà là cấy ghép một ý tưởng vào sâu trong tiềm thức.',
  awards: [
    {
      title: '4 Giải Oscar Danh Giá',
      sub: 'Âm thanh & Quay phim xuất sắc nhất',
    },
  ],
  criticScore: '9.5',
  criticReviewCount: '380 bài phê bình',
  masterpieceRate: '95%',
  featuredQuote:
    'Một mê cung trí tuệ hoàn hảo khiến người xem không ngừng suy ngẫm về thực tại.',
  featuredAuthor: 'Empire',
};

export const BATMAN_MOVIE_DATA: MovieDetails = {
  id: 19,
  title: 'The Batman: Vạch Trần Sự Thật',
  originalTitle: 'The Batman (2022)',
  posterUrl: 'https://image.tmdb.org/t/p/w780/74xTEgt7R36Fpooo50r9T25onhq.jpg',
  backdropUrl:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/mqqft2x_Aa4?autoplay=1',
  rating: 8.9,
  ratingCount: '650k lượt',
  rottenTomatoes: '89%',
  ageRating: 'T16 • 4DX MOTION',
  runtime: "176'",
  releaseDate: 'Tái chiếu đặc biệt',
  formatBadge: '4DX MOTION',
  badges: ['TRINH THÁM ĐEN TỐI', 'DC COMICS', '4DX MOTION'],
  genres: ['Trinh Thám', 'Hành Động', 'Tội Phạm'],
  director: {
    name: 'Matt Reeves',
    role: 'ĐẠO DIỄN',
    works: 'Planet of the Apes Trilogy',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Robert Pattinson',
      role: 'Bruce Wayne / Batman',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Zoë Kravitz',
      role: 'Selina Kyle / Catwoman',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Paul Dano',
      role: 'The Riddler',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Trong năm thứ hai hoạt động chống tội phạm tại Gotham, Batman đối mặt với một tên sát nhân hàng loạt bí ẩn nhắm vào giới tinh hoa của thành phố.',
  synopsisP2:
    'Những câu đố hiểm ác của Riddler dần bóc trần những bí mật đen tối của gia tộc Wayne và sự mục ruỗng thấu xương của Gotham.',
  awards: [
    {
      title: '3 Đề Cử Giải Oscar',
      sub: 'Âm thanh & Hóa trang xuất sắc',
    },
  ],
  criticScore: '8.9',
  criticReviewCount: '290 bài phê bình',
  masterpieceRate: '90%',
  featuredQuote:
    'Bản hùng ca trinh thám noir chân thực và u tối nhất về Hiệp sĩ bóng đêm.',
  featuredAuthor: 'The Guardian',
};

export const EXHUMA_MOVIE_DATA: MovieDetails = {
  id: 20,
  title: 'Quật Mộ Trùng Ma',
  originalTitle: 'Exhuma (2024)',
  posterUrl:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
  backdropUrl:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/5a4G11566gM?autoplay=1',
  rating: 8.8,
  ratingCount: '480k lượt',
  rottenTomatoes: '92%',
  ageRating: 'T18 • TOP 1 HÀN QUỐC',
  runtime: "134'",
  releaseDate: '15/03/2024',
  formatBadge: 'TOP 1 HÀN QUỐC',
  badges: ['KINH DỊ TÂM LINH', 'TOP 1 PHÒNG VÉ HÀN', 'GIẢI BAEKSANG'],
  genres: ['Kinh Dị', 'Thần Bí', 'Tâm Linh'],
  director: {
    name: 'Jang Jae-hyun',
    role: 'ĐẠO DIỄN',
    works: 'The Priests, Svaha: The Sixth Finger',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Kim Go-eun',
      role: 'Pháp sư Hwa-rim',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Choi Min-sik',
      role: 'Thầy phong thủy Sang-deok',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Lee Do-hyun',
      role: 'Bong-gil',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Một gia đình siêu giàu gốc Hàn tại Mỹ gặp phải những hiện tượng huyền bí liên tiếp và quyết định nhờ hai pháp sư trẻ cùng thầy phong thủy khai quật mộ tổ tiên.',
  synopsisP2:
    'Ngôi mộ cổ tọa lạc tại một vùng đất cấm hiểm trở đã giải phóng một thế lực tà ác ghê rợn vượt ra ngoài tầm kiểm soát của con người.',
  awards: [
    {
      title: 'Đại Thắng Giải Thưởng Baeksang 2024',
      sub: '+11 Triệu vé tại Hàn Quốc & +200 Tỷ VNĐ tại VN',
    },
  ],
  criticScore: '8.8',
  criticReviewCount: '140 bài phê bình',
  masterpieceRate: '91%',
  featuredQuote:
    'Diễn xuất bùng nổ của Kim Go-eun và Lee Do-hyun tạo nên bước ngoặt mới cho dòng phim kinh dị Á Đông.',
  featuredAuthor: 'Korea JoongAng Daily',
};

export const SPIRITED_AWAY_MOVIE_DATA: MovieDetails = {
  id: 21,
  title: 'Vùng Đất Linh Hồn (Spirited Away)',
  originalTitle: 'Spirited Away (2001)',
  posterUrl: 'https://image.tmdb.org/t/p/w780/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
  backdropUrl:
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/ByXuk9QqQkk?autoplay=1',
  rating: 9.3,
  ratingCount: '890k lượt',
  rottenTomatoes: '97%',
  ageRating: 'P • GHIBLI CLASSIC',
  runtime: "125'",
  releaseDate: 'Tái chiếu kinh điển Ghibli',
  formatBadge: 'GHIBLI CLASSIC',
  badges: ['GIẢI OSCAR HOẠT HÌNH', 'GHIBLI HUYỀN THOẠI', 'KỲ ẢO'],
  genres: ['Anime', 'Kỳ Ảo', 'Phiêu Lưu'],
  director: {
    name: 'Hayao Miyazaki',
    role: 'ĐẠO DIỄN / BIÊN KỊCH',
    works: 'My Neighbor Totoro, Princess Mononoke',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Rumi Hiiragi',
      role: 'Chihiro / Sen',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Miyu Irino',
      role: 'Haku',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Mari Natsuki',
      role: 'Yubaba',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Cô bé Chihiro 10 tuổi tình cờ lạc vào thế giới ma thuật của các linh hồn sau khi cha mẹ bị biến thành lợn vì trót ăn đồ cúng linh thiêng.',
  synopsisP2:
    'Để giải cứu cha mẹ và tìm đường trở lại thế giới loài người, Chihiro phải làm việc cật lực tại nhà tắm công cộng của mụ phù thủy Yubaba.',
  awards: [
    {
      title: 'Oscar Phim Hoạt Hình Xuất Sắc Nhất',
      sub: 'Tác phẩm anime đầu tiên đoạt giải Oscar',
    },
  ],
  criticScore: '9.6',
  criticReviewCount: '270 bài phê bình',
  masterpieceRate: '97%',
  featuredQuote:
    'Một trong những kiệt tác hoạt hình vĩ đại và giàu trí tưởng tượng nhất mọi thời đại.',
  featuredAuthor: 'BBC Culture',
};

export const PARASITE_MOVIE_DATA: MovieDetails = {
  id: 22,
  title: 'Ký Sinh Trùng (Parasite)',
  originalTitle: 'Parasite (2019)',
  posterUrl: 'https://image.tmdb.org/t/p/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
  backdropUrl:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/5xH0RZE7Z4E?autoplay=1',
  rating: 9.2,
  ratingCount: '950k lượt',
  rottenTomatoes: '99%',
  ageRating: 'T18 • OSCAR BEST PICTURE',
  runtime: "132'",
  releaseDate: 'Tái chiếu đặc biệt',
  formatBadge: 'OSCAR BEST PICTURE',
  badges: ['4 TƯỢNG VÀNG OSCAR', 'CÀNH CỌ VÀNG CANNES', 'TÂM LÝ GIẬT GÂN'],
  genres: ['Tâm Lý', 'Giật Gân', 'Hài Kịch Đen'],
  director: {
    name: 'Bong Joon-ho',
    role: 'ĐẠO DIỄN',
    works: 'Memories of Murder, Snowpiercer',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Song Kang-ho',
      role: 'Kim Ki-taek',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Choi Woo-shik',
      role: 'Ki-woo',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Park蓄 So-dam',
      role: 'Ki-jung',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Gia đình nghèo 4 người sống chen chúc dưới căn hộ bán hầm tại Seoul dần tìm cách thâm nhập vào cuộc sống của gia đình tài phiệt Park giàu có.',
  synopsisP2:
    'Những toan tính cộng sinh dần biến thành một thảm kịch kinh hoàng khi một bí mật đen tối bên dưới căn biệt thự xa hoa bị phơi bày.',
  awards: [
    {
      title: 'Lịch Sử 4 Tượng Vàng Oscar 2020',
      sub: 'Phim nói tiếng nước ngoài đầu tiên đoạt Phim hay nhất',
    },
  ],
  criticScore: '9.8',
  criticReviewCount: '420 bài phê bình',
  masterpieceRate: '99%',
  featuredQuote:
    'Một tác phẩm điện ảnh sắc bén, tinh tế và tàn nhẫn phơi bày hố sâu ngăn cách giai cấp.',
  featuredAuthor: 'The New York Times',
};

export const HOWLS_MOVING_CASTLE_MOVIE_DATA: MovieDetails = {
  id: 23,
  title: 'Lâu Đài Bay Của Pháp Sư Howl',
  originalTitle: "Howl's Moving Castle (2004)",
  posterUrl:
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
  backdropUrl:
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/iwROgK94zcM?autoplay=1',
  rating: 9.1,
  ratingCount: '720k lượt',
  rottenTomatoes: '94%',
  ageRating: 'P • GHIBLI CLASSIC',
  runtime: "119'",
  releaseDate: 'Tái chiếu kinh điển Ghibli',
  formatBadge: 'GHIBLI CLASSIC',
  badges: ['GHIBLI TUYỆT TÁC', 'LÃNG MẠN KỲ ẢO', 'ĐỀ CỬ OSCAR'],
  genres: ['Anime', 'Lãng Mạn', 'Kỳ Ảo'],
  director: {
    name: 'Hayao Miyazaki',
    role: 'ĐẠO DIỄN',
    works: 'Spirited Away, Princess Mononoke',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Chieko Baisho',
      role: 'Sophie',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Takuya Kimura',
      role: 'Pháp sư Howl',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Akihiro Miwa',
      role: 'Phù thủy Xứ Hoang',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'Cô thợ làm mũ trẻ tuổi Sophie bị Phù thủy Xứ Hoang yểm bùa biến thành một bà lão 90 tuổi lưng còng tóc bạc.',
  synopsisP2:
    'Sophie rời thị trấn và tình cờ bước chân vào lâu đài di động kỳ lạ của pháp sư điển trai Howl, bắt đầu hành trình tìm lại tuổi thanh xuân.',
  awards: [
    {
      title: 'Đề Cử Oscar Phim Hoạt Hình Xuất Sắc',
      sub: 'Tuyệt phẩm lãng mạn của Hayao Miyazaki',
    },
  ],
  criticScore: '9.2',
  criticReviewCount: '210 bài phê bình',
  masterpieceRate: '93%',
  featuredQuote:
    'Bản tình ca kỳ ảo thơ mộng và thông điệp phản chiến sâu sắc chạm đến trái tim người xem.',
  featuredAuthor: 'The Telegraph',
};

export const JOHN_WICK_4_MOVIE_DATA: MovieDetails = {
  id: 24,
  title: 'Sát Thủ John Wick: Phần 4',
  originalTitle: 'John Wick: Chapter 4 (2023)',
  posterUrl:
    'https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=800&auto=format&fit=crop',
  backdropUrl:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/embed/qEVUtrk8_B4?autoplay=1',
  rating: 9.0,
  ratingCount: '630k lượt',
  rottenTomatoes: '94%',
  ageRating: 'T18 • IMAX LASER',
  runtime: "169'",
  releaseDate: '24/03/2023',
  formatBadge: 'IMAX LASER',
  badges: ['HÀNH ĐỘNG ĐỈNH CAO', 'IMAX LASER', 'SIÊU PHẨM SÁT THỦ'],
  genres: ['Hành Động', 'Giật Gân', 'Tội Phạm'],
  director: {
    name: 'Chad Stahelski',
    role: 'ĐẠO DIỄN',
    works: 'John Wick 1-3',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  cast: [
    {
      name: 'Keanu Reeves',
      role: 'John Wick',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Donnie Yen',
      role: 'Caine',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Bill Skarsgård',
      role: 'Marquis de Gramont',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    },
  ],
  synopsisP1:
    'John Wick tìm ra con đường duy nhất để giải thoát bản thân và đánh bại Hội Đồng Tối Cao High Table.',
  synopsisP2:
    'Trước khi có thể giành lại tự do, anh phải đối đầu với một liên minh sát thủ toàn cầu mới do Marquis de Gramont chỉ huy và người bạn cũ Caine.',
  awards: [
    {
      title: 'Đỉnh Cao Doanh Thu Dòng Phim Sát Thủ',
      sub: '+440 Triệu USD phòng vé toàn cầu',
    },
  ],
  criticScore: '9.1',
  criticReviewCount: '310 bài phê bình',
  masterpieceRate: '94%',
  featuredQuote:
    'Đỉnh cao của vũ đạo hành động và kỹ xảo quay phim, một cái kết tráng lệ cho sát thủ Baba Yaga.',
  featuredAuthor: 'The Hollywood Reporter',
};

export const MOVIE_DETAILS_MAP: Record<string, MovieDetails> = {
  // Discovery Movies 1..24
  '1': { ...DUNE_MOVIE_DATA, id: 1 },
  'dune-2': DUNE_MOVIE_DATA,
  '2': FURIOSA_MOVIE_DATA,
  furiosa: FURIOSA_MOVIE_DATA,
  '3': CONAN_MOVIE_DATA,
  conan: CONAN_MOVIE_DATA,
  '4': LAT_MAT_7_MOVIE_DATA,
  'lat-mat-7': LAT_MAT_7_MOVIE_DATA,
  '5': DEADPOOL_WOLVERINE_MOVIE_DATA,
  deadpool: DEADPOOL_WOLVERINE_MOVIE_DATA,
  '6': QUIET_PLACE_MOVIE_DATA,
  'quiet-place': QUIET_PLACE_MOVIE_DATA,
  '7': INSIDE_OUT_2_MOVIE_DATA,
  'inside-out-2': INSIDE_OUT_2_MOVIE_DATA,
  '8': JOKER_2_MOVIE_DATA,
  joker: JOKER_2_MOVIE_DATA,
  '9': OPPENHEIMER_MOVIE_DATA,
  oppenheimer: OPPENHEIMER_MOVIE_DATA,
  '10': GODZILLA_KONG_MOVIE_DATA,
  'godzilla-kong': GODZILLA_KONG_MOVIE_DATA,
  'godzilla-x-kong': GODZILLA_KONG_MOVIE_DATA,
  '11': KUNG_FU_PANDA_4_MOVIE_DATA,
  'kung-fu-panda-4': KUNG_FU_PANDA_4_MOVIE_DATA,
  '12': MAI_MOVIE_DATA,
  mai: MAI_MOVIE_DATA,
  '13': SPIDER_VERSE_MOVIE_DATA,
  'spider-man-spider-verse': SPIDER_VERSE_MOVIE_DATA,
  '14': AVATAR_2_MOVIE_DATA,
  avatar: AVATAR_2_MOVIE_DATA,
  '15': DESPICABLE_ME_4_MOVIE_DATA,
  'ke-trom-mat-trang-4': DESPICABLE_ME_4_MOVIE_DATA,
  '16': ALIEN_ROMULUS_MOVIE_DATA,
  'alien-romulus': ALIEN_ROMULUS_MOVIE_DATA,
  '17': INTERSTELLAR_MOVIE_DATA,
  interstellar: INTERSTELLAR_MOVIE_DATA,
  '18': INCEPTION_MOVIE_DATA,
  inception: INCEPTION_MOVIE_DATA,
  '19': BATMAN_MOVIE_DATA,
  'the-batman': BATMAN_MOVIE_DATA,
  '20': EXHUMA_MOVIE_DATA,
  exhuma: EXHUMA_MOVIE_DATA,
  '21': SPIRITED_AWAY_MOVIE_DATA,
  'spirited-away': SPIRITED_AWAY_MOVIE_DATA,
  '22': PARASITE_MOVIE_DATA,
  parasite: PARASITE_MOVIE_DATA,
  '23': HOWLS_MOVING_CASTLE_MOVIE_DATA,
  'howls-moving-castle': HOWLS_MOVING_CASTLE_MOVIE_DATA,
  '24': JOHN_WICK_4_MOVIE_DATA,
  'john-wick-4': JOHN_WICK_4_MOVIE_DATA,

  // Now Showing Movies 101..105
  '101': NAM_BUOC_DE_YEU_DATA,
  'nam-buoc-de-yeu': NAM_BUOC_DE_YEU_DATA,
  '102': HAM_CA_MAP_DATA,
  'ham-ca-map': HAM_CA_MAP_DATA,
  '103': BAY_THI_THE_DATA,
  '7-thi-the': BAY_THI_THE_DATA,
  '104': SPIDERMAN_DATA,
  'spider-man': SPIDERMAN_DATA,
  '105': THOR_DATA,
  thor: THOR_DATA,
};

/**
 * Lấy dữ liệu chi tiết của phim theo ID hoặc slug.
 * Lấy trực tiếp từ bảng dữ liệu được khai báo chính xác từng phim,
 * không sử dụng tự động đoán chuỗi/đồng bộ đè ảnh.
 */
export const getMovieDetails = (
  idOrSlug?: string | number,
): MovieDetails => {
  if (!idOrSlug) return DUNE_MOVIE_DATA;
  const key = idOrSlug.toString().toLowerCase().trim();
  return MOVIE_DETAILS_MAP[key] || DUNE_MOVIE_DATA;
};

const VIETNAMESE_DAYS = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
];

export const generateDynamicDayOptions = (): DayOption[] => {
  const options: DayOption[] = [];
  const now = new Date();

  for (let i = 0; i < 6; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);

    const dayOfMonth = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const dayOfWeek = VIETNAMESE_DAYS[d.getDay()];

    let dayLabel = dayOfWeek.toUpperCase();
    if (i === 0) {
      dayLabel = 'HÔM NAY';
    } else if (i === 1) {
      dayLabel = 'NGÀY MAI';
    } else if (d.getDay() === 0 || d.getDay() === 6) {
      dayLabel = 'CUỐI TUẦN';
    } else if (d.getDay() === 1) {
      dayLabel = 'TUẦN MỚI';
    } else if (d.getDay() === 2) {
      dayLabel = 'ƯU ĐÃI';
    }

    const dateStr = `${dayOfMonth}/${month}`;
    const fullDate =
      i === 0
        ? `Hôm nay, ${dateStr}/${year}`
        : `${dayOfWeek}, ${dateStr}/${year}`;

    options.push({
      dayLabel,
      dateStr,
      dayOfWeek,
      fullDate,
    });
  }

  return options;
};

export const DAY_OPTIONS: DayOption[] = generateDynamicDayOptions();

export const FORMAT_FILTERS = [
  { id: 'all', label: 'Tất cả định dạng', count: 18 },
  { id: 'imax', label: 'IMAX Laser 2D', count: 6, isHot: true },
  { id: '2d', label: '2D Phụ đề Quốc tế', count: 9 },
  { id: 'screenx', label: 'ScreenX & 3D', count: 3 },
];

export const CINEMAS_DATA: CinemaSchedule[] = [
  {
    id: 'cgv-landmark-81',
    name: 'CGV Vincom Landmark 81',
    badge: 'IMAX Laser',
    address:
      'Tầng B1, TTTM Vincom Landmark 81, 772 Điện Biên Phủ, Q. Bình Thạnh',
    distance: 'Cách bạn 2.4 km',
    formats: [
      {
        formatName: 'IMAX LASER 2D • PHỤ ĐỀ',
        roomDetails: 'Phòng chiếu IMAX #01 (Màn hình 28m)',
        slots: [
          {
            id: 'lm81-imax-1',
            time: '14:30',
            statusText: 'Còn 42 ghế',
            priceText: '190k',
            price: 190000,
          },
          {
            id: 'lm81-imax-2',
            time: '17:15',
            statusText: 'Sắp kín (12)',
            isAlmostFull: true,
            priceText: '210k',
            price: 210000,
          },
          {
            id: 'lm81-imax-3',
            time: '20:00',
            statusText: 'Sắp kín (6)',
            isAlmostFull: true,
            priceText: '230k',
            price: 230000,
          },
          {
            id: 'lm81-imax-4',
            time: '22:45',
            statusText: 'Còn 78 ghế',
            priceText: '140k',
            price: 140000,
            isMystery: true,
            mysteryDiscount: 40,
          },
        ],
      },
      {
        formatName: '2D TIÊU CHUẨN • DOLBY ATMOS',
        roomDetails: 'Rạp tiêu chuẩn #03 & #05',
        slots: [
          {
            id: 'lm81-2d-1',
            time: '15:00',
            statusText: 'Còn 64 ghế',
            priceText: '130k',
            price: 130000,
          },
          {
            id: 'lm81-2d-2',
            time: '18:30',
            statusText: 'Còn 28 ghế',
            priceText: '145k',
            price: 145000,
          },
          {
            id: 'lm81-2d-3',
            time: '21:15',
            statusText: 'Còn 55 ghế',
            priceText: '145k',
            price: 145000,
          },
        ],
      },
    ],
  },
  {
    id: 'galaxy-nguyen-du',
    name: 'Galaxy Nguyễn Du',
    badge: 'Cine Lounge',
    address: '116 Nguyễn Du, Phường Bến Thành, Quận 1',
    distance: 'Cách bạn 3.8 km',
    formats: [
      {
        formatName: '2D PHỤ ĐỀ TIẾNG VIỆT • PHÒNG VIP',
        roomDetails: 'Phòng VIP Gold Class #02',
        slots: [
          {
            id: 'gxd-1',
            time: '13:45',
            statusText: 'Còn 35 ghế',
            priceText: '120k',
            price: 120000,
          },
          {
            id: 'gxd-2',
            time: '16:40',
            statusText: 'Sắp kín (8)',
            isAlmostFull: true,
            priceText: '135k',
            price: 135000,
          },
          {
            id: 'gxd-3',
            time: '19:50',
            statusText: 'Sắp kín (4)',
            isAlmostFull: true,
            priceText: '150k',
            price: 150000,
          },
        ],
      },
    ],
  },
  {
    id: 'bhd-bitexco',
    name: 'BHD Star Cineplex Bitexco',
    badge: 'First Class',
    address: 'Tầng 3 & 4, Bitexco Financial Tower, 2 Hải Triều, Quận 1',
    distance: 'Cách bạn 4.1 km',
    formats: [
      {
        formatName: '2D FIRST CLASS GHẾ GIƯỜNG NẰM VIP',
        roomDetails: 'Phòng First Class Suite #01',
        slots: [
          {
            id: 'bhd-1',
            time: '17:30',
            statusText: 'Còn 16 ghế',
            priceText: '250k',
            price: 250000,
          },
          {
            id: 'bhd-2',
            time: '20:45',
            statusText: 'Còn 10 ghế',
            priceText: '280k',
            price: 280000,
          },
        ],
      },
    ],
  },
  {
    id: 'lotte-nowzone',
    name: 'Lotte Cinema Nowzone',
    badge: 'Charlotte Room',
    address: 'Tầng 5, TTTM Nowzone, 235 Nguyễn Văn Cừ, Quận 1',
    distance: 'Cách bạn 5.3 km',
    formats: [
      {
        formatName: '2D PHỤ ĐỀ TIÊU CHUẨN',
        roomDetails: 'Phòng chiếu #04',
        slots: [
          {
            id: 'lotte-1',
            time: '16:00',
            statusText: 'Còn 50 ghế',
            priceText: '110k',
            price: 110000,
          },
          {
            id: 'lotte-2',
            time: '19:30',
            statusText: 'Còn 22 ghế',
            priceText: '125k',
            price: 125000,
          },
          {
            id: 'lotte-3',
            time: '22:15',
            statusText: 'Còn 40 ghế',
            priceText: '85k',
            price: 85000,
            isMystery: true,
            mysteryDiscount: 35,
          },
        ],
      },
    ],
  },
];
