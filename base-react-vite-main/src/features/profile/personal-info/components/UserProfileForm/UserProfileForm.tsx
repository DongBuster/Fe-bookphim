import type { FC, FormEvent } from 'react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfileApi, updateProfileApi } from '@features/auth/api/auth.api';
import {
  User,
  Lock,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  MapPin,
  Film,
  ChevronDown,
  Check,
  Loader2,
} from 'lucide-react';
import { UserProfileSkeleton } from '@shared/components/skeleton';
import * as S from './UserProfileForm.styles';

const CITIES = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Bình Dương'];
const CINEMAS = [
  'PhimBook IMAX Landmark 81',
  'CGV Vincom Đồng Khởi',
  'Galaxy Sala Thủ Thiêm',
  'Lotte Cinema Diamond Plaza',
];

interface UserProfileFormProps {
  onSaveSuccess: (message: string) => void;
}

export const UserProfileForm: FC<UserProfileFormProps> = ({
  onSaveSuccess,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: profileData, isLoading: isFetchingProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getProfileApi,
    staleTime: 60000,
  });

  // Form states
  const [fullName, setFullName] = useState('Khách Hàng PhimBook');
  const [nickname, setNickname] = useState('');
  const [dob, setDob] = useState('1995-08-18');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [email, setEmail] = useState('user@phimbook.vn');
  const [phone, setPhone] = useState('0912345678');
  const [city, setCity] = useState('TP. Hồ Chí Minh');
  const [favoriteCinema, setFavoriteCinema] = useState(
    'PhimBook IMAX Landmark 81',
  );
  const [activeDropdown, setActiveDropdown] = useState<'city' | 'cinema' | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync profile data when fetched
  useEffect(() => {
    if (profileData) {
      if (profileData.fullName) setFullName(profileData.fullName);
      if (profileData.nickname) setNickname(profileData.nickname);
      if (profileData.birthDate) {
        setDob(profileData.birthDate.split('T')[0]);
      }
      if (profileData.email) setEmail(profileData.email);
      if (profileData.phone) setPhone(profileData.phone);
    }
  }, [profileData]);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const cinemaDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(target) &&
        cinemaDropdownRef.current &&
        !cinemaDropdownRef.current.contains(target)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDob(e.target.value);
  };

  const handleSelectGender =
    (selectedGender: 'male' | 'female' | 'other') => () => {
      setGender(selectedGender);
    };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleToggleCityDropdown = () => {
    setActiveDropdown((prev) => (prev === 'city' ? null : 'city'));
  };

  const handleToggleCinemaDropdown = () => {
    setActiveDropdown((prev) => (prev === 'cinema' ? null : 'cinema'));
  };

  const handleSelectCity = (selectedCity: string) => () => {
    setCity(selectedCity);
    setActiveDropdown(null);
  };

  const handleSelectCinema = (selectedCinema: string) => () => {
    setFavoriteCinema(selectedCinema);
    setActiveDropdown(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateProfileApi({
        fullName: fullName.trim(),
        phone: phone.trim(),
        birthDate: dob ? `${dob}T00:00:00.000Z` : undefined,
        nickname: nickname.trim() || undefined,
        favoriteTheaterId: 'd0000001-0000-0000-0000-000000000001',
      });

      // Update cached profile
      localStorage.setItem('user_name', fullName.trim());
      await queryClient.invalidateQueries({ queryKey: ['user-profile'] });

      onSaveSuccess(t('profile:save_profile_success'));
    } catch (error) {
      console.error('Lỗi khi cập nhật hồ sơ:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetchingProfile && !profileData) {
    return <UserProfileSkeleton />;
  }

  return (
    <S.Card as="form" onSubmit={handleSubmit}>
      <div className="card-header">
        <div className="title-group">
          <h3>
            <User size={18} color="#ff535a" />
            <span>{t('profile:user_profile_title')}</span>
            {isFetchingProfile && (
              <Loader2 size={14} color="#8c8994" style={{ animation: 'spin 1s linear infinite' }} />
            )}
          </h3>
          <span className="sub">
            {t('profile:user_profile_sub')}

          </span>
        </div>
      </div>

      <S.FormRow>
        <S.FormGroup>
          <label>
            <span>{t('profile:full_name')}</span>
            <span className="req">{t('profile:required_badge')}</span>
          </label>
          <div className="input-wrap">
            <User size={14} className="icon" />
            <input
              type="text"
              value={fullName}
              onChange={handleFullNameChange}
              required
            />
          </div>
        </S.FormGroup>

        <S.FormGroup>
          <label>{t('profile:nickname_label')}</label>
          <div className="input-wrap">
            <span className="icon">@</span>
            <input
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
            />
          </div>
        </S.FormGroup>
      </S.FormRow>

      <S.FormRow>
        <S.FormGroup>
          <label>
            <span>{t('profile:dob_label')}</span>
            <Lock size={11} color="#ffb955" />
          </label>
          <div className="input-wrap">
            <Calendar size={14} className="icon" />
            <input
              type="date"
              value={dob}
              onChange={handleDobChange}
            />
          </div>
          <span className="helper-text">
            {t('profile:birthday_gift_note')}
          </span>
        </S.FormGroup>

        <S.FormGroup>
          <label>{t('profile:gender_label')}</label>
          <S.GenderRow>
            <button
              type="button"
              className={`gender-btn ${gender === 'male' ? 'active' : ''}`}
              onClick={handleSelectGender('male')}
            >
              {t('profile:gender_male')}
            </button>
            <button
              type="button"
              className={`gender-btn ${gender === 'female' ? 'active' : ''}`}
              onClick={handleSelectGender('female')}
            >
              {t('profile:gender_female')}
            </button>
            <button
              type="button"
              className={`gender-btn ${gender === 'other' ? 'active' : ''}`}
              onClick={handleSelectGender('other')}
            >
              {t('profile:gender_other')}
            </button>
          </S.GenderRow>
        </S.FormGroup>
      </S.FormRow>

      <S.FormGroup>
        <label>{t('profile:email_label')}</label>
        <div className="input-wrap">
          <Mail size={14} className="icon" />
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="has-badge"
          />
          <span className="status-badge verified">{t('profile:verified_badge')}</span>
        </div>
      </S.FormGroup>

      <S.FormGroup>
        <label>{t('profile:phone_sms_label')}</label>
        <div className="input-wrap">
          <Phone size={14} className="icon" />
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            className="has-badge"
          />
          <span className="status-badge linked">{t('profile:otp_linked_badge')}</span>
        </div>
      </S.FormGroup>

      <S.FormRow>
        <S.FormGroup>
          <label>{t('profile:city_label')}</label>
          <div className="input-wrap" ref={cityDropdownRef}>
            <MapPin size={14} className="icon" />
            <S.SelectTrigger
              type="button"
              $isOpen={activeDropdown === 'city'}
              onClick={handleToggleCityDropdown}
              aria-haspopup="listbox"
              aria-expanded={activeDropdown === 'city'}
            >
              <span className="selected-text">{city}</span>
              <ChevronDown size={14} className="chevron" />
            </S.SelectTrigger>

            {activeDropdown === 'city' && (
              <S.DropdownMenu role="listbox">
                {CITIES.map((c) => (
                  <S.DropdownItem
                    key={c}
                    type="button"
                    role="option"
                    aria-selected={city === c}
                    $isSelected={city === c}
                    onClick={handleSelectCity(c)}
                  >
                    <span>{c}</span>
                    {city === c && <Check size={14} className="check-icon" />}
                  </S.DropdownItem>
                ))}
              </S.DropdownMenu>
            )}
          </div>
        </S.FormGroup>

        <S.FormGroup>
          <label>{t('profile:fav_cinema_label')}</label>
          <div className="input-wrap" ref={cinemaDropdownRef}>
            <Film size={14} className="icon" />
            <S.SelectTrigger
              type="button"
              $isOpen={activeDropdown === 'cinema'}
              onClick={handleToggleCinemaDropdown}
              aria-haspopup="listbox"
              aria-expanded={activeDropdown === 'cinema'}
            >
              <span className="selected-text">{favoriteCinema}</span>
              <ChevronDown size={14} className="chevron" />
            </S.SelectTrigger>

            {activeDropdown === 'cinema' && (
              <S.DropdownMenu role="listbox">
                {CINEMAS.map((cin) => (
                  <S.DropdownItem
                    key={cin}
                    type="button"
                    role="option"
                    aria-selected={favoriteCinema === cin}
                    $isSelected={favoriteCinema === cin}
                    onClick={handleSelectCinema(cin)}
                  >
                    <span>{cin}</span>
                    {favoriteCinema === cin && (
                      <Check size={14} className="check-icon" />
                    )}
                  </S.DropdownItem>
                ))}
              </S.DropdownMenu>
            )}
          </div>
        </S.FormGroup>
      </S.FormRow>

      <S.FormFooter>
        <div className="sync-note">
          <Sparkles size={14} color="#ffb955" />
          <span>{t('profile:sync_note')}</span>
        </div>
        <button
          type="submit"
          className="save-btn"
          disabled={isSaving}
          style={{
            opacity: isSaving ? 0.7 : 1,
            cursor: isSaving ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {isSaving ? (
            <>
              <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
              <span>{t('profile:saving_btn')}</span>
            </>
          ) : (
            t('profile:save_changes_btn')
          )}
        </button>
      </S.FormFooter>
    </S.Card>
  );
};

export default UserProfileForm;
