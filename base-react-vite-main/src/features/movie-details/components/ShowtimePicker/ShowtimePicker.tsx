import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, ExternalLink } from 'lucide-react';
import { isFeatureEnabled } from '@/config/features.config';
import {
  DAY_OPTIONS,
  FORMAT_FILTERS,
  getDayTagLabel,
  getDayOfWeekLabel,
  getFormatFilterLabel,
  type DayOption,
  type CinemaSchedule,
  type ScreenFormatGroup,
  type ShowtimeSlot,
} from '../../data/mock-movie-details';
import * as S from './ShowtimePicker.styles';

interface ShowtimePickerProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  searchCinema: string;
  onSearchCinema: (text: string) => void;
  selectedDate: DayOption;
  onSelectDate: (day: DayOption) => void;
  selectedFormat: string;
  onSelectFormat: (format: string) => void;
  cinemas: CinemaSchedule[];
  selectedSlot: {
    cinema: CinemaSchedule;
    format: ScreenFormatGroup;
    slot: ShowtimeSlot;
  } | null;
  onSelectSlot: (
    cinema: CinemaSchedule,
    format: ScreenFormatGroup,
    slot: ShowtimeSlot,
  ) => void;
}

export const ShowtimePicker = forwardRef<HTMLDivElement, ShowtimePickerProps>(
  (
    {
      selectedCity,
      onSelectCity,
      searchCinema,
      onSearchCinema,
      selectedDate,
      onSelectDate,
      selectedFormat,
      onSelectFormat,
      cinemas,
      selectedSlot,
      onSelectSlot,
    },
    ref,
  ) => {
    const { t } = useTranslation();

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onSelectCity(e.target.value);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchCinema(e.target.value);
    };

    const handleSelectDate = (day: DayOption) => () => {
      onSelectDate(day);
    };

    const handleSelectFormat = (formatId: string) => () => {
      onSelectFormat(formatId);
    };

    const handleSelectSlot =
      (cinema: CinemaSchedule, format: ScreenFormatGroup, slot: ShowtimeSlot) =>
      () => {
        onSelectSlot(cinema, format, slot);
      };

    return (
      <S.ShowtimesSection ref={ref} id="showtimes-section">
        <S.ShowtimesHeader>
          <div className="title-group">
            <span className="sub">{t('movie:online_booking_badge')}</span>
            <h2>{t('movie:showtimes_and_cinemas')}</h2>
          </div>

          <div className="filters-right">
            <S.CitySelect
              value={selectedCity}
              onChange={handleCityChange}
            >
              <option value="TP. Hồ Chí Minh">🏙 TP. Hồ Chí Minh</option>
              <option value="Hà Nội">🏙 Hà Nội</option>
              <option value="Đà Nẵng">🏙 Đà Nẵng</option>
            </S.CitySelect>

            <S.SearchInput>
              <Search size={14} />
              <input
                type="text"
                placeholder={t('movie:search_cinema_placeholder')}
                value={searchCinema}
                onChange={handleSearchChange}
              />
            </S.SearchInput>
          </div>
        </S.ShowtimesHeader>

        <S.StepsContainer>
          {/* 1. Chọn ngày xem chiếu */}
          <div>
            <S.StepLabel>{t('movie:step_select_date')}</S.StepLabel>
            <S.DayTabsRow>
              {DAY_OPTIONS.map((day) => {
                const isSelected = selectedDate.dateStr === day.dateStr;
                return (
                  <S.DayTab
                    key={day.dateStr}
                    $isActive={isSelected}
                    onClick={handleSelectDate(day)}
                  >
                    <span className="tag">
                      {getDayTagLabel(t, day.dayLabel)}
                    </span>
                    <span className="date">{day.dateStr}</span>
                    <span className="day">
                      {getDayOfWeekLabel(t, day.dayOfWeek)}
                    </span>
                  </S.DayTab>
                );
              })}
            </S.DayTabsRow>
          </div>

          {/* 2. Bộ lọc định dạng phòng */}
          <div>
            <S.StepLabel>{t('movie:step_select_format')}</S.StepLabel>
            <S.FormatChipsRow>
              {FORMAT_FILTERS.map((fmt) => (
                <S.FormatChip
                  key={fmt.id}
                  $isActive={selectedFormat === fmt.id}
                  onClick={handleSelectFormat(fmt.id)}
                >
                  {getFormatFilterLabel(t, fmt.id, fmt.label)} ({fmt.count})
                </S.FormatChip>
              ))}
            </S.FormatChipsRow>
          </div>
        </S.StepsContainer>

        {/* Danh sách các cụm rạp và suất chiếu */}
        <S.CinemaScheduleList>
          {cinemas
            .map((cinema) => {
              const visibleFormats = cinema.formats.filter((fmtGroup) => {
                if (selectedFormat === 'all') return true;
                if (selectedFormat === 'imax')
                  return fmtGroup.formatName.toLowerCase().includes('imax');
                if (selectedFormat === '2d')
                  return fmtGroup.formatName.toLowerCase().includes('2d');
                if (selectedFormat === 'screenx')
                  return (
                    fmtGroup.formatName.toLowerCase().includes('screenx') ||
                    fmtGroup.formatName.toLowerCase().includes('3d')
                  );
                return true;
              });

              if (visibleFormats.length === 0) return null;

              return (
                <S.CinemaCard key={cinema.id}>
                  <div className="cinema-header">
                    <div className="cinema-meta">
                      <div className="name-row">
                        <span className="name">{cinema.name}</span>
                        <span className="badge">{cinema.badge}</span>
                      </div>
                      <div className="address-row">
                        <MapPin size={12} />
                        <span>{cinema.address}</span>
                        <span className="dist">• {cinema.distance}</span>
                      </div>
                    </div>

                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        cinema.name + ' ' + cinema.address,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="map-link"
                    >
                      <span>{t('movie:view_map')}</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>

                  {visibleFormats.map((fmtGroup) => (
                    <div className="format-block" key={fmtGroup.formatName}>
                      <div className="format-label-row">
                        <span className="format-title">{fmtGroup.formatName}</span>
                        <span className="room-sub">({fmtGroup.roomDetails})</span>
                      </div>

                      <div className="showtime-pills">
                        {fmtGroup.slots.map((slot) => {
                          const isSlotSelected =
                            selectedSlot?.cinema.id === cinema.id &&
                            selectedSlot?.format.formatName ===
                              fmtGroup.formatName &&
                            selectedSlot?.slot.id === slot.id;

                          return (
                            <S.ShowtimePill
                              key={slot.id}
                              $isSelected={isSlotSelected}
                              $isAlmostFull={slot.isAlmostFull}
                              onClick={handleSelectSlot(cinema, fmtGroup, slot)}
                            >
                              <span className="pill-time">{slot.time}</span>
                              <span className="pill-sub">
                                {slot.isMystery && isFeatureEnabled('mysteryNight') ? '🔮 Bí ẩn' : slot.statusText} • {slot.priceText}
                              </span>
                            </S.ShowtimePill>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </S.CinemaCard>
              );
            })
            .filter(Boolean)}
        </S.CinemaScheduleList>
      </S.ShowtimesSection>
    );
  },
);

ShowtimePicker.displayName = 'ShowtimePicker';
