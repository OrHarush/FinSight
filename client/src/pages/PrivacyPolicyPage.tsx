import { Typography, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Column from '@/components/shared/layout/containers/Column';
import LegalSection from '@/components/legal/LegalSection';
import LegalBulletList from '@/components/legal/LegalBulletList';
import LegalFooter from '@/components/legal/LegalFooter';
import LegalMeta from '@/components/legal/LegalMeta';
import LegalHeader from '@/components/legal/LegalHeader';

export const PrivacyPolicyPage = () => {
  const { t } = useTranslation(['privacyPolicy', 'common']);

  const getArray = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value;
    }

    return [];
  };

  return (
    <Column
      spacing={4}
      sx={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <LegalHeader title={t('title')} />
      <Divider />
      <Column spacing={3}>
        <LegalSection title={t('sections.intro.title')}>{t('sections.intro.body')}</LegalSection>
        <LegalSection title={t('sections.controller.title')}>
          {t('sections.controller.body')}
        </LegalSection>
        <LegalSection title={t('sections.dataCollected.title')}>
          <Column spacing={2} sx={{ paddingLeft: 2, mt: 2 }}>
            <Column spacing={1}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t('sections.dataCollected.account.title')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                {t('sections.dataCollected.account.body')}
              </Typography>
            </Column>
            <Column spacing={1}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t('sections.dataCollected.financial.title')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                {t('sections.dataCollected.financial.body')}
              </Typography>
            </Column>
            <Column spacing={1}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t('sections.dataCollected.technical.title')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                {t('sections.dataCollected.technical.body')}
              </Typography>
            </Column>
          </Column>
        </LegalSection>
        <LegalSection title={t('sections.legalBasis.title')}>
          {t('sections.legalBasis.body')}
        </LegalSection>
        <LegalSection title={t('sections.usage.title')}>
          <LegalBulletList items={getArray(t('sections.usage.items', { returnObjects: true }))} />
        </LegalSection>
        <LegalSection title={t('sections.deletion.title')}>
          {t('sections.deletion.body')}
        </LegalSection>
        <LegalSection title={t('sections.rights.title')}>{t('sections.rights.body')}</LegalSection>
        <LegalSection title={t('sections.cookies.title')}>
          {t('sections.cookies.body')}
        </LegalSection>
        <LegalSection title={t('sections.thirdParties.title')}>
          {t('sections.thirdParties.body')}
        </LegalSection>
        <LegalSection title={t('sections.age.title')}>{t('sections.age.body')}</LegalSection>
        <LegalSection title={t('sections.changes.title')}>
          {t('sections.changes.body')}
        </LegalSection>
        <LegalMeta />
      </Column>
      <Divider />
      <LegalFooter />
    </Column>
  );
};

export default PrivacyPolicyPage;
