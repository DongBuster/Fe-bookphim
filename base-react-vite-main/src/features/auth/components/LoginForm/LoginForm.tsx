import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from '@config/notification';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  QrCode,
  ShieldCheck,
  Smartphone,
  Ticket,
  User,
  ChevronRight,
  Loader2,
  Sparkles,
} from 'lucide-react';
import tokenManager from '@shared/utils/tokenManager';
import { isFeatureEnabled } from '@/config/features.config';
import { loginApi, registerApi } from '@features/auth/api/auth.api';
import { FoxMascot } from '@/shared/components/mascot';
import * as S from './LoginForm.styles';

export const LoginForm: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Mode: Đăng nhập hoặc Đăng ký
  const [searchParams] = useSearchParams();
  const [isRegisterMode, setIsRegisterMode] = useState(searchParams.get('mode') === 'register');

  // Mặc định chọn tab email vì backend hỗ trợ email/password
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('email');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [credential, setCredential] = useState('');
  const [isRememberMe, setIsRememberMe] = useState(true);

  const handleSelectPhoneTab = () => {
    setActiveTab('phone');
    message.info(t('auth:toast_phone_otp_test', 'Phương thức đăng nhập qua Số điện thoại (OTP) đang được thử nghiệm.'));
  };
  const handleSelectEmailTab = () => setActiveTab('email');

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(e.target.value);
  };

  const handleCredentialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredential(e.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsRememberMe(e.target.checked);
  };

  const handleFillDemoAccount = () => {
    setIsRegisterMode(false);
    setActiveTab('email');
    setIdentifier('testuser@phimbook.vn');
    setCredential('Password123@');
  };

  const handleForgotPassword = () => {
    message.info(t('auth:toast_forgot_pass', 'Tính năng Quên mật khẩu đang được kết nối với cổng SMS/Email OTP.'));
  };

  const handleGoogleLogin = () => {
    message.info(t('auth:toast_google_oauth', 'Đăng nhập Google OAuth2 đang trong quá trình tích hợp môi trường.'));
  };

  const handleFacebookLogin = () => {
    message.info(t('auth:toast_facebook_oauth', 'Đăng nhập Facebook OAuth2 đang trong quá trình tích hợp môi trường.'));
  };

  const handleZaloLogin = () => {
    message.info(t('auth:toast_zalo_oauth', 'Đăng nhập Zalo ZNS/OAuth đang trong quá trình tích hợp môi trường.'));
  };

  const handleQrLogin = () => {
    message.info(t('auth:toast_qr_login', 'Tính năng Quét mã QR đăng nhập qua App PhimBook sẽ sớm ra mắt.'));
  };

  const handleToggleMode = () => {
    setIsRegisterMode((prev) => !prev);
    if (!isRegisterMode) {
      setIdentifier('');
      setCredential('');
    } else {
      setIdentifier('testuser@phimbook.vn');
      setCredential('Password123@');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = identifier.trim();
    const password = credential;

    if (isRegisterMode) {
      if (!fullName.trim() || !phone.trim() || !email || !password) {
        message.warning(t('auth:toast_fill_all_fields', 'Vui lòng điền đầy đủ tất cả các trường đăng ký.'));
        return;
      }

      try {
        setIsLoading(true);
        const regData = await registerApi({
          email,
          password,
          phone: phone.trim(),
          fullName: fullName.trim(),
        });

        if (regData?.accessToken) {
          tokenManager.setAccessToken(regData.accessToken);
          if (regData.refreshToken) {
            tokenManager.setRefreshToken(regData.refreshToken);
          }

          const displayName = regData.user?.fullName || regData.user?.email || fullName.trim();
          localStorage.setItem('user_name', displayName);
          if (regData.user) {
            localStorage.setItem('user_info', JSON.stringify(regData.user));
          }

          navigate('/', { replace: true });
        }
      } catch (error: unknown) {
        console.error('Đăng ký thất bại:', error);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!email || !password) {
      message.warning(t('auth:toast_fill_credentials', 'Vui lòng nhập đầy đủ tài khoản và mật khẩu.'));
      return;
    }

    try {
      setIsLoading(true);

      const loginData = await loginApi({
        email,
        password,
      });

      if (loginData?.accessToken) {
        // 1. Lưu JWT token vào tokenManager
        tokenManager.setAccessToken(loginData.accessToken);
        if (loginData.refreshToken) {
          tokenManager.setRefreshToken(loginData.refreshToken);
        }

        // 2. Lưu thông tin người dùng vào localStorage
        const displayName =
          loginData.user?.fullName || loginData.user?.email || 'Quản Trị Viên';
        localStorage.setItem('user_name', displayName);
        if (loginData.user) {
          localStorage.setItem('user_info', JSON.stringify(loginData.user));
        }

        // 3. Chuyển hướng về trang chủ
        navigate('/', { replace: true });
      }
    } catch (error: unknown) {
      console.error('Đăng nhập thất bại:', error);
      const isAlreadyHandled = Boolean(
        (error as { isHandled?: boolean })?.isHandled ||
        (error as { isBusinessError?: boolean })?.isBusinessError
      );
      if (!isAlreadyHandled) {
        message.error(t('auth:toast_login_failed', 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin tài khoản.'));
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <S.RightPanel>
      <div>
        {/* Interactive Fox Mascot (koboyo.com/page-mascot) */}
        <FoxMascot
          isPasswordFocused={isPasswordFocused}
          isPasswordVisible={isPasswordVisible}
          isRegisterMode={isRegisterMode}
          size={88}
        />

        {/* Header Form */}
        <S.FormTopHeader>
          <S.FormTitle>
            {isRegisterMode ? t('auth:register_title') : t('auth:welcome_back')}
          </S.FormTitle>
          <S.FormSubtitle>
            {isRegisterMode
              ? t('auth:register_subtitle_desc')
              : t('auth:login_subtitle_desc')}
            {' '}
            <span className="gold-highlight">PhimBook</span>.
          </S.FormSubtitle>
        </S.FormTopHeader>

        {/* Switch Tab: Phone vs Email (only show on login) */}
        {!isRegisterMode && (
          <S.TabSwitchWrapper>
            <S.TabButton
              type="button"
              $isActive={activeTab === 'phone'}
              onClick={handleSelectPhoneTab}
            >
              <Smartphone size={15} />
              <span>{t('auth:tab_phone')}</span>
            </S.TabButton>

            <S.TabButton
              type="button"
              $isActive={activeTab === 'email'}
              onClick={handleSelectEmailTab}
            >
              <Mail size={15} />
              <span>{t('auth:tab_email')}</span>
            </S.TabButton>
          </S.TabSwitchWrapper>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Trường Họ và tên & SĐT khi đăng ký */}
          {isRegisterMode && (
            <>
              <S.FieldGroup>
                <S.FieldLabel>{t('auth:full_name_label')}</S.FieldLabel>
                <S.InputBox>
                  <User size={16} className="field-icon" />
                  <input
                    type="text"
                    placeholder={t('auth:full_name_placeholder')}
                    value={fullName}
                    onChange={handleFullNameChange}
                    required
                  />
                </S.InputBox>
              </S.FieldGroup>

              <S.FieldGroup>
                <S.FieldLabel>{t('auth:phone_reg_label')}</S.FieldLabel>
                <S.InputBox>
                  <Phone size={16} className="field-icon" />
                  <input
                    type="tel"
                    placeholder={t('auth:phone_reg_placeholder')}
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                  />
                </S.InputBox>
              </S.FieldGroup>
            </>
          )}

          {/* Field 1: Phone hoặc Email */}
          <S.FieldGroup>
            <S.FieldLabel>
              {isRegisterMode
                ? t('auth:email_account_label')
                : activeTab === 'phone'
                  ? t('auth:phone_label')
                  : t('auth:email_label')}
            </S.FieldLabel>
            <S.InputBox>
              {!isRegisterMode && activeTab === 'phone' ? (
                <Phone size={16} className="field-icon" />
              ) : (
                <Mail size={16} className="field-icon" />
              )}
              <input
                type={!isRegisterMode && activeTab === 'phone' ? 'tel' : 'email'}
                placeholder={
                  !isRegisterMode && activeTab === 'phone'
                    ? t('auth:phone_placeholder')
                    : t('auth:email_placeholder')
                }
                value={identifier}
                onChange={handleIdentifierChange}
                required
              />
            </S.InputBox>
          </S.FieldGroup>

          {/* Field 2: Password hoặc OTP */}
          <S.FieldGroup>
            <S.FieldLabelRow>
              <S.FieldLabel>
                {isRegisterMode
                  ? t('auth:password_account_label')
                  : activeTab === 'phone'
                    ? t('auth:otp_label')
                    : t('auth:password_label')}
              </S.FieldLabel>
              {!isRegisterMode && (
                <S.ForgotPassLink
                  type="button"
                  onClick={handleForgotPassword}
                >
                  {t('auth:forgot_password')}
                </S.ForgotPassLink>
              )}
            </S.FieldLabelRow>

            <S.InputBox>
              <Lock size={16} className="field-icon" />
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder={
                  !isRegisterMode && activeTab === 'phone'
                    ? t('auth:otp_placeholder')
                    : t('auth:password_placeholder')
                }
                value={credential}
                onChange={handleCredentialChange}
                onFocus={() => {
                  if (isRegisterMode || activeTab !== 'phone') {
                    setIsPasswordFocused(true);
                  }
                }}
                onBlur={() => setIsPasswordFocused(false)}
                required
              />
              <button
                type="button"
                className="toggle-eye"
                onClick={handleTogglePasswordVisibility}
                title={isPasswordVisible ? t('auth:hide_password') : t('auth:show_password')}
              >
                {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </S.InputBox>
          </S.FieldGroup>

          {/* Extra row: Ghi nhớ & Bảo mật SSL */}
          <S.ExtraOptionsRow>
            <S.CheckboxLabel>
              <input
                type="checkbox"
                checked={isRememberMe}
                onChange={handleRememberMeChange}
              />
              <span>{t('auth:remember_30_days')}</span>
            </S.CheckboxLabel>

            <S.SecurityTag>
              <ShieldCheck size={14} className="lock-icon" />
              <span>{t('auth:ssl_security')}</span>
            </S.SecurityTag>
          </S.ExtraOptionsRow>

          {/* Nút Submit */}
          <S.SubmitButton
            type="submit"
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>
                  {isRegisterMode
                    ? t('auth:btn_registering')
                    : t('auth:btn_logging_in')}
                </span>
              </>
            ) : (
              <>
                <span>
                  {isRegisterMode
                    ? t('auth:register_btn')
                    : t('auth:login_btn')}
                </span>
                <ArrowRight size={16} />
              </>
            )}
          </S.SubmitButton>

          {/* Quick Demo Fill Pill (only on login mode) */}
          {!isRegisterMode && (
            <div
              style={{
                marginTop: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontSize: 12,
                color: '#ae8786',
              }}
            >
              <span>{t('auth:demo_account_label')}</span>
              <button
                type="button"
                onClick={handleFillDemoAccount}
                style={{
                  background: 'rgba(255, 83, 90, 0.12)',
                  border: '1px solid rgba(255, 83, 90, 0.3)',
                  color: '#ff7b54',
                  borderRadius: 6,
                  padding: '2px 8px',
                  cursor: 'pointer',
                  fontSize: 11.5,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Sparkles size={12} />
                {t('auth:fill_demo_btn')}
              </button>
            </div>
          )}
        </form>

        {/* Hoặc tiếp tục với */}
        {!isRegisterMode && isFeatureEnabled('socialLogin') && (
          <>
            <S.OrDivider>
              <div className="line" />
              <span className="text">{t('auth:or_continue_with')}</span>
              <div className="line" />
            </S.OrDivider>

            {/* Social Logins */}
            <S.SocialButtonsRow>
              <S.SocialButton
                type="button"
                onClick={handleGoogleLogin}
              >
                <svg width="15" height="15" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.1 8.8 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14s.6 4.8 1.6 6.8l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.1-6.7-5.1L1.6 16.1C3.5 20.4 7.4 23 12 23z"
                  />
                </svg>
                <span>Google</span>
              </S.SocialButton>

              <S.SocialButton
                type="button"
                onClick={handleFacebookLogin}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </S.SocialButton>

              <S.SocialButton
                type="button"
                onClick={handleZaloLogin}
              >
                <span className="zalo-text">Z</span>
                <span>Zalo</span>
              </S.SocialButton>
            </S.SocialButtonsRow>

            {/* Đăng nhập nhanh bằng QR */}
            <S.QrCodeBanner
              onClick={handleQrLogin}
            >
              <div className="left">
                <QrCode size={22} className="qr-icon" />
                <div className="text-col">
                  <span className="title">{t('auth:qr_login_title')}</span>
                  <span className="desc">{t('auth:qr_login_desc')}</span>
                </div>
              </div>
              <ChevronRight size={16} className="chevron" />
            </S.QrCodeBanner>
          </>
        )}
      </div>

      {/* Footer form: Đăng ký & Voucher */}
      <S.FormFooter>
        <S.RegisterLinkText>
          {isRegisterMode
            ? t('auth:has_account_prompt')
            : t('auth:no_account_prompt')}
          <button
            type="button"
            onClick={handleToggleMode}
          >
            {isRegisterMode
              ? t('auth:sign_in_now_arrow')
              : t('auth:register_now_arrow')}
          </button>
        </S.RegisterLinkText>

        <S.VoucherBanner>
          <Ticket size={15} />
          <span>{t('auth:voucher_banner')}</span>
        </S.VoucherBanner>
      </S.FormFooter>
    </S.RightPanel>
  );
};

export default LoginForm;
