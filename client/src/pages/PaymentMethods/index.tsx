import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import { usePageHeader } from '@/components/shared/layout/PageHeaderContext';
import ActionFab from '@/components/shared/ui/ActionFab';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import { useOpen } from '@/hooks/common/useOpen';
import PaymentMethodsDialogManager from '@/pages/PaymentMethods/PaymentMethodsDialogManager';
import PaymentMethodsPageContent from '@/pages/PaymentMethods/PaymentMethodsPageContent';
import { PaymentMethodDto } from '@/types/PaymentMethod';

const PaymentMethodsPage = () => {
  const { t } = useTranslation('paymentMethods');
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();

  usePageHeader(t('pageTitle'));
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodDto>();
  const isMobile = useIsMobile();

  const handleSelectPaymentMethod = (paymentMethod: PaymentMethodDto) => {
    setSelectedPaymentMethod(paymentMethod);
  };

  const handleCloseEdit = () => {
    setSelectedPaymentMethod(undefined);
  };

  return (
    <PageLayout>
      {!isMobile && (
        <Row justifyContent="flex-end">
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
            {t('actions.create')}
          </Button>
        </Row>
      )}
      <PaymentMethodsPageContent selectPaymentMethod={handleSelectPaymentMethod} />
      <ActionFab onClick={openCreateDialog} showBelow={'sm'} />
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
