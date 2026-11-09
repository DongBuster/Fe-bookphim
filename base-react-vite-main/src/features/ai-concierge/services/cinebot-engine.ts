import {
  type CityName,
  normalizeCityName,
  getCinemasByCity,
} from '@/shared/data/city-theaters-data';
import type {
  ConciergeChatResponseData,
  RecommendedMovieDto,
} from '@shared/types/api.types';

// Danh mục phim nổi bật được tuyển chọn cho CineBot AI
const CURATED_CINEBOT_MOVIES: (RecommendedMovieDto & {
  keywords: string[];
  genres: string[];
})[] = [
  {
    id: 'dune-phan-hai',
    title: 'Dune: Hành Tinh Cát - Phần Hai',
    slug: 'dune-phan-hai',
    posterUrl:
      'https://image.tmdb.org/t/p/w780/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    imdbRating: 8.6,
    genre: 'Khoa Học Viễn Tưởng',
    genres: ['Khoa Học Viễn Tưởng', 'Sử Thi', 'Phiêu Lưu', 'Hành Động'],
    matchReason: 'Trải nghiệm đỉnh cao trên màn hình IMAX Laser',
    keywords: [
      'dune',
      'hành tinh cát',
      'viễn tưởng',
      'sci-fi',
      'imax',
      'paul atreides',
      'hoành tráng',
    ],
  },
  {
    id: 'deadpool-va-wolverine',
    title: 'Deadpool & Wolverine',
    slug: 'deadpool-va-wolverine',
    posterUrl:
      'https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    imdbRating: 9.2,
    genre: 'Hành Động • Hài Hước',
    genres: ['Hành Động', 'Hài Hước', 'Siêu Anh Hùng'],
    matchReason: 'Bộ đôi siêu anh hùng bùng nổ phòng vé 2024',
    keywords: [
      'deadpool',
      'wolverine',
      'marvel',
      'hành động',
      'hài',
      'hài hước',
      'siêu anh hùng',
      '18+',
    ],
  },
  {
    id: 'nhim-sonic-3',
    title: 'Nhím Sonic 3',
    slug: 'nhim-sonic-3',
    posterUrl:
      'https://image.tmdb.org/t/p/w780/nyErB6q97F1b30uQeHhQ4z5h9uR.jpg',
    imdbRating: 8.4,
    genre: 'Hoạt Hình • Gia Đình',
    genres: ['Hoạt Hình', 'Gia Đình', 'Phiêu Lưu', 'Hài Hước'],
    matchReason: 'Thích hợp cho cả gia đình và khán giả trẻ',
    keywords: [
      'sonic',
      'nhím',
      'hoạt hình',
      'trẻ em',
      'gia đình',
      'shadow',
      'tốc độ',
    ],
  },
  {
    id: 'nhung-manh-ghep-cam-xuc-2',
    title: 'Những Mảnh Ghép Cảm Xúc 2 (Inside Out 2)',
    slug: 'nhung-manh-ghep-cam-xuc-2',
    posterUrl:
      'https://image.tmdb.org/t/p/w780/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    imdbRating: 7.7,
    genre: 'Hoạt Hình • Tâm Lý',
    genres: ['Hoạt Hình', 'Gia Đình', 'Hài Hước', 'Tâm Lý'],
    matchReason: 'Bộ phim hoạt hình doanh thu cao nhất mọi thời đại',
    keywords: [
      'inside out',
      'mảnh ghép cảm xúc',
      'cảm xúc',
      'hoạt hình',
      'pixar',
      'trẻ em',
      'tâm lý',
    ],
  },
  {
    id: 'alien-romulus',
    title: 'Quái Vật Không Gian: Romulus',
    slug: 'alien-romulus',
    posterUrl:
      'https://image.tmdb.org/t/p/w780/b33nnKl12vfBN9kvZ0gYoTXumks.jpg',
    imdbRating: 7.3,
    genre: 'Kinh Dị • Viễn Tưởng',
    genres: ['Kinh Dị', 'Khoa Học Viễn Tưởng', 'Giật Gân'],
    matchReason: 'Kinh dị vũ trụ chân thực, thót tim từng phút',
    keywords: ['alien', 'romulus', 'quái vật', 'kinh dị', 'giật gân', 'ma', 'sợ hãi'],
  },
  {
    id: 'exhuma',
    title: 'Quật Mộ Trùng Ma (Exhuma)',
    slug: 'exhuma',
    posterUrl:
      'https://image.tmdb.org/t/p/w780/pWv0Yf4X5G8y6c6p6Qc0jX7v0y7.jpg',
    imdbRating: 7.1,
    genre: 'Kinh Dị • Tâm Linh',
    genres: ['Kinh Dị', 'Hồi Hộp', 'Tâm Linh'],
    matchReason: 'Hiện tượng kinh dị tâm linh xứ Hàn với plot twist bất ngờ',
    keywords: ['quật mộ', 'trùng ma', 'exhuma', 'kinh dị', 'tâm linh', 'plot twist', 'hàn quốc'],
  },
  {
    id: 'interstellar',
    title: 'Hố Đen Tử Thần (Interstellar 10th Anniversary)',
    slug: 'ho-den-tu-than-imax-10-nam',
    posterUrl:
      'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    imdbRating: 8.7,
    genre: 'Khoa Học Viễn Tưởng',
    genres: ['Khoa Học Viễn Tưởng', 'Tâm Lý', 'Phiêu Lưu'],
    matchReason: 'Kiệt tác vượt thời gian của Christopher Nolan',
    keywords: ['hố đen', 'tử thần', 'interstellar', 'nolan', 'vũ trụ', 'viễn tưởng'],
  },
  {
    id: 'john-wick-4',
    title: 'John Wick: Phần 4',
    slug: 'john-wick-4',
    posterUrl:
      'https://image.tmdb.org/t/p/w780/vZloFAK7NKnMGKEslUsZloewEG.jpg',
    imdbRating: 7.7,
    genre: 'Hành Động • Giật Gân',
    genres: ['Hành Động', 'Tội Phạm', 'Giật Gân'],
    matchReason: 'Những trường đoạn hành động đỉnh cao không khoan nhượng',
    keywords: ['john wick', 'sát thủ', 'hành động', 'bắn súng', 'kịch tính'],
  },
];

