import styled, { css } from 'styled-components';

export const ShowtimesSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  scroll-margin-top: 80px;
`;

export const ShowtimesHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;

  .title-group {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .sub {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.2px;
      color: #ff535a;
      text-transform: uppercase;
    }

    h2 {
      font-size: 26px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -0.3px;
      margin: 0;
    }
  }

  .header-controls {
    display: flex;
    align-items: center;
    gap: 10px;

    @media (max-width: 640px) {
      width: 100%;
      min-width: 0;
      flex-direction: column;
      align-items: stretch;
    }
  }
`;

export const CitySelect = styled.select`
  height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover,
  &:focus {
    border-color: rgba(255, 185, 85, 0.5);
  }

  @media (max-width: 640px) {
    width: 100%;
  }

  option {
    background: #19181c;
    color: #ffffff;
  }
`;

export const SearchInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ae8786;
  min-width: 220px;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: rgba(255, 185, 85, 0.5);
  }

  @media (max-width: 640px) {
    width: 100%;
    min-width: 0;
  }

  input {
    background: transparent;
    border: none;
    outline: none;
    color: #ffffff;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 12.5px;
    width: 100%;
    min-width: 0;

    &::placeholder {
      color: #7d6b6a;
    }
  }
`;

/* =========================================================================
   COMPACT CONTROL BAR (Date Strip + Format Filter Strip)
   ========================================================================= */

export const ControlBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 12px 14px;
`;

export const DateBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 2px;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 999px;
  }
`;

export const CompactDayPill = styled.button<{ $isActive: boolean }>`
  flex-shrink: 0;
  min-width: 96px;
  padding: 7px 12px;
  border-radius: 10px;
  border: 1px solid
    ${({ $isActive }) =>
      $isActive ? 'rgba(255, 83, 90, 0.7)' : 'rgba(255, 255, 255, 0.08)'};
  background: ${({ $isActive }) =>
    $isActive
      ? 'linear-gradient(135deg, rgba(255, 83, 90, 0.22) 0%, rgba(255, 83, 90, 0.1) 100%)'
      : 'rgba(255, 255, 255, 0.03)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  transition: all 0.18s ease;

  .pill-tag {
    font-size: 9px;
    font-weight: 800;
    color: ${({ $isActive }) => ($isActive ? '#ff535a' : '#ae8786')};
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .pill-date {
    font-size: 15px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.1;
  }

  .pill-day {
    font-size: 10.5px;
    font-weight: 500;
    color: ${({ $isActive }) => ($isActive ? '#ffffff' : '#7d6b6a')};
  }

  &:hover {
    border-color: rgba(255, 83, 90, 0.45);
    background: rgba(255, 255, 255, 0.07);
    transform: translateY(-1px);
  }
`;

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  .formats-group {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
`;

export const FormatChip = styled.button<{ $isActive: boolean }>`
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid
    ${({ $isActive }) =>
      $isActive ? 'rgba(255, 185, 85, 0.7)' : 'rgba(255, 255, 255, 0.08)'};
  background: ${({ $isActive }) =>
    $isActive ? 'rgba(255, 185, 85, 0.18)' : 'rgba(255, 255, 255, 0.03)'};
  color: ${({ $isActive }) => ($isActive ? '#ffb955' : '#ae8786')};
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

export const MysteryPillBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(168, 85, 247, 0.18) 0%,
    rgba(99, 102, 241, 0.12) 100%
  );
  border: 1px solid rgba(168, 85, 247, 0.45);
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.15);
  font-size: 11px;
  user-select: none;

  .glow-icon {
    font-size: 12px;
  }

  .badge-title {
    font-weight: 800;
    color: #d8b4fe;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .badge-sub {
    font-weight: 700;
    color: #a855f7;
    background: rgba(168, 85, 247, 0.2);
    padding: 1px 6px;
    border-radius: 4px;
  }

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

/* =========================================================================
   MASTER-DETAIL 2-COLUMN LAYOUT (DESKTOP / TABLET)
   ========================================================================= */

export const ShowtimesSplitLayout = styled.div`
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 18px;
  align-items: stretch;
  min-height: 480px;

  @media (max-width: 900px) {
    grid-template-columns: 290px 1fr;
    gap: 14px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const MasterListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 14px;
  overflow: hidden;

  .master-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;
    margin-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);

    .master-title {
      font-size: 10.5px;
      font-weight: 800;
      color: #ae8786;
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }
  }

  .master-items-scroll {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 480px;
    overflow-y: auto;
    padding-right: 4px;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.12);
      border-radius: 999px;
    }
  }
