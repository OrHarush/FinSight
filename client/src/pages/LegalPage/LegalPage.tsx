import { Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

import LegalContentRenderer from '@/components/legal/LegalContentRenderer';
import JsonLd from '@/components/seo/JsonLd';
import ScrollableColumn from '@/components/shared/layout/containers/ScrollableColumn';
import Footer from '@/components/shared/layout/Footer';
import { ROUTES } from '@/constants/Routes';
import LandingNavbar from '@/pages/Home/LandingNavbar';

interface LegalPageProps {
  type: 'termsOfService' | 'privacyPolicy' | 'accessibility';
}

const LEGAL_PATHS: Record<LegalPageProps['type'], string> = {
  accessibility: ROUTES.ACCESSIBILITY_URL,
  privacyPolicy: ROUTES.PRIVACY_POLICY_URL,
  termsOfService: ROUTES.TERMS_OF_SERVICE_URL,
};

const LegalPage = ({ type }: LegalPageProps) => {
  const { t, i18n } = useTranslation(type);

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t('title'),
    url: `https://lyra-il.com${LEGAL_PATHS[type]}`,
    inLanguage: i18n.language,
  };

  return (
    <>
      <JsonLd id="webpage-jsonld" schema={webPageSchema} />
      <LandingNavbar />
      <ScrollableColumn
        component={'main'}
        alignItems={'center'}
        sx={{
          padding: { xs: 2, sm: 3, md: 4 },
          flex: 1,
        }}
      >
        <LegalContentRenderer type={type} showBackButton />
        <Divider sx={{ mt: 'auto', width: '100%', maxWidth: '900px' }} />
        <Footer />
      </ScrollableColumn>
    </>
  );
};

export default LegalPage;
