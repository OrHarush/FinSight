import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import PageHeader from '@/components/shared/layout/page/PageHeader';
import { useOpen } from '@/hooks/common/useOpen';
import PaymentMethodsPageContent from '@/pages/PaymentMethods/PaymentMethodsPageContent';
import PaymentMethodsDialogManager from '@/pages/PaymentMethods/PaymentMethodsDialogManager';
import { useState } from 'react';
import { PaymentMethodDto } from '@/types/PaymentMethod';
import ActionFab from '@/components/shared/ui/ActionFab';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import { useTranslation } from 'react-i18next';

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
