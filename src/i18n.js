import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationKR from './locales/kr/translation.json';
import translationJA from './locales/ja/translation.json';
import translationZH from './locales/zh/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  kr: {
    translation: translationKR,
  },
  ja: {
    translation: translationJA,
  },
  zh: {
    translation: translationZH,
  },
};

i18n
.use(LanguageDetector)
  .use(initReactI18next) 
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
