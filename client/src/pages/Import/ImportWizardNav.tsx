import { Button, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { ROUTES } from '@/constants/Routes';
import { TOTAL_STEPS } from '@/pages/Import/constants/import';
import { useImportWizard } from '@/pages/Import/ImportWizardContext';

const ImportWizardNav = () => {
  const { t } = useTranslation('transactions');
  const navigate = useNavigate();
  const { activeStep, goToNextStep, goToPrevStep, canProceed } = useImportWizard();

  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === TOTAL_STEPS - 1;

  const handleBack = () => {
    if (isFirstStep) {
      navigate(ROUTES.TRANSACTIONS_URL);
    } else {
      goToPrevStep();
    }
  };

  return (
    <Column spacing={1} sx={{ pt: 2 }}>
      <Divider />
      <Row justifyContent="space-between" pb={1}>
        <Button variant="outlined" onClick={handleBack}>
          {t('importWizard.navigation.back')}
        </Button>
        {!isLastStep && (
          <Button variant="contained" onClick={goToNextStep} disabled={!canProceed}>
            {t('importWizard.navigation.next')}
          </Button>
        )}
      </Row>
    </Column>
  );
};

export default ImportWizardNav;
