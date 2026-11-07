import type {
  CinemaSchedule,
  ScreenFormatGroup,
  ShowtimeSlot,
} from '@/features/movie-details/data/mock-movie-details';

export type CityName = 'TP. HCM' | 'Hà Nội' | 'Đà Nẵng';

export const CITIES_LIST: { id: string; name: CityName; defaultOption: string }[] = [
  { id: 'hcm', name: 'TP. HCM', defaultOption: 'TP. Hồ Chí Minh' },
  { id: 'hanoi', name: 'Hà Nội', defaultOption: 'Hà Nội' },
  { id: 'danang', name: 'Đà Nẵng', defaultOption: 'Đà Nẵng' },
];

export interface CinemaMeta {
  id: string;
  name: string;
  badge: string;
  city: CityName;
  address: string;
  district: string;
  distance: string;
  brand: string;
  brandColor: string;
  format: string;
  formatBg: string;
  formatText: string;
  desc: string;
  image: string;
  shows: string;
  supportedFormats: string[];
}

// ==============================================================================
// 1. CẤP 2: DANH SÁCH 15 CỤM RẠP CHI TIẾT THEO 3 THÀNH PHỐ
// ==============================================================================
export const ALL_CINEMAS: CinemaMeta[] = [
  // ── HÀ NỘI (5 Rạp) ──────────────────────────────────────────────────────────
  {
    id: 'hn-cgv-metropolis',
    name: 'CGV Vincom Metropolis Liễu Giai',
    badge: 'IMAX Laser • Gold Class',
    city: 'Hà Nội',
    district: 'Ba Đình',
    address: 'Tầng 3, TTTM Vincom Center Metropolis, 29 Liễu Giai, Ba Đình, Hà Nội',
    distance: 'Cách bạn 2.1 km',
    brand: 'CGV Flagship',
    brandColor: '#FFB3B0',
    format: 'IMAX LASER • GOLD CLASS',
    formatBg: '#DC9100',
    formatText: '#4F3100',
    desc: 'Cụm rạp flagship quy mô hàng đầu Thủ đô với màn chiếu IMAX Laser siêu nét và phòng chiếu Gold Class với ghế sofa da thư giãn riêng biệt.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
    shows: '36',
    supportedFormats: ['IMAX Laser', 'Gold Class', '2D Digital'],
  },
  {
    id: 'hn-lotte-westlake',
    name: 'Lotte Cinema West Lake Tây Hồ',
    badge: 'Cine Comfort • IMAX',
    city: 'Hà Nội',
    district: 'Tây Hồ',
    address: 'Tầng 4, Lotte Mall West Lake, 272 Võ Chí Công, Tây Hồ, Hà Nội',
    distance: 'Cách bạn 4.5 km',
    brand: 'Lotte Diamond',
    brandColor: '#FFB955',
    format: 'IMAX LASER • CINE COMFORT',
    formatBg: '#FF535A',
    formatText: '#5B000D',
    desc: 'Phòng chiếu Cine Comfort hiện đại nhất miền Bắc với ghế bọc nhung ngả điện 160 độ, máy chiếu Laser Christie 4K thế hệ mới nhất.',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
    shows: '40',
    supportedFormats: ['IMAX Laser', 'Cine Comfort', '2D Digital'],
  },
  {
    id: 'hn-bhd-phamngocthach',
    name: 'BHD Star Vincom Phạm Ngọc Thạch',
    badge: 'First Class VIP',
    city: 'Hà Nội',
    district: 'Đống Đa',
    address: 'Tầng 8, Vincom Center, 2 Phạm Ngọc Thạch, Đống Đa, Hà Nội',
    distance: 'Cách bạn 3.2 km',
    brand: 'BHD Star Suite',
    brandColor: '#34c759',
    format: 'FIRST CLASS • DOLBY 7.1',
    formatBg: '#2a2a2b',
    formatText: '#e5e2e3',
    desc: 'Không gian First Class sang trọng với lối đi riêng, phục vụ cocktail và đồ ăn nhẹ tận ghế ngồi kèm tai nghe cách âm cao cấp.',
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800&auto=format&fit=crop',
    shows: '28',
    supportedFormats: ['First Class', '2D Digital', '3D Digital'],
  },
  {
    id: 'hn-ttcp-quocgia',
    name: 'Trung Tâm Chiếu Phim Quốc Gia',
    badge: 'ScreenX • 2D Digital',
    city: 'Hà Nội',
    district: 'Đống Đa',
    address: '87 Láng Hạ, P. Thành Công, Đống Đa, Hà Nội',
    distance: 'Cách bạn 1.8 km',
    brand: 'National Cinema',
    brandColor: '#178fe2',
    format: 'SCREENX • 2D DIGITAL',
    formatBg: '#178fe2',
    formatText: '#ffffff',
    desc: 'Trung tâm chiếu phim lâu đời và hiện đại bậc nhất với màn hình đa diện ScreenX 270 độ và giá vé thân thiện nhất Thủ đô.',
    image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=800&auto=format&fit=crop',
    shows: '52',
    supportedFormats: ['ScreenX', '2D Digital', '3D Digital'],
  },
  {
    id: 'hn-beta-mydinh',
    name: 'Beta Cinemas Mỹ Đình',
    badge: 'Tiêu Chuẩn 2D Laser',
    city: 'Hà Nội',
    district: 'Nam Từ Liêm',
    address: 'Tầng B1, Tòa nhà Golden Palace, Mễ Trì, Nam Từ Liêm, Hà Nội',
    distance: 'Cách bạn 5.8 km',
    brand: 'Beta Laser',
    brandColor: '#ffb955',
    format: '2D TIÊU CHUẨN • DOLBY 7.1',
    formatBg: '#2a2a2b',
    formatText: '#e5e2e3',
    desc: 'Thiết kế trẻ trung, phòng chiếu Laser thế hệ mới đem lại độ tương phản cao với chi phí hợp lý cho sinh viên và giới trẻ.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
    shows: '24',
    supportedFormats: ['2D Digital'],
  },

  // ── TP. HỒ CHÍ MINH (6 Rạp) ─────────────────────────────────────────────────
  {
    id: 'cgv-landmark-81',
    name: 'CGV Vincom Landmark 81',
    badge: 'IMAX Laser • Gold Class',
    city: 'TP. HCM',
    district: 'Bình Thạnh',
    address: 'Tầng B1, TTTM Vincom Landmark 81, 772 Điện Biên Phủ, Q. Bình Thạnh, TP.HCM',
    distance: 'Cách bạn 1.2 km',
    brand: 'CGV Flagship',
    brandColor: '#FFB3B0',
    format: 'IMAX LASER • GOLD CLASS',
    formatBg: '#DC9100',
    formatText: '#4F3100',
    desc: 'Trang bị màn hình IMAX lớn nhất Việt Nam cùng hệ thống âm thanh vòm 12 kênh thế hệ mới. Phòng chiếu Gold Class phục vụ trà chiều và chăn len riêng biệt.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
    shows: '38',
    supportedFormats: ['IMAX Laser', 'Gold Class', '2D Digital'],
  },
  {
    id: 'galaxy-sala',
    name: 'Galaxy Sala Thủ Thiêm',
    badge: 'La Rosa Bed • IMAX Laser',
    city: 'TP. HCM',
    district: 'TP. Thủ Đức',
    address: 'Tầng 3, TTTM Thiso Mall Sala, 10 Mai Chí Thọ, Thủ Thiêm, TP. Thủ Đức, TP.HCM',
    distance: 'Cách bạn 3.4 km',
    brand: 'Galaxy Premium',
    brandColor: '#FFB955',
    format: 'IMAX LASER • LA ROSA BED',
    formatBg: '#FF535A',
    formatText: '#5B000D',
    desc: 'Cụm rạp tích hợp công nghệ chiếu Laser 4K thế hệ mới nhất với phòng chiếu La Rosa trang bị giường nằm bọc da cao cấp cùng quầy bar ẩm thực riêng.',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
    shows: '34',
    supportedFormats: ['IMAX Laser', 'La Rosa Bed', '2D Digital'],
  },
  {
    id: 'lotte-namsg',
    name: 'Lotte Cinema Nam Sài Gòn',
    badge: 'Charlotte Suite',
    city: 'TP. HCM',
    district: 'Quận 7',
    address: 'Tầng 3, Lotte Mart, 469 Nguyễn Hữu Thọ, P. Tân Hưng, Quận 7, TP.HCM',
    distance: 'Cách bạn 4.8 km',
    brand: 'Lotte Diamond',
    brandColor: '#FFB3B0',
    format: 'CHARLOTTE • CINEUM LED',
    formatBg: '#4F3100',
    formatText: '#FFB955',
    desc: 'Phòng chiếu Charlotte Suite đỉnh cao với phòng chờ riêng phục vụ rượu vang, ghế massage chỉnh điện đa điểm và màn hình công nghệ LED Cineum không viền.',
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800&auto=format&fit=crop',
    shows: '42',
    supportedFormats: ['Charlotte Suite', '2D Digital'],
  },
  {
    id: 'bhd-bitexco',
    name: 'BHD Star Bitexco',
    badge: 'Dolby Atmos 3D',
    city: 'TP. HCM',
    district: 'Quận 1',
    address: 'Tầng 3 & 4, Bitexco Financial Tower, 2 Hải Triều, Bến Nghé, Quận 1, TP.HCM',
    distance: 'Cách bạn 2.6 km',
    brand: 'BHD Star VIP',
    brandColor: '#34c759',
    format: 'DOLBY ATMOS • 2D / 3D',
    formatBg: '#2a2a2b',
    formatText: '#e5e2e3',
    desc: 'Tọa lạc tại tòa tháp biểu tượng Bitexco, rạp sở hữu hệ thống âm thanh vòm Dolby Atmos đa hướng cùng các suất chiếu đêm cuối tuần đặc sắc.',
    image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=800&auto=format&fit=crop',
    shows: '30',
    supportedFormats: ['2D Digital', '3D Digital'],
  },
  {
    id: 'cinestar-quocthanh',
    name: 'Cinestar Quốc Thanh',
    badge: 'Laser 2D • Dolby 7.1',
    city: 'TP. HCM',
    district: 'Quận 1',
    address: '271 Nguyễn Trãi, P. Nguyễn Cư Trinh, Quận 1, TP.HCM',
    distance: 'Cách bạn 3.8 km',
    brand: 'Cinestar',
    brandColor: '#ff535a',
    format: '2D PHỤ ĐỀ • DOLBY 7.1',
    formatBg: '#2a2a2b',
    formatText: '#e5e2e3',
    desc: 'Giá vé siêu tiết kiệm cùng nhiều combo bắp nước ưu đãi nhất trung tâm Sài Gòn, phòng chiếu sạch sẽ và cách âm chuẩn quốc tế.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
    shows: '26',
    supportedFormats: ['2D Digital'],
  },
  {
    id: 'lotte-nowzone',
    name: 'Lotte Cinema Nowzone',
    badge: 'Charlotte Room',
    city: 'TP. HCM',
    district: 'Quận 1',
    address: 'Tầng 5, TTTM Nowzone, 235 Nguyễn Văn Cừ, Quận 1, TP.HCM',
    distance: 'Cách bạn 5.3 km',
    brand: 'Lotte Cinema',
    brandColor: '#ffb955',
    format: '2D PHỤ ĐỀ TIÊU CHUẨN',
    formatBg: '#2a2a2b',
    formatText: '#e5e2e3',
    desc: 'Nằm tại vị trí giao thoa giữa Quận 1 và Quận 5, thuận tiện di chuyển với hệ thống ghế ngồi rộng rãi và nhiều suất chiếu giờ trưa.',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
    shows: '22',
    supportedFormats: ['2D Digital'],
  },

  // ── ĐÀ NẴNG (4 Rạp) ────────────────────────────────────────────────────────
  {
    id: 'dn-cgv-vincom',
    name: 'CGV Vincom Plaza Đà Nẵng',
    badge: 'IMAX Laser • Gold Class',
    city: 'Đà Nẵng',
    district: 'Sơn Trà',
    address: 'Tầng 4, TTTM Vincom Plaza Đà Nẵng, 910A Ngô Quyền, Sơn Trà, Đà Nẵng',
    distance: 'Cách bạn 1.5 km',
    brand: 'CGV Flagship',
    brandColor: '#FFB3B0',
    format: 'IMAX LASER • GOLD CLASS',
    formatBg: '#DC9100',
    formatText: '#4F3100',
    desc: 'Cụm rạp chuẩn IMAX Laser đầu tiên tại thành phố biển Đà Nẵng, góc nhìn trực diện biển và sông Hàn với chất lượng hình ảnh đẳng cấp quốc tế.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
    shows: '32',
    supportedFormats: ['IMAX Laser', 'Gold Class', '2D Digital'],
  },
  {
    id: 'dn-lotte-danang',
    name: 'Lotte Cinema Đà Nẵng',
    badge: 'Prestige Suite',
    city: 'Đà Nẵng',
    district: 'Hải Châu',
    address: 'Tầng 5, TTTM Lotte Mart Đà Nẵng, 6 Nại Nam, P. Hòa Cường Bắc, Hải Châu, Đà Nẵng',
    distance: 'Cách bạn 3.1 km',
    brand: 'Lotte Cinema',
    brandColor: '#FFB955',
    format: 'PRESTIGE SUITE • 2D / 3D',
    formatBg: '#4F3100',
    formatText: '#FFB955',
    desc: 'Cụm rạp ven sông Hàn sở hữu phòng chiếu Prestige cao cấp với ghế sofa đôi, phục vụ chăn gối và đồ uống miễn phí suốt buổi chiếu.',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
    shows: '28',
    supportedFormats: ['Prestige Suite', '2D Digital', '3D Digital'],
  },
  {
    id: 'dn-galaxy-danang',
    name: 'Galaxy Cinema Coop Mart Đà Nẵng',
    badge: 'Dolby 7.1 • Laser 2D',
    city: 'Đà Nẵng',
    district: 'Thanh Khê',
    address: 'Tầng 3, Siêu thị Coop Mart, 478 Điện Biên Phủ, Thanh Khê, Đà Nẵng',
    distance: 'Cách bạn 2.8 km',
    brand: 'Galaxy Cinema',
    brandColor: '#ff535a',
    format: '2D TIÊU CHUẨN • DOLBY 7.1',
    formatBg: '#2a2a2b',
    formatText: '#e5e2e3',
    desc: 'Không gian xem phim hiện đại, âm thanh sống động với bắp rang bơ phô mai trứ danh và nhiều ưu đãi thứ Ba Happy Day hàng tuần.',
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800&auto=format&fit=crop',
    shows: '24',
    supportedFormats: ['2D Digital', '3D Digital'],
  },
  {
    id: 'dn-starlight-danang',
    name: 'Starlight Cinema Đà Nẵng',
    badge: 'Star VIP • Bowling Hub',
    city: 'Đà Nẵng',
    district: 'Thanh Khê',
    address: 'Tầng 4, TTTM Nguyễn Kim, 46 Điện Biên Phủ, Thanh Khê, Đà Nẵng',
    distance: 'Cách bạn 2.4 km',
    brand: 'Starlight Hub',
    brandColor: '#178fe2',
    format: 'STAR VIP • 2D DIGITAL',
    formatBg: '#178fe2',
    formatText: '#ffffff',
    desc: 'Tổ hợp giải trí cinema & bowling lớn nhất Đà Nẵng với phòng chiếu hiện đại, màn hình cong siêu nét và hàng ghế đôi Sweetbox rộng rãi.',
    image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=800&auto=format&fit=crop',
    shows: '20',
    supportedFormats: ['2D Digital'],
  },
];