export type CineBotIntent =
  | 'GREETING'
  | 'THEATER_LOCATION'
  | 'PRICING_PROMO'
  | 'MOVIE_SEARCH'
  | 'GENERAL';

/**
 * Nhận diện ý định của người dùng từ văn bản tin nhắn
 */
export function detectUserIntent(text: string): CineBotIntent {
  const lower = text.trim().toLowerCase();

  // 1. Chào hỏi
  const greetingKeywords = [
    'chào',
    'hello',
    'hi bot',
    'xin chào',
    'hey',
    'bạn là ai',
    'ai đây',
    'giới thiệu',
    'bạn làm được gì',
    'tư vấn giúp',
  ];
  if (greetingKeywords.some((k) => lower === k || lower.startsWith(k + ' '))) {
    return 'GREETING';
  }

  // 2. Hỏi giá vé, khuyến mãi, combo
  const pricingKeywords = [
    'giá vé',
    'bao nhiêu tiền',
    'nhiêu tiền',
    'bảng giá',
    'combo',
    'bắp',
    'bỏng ngô',
    'nước',
    'ưu đãi',
    'khuyến mãi',
    'giảm giá',
    'voucher',
    'thành viên',
    'điểm',
    'cinepoints',
  ];
  if (pricingKeywords.some((k) => lower.includes(k))) {
    return 'PRICING_PROMO';
  }

  // 3. Hỏi về rạp, địa điểm, công nghệ chiếu
  const theaterKeywords = [
    'rạp',
    'hà nội',
    'tp. hcm',
    'sài gòn',
    'hồ chí minh',
    'đà nẵng',
    'imax',
    'gold class',
    'cine comfort',
    'screenx',
    'ở đâu',
    'địa chỉ',
    'gần tôi',
    'gần nhất',
    'phòng chiếu',
    'rạp nào',
    'landmark',
    'metropolis',
    'tây hồ',
    'sala',
  ];
  if (theaterKeywords.some((k) => lower.includes(k))) {
    return 'THEATER_LOCATION';
  }

  // 4. Tìm phim theo tên hoặc thể loại
  const movieKeywords = [
    'phim',
    'dune',
    'sonic',
    'deadpool',
    'inside out',
    'quái vật',
    'hố đen',
    'quật mộ',
    'hoạt hình',
    'kinh dị',
    'hành động',
    'hài',
    'tình cảm',
    'viễn tưởng',
    'chiếu rạp',
    'hot',
    'bom tấn',
    'gợi ý',
    'xem gì',
  ];
  if (movieKeywords.some((k) => lower.includes(k))) {
    return 'MOVIE_SEARCH';
  }

  return 'GENERAL';
}

