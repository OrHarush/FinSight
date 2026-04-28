import { Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import LegalBulletList from '@/components/legal/LegalBulletList';
import LegalHeader from '@/components/legal/LegalHeader';
import LegalMeta from '@/components/legal/LegalMeta';
import LegalSection from '@/components/legal/LegalSection';
import Column from '@/components/shared/layout/containers/Column';

interface LegalContentRendererProps {
  type: 'termsOfService' | 'privacyPolicy' | 'accessibility';
}

const AccessibilityContent = () => {
  const { t } = useTranslation(['accessibility', 'common']);
  return (
    <>
      <LegalHeader title={t('title')} date={t('date')} />
      <Divider />
      <Column spacing={3} sx={{ flex: 1 }}>
        <LegalSection title={t('sections.general.title')}>
          {t('sections.general.body')}
        </LegalSection>
        <LegalSection title={t('sections.status.title')}>{t('sections.status.body')}</LegalSection>
        <LegalSection title={t('sections.exemptions.title')}>
          {t('sections.exemptions.body')}
        </LegalSection>
        <LegalMeta email="accessibility@lyra-il.com">
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
            {t('sections.contact.body')}
          </Typography>
        </LegalMeta>
      </Column>
    </>
  );
};

const PrivacyPolicyContent = () => {
  const { t } = useTranslation(['privacyPolicy', 'common']);
  const getArray = (value: unknown): string[] => (Array.isArray(value) ? value : []);

  return (
    <>
      <LegalHeader title={t('title')} date={t('date')} />
      <Divider />
      <Column spacing={3}>
        <LegalSection title={t('sections.intro.title')}>{t('sections.intro.body')}</LegalSection>
        <LegalSection title={t('sections.controller.title')}>
          {t('sections.controller.body')}
        </LegalSection>
        <LegalSection title={t('sections.dataCollected.title')}>
          <Column spacing={2} sx={{ paddingLeft: 2, mt: 2 }}>
            <Column spacing={1}>
              <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t('sections.dataCollected.account.title')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                {t('sections.dataCollected.account.body')}
              </Typography>
            </Column>
            <Column spacing={1}>
              <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t('sections.dataCollected.financial.title')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                {t('sections.dataCollected.financial.body')}
              </Typography>
            </Column>
            <Column spacing={1}>
              <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 600 }}>
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
        <LegalMeta email="support@lyra-il.com" />
      </Column>
    </>
  );
};

const TermsOfServiceContent = () => {
  const { t } = useTranslation(['termsOfService']);

  return (
    <>
      <LegalHeader title={t('title')} date={t('date')} />
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
        <LegalMeta email="support@lyra-il.com" />
      </Column>
    </>
  );
};

const LegalContentRenderer = ({ type }: LegalContentRendererProps) => (
  <Column spacing={4} sx={{ flex: 1 }} maxWidth={'900px'}>
    {type == 'accessibility' && <AccessibilityContent />}
    {type == 'privacyPolicy' && <PrivacyPolicyContent />}
    {type == 'termsOfService' && <TermsOfServiceContent />}
  </Column>
);

export default LegalContentRenderer;
