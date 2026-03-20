import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import PageHeader from '@/components/shared/layout/page/PageHeader';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import ActionFab from '@/components/shared/ui/ActionFab';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import { useOpen } from '@/hooks/common/useOpen';
import PaymentMethodsDialogManager from '@/pages/PaymentMethods/PaymentMethodsDialogManager';
import PaymentMethodsPageContent from '@/pages/PaymentMethods/PaymentMethodsPageContent';
import { PaymentMethodDto } from '@/types/PaymentMethod';

const PaymentMethodsPage = () => {
  const { t } = useTranslation('paymentMethods');
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
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
      <PageHeader entityName={'paymentMethods'}>
        {!isMobile && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
            {t('actions.create')}
          </Button>
        )}
      </PageHeader>
      <PaymentMethodsPageContent selectPaymentMethod={handleSelectPaymentMethod} />
      <ActionFab onClick={openCreateDialog} />
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