/**
 * Tìm kiếm phim phù hợp nhất dựa trên từ khóa câu hỏi
 */
export function findMatchingMovies(query: string): RecommendedMovieDto[] {
  const lower = query.toLowerCase();

  // Tính điểm khớp cho từng phim
  const scored = CURATED_CINEBOT_MOVIES.map((movie) => {
    let score = 0;
    for (const kw of movie.keywords) {
      if (lower.includes(kw)) score += 3;
    }
    for (const genre of movie.genres) {
      if (lower.includes(genre.toLowerCase())) score += 2;
    }
    if (lower.includes(movie.title.toLowerCase())) score += 5;
    return { movie, score };
  });

  const sorted = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);

  if (sorted.length > 0) {
    return sorted.slice(0, 3).map((s) => s.movie);
  }

  // Mặc định trả về top 3 phim bom tấn có điểm cao nhất
  return CURATED_CINEBOT_MOVIES.slice(0, 3);
}

/**
 * Trả lời thông minh khi hỏi về Chào hỏi (Greeting)
 */
function handleGreeting(city: CityName): ConciergeChatResponseData {
  const replies = [
    `Dạ xin chào! Mình là CineBot — Trợ lý điện ảnh AI của PhimBook tại **${city}**. Bạn muốn mình gợi ý phim bom tấn hot tuần này, tìm suất chiếu IMAX Laser, hay săn ưu đãi vé hôm nay?`,
    `Chào bạn! CineBot rất vui được đồng hành cùng bạn. Hôm nay bạn đang có hứng thú với thể loại phim nào (hành động, kinh dị, hoạt hình gia đình), hay muốn tìm rạp VIP gần bạn nhất tại **${city}**?`,
  ];
  const reply = replies[Math.floor(Math.random() * replies.length)];

  return {
    reply,
    recommendedMovies: CURATED_CINEBOT_MOVIES.slice(0, 2),
    suggestedReplies: [
      `Gợi ý phim hot tuần này`,
      `Rạp IMAX sang trọng tại ${city}`,
      `Bảng giá vé & phòng VIP`,
      `Phim hoạt hình cho trẻ em`,
    ],
  };
}

/**
 * Trả lời thông minh khi hỏi về Rạp / Địa điểm / Công nghệ chiếu
 */
function handleTheaterLocation(query: string, city: CityName): ConciergeChatResponseData {
  const normCity = normalizeCityName(query) || city;
  const cinemas = getCinemasByCity(normCity);
  const cinemaNames = cinemas.slice(0, 3).map((c) => `• **${c.name}** (${c.format}): ${c.address}`).join('\n');

  let reply = `Tại khu vực **${normCity}**, PhimBook kết nối với những cụm rạp sang trọng hàng đầu:\n\n${cinemaNames}\n\n`;

  if (query.toLowerCase().includes('imax')) {
    reply += `✨ *Phòng chiếu IMAX Laser thế hệ mới sở hữu màn hình siêu đại và hệ thống âm thanh vòm 12 kênh, mang lại chiều sâu không gian tối đa.*`;
  } else if (query.toLowerCase().includes('gold') || query.toLowerCase().includes('vip')) {
    reply += `🍷 *Các phòng Gold Class và Cine Comfort được trang bị sofa ngả điện bọc da cao cấp, phục vụ trà chiều và chăn ấm riêng biệt.*`;
  } else {
    reply += `Bạn muốn xem lịch chiếu và giữ ghế trung tâm tại cụm rạp nào ở ${normCity}?`;
  }

  return {
    reply,
    suggestedReplies: [
      `Xem lịch chiếu ${cinemas[0]?.name || 'rạp này'}`,
      `Phim bom tấn đang chiếu tại ${normCity}`,
      `Bảng giá vé phòng VIP`,
      `Đổi sang Hà Nội`,
    ],
  };
}

