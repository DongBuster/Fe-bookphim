import { useState, useEffect, useCallback } from 'react';
import { type CityName, normalizeCityName } from '@/shared/data/city-theaters-data';

const CITY_STORAGE_KEY = 'phimbook_selected_city';
const CITY_EVENT_NAME = 'phimbook:city-change';

/**
 * Đọc thành phố hiện tại từ localStorage
 */
export function getSavedCity(): CityName {
  if (typeof window === 'undefined') return 'TP. HCM';
  try {
    const saved = localStorage.getItem(CITY_STORAGE_KEY);
    return normalizeCityName(saved);
  } catch {
    return 'TP. HCM';
  }
}

/**
 * Cập nhật thành phố và phát sự kiện đồng bộ toàn ứng dụng
 */
export function setSavedCity(city: string): CityName {
  const normalized = normalizeCityName(city);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CITY_STORAGE_KEY, normalized);
    } catch {
      // Safely ignore storage quotas or private browsing DOMExceptions
    }
    window.dispatchEvent(
      new CustomEvent(CITY_EVENT_NAME, { detail: { city: normalized } }),
    );
  }
  return normalized;
}

/**
 * React Hook sử dụng trạng thái thành phố toàn cục
 * Tự động đồng bộ giữa Header, Sidebar, QuickBookingBar và ShowtimePicker
 */
export function useSelectedCity(): [CityName, (newCity: string) => void] {
  const [city, setCityState] = useState<CityName>(getSavedCity);

  useEffect(() => {
    const handleCityChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ city?: CityName } | CityName>;
      const rawCity =
        typeof customEvent.detail === 'string'
          ? customEvent.detail
          : customEvent.detail?.city;
      if (rawCity) {
        setCityState(normalizeCityName(rawCity));
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CITY_STORAGE_KEY && e.newValue) {
        setCityState(normalizeCityName(e.newValue));
      }
    };

    window.addEventListener(CITY_EVENT_NAME, handleCityChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(CITY_EVENT_NAME, handleCityChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const changeCity = useCallback((newCity: string) => {
    setSavedCity(newCity);
  }, []);

  return [city, changeCity];
}
