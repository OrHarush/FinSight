import { useTranslation } from 'react-i18next';

import JsonLd from '@/components/seo/JsonLd';
import ScrollableColumn from '@/components/shared/layout/containers/ScrollableColumn';
import Footer from '@/components/shared/layout/Footer';
import BottomCtaSection from '@/pages/Home/BottomCtaSection';
import ComparisonSection from '@/pages/Home/ComparisonSection';
import DashboardClaritySection from '@/pages/Home/DashboardClaritySection';
import FaqSection from '@/pages/Home/FaqSection';
import HeroSection from '@/pages/Home/HeroSection';
import HowItWorksSection from '@/pages/Home/HowItWorksSection';
import LandingNavbar from '@/pages/Home/LandingNavbar';
import TestimonialsSection from '@/pages/Home/TestimonialsSection';

const HomePage = () => {
  const { i18n } = useTranslation();

  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Lyra',
    url: 'https://lyra-il.com',
    datePublished: '2025-08-15',
    dateModified: '2026-05-04',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    inLanguage: i18n.language,
    description:
      'ליירה — אפליקציה ישראלית למעקב הוצאות וניהול תזרים. ניהול הוצאות והכנסות עם מחזורי חיוב נפרדים לכל כרטיס אשראי, ייבוא קבצים מקאל וממקס, חישוב יתרה אוטומטי ותחזית — ללא חיבור לבנק. חינם.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'ILS',
    },
    featureList: [
      'מעקב הוצאות יומי בעברית',
      'ניהול תזרים מזומנים אישי',
      'ניהול הוצאות והכנסות במקום אחד',
      'ייבוא קבצי CSV מקאל וממקס',
      'מחזור חיוב נפרד לכל כרטיס אשראי',
      'ללא חיבור לחשבון הבנק',
      'חישוב יתרה אוטומטי ותחזית עתידית',
      'קטגוריות, חשבונות ואמצעי תשלום מותאמים אישית',
      'תמיכה מלאה בעברית ובאנגלית עם RTL',
      'חינמי לחלוטין',
    ],
  };

  return (
    <>
      <JsonLd id="software-application-jsonld" schema={softwareApplicationSchema} />
      <LandingNavbar />
      <ScrollableColumn component={'main'} sx={{ pb: 4, pr: 0 }}>
        <HeroSection />
        <DashboardClaritySection />
        <HowItWorksSection />
        <ComparisonSection />
        <FaqSection />
        <TestimonialsSection />
        <BottomCtaSection />
        <Footer />
      </ScrollableColumn>
    </>
  );
};

export default HomePage;
