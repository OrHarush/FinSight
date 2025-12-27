import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import dayjs from 'dayjs';

import enCommon from '@/locales/en/common.json';
import enHome from '@/locales/en/home.json';
import enLogin from '@/locales/en/login.json';
import enUser from '@/locales/en/user.json';
import enPrivacyPolicy from '@/locales/en/privacyPolicy.json';
import enTermsOfService from '@/locales/en/termsOfService.json';
import enOverview from '@/locales/en/overview.json';
import enSidebar from '@/locales/en/sidebar.json';
import enTransactions from '@/locales/en/transactions.json';
import enAccounts from '@/locales/en/accounts.json';
import enCategories from '@/locales/en/categories.json';
import enPaymentMethods from '@/locales/en/paymentMethods.json';

import heCommon from '@/locales/he/common.json';
import heHome from '@/locales/he/home.json';
import heLogin from '@/locales/he/login.json';
import heUser from '@/locales/he/user.json';
import hePrivacyPolicy from '@/locales/he/privacyPolicy.json';
import heTermsOfService from '@/locales/he/termsOfService.json';
import heOverview from '@/locales/he/overview.json';
import heSidebar from '@/locales/he/sidebar.json';
import heTransactions from '@/locales/he/transactions.json';
import heAccounts from '@/locales/he/accounts.json';
import heCategories from '@/locales/he/categories.json';
import hePaymentMethods from '@/locales/he/paymentMethods.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        home: enHome,
        login: enLogin,
        user: enUser,
        privacyPolicy: enPrivacyPolicy,
        termsOfService: enTermsOfService,
        sidebar: enSidebar,
        overview: enOverview,
        transactions: enTransactions,
        accounts: enAccounts,
        categories: enCategories,
        paymentMethods: enPaymentMethods,
      },
      he: {
        common: heCommon,
        home: heHome,
        login: heLogin,
        user: heUser,
        privacyPolicy: hePrivacyPolicy,
        termsOfService: heTermsOfService,
        sidebar: heSidebar,
        overview: heOverview,
        transactions: heTransactions,
        accounts: heAccounts,
        categories: heCategories,
        paymentMethods: hePaymentMethods,
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

dayjs.locale(i18n.language);

i18n.on('languageChanged', lng => {
  dayjs.locale(lng);
});

export default i18n;
