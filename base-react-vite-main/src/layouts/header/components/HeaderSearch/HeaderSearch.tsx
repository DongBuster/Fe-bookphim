import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import * as S from './HeaderSearch.styles';

export const HeaderSearch: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/kham-pha?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      navigate('/kham-pha');
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
  };

  return (
    <S.SearchForm onSubmit={handleSearchSubmit}>
      <S.SearchBox>
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder={t('header:search_placeholder_full', 'Tìm theo tên phim, diễn viên, đạo diễn...')}
          value={searchVal}
          onChange={handleSearchInputChange}
        />
        {searchVal && (
          <button
            type="button"
            className="clear-btn"
            onClick={() => setSearchVal('')}
            title={t('header:clear_search', 'Xóa tìm kiếm')}
            aria-label={t('header:clear_search', 'Xóa tìm kiếm')}
          >
            <X size={14} />
          </button>
        )}
      </S.SearchBox>
    </S.SearchForm>
  );
};
