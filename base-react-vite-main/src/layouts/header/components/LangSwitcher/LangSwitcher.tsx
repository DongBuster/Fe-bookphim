import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../data/header-data';
import { useClickOutside } from '../../hooks/useClickOutside';
import * as S from './LangSwitcher.styles';

export function LangSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleToggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelectLang = (code: string) => () => {
    try {
      localStorage.setItem('app_user_language_selected', 'true');
    } catch {
      // ignore
    }
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  useClickOutside([ref], [handleClose]);

  const currentLang =
    LANGUAGES.find((l) => i18n.language?.startsWith(l.code)) || LANGUAGES[0];

  return (
    <S.LangWrapper ref={ref}>
      <S.LangBadge $isOpen={isOpen} onClick={handleToggleOpen}>
        <img
          src={currentLang.flagUrl}
          alt={currentLang.label}
          className="flag-img"
        />
        <ChevronDown size={10} className="chevron-icon" />
      </S.LangBadge>

      {isOpen && (
        <S.LangDropdown>
          {LANGUAGES.map((lang) => (
            <S.LangItem
              key={lang.code}
              $isSelected={Boolean(i18n.language?.startsWith(lang.code))}
              onClick={handleSelectLang(lang.code)}
            >
              <span className="lang-label">{lang.label}</span>
              <img src={lang.flagUrl} alt={lang.label} className="flag-img" />
            </S.LangItem>
          ))}
        </S.LangDropdown>
      )}
    </S.LangWrapper>
  );
}
