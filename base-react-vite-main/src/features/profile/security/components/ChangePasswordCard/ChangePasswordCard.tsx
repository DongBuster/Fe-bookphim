import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Key, Lock, Eye, EyeOff, Shield, CheckCircle2 } from 'lucide-react';
import * as S from './ChangePasswordCard.styles';

interface ChangePasswordCardProps {
  onSuccess: (message: string) => void;
}

export const ChangePasswordCard: FC<ChangePasswordCardProps> = ({
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isShowCurrentPassword, setIsShowCurrentPassword] = useState(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isReloginRequired, setIsReloginRequired] = useState(true);

  const handleForgotPassword = () => {
    onSuccess(t('profile:toast_forgot_pass'));
  };

  const handleCurrentPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCurrentPass(e.target.value);
    if (errorMessage) setErrorMessage('');
  };

  const handleToggleCurrentPasswordVisibility = () => {
    setIsShowCurrentPassword((prev) => !prev);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPass(e.target.value);
    if (errorMessage) setErrorMessage('');
  };

  const handleToggleNewPasswordVisibility = () => {
    setIsShowNewPassword((prev) => !prev);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPass(e.target.value);
    if (errorMessage) setErrorMessage('');
  };

  const handleReloginRequiredChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsReloginRequired(e.target.checked);
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!currentPass) {
      setErrorMessage(t('profile:err_current_pass_empty', 'Vui lòng nhập mật khẩu hiện tại.'));
      return;
    }
    if (newPass.length < 6) {
      setErrorMessage(t('profile:err_pass_too_short', 'Mật khẩu mới phải có ít nhất 6 ký tự.'));
      return;
    }
    if (newPass !== confirmPass) {
      setErrorMessage(t('profile:err_pass_mismatch', 'Mật khẩu xác nhận không trùng khớp.'));
      return;
    }
    setErrorMessage('');
    onSuccess(t('profile:toast_pass_updated'));
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const isPasswordMatch = Boolean(confirmPass && confirmPass === newPass);

  return (
    <S.Card>
      <div className="card-top-bar">
        <div className="title-left">
          <h3>
            <Key size={17} color="#ff535a" />
            <span>{t('profile:change_pass_title')}</span>
          </h3>
          <span className="sub">
            {t('profile:change_pass_sub')}
          </span>
        </div>
        <span className="status-pill">{t('profile:pass_updated_ago')}</span>
      </div>

      <S.PasswordForm onSubmit={handlePasswordSubmit}>
        <div className="field-group">
          <label>
            <span>{t('profile:current_pass_lbl')}</span>
            <span
              className="forgot-link"
              onClick={handleForgotPassword}
            >
              {t('profile:forgot_pass_link')}
            </span>
          </label>
          <div className="input-box">
            <Lock size={14} className="icon" />
            <input
              type={isShowCurrentPassword ? 'text' : 'password'}
              value={currentPass}
              onChange={handleCurrentPasswordChange}
              placeholder={t('profile:current_pass_placeholder', 'Nhập mật khẩu hiện tại')}
              required
            />
            <span
              className="toggle-eye"
              onClick={handleToggleCurrentPasswordVisibility}
            >
              {isShowCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </span>
          </div>
        </div>

        <div className="field-group">
          <label>{t('profile:new_pass_lbl')}</label>
          <div className="input-box">
            <Lock size={14} className="icon" />
            <input
              type={isShowNewPassword ? 'text' : 'password'}
              value={newPass}
              onChange={handleNewPasswordChange}
              placeholder={t('profile:new_pass_placeholder', 'Nhập mật khẩu mới')}
              required
            />
            <span
              className="toggle-eye"
              onClick={handleToggleNewPasswordVisibility}
            >
              {isShowNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </span>
          </div>
        </div>

        <div className="strength-meter">
          <div className="bars">
            <span className="seg" />
            <span className="seg" />
            <span className="seg" />
            <span className="seg" />
          </div>
          <span className="score-text">
            <Shield size={12} />
            <span>{t('profile:pass_strength_optimal')}</span>
          </span>
        </div>

        <div className="field-group">
          <label>{t('profile:confirm_new_pass_lbl')}</label>
          <div className="input-box">
            <Lock size={14} className="icon" />
            <input
              type="password"
              value={confirmPass}
              onChange={handleConfirmPasswordChange}
              placeholder={t('profile:confirm_pass_placeholder', 'Nhập lại mật khẩu mới')}
              required
            />
            {isPasswordMatch && <CheckCircle2 size={15} className="check-ok" />}
          </div>
        </div>

        {errorMessage && (
          <div
            style={{
              color: '#ff535a',
              fontSize: '12px',
              padding: '8px 12px',
              background: 'rgba(255, 83, 90, 0.1)',
              borderRadius: 6,
              border: '1px solid rgba(255, 83, 90, 0.2)',
            }}
          >
            {errorMessage}
          </div>
        )}

        <label className="remember-check">
          <input
            type="checkbox"
            checked={isReloginRequired}
            onChange={handleReloginRequiredChange}
          />
          <span>{t('profile:relogin_required_chk')}</span>
        </label>

        <button type="submit" className="submit-btn">
          {t('profile:update_pass_btn')}
        </button>
      </S.PasswordForm>
    </S.Card>
  );
};

export default ChangePasswordCard;
