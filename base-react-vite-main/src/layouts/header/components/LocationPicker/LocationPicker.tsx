import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, MapPin } from 'lucide-react';
import { CITIES } from '../../data/header-data';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useSelectedCity } from '@/shared/services/location.service';
import * as S from './LocationPicker.styles';

const CITY_KEY_MAP: Record<string, string> = {
  'Hà Nội': 'header:cities.hanoi',
  'TP. HCM': 'header:cities.hcmc',
  'Đà Nẵng': 'header:cities.danang',
};

export function LocationPicker() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useSelectedCity();
  const ref = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleToggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelectCity = (city: string) => () => {
    setSelectedCity(city);
    setIsOpen(false);
  };

  useClickOutside([ref], [handleClose]);

  const displayCity = t(CITY_KEY_MAP[selectedCity] || selectedCity, selectedCity);

  return (
    <S.LocationWrapper ref={ref}>
      <S.LocationBadge $isOpen={isOpen} onClick={handleToggleOpen}>
        <MapPin size={12} className="loc-icon" />
        <span>{displayCity}</span>
        <ChevronDown size={10} className="chevron-icon" />
      </S.LocationBadge>

      {isOpen && (
        <S.LocationDropdown>
          {CITIES.map((city) => {
            const cityName = t(CITY_KEY_MAP[city] || city, city);
            return (
              <S.LocationItem
                key={city}
                $isSelected={selectedCity === city}
                onClick={handleSelectCity(city)}
              >
                <span>{cityName}</span>
                {selectedCity === city && (
                  <Check size={12} className="check-icon" />
                )}
              </S.LocationItem>
            );
          })}
        </S.LocationDropdown>
      )}
    </S.LocationWrapper>
  );
}