// ==============================================================================
// 2. CẤP 3: LỊCH CHIẾU PHIM ĐẶC THÙ THEO TỪNG RẠP (Phân bổ theo phim)
// ==============================================================================

// Helper tạo suất chiếu nhanh
function createSlots(
  times: string[],
  basePrice: number,
  mysteryIndex = -1,
): ShowtimeSlot[] {
  return times.map((time, idx) => {
    const isMystery = idx === mysteryIndex;
    const price = isMystery ? Math.round(basePrice * 0.6) : basePrice;
    return {
      id: `slot-${time.replace(':', '')}-${idx}`,
      time,
      statusText: idx === 1 ? 'Sắp kín (8)' : 'Còn ghế',
      isAlmostFull: idx === 1,
      priceText: `${Math.round(price / 1000)}k`,
      price,
      isMystery,
      mysteryDiscount: isMystery ? 40 : undefined,
    };
  });
}

// Lịch chiếu chi tiết cho từng phim tại từng rạp
export function getCinemasScheduleByMovieAndCity(
  movieIdOrSlug: string | number,
  cityInput: string,
): CinemaSchedule[] {
  const normCity = normalizeCityName(cityInput);
  const cityCinemas = ALL_CINEMAS.filter((c) => c.city === normCity);
  const slug = String(movieIdOrSlug).toLowerCase();

  return cityCinemas.map((cinema) => {
    let formats: ScreenFormatGroup[] = [];

    // Phân bổ lịch chiếu theo từng bộ phim cụ thể
    if (slug.includes('dune') || slug === '1') {
      // DUNE: PART TWO - Ưu tiên phòng chiếu IMAX & Gold Class
      if (cinema.supportedFormats.includes('IMAX Laser')) {
        formats.push({
          formatName: 'IMAX LASER 3D • PHỤ ĐỀ',
          roomDetails: `${cinema.name} - Phòng chiếu IMAX #01 (Màn hình 28m)`,
          slots: createSlots(['10:30', '14:15', '18:00', '21:45'], 210000, 3),
        });
      }
      if (cinema.supportedFormats.includes('Gold Class') || cinema.supportedFormats.includes('Cine Comfort')) {
        formats.push({
          formatName: 'GOLD CLASS VIP • 2D PHỤ ĐỀ',
          roomDetails: 'Phòng chiếu VIP Lounge (Ghế sofa da ngả điện)',
          slots: createSlots(['15:30', '19:15', '22:30'], 280000),
        });
      }
      formats.push({
        formatName: '2D KỸ THUẬT SỐ • DOLBY ATMOS',
        roomDetails: 'Phòng chiếu tiêu chuẩn #02 & #03',
        slots: createSlots(['11:45', '16:30', '19:45', '22:15'], 120000, 3),
      });
    } else if (slug.includes('sonic') || slug === '2') {
      // NHÍM SONIC 3 - Ưu tiên 2D Lồng tiếng & Phụ đề cho gia đình
      formats.push({
        formatName: '2D LỒNG TIẾNG VIỆT • GIA ĐÌNH',
        roomDetails: 'Phòng chiếu #01 (Âm lượng chuẩn trẻ em)',
        slots: createSlots(['09:15', '11:30', '14:00', '16:30'], 110000),
      });
      formats.push({
        formatName: '2D PHỤ ĐỀ TIÊU CHUẨN',
        roomDetails: 'Phòng chiếu #04',
        slots: createSlots(['18:15', '20:30'], 125000),
      });
      if (cinema.supportedFormats.includes('IMAX Laser')) {
        formats.push({
          formatName: 'IMAX LASER 2D • PHỤ ĐỀ',
          roomDetails: 'Phòng chiếu IMAX #01',
          slots: createSlots(['13:15', '17:45', '21:00'], 180000, 2),
        });
      }
    } else if (slug.includes('deadpool') || slug === '3') {
      // DEADPOOL & WOLVERINE - Suất chiếu tối & khuya, hành động 18+
      formats.push({
        formatName: '2D PHỤ ĐỀ TIÊU CHUẨN (T18)',
        roomDetails: 'Phòng chiếu #02 & #05',
        slots: createSlots(['13:00', '16:00', '19:00', '21:30', '23:45'], 130000, 4),
      });
      if (cinema.supportedFormats.includes('ScreenX') || cinema.supportedFormats.includes('IMAX Laser')) {
        formats.push({
          formatName: 'IMAX / SCREENX LASER 3D',
          roomDetails: 'Phòng chiếu công nghệ cao #01',
          slots: createSlots(['17:30', '20:45'], 220000),
        });
      }
    } else if (slug.includes('inside-out') || slug.includes('manh-ghep') || slug === '4') {
      // INSIDE OUT 2 - Suất sáng, chiều, lồng tiếng
      formats.push({
        formatName: '2D LỒNG TIẾNG VIỆT',
        roomDetails: 'Phòng chiếu #01 & #03',
        slots: createSlots(['09:30', '11:45', '14:15', '16:45'], 115000),
      });
      formats.push({
        formatName: '2D PHỤ ĐỀ TIÊU CHUẨN',
        roomDetails: 'Phòng chiếu #02',
        slots: createSlots(['18:30', '20:45'], 120000, 1),
      });
    } else {
      // Phim tổng quát
      formats.push({
        formatName: '2D KỸ THUẬT SỐ TIÊU CHUẨN',
        roomDetails: 'Phòng chiếu #01 & #02',
        slots: createSlots(['10:15', '13:30', '16:45', '19:30', '22:15'], 120000, 4),
      });
      if (cinema.supportedFormats.includes('IMAX Laser')) {
        formats.push({
          formatName: 'IMAX LASER 2D • PHỤ ĐỀ',
          roomDetails: 'Phòng chiếu IMAX #01',
          slots: createSlots(['14:00', '18:15', '21:00'], 190000),
        });
      }
    }

    return {
      id: cinema.id,
      name: cinema.name,
      badge: cinema.badge,
      address: cinema.address,
      distance: cinema.distance,
      city: cinema.city,
      formats,
    };
  });
}

