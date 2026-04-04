import { Step, StepLabel, Stepper } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import { usePageHeader } from '@/components/shared/layout/PageHeaderContext';
import { ImportWizardProvider, useImportWizard } from '@/pages/Import/ImportWizardContext';
import ImportWizardNav from '@/pages/Import/ImportWizardNav';
import CategorizeStep from '@/pages/Import/steps/categorize';
import ConfirmStep from '@/pages/Import/steps/ConfirmStep';
import SettingsStep from '@/pages/Import/steps/SettingsStep';
import UploadStep from '@/pages/Import/steps/upload';

const STEP_COMPONENTS = [UploadStep, SettingsStep, CategorizeStep, ConfirmStep];

const ImportWizardContent = () => {
  const { t } = useTranslation('transactions');
  const { activeStep } = useImportWizard();

  usePageHeader(t('importWizard.pageTitle'));

  const stepLabels = [
    t('importWizard.steps.upload'),
    t('importWizard.steps.settings'),
    t('importWizard.steps.categorize'),
    t('importWizard.steps.confirm'),
  ];

  const ActiveStep = STEP_COMPONENTS[activeStep];

  return (
    <Column height="100%" spacing={0}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ pb: 3 }}>
        {stepLabels.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Column flex={1} minHeight={0} overflow="auto">
        <ActiveStep />
      </Column>
      <ImportWizardNav />
    </Column>
  );
};

const ImportWizardPage = () => (
  <PageLayout>
    <ImportWizardProvider>
      <ImportWizardContent />
    </ImportWizardProvider>
  </PageLayout>
);

export default ImportWizardPage;