`;

export const CinemaMasterItem = styled.button<{
  $isActive: boolean;
  $hasSelectedSlot: boolean;
}>`
  flex-shrink: 0;
  width: 100%;
  text-align: left;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: 'Be Vietnam Pro', sans-serif;
  border: 1px solid
    ${({ $isActive, $hasSelectedSlot }) =>
      $isActive
        ? 'rgba(255, 185, 85, 0.55)'
        : $hasSelectedSlot
          ? 'rgba(255, 83, 90, 0.45)'
          : 'rgba(255, 255, 255, 0.05)'};
  background: ${({ $isActive, $hasSelectedSlot }) =>
    $isActive
      ? 'linear-gradient(135deg, rgba(255, 185, 85, 0.14) 0%, rgba(255, 83, 90, 0.06) 100%)'
      : $hasSelectedSlot
        ? 'rgba(255, 83, 90, 0.08)'
        : 'rgba(255, 255, 255, 0.02)'};
  position: relative;
  overflow: hidden;

  ${({ $isActive }) =>
    $isActive &&
    css`
      box-shadow: 0 4px 18px rgba(255, 185, 85, 0.1);
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3.5px;
        background: #ffb955;
        border-radius: 4px 0 0 4px;
      }
    `}

  &:hover {
    border-color: rgba(255, 185, 85, 0.4);
    background: rgba(255, 255, 255, 0.05);
  }

  .item-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    .chain-badge {
      font-size: 9.5px;
      font-weight: 800;
      color: #ffb955;
      background: rgba(255, 185, 85, 0.14);
      padding: 2px 6px;
      border-radius: 4px;
      letter-spacing: 0.4px;
      text-transform: uppercase;
    }

    .dist {
      font-size: 11px;
      color: #7d6b6a;
      font-weight: 500;
    }
  }

  .item-name {
    font-size: 14px;
    font-weight: 800;
    color: ${({ $isActive }) => ($isActive ? '#ffffff' : '#e5e2e3')};
    line-height: 1.25;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-address {
    font-size: 11px;
    color: #ae8786;
    display: flex;
    align-items: center;
    gap: 5px;
    overflow: hidden;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .item-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 4px;
    padding-top: 6px;
    border-top: 1px solid rgba(255, 255, 255, 0.04);

    .slots-badge {
      font-size: 10.5px;
      font-weight: 600;
      color: ${({ $isActive }) => ($isActive ? '#ffb955' : '#7d6b6a')};
    }

    .selected-flag {
      font-size: 10px;
      font-weight: 800;
      color: #ff535a;
      background: rgba(255, 83, 90, 0.15);
      padding: 1px 6px;
      border-radius: 4px;
    }
  }
`;

export const ShowtimesDetailPanel = styled.div`
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const DetailCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;

  .detail-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);

    .cinema-meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;

      .name-row {
        display: flex;
        align-items: center;
        gap: 10px;

        .name {
          font-size: 18px;
          font-weight: 900;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.2px;
        }

        .badge {
          padding: 2px 7px;
          border-radius: 5px;
          background: rgba(255, 185, 85, 0.16);
          border: 1px solid rgba(255, 185, 85, 0.35);
          color: #ffb955;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
        }
      }

      .address-row {
        font-size: 12px;
        color: #ae8786;
        display: flex;
        align-items: center;
        gap: 6px;

        .dist {
          color: #7d6b6a;
        }
      }
    }

    .map-link {
      font-size: 12px;
      font-weight: 600;
      color: #ffb955;
      text-decoration: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      flex-shrink: 0;
      padding: 6px 10px;
      border-radius: 8px;
      background: rgba(255, 185, 85, 0.08);
      border: 1px solid rgba(255, 185, 85, 0.2);
      transition: all 0.15s ease;

      &:hover {
        background: rgba(255, 185, 85, 0.16);
        text-decoration: none;
      }
    }
  }

  .detail-formats {
    display: flex;
    flex-direction: column;
    gap: 18px;
    max-height: 420px;
    overflow-y: auto;
    padding-right: 6px;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 999px;
    }

    .format-section {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .format-title-row {
        display: flex;
        align-items: center;
        gap: 8px;

        .format-title {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #e5e2e3;
          text-transform: uppercase;
        }

        .room-desc {
          font-size: 11px;
          color: #7d6b6a;
        }
      }

      .showtime-pills-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
    }
  }