/**
 * Trả lời thông minh khi hỏi về Giá vé & Ưu đãi
 */
function handlePricingPromo(): ConciergeChatResponseData {
  const reply = `Biểu phí vé và ưu đãi đặc quyền tại hệ thống phòng vé PhimBook như sau:

🎬 **Bảng giá vé tiêu chuẩn & công nghệ cao:**
• **2D Digital Tiêu Chuẩn**: 105.000đ – 120.000đ (Phòng chiếu laser sắc nét)
• **IMAX Laser / ScreenX**: 180.000đ – 210.000đ (Màn chiếu siêu khủng, âm thanh đa tầng)
• **Gold Class VIP / Cine Comfort**: 210.000đ – 250.000đ (Sofa da ngả điện, trà chiều cao cấp)

🍿 **Ưu đãi & Combo ẩm thực:**
• **Combo Bắp Nước Caramel**: từ 75.000đ / phần
• **Đặc quyền VIP Elite**: Tích lũy **5% CinePoints** mỗi đơn hàng và giảm tới **40%** cho các suất chiếu bí ẩn (Mystery Night)!`;

  return {
    reply,
    suggestedReplies: [
      'Gợi ý phim hot tuần này',
      'Tìm rạp IMAX gần tôi',
      'Suất chiếu tối nay',
    ],
  };
}

/**
 * Trả lời thông minh khi Tìm phim theo thể loại hoặc tên
 */
function handleMovieSearch(query: string, city: CityName): ConciergeChatResponseData {
  const matches = findMatchingMovies(query);
  const main = matches[0];

  let reply = '';
  const lower = query.toLowerCase();

  if (lower.includes('kinh dị') || lower.includes('ma')) {
    reply = `Nếu bạn yêu thích cảm giác hồi hộp thót tim và những cú twist bất ngờ, bộ phim **${main.title}** (Điểm IMDb: ${main.imdbRating}) là lựa chọn số một lúc này. Không gian âm thanh vòm Dolby Atmos sẽ khiến bạn nổi da gà từng phân cảnh!`;
  } else if (lower.includes('hoạt hình') || lower.includes('trẻ em') || lower.includes('gia đình')) {
    reply = `Dành cho buổi xem phim ấm áp cùng người thân và các bé, **${main.title}** là bộ phim được yêu thích nhất với thông điệp tích cực, hình ảnh rực rỡ và các suất lồng tiếng thân thiện.`;
  } else if (lower.includes('hành động') || lower.includes('kịch tính') || lower.includes('siêu anh hùng')) {
    reply = `Để thưởng thức những trường đoạn kỹ xảo bùng nổ và hành động mãn nhãn, **${main.title}** (Điểm IMDb: ${main.imdbRating}) tại phòng chiếu IMAX Laser hoặc 3D sẽ mang lại cảm giác nghẹt thở đến từng giây!`;
  } else if (lower.includes('dune') || lower.includes('hành tinh cát')) {
    reply = `**Dune: Hành Tinh Cát - Phần Hai** là một kiệt tác viễn tưởng sử thi của đạo diễn Denis Villeneuve. Trải nghiệm rạp IMAX Laser 70mm với trường thị giác 1.43:1 là định dạng hoàn hảo nhất để đắm chìm vào hành tinh Arrakis!`;
  } else {
    reply = `Dựa trên sở thích của bạn, mình đề xuất **${main.title}** (Điểm IMDb: ${main.imdbRating}) — ${main.matchReason}. Bạn có thể bấm trực tiếp vào thẻ phim bên dưới để xem trailer và chọn suất chiếu đẹp tại **${city}** nhé!`;
  }

  return {
    reply,
    recommendedMovies: matches,
    suggestedReplies: [
      `Xem suất chiếu của ${main.title}`,
      `Tìm phòng chiếu IMAX tại ${city}`,
      `Gợi ý thêm phim khác`,
    ],
  };
}

