import dayjs from 'dayjs';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enAdmin from '@/locales/en/admin.json';
import enAccounts from '@/locales/en/accounts.json';
import enBudgets from '@/locales/en/budgets.json';
import enCategories from '@/locales/en/categories.json';
import enChat from '@/locales/en/chat.json';
import enCommon from '@/locales/en/common.json';
import enHome from '@/locales/en/home.json';
import enLogin from '@/locales/en/login.json';
import enOverview from '@/locales/en/overview.json';
import enPaymentMethods from '@/locales/en/paymentMethods.json';
import enPrivacyPolicy from '@/locales/en/privacyPolicy.json';
import enSidebar from '@/locales/en/sidebar.json';
import enTermsOfService from '@/locales/en/termsOfService.json';
import enTransactions from '@/locales/en/transactions.json';
import enUser from '@/locales/en/user.json';
import heAdmin from '@/locales/he/admin.json';
import heAccounts from '@/locales/he/accounts.json';
import heBudgets from '@/locales/he/budgets.json';
import heCategories from '@/locales/he/categories.json';
import heChat from '@/locales/he/chat.json';
import heCommon from '@/locales/he/common.json';
import heHome from '@/locales/he/home.json';
import heLogin from '@/locales/he/login.json';
import heOverview from '@/locales/he/overview.json';
import hePaymentMethods from '@/locales/he/paymentMethods.json';
import hePrivacyPolicy from '@/locales/he/privacyPolicy.json';
import heSidebar from '@/locales/he/sidebar.json';
import heTermsOfService from '@/locales/he/termsOfService.json';
import heTransactions from '@/locales/he/transactions.json';
import heUser from '@/locales/he/user.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        admin: enAdmin,
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
        budgets: enBudgets,
        chat: enChat,
      },
      he: {
        admin: heAdmin,
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
        budgets: heBudgets,
        chat: heChat,
      },
    },
    fallbackLng: 'he',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
    },
  });

dayjs.locale(i18n.language);

i18n.on('languageChanged', lng => {
  dayjs.locale(lng);
});

export default i18n;
