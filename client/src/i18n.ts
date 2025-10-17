import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from '@/locales/en/common.json';
import enLogin from '@/locales/en/login.json';
import enDashboard from '@/locales/en/dashboard.json';
import enSidebar from '@/locales/en/sidebar.json';
import enTransactions from '@/locales/en/transactions.json';
import enAccounts from '@/locales/en/accounts.json';
import enCategories from '@/locales/en/categories.json';

import heCommon from '@/locales/he/common.json';
import heLogin from '@/locales/he/login.json';
import heDashboard from '@/locales/he/dashboard.json';
import heSidebar from '@/locales/he/sidebar.json';
import heTransactions from '@/locales/he/transactions.json';
import heAccounts from '@/locales/he/accounts.json';
import heCategories from '@/locales/he/categories.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        login: enLogin,
        dashboard: enDashboard,
        sidebar: enSidebar,
        transactions: enTransactions,
        accounts: enAccounts,
        categories: enCategories,
      },
      he: {
        common: heCommon,
        login: heLogin,
        sidebar: heSidebar,
        dashboard: heDashboard,
        transactions: heTransactions,
        accounts: heAccounts,
        categories: heCategories,
      },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