/**
 * Xử lý làm giàu (Enhance) câu trả lời từ Backend
 * Nếu Backend trả về câu rập khuôn, hàm này sẽ biến hóa thành văn phong tự nhiên, sinh động hơn
 */
export function enhanceBackendResponse(
  backendData: ConciergeChatResponseData,
  userMessage: string,
  currentCity: CityName,
): ConciergeChatResponseData {
  const reply = backendData.reply || '';
  const isGenericTemplate =
    reply.includes('Dựa trên yêu cầu của bạn, bộ phim') &&
    reply.includes('là lựa chọn sáng giá nhất lúc này');

  // Nếu câu trả lời từ backend quá rập khuôn, ta thay bằng văn phong tự nhiên hơn
  if (isGenericTemplate) {
    const movies = backendData.recommendedMovies || [];
    const mainMovie = movies[0];

    if (mainMovie) {
      const intent = detectUserIntent(userMessage);
      if (intent === 'GREETING') {
        return handleGreeting(currentCity);
      }
      if (intent === 'THEATER_LOCATION') {
        return handleTheaterLocation(userMessage, currentCity);
      }
      if (intent === 'PRICING_PROMO') {
        return handlePricingPromo();
      }

      // Trả lời đa dạng cho phim
      const variedReplies = [
        `Gợi ý xuất sắc cho bạn hôm nay chính là siêu phẩm **${mainMovie.title}** (Điểm IMDb: ${mainMovie.imdbRating || '8.6'}). Bộ phim đang nhận được cơn mưa lời khen tại các phòng vé ${currentCity}!`,
        `Nếu bạn đang tìm kiếm trải nghiệm điện ảnh trọn vẹn, **${mainMovie.title}** chắc chắn sẽ làm bạn hài lòng với chất lượng hình ảnh và kịch bản lôi cuốn. Mình đã chuẩn bị sẵn các suất chiếu bên dưới nhé:`,
        `Thật trùng hợp! **${mainMovie.title}** đang là tựa phim thu hút đông đảo khán giả nhất tuần này. Bạn có muốn giữ trước chỗ ngồi hàng ghế VIP trung tâm không?`,
      ];
      const selected = variedReplies[Math.floor(Math.random() * variedReplies.length)];

      return {
        ...backendData,
        reply: selected,
        suggestedReplies: backendData.suggestedReplies?.length
          ? backendData.suggestedReplies
          : [
              `Xem suất chiếu ${mainMovie.title}`,
              `Chọn rạp tại ${currentCity}`,
              `Ưu đãi vé hôm nay`,
            ],
      };
    }
  }

  return backendData;
}

/**
 * Bộ não điều phối chính:
 * 1. Phân tích ngữ cảnh câu hỏi.
 * 2. Ưu tiên xử lý cục bộ các câu Chào hỏi, Hỏi rạp, Bảng giá để phản hồi nhanh, chính xác nhất.
 * 3. Fallback mượt mà khi Backend gặp sự cố.
 */
export function getSmartLocalConciergeResponse(
  message: string,
  city: CityName,
): ConciergeChatResponseData {
  const intent = detectUserIntent(message);

  switch (intent) {
    case 'GREETING':
      return handleGreeting(city);
    case 'THEATER_LOCATION':
      return handleTheaterLocation(message, city);
    case 'PRICING_PROMO':
      return handlePricingPromo();
    case 'MOVIE_SEARCH':
    default:
      return handleMovieSearch(message, city);
  }
}