`;

export const EmptyFormatNotice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  gap: 12px;

  p {
    font-size: 13.5px;
    color: #ae8786;
    margin: 0;
  }

  button {
    padding: 8px 16px;
    border-radius: 8px;
    background: rgba(255, 185, 85, 0.16);
    border: 1px solid rgba(255, 185, 85, 0.4);
    color: #ffb955;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Be Vietnam Pro', sans-serif;
    transition: all 0.15s ease;

    &:hover {
      background: rgba(255, 185, 85, 0.25);
    }
  }
`;

export const EmptyCinemasState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #7d6b6a;
  font-size: 14px;
  font-weight: 500;
`;

/* =========================================================================
   SHOWTIME PILL (Slots)
   ========================================================================= */

export const ShowtimePill = styled.button<{
  $isMystery?: boolean;
  $isSelected: boolean;
  $isAlmostFull?: boolean;
}>`
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid
    ${({ $isMystery, $isSelected, $isAlmostFull }) => {
      if ($isSelected) return '#ffb955';
      if ($isMystery) return 'rgba(168, 85, 247, 0.6)';
      if ($isAlmostFull) return 'rgba(255, 83, 90, 0.45)';
      return 'rgba(255, 255, 255, 0.09)';
    }};
  background: ${({ $isMystery, $isSelected }) => {
    if ($isSelected) return 'rgba(255, 185, 85, 0.2)';
    if ($isMystery)
      return 'linear-gradient(135deg, rgba(168, 85, 247, 0.16) 0%, rgba(99, 102, 241, 0.1) 100%)';
    return 'rgba(255, 255, 255, 0.04)';
  }};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: 90px;
  font-family: 'Be Vietnam Pro', sans-serif;

  ${({ $isMystery }) =>
    $isMystery &&
    css`
      box-shadow: 0 0 10px rgba(168, 85, 247, 0.2);
    `}

  .pill-time {
    font-size: 15px;
    font-weight: 800;
    color: ${({ $isSelected }) => ($isSelected ? '#ffb955' : '#ffffff')};
  }

  .pill-sub {
    font-size: 10px;
    font-weight: 600;
    color: ${({ $isMystery, $isSelected, $isAlmostFull }) => {
      if ($isSelected) return '#ffb955';
      if ($isMystery) return '#d8b4fe';
      if ($isAlmostFull) return '#ff535a';
      return '#ae8786';
    }};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    white-space: nowrap;
  }

  &:hover {
    border-color: rgba(255, 185, 85, 0.5);
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
  }
`;

/* =========================================================================
   MOBILE ACCORDION VIEW (< 768px)
   ========================================================================= */

export const MobileAccordionList = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

export const MobileCinemaAccordion = styled.div<{ $isExpanded: boolean }>`
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid
    ${({ $isExpanded }) =>
      $isExpanded ? 'rgba(255, 185, 85, 0.5)' : 'rgba(255, 255, 255, 0.07)'};
  overflow: hidden;
  transition: border-color 0.2s ease;
`;

export const MobileAccordionHeader = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  cursor: pointer;
  background: ${({ $isExpanded }) =>
    $isExpanded ? 'rgba(255, 185, 85, 0.08)' : 'transparent'};
  transition: background 0.15s ease;

  .meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;

    .name-row {
      display: flex;
      align-items: center;
      gap: 8px;

      .name {
        font-size: 14.5px;
        font-weight: 800;
        color: #ffffff;
      }

      .badge {
        font-size: 9px;
        font-weight: 800;
        color: #ffb955;
        background: rgba(255, 185, 85, 0.14);
        padding: 1px 5px;
        border-radius: 4px;
        text-transform: uppercase;
      }
    }

    .sub-row {
      font-size: 11px;
      color: #ae8786;
      display: flex;
      align-items: center;
      gap: 6px;
      overflow: hidden;

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .chevron-icon {
    color: ${({ $isExpanded }) => ($isExpanded ? '#ffb955' : '#ae8786')};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.2s ease;
    ${({ $isExpanded }) => $isExpanded && 'transform: rotate(180deg);'}
  }
`;

export const MobileAccordionBody = styled.div`
  padding: 14px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;

  .map-row {
    display: flex;
    justify-content: flex-end;

    a {
      font-size: 11.5px;
      color: #ffb955;
      display: flex;
      align-items: center;
      gap: 4px;
      text-decoration: none;
    }
  }

  .format-block {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .format-label {
      font-size: 11px;
      font-weight: 800;
      color: #e5e2e3;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }

    .showtime-pills {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(95px, 1fr));
      gap: 8px;
    }
  }
`;
