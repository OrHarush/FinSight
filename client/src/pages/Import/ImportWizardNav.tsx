import { Button, CircularProgress, Divider, Tooltip } from '@mui/material';
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
  const {
    activeStep,
    goToNextStep,
    goToPrevStep,
    canProceed,
    nextLabelOverride,
    nextDisabledReason,
    isReviewingDuplicates,
    footerPrimaryAction,
    isImportComplete,
  } = useImportWizard();

  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === TOTAL_STEPS - 1;

  if (isReviewingDuplicates || isImportComplete) {
    return null;
  }

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
          <Tooltip title={!canProceed && nextDisabledReason ? nextDisabledReason : ''}>
            <span>
              <Button variant="contained" onClick={goToNextStep} disabled={!canProceed}>
                {nextLabelOverride ?? t('importWizard.navigation.next')}
              </Button>
            </span>
          </Tooltip>
        )}
        {isLastStep && footerPrimaryAction && (
          <Button
            variant="contained"
            onClick={footerPrimaryAction.onClick}
            disabled={footerPrimaryAction.disabled}
            startIcon={
              footerPrimaryAction.loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            {footerPrimaryAction.label}
          </Button>
        )}
      </Row>
    </Column>
  );
};

export default ImportWizardNav;
