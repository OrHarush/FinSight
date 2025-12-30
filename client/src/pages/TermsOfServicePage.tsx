import { Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Column from '@/components/shared/layout/containers/Column';
import LegalSection from '@/components/legal/LegalSection';
import LegalBulletList from '@/components/legal/LegalBulletList';
import LegalFooter from '@/components/legal/LegalFooter';
import LegalMeta from '@/components/legal/LegalMeta';
import LegalHeader from '@/components/legal/LegalHeader';

export const TermsOfServicePage = () => {
  const { t } = useTranslation(['termsOfService']);

  return (
    <Column spacing={4} sx={{ maxWidth: 900, margin: '0 auto', p: { xs: 2, md: 4 } }}>
      <LegalHeader title={t('title')} />
      <Divider />
      <Column spacing={3}>
        <LegalSection title={t('sections.acceptance.title')}>
          {t('sections.acceptance.body')}
        </LegalSection>
        <LegalSection title={t('sections.service.title')}>
          {t('sections.service.body')}
        </LegalSection>
        <LegalSection title={t('sections.account.title')}>
          {t('sections.account.body')}
        </LegalSection>
        <LegalSection title={t('sections.data.title')}>{t('sections.data.body')}</LegalSection>
        <LegalSection title={t('sections.prohibited.title')}>
          <LegalBulletList
            items={t('sections.prohibited.items', { returnObjects: true }) as string[]}
          />
        </LegalSection>
        <LegalSection title={t('sections.availability.title')}>
          {t('sections.availability.body')}
        </LegalSection>
        <LegalSection title={t('sections.disclaimer.title')}>
          {t('sections.disclaimer.body')}
        </LegalSection>
        <LegalSection title={t('sections.liability.title')}>
          {t('sections.liability.body')}
        </LegalSection>
        <LegalSection title={t('sections.law.title')}>{t('sections.law.body')}</LegalSection>
        <LegalSection title={t('sections.changes.title')}>
          {t('sections.changes.body')}
        </LegalSection>
        <LegalSection title={t('sections.age.title')}>{t('sections.age.body')}</LegalSection>
        <LegalMeta />
      </Column>
      <Divider />
      <LegalFooter />
    </Column>
  );
};

export default TermsOfServicePage;