// ==============================================================================
// 3. CÁC HÀM TIỆN ÍCH DÀNH CHO HERO BANNER & LUXURY CINEMAS
// ==============================================================================

/**
 * Chuẩn hóa tên thành phố (xử lý các biến thể 'TP. Hồ Chí Minh', 'TP.HCM', 'Hồ Chí Minh' -> 'TP. HCM')
 */
export function normalizeCityName(input?: string | null): CityName {
  if (!input) return 'TP. HCM';
  const trimmed = input.trim();
  if (trimmed.includes('Hà Nội') || trimmed.includes('Hanoi')) return 'Hà Nội';
  if (trimmed.includes('Đà Nẵng') || trimmed.includes('Danang')) return 'Đà Nẵng';
  return 'TP. HCM';
}

/**
 * Lấy danh sách tên rạp cho dropdown 'CHỌN RẠP' trên thanh Đặt vé nhanh Hero Banner
 */
export function getQuickBookCinemasByCity(cityName: string): string[] {
  const normCity = normalizeCityName(cityName);
  return ALL_CINEMAS.filter((c) => c.city === normCity).map((c) => c.name);
}

/**
 * Lấy danh sách cụm rạp cho mục LuxuryCinemas trang chủ
 */
export function getLuxuryCinemasByCity(cityName: string): CinemaMeta[] {
  const normCity = normalizeCityName(cityName);
  const cityCinemas = ALL_CINEMAS.filter((c) => c.city === normCity);
  // Lấy tối đa 3 rạp VIP đại diện
  return cityCinemas.slice(0, 3);
}
