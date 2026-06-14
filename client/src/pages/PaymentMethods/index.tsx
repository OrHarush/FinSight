import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import { usePageHeader, usePrimaryAction } from '@/components/shared/layout/PageHeaderContext';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import { useOpen } from '@/hooks/common/useOpen';
import PaymentMethodsDialogManager from '@/pages/PaymentMethods/PaymentMethodsDialogManager';
import PaymentMethodsPageContent from '@/pages/PaymentMethods/PaymentMethodsPageContent';
import { PaymentMethodDto } from '@/types/PaymentMethod';

const PaymentMethodsPage = () => {
  const { t } = useTranslation('paymentMethods');
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();

  usePageHeader(t('pageTitle'));
  usePrimaryAction(openCreateDialog);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodDto>();
  const isSmallScreen = useIsSmallScreen();

  const handleSelectPaymentMethod = (paymentMethod: PaymentMethodDto) => {
    setSelectedPaymentMethod(paymentMethod);
  };

  const handleCloseEdit = () => {
    setSelectedPaymentMethod(undefined);
  };

  return (
    <PageLayout>
      {!isSmallScreen && (
        <Row justifyContent="flex-end">
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
            {t('actions.create')}
          </Button>
        </Row>
      )}
      <PaymentMethodsPageContent selectPaymentMethod={handleSelectPaymentMethod} />
      <PaymentMethodsDialogManager
        isCreateOpen={isCreateDialogOpen}
        selectedPaymentMethod={selectedPaymentMethod}
        onCloseCreate={closeCreateDialog}
        onCloseEdit={handleCloseEdit}
      />
    </PageLayout>
  );
};

export default PaymentMethodsPage;
