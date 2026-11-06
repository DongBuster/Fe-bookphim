import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import vi from './locales/vi.json';
import en from './locales/en.json';
import ko from './locales/ko.json';
import ja from './locales/ja.json';
import zh from './locales/zh.json';

const resources = {
  vi,
  en,
  ko,
  ja,
  zh,
};

export const NAMESPACES = [
  'common',
  'header',
  'footer',
  'sidebar',
  'auth',
  'booking',
  'movie',
  'discovery',
  'profile',
  'feedback',
  'home',
] as const;

export type AppNamespace = (typeof NAMESPACES)[number];

export const SUPPORTED_LANGUAGES = ['vi', 'en', 'ko', 'ja', 'zh'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// Kiểm tra ngôn ngữ đã được người dùng chủ động lựa chọn hay chưa
const isUserExplicit =
  typeof window !== 'undefined' &&
  localStorage.getItem('app_user_language_selected') === 'true';
const savedLng =
  typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : null;
const normalizedSavedLng = savedLng ? savedLng.split('-')[0] : null;

// Nếu người dùng chưa từng chủ động đổi ngôn ngữ hoặc giá trị lưu không hợp lệ -> luôn mặc định là 'vi'
const initialLng: SupportedLanguage =
  isUserExplicit &&
  normalizedSavedLng &&
  SUPPORTED_LANGUAGES.includes(normalizedSavedLng as SupportedLanguage)
    ? (normalizedSavedLng as SupportedLanguage)
    : 'vi';

if (typeof window !== 'undefined' && !isUserExplicit) {
  try {
    localStorage.setItem('i18nextLng', 'vi');
  } catch {
    // Bỏ qua lỗi nếu không ghi được localStorage
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLng,
    fallbackLng: 'vi',
    supportedLngs: [...SUPPORTED_LANGUAGES],
    defaultNS: 'common',
    ns: [...NAMESPACES],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
  });

export default i18n;
