import { forwardRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, ExternalLink, ChevronDown } from 'lucide-react';
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

    // Default active cinema to the first available or currently selected cinema
    const [activeCinemaId, setActiveCinemaId] = useState<string | number>(() => {
      if (selectedSlot?.cinema?.id) return selectedSlot.cinema.id;
      if (cinemas.length > 0) return cinemas[0].id;
      return '';
    });

    // Ensure activeCinemaId stays valid when cinemas list updates (e.g., search/city change)
    useEffect(() => {
      if (cinemas.length > 0) {
        const exists = cinemas.some((c) => c.id === activeCinemaId);
        if (!exists) {
          setActiveCinemaId(cinemas[0].id);
        }
      }
    }, [cinemas, activeCinemaId]);

    // Keep active cinema synced when a slot is chosen
    useEffect(() => {
      if (selectedSlot?.cinema?.id) {
        setActiveCinemaId(selectedSlot.cinema.id);
      }
    }, [selectedSlot?.cinema?.id]);

    const activeCinema =
      cinemas.find((c) => c.id === activeCinemaId) || cinemas[0] || null;

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

    const getVisibleFormats = (cinema: CinemaSchedule) => {
      return cinema.formats.filter((fmtGroup) => {
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
    };

    const getTotalSlots = (cinema: CinemaSchedule) => {
      return cinema.formats.reduce((acc, fmt) => acc + fmt.slots.length, 0);
    };

    const activeVisibleFormats = activeCinema
      ? getVisibleFormats(activeCinema)
      : [];

    return (
      <S.ShowtimesSection ref={ref} id="showtimes-section">
        {/* 1. Header & Controls */}
        <S.ShowtimesHeader>
          <div className="title-group">
            <span className="sub">{t('movie:online_booking_badge')}</span>
            <h2>{t('movie:showtimes_and_cinemas')}</h2>
          </div>

          <div className="header-controls">
            <S.CitySelect value={selectedCity} onChange={handleCityChange}>
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

        {/* 2. Compact Control Strip (Date Bar + Formats & Mystery Night) */}
        <S.ControlBar>
          {/* Row 1: Date Pills */}
          <S.DateBar>
            {DAY_OPTIONS.map((day) => {
              const isSelected = selectedDate.dateStr === day.dateStr;
              return (
                <S.CompactDayPill
                  key={day.dateStr}
                  $isActive={isSelected}
                  onClick={handleSelectDate(day)}
                  type="button"
                >
                  <span className="pill-tag">
                    {getDayTagLabel(t, day.dayLabel)}
                  </span>
                  <span className="pill-date">{day.dateStr}</span>
                  <span className="pill-day">
                    {getDayOfWeekLabel(t, day.dayOfWeek)}
                  </span>
                </S.CompactDayPill>
              );
            })}
          </S.DateBar>

          {/* Row 2: Format Filter Chips + Mystery Night Tag */}
          <S.FilterRow>
            <div className="formats-group">
              {FORMAT_FILTERS.map((fmt) => (
                <S.FormatChip
                  key={fmt.id}
                  $isActive={selectedFormat === fmt.id}
                  onClick={handleSelectFormat(fmt.id)}
                  type="button"
                >
                  {getFormatFilterLabel(t, fmt.id, fmt.label)} ({fmt.count})
                </S.FormatChip>
              ))}
            </div>

            {isFeatureEnabled('mysteryNight') && (
              <S.MysteryPillBadge title="Suất chiếu bí ẩn: Giảm giá vé đến 40%!">
                <span className="glow-icon">🔮</span>
                <span className="badge-title">Mystery Night</span>
                <span className="badge-sub">-40% Giá Vé</span>
              </S.MysteryPillBadge>
            )}
          </S.FilterRow>
        </S.ControlBar>

        {/* 3. Empty Cinemas Check */}
        {cinemas.length === 0 ? (
          <S.EmptyCinemasState>
            <p>Không tìm thấy rạp chiếu phù hợp tại {selectedCity}. Vui lòng thử tìm kiếm khác.</p>
          </S.EmptyCinemasState>
        ) : (
          <>
            {/* 4. Desktop / Tablet Master-Detail 2-Column Split Layout */}
            <S.ShowtimesSplitLayout>
              {/* Left Column: Cinema Directory */}
              <S.MasterListWrapper>
                <div className="master-header">
                  <span className="master-title">
                    CỤM RẠP ({cinemas.length})
                  </span>
                </div>

                <div className="master-items-scroll">
                  {cinemas.map((cinema) => {
                    const isCurrentActive = cinema.id === activeCinema?.id;
                    const hasSelected = selectedSlot?.cinema.id === cinema.id;
                    const totalSlots = getTotalSlots(cinema);

                    return (
                      <S.CinemaMasterItem
                        key={cinema.id}
                        $isActive={isCurrentActive}
                        $hasSelectedSlot={hasSelected}
                        onClick={() => setActiveCinemaId(cinema.id)}
                        type="button"
                      >
                        <div className="item-top">
                          <span className="chain-badge">{cinema.badge}</span>
                          <span className="dist">{cinema.distance}</span>
                        </div>

                        <div className="item-name">{cinema.name}</div>

                        <div className="item-address">
                          <MapPin size={11} />
                          <span>{cinema.address}</span>
                        </div>

                        <div className="item-footer">
                          <span className="slots-badge">{totalSlots} suất chiếu</span>
                          {hasSelected && (
                            <span className="selected-flag">✓ Đã chọn</span>
                          )}
                        </div>
                      </S.CinemaMasterItem>
                    );
                  })}
                </div>
              </S.MasterListWrapper>

              {/* Right Column: Showtime Slots Workspace */}
              <S.ShowtimesDetailPanel>
                {activeCinema ? (
                  <S.DetailCard>
                    <div className="detail-header">
                      <div className="cinema-meta">
                        <div className="name-row">
                          <h3 className="name">{activeCinema.name}</h3>
                          <span className="badge">{activeCinema.badge}</span>
                        </div>
                        <div className="address-row">
                          <MapPin size={12} />
                          <span>{activeCinema.address}</span>
                          <span className="dist">• {activeCinema.distance}</span>
                        </div>
                      </div>

                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(
                          activeCinema.name + ' ' + activeCinema.address,
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="map-link"
                      >
                        <span>{t('movie:view_map')}</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>

                    <div className="detail-formats">
                      {activeVisibleFormats.length > 0 ? (
                        activeVisibleFormats.map((fmtGroup) => (
                          <div
                            className="format-section"
                            key={fmtGroup.formatName}
                          >
                            <div className="format-title-row">
                              <span className="format-title">
                                {fmtGroup.formatName}
                              </span>
                              <span className="room-desc">
                                ({fmtGroup.roomDetails})
                              </span>
                            </div>

                            <div className="showtime-pills-grid">
                              {fmtGroup.slots.map((slot) => {
                                const isSlotSelected =
                                  selectedSlot?.cinema.id === activeCinema.id &&
                                  selectedSlot?.format.formatName ===
                                    fmtGroup.formatName &&
                                  selectedSlot?.slot.id === slot.id;

                                return (
                                  <S.ShowtimePill
                                    key={slot.id}
                                    $isSelected={isSlotSelected}
                                    $isAlmostFull={slot.isAlmostFull}
                                    $isMystery={Boolean(
                                      slot.isMystery &&
                                        isFeatureEnabled('mysteryNight'),
                                    )}
                                    onClick={handleSelectSlot(
                                      activeCinema,
                                      fmtGroup,
                                      slot,
                                    )}
                                    type="button"
                                  >
                                    <span className="pill-time">
                                      {slot.time}
                                    </span>
                                    <span className="pill-sub">
                                      {slot.isMystery &&
                                      isFeatureEnabled('mysteryNight')
                                        ? '🔮 Bí ẩn'
                                        : slot.statusText}{' '}
                                      • {slot.priceText}
                                    </span>
                                  </S.ShowtimePill>
                                );
                              })}
                            </div>
                          </div>
                        ))
                      ) : (
                        <S.EmptyFormatNotice>
                          <p>
                            Không có suất chiếu phù hợp với định dạng đã chọn
                            tại rạp này.
                          </p>
                          <button
                            type="button"
                            onClick={() => onSelectFormat('all')}
                          >
                            Xem tất cả định dạng (
                            {getTotalSlots(activeCinema)} suất)
                          </button>
                        </S.EmptyFormatNotice>
                      )}
                    </div>
                  </S.DetailCard>
                ) : null}
              </S.ShowtimesDetailPanel>
            </S.ShowtimesSplitLayout>

            {/* 5. Mobile Accordion View (< 768px) */}
            <S.MobileAccordionList>
              {cinemas.map((cinema) => {
                const isExpanded = activeCinemaId === cinema.id;
                const visibleFormats = getVisibleFormats(cinema);
                if (visibleFormats.length === 0) return null;

                return (
                  <S.MobileCinemaAccordion
                    key={cinema.id}
                    $isExpanded={isExpanded}
                  >
                    <S.MobileAccordionHeader
                      $isExpanded={isExpanded}
                      onClick={() =>
                        setActiveCinemaId(isExpanded ? '' : cinema.id)
                      }
                    >
                      <div className="meta">
                        <div className="name-row">
                          <span className="name">{cinema.name}</span>
                          <span className="badge">{cinema.badge}</span>
                        </div>
                        <div className="sub-row">
                          <span>{cinema.distance}</span>
                          <span>•</span>
                          <span>{cinema.address}</span>
                        </div>
                      </div>

                      <div className="chevron-icon">
                        <ChevronDown size={18} />
                      </div>
                    </S.MobileAccordionHeader>

                    {isExpanded && (
                      <S.MobileAccordionBody>
                        <div className="map-row">
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(
                              cinema.name + ' ' + cinema.address,
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span>{t('movie:view_map')}</span>
                            <ExternalLink size={11} />
                          </a>
                        </div>

                        {visibleFormats.map((fmtGroup) => (
                          <div
                            className="format-block"
                            key={fmtGroup.formatName}
                          >
                            <div className="format-label">
                              {fmtGroup.formatName} ({fmtGroup.roomDetails})
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
                                    $isMystery={Boolean(
                                      slot.isMystery &&
                                        isFeatureEnabled('mysteryNight'),
                                    )}
                                    onClick={handleSelectSlot(
                                      cinema,
                                      fmtGroup,
                                      slot,
                                    )}
                                    type="button"
                                  >
                                    <span className="pill-time">
                                      {slot.time}
                                    </span>
                                    <span className="pill-sub">
                                      {slot.isMystery &&
                                      isFeatureEnabled('mysteryNight')
                                        ? '🔮 Bí ẩn'
                                        : slot.statusText}{' '}
                                      • {slot.priceText}
                                    </span>
                                  </S.ShowtimePill>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </S.MobileAccordionBody>
                    )}
                  </S.MobileCinemaAccordion>
                );
              })}
            </S.MobileAccordionList>
          </>
        )}
      </S.ShowtimesSection>
    );
  },
);

ShowtimePicker.displayName = 'ShowtimePicker';
