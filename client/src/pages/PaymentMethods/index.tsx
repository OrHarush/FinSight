import { Button, Card, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import PageHeader from '@/components/shared/layout/page/PageHeader';
import { useOpen } from '@/hooks/useOpen';
import CreatePaymentMethodDialog from '@/components/features/paymentMethods/dialogs/CreatePaymentMethodDialog';
import PaymentMethodsPageContent from '@/pages/PaymentMethods/PaymentMethodsPageContent';
import { useState } from 'react';
import { PaymentMethodDto } from '@/types/PaymentMethod';
import EditPaymentMethodDialog from '@/components/features/paymentMethods/dialogs/EditPaymentMethodDialog';
import ActionFab from '@/components/shared/ui/ActionFab';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useTranslation } from 'react-i18next';

const PaymentMethodsPage = () => {
  const { t } = useTranslation('paymentMethods');
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodDto>();
  const isMobile = useIsMobile();

  const closeEditDialogAndReset = () => {
    setSelectedPaymentMethod(undefined);
  };

  const selectPaymentMethod = (paymentMethod: PaymentMethodDto) => {
    setSelectedPaymentMethod(paymentMethod);
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
      <PaymentMethodsPageContent selectPaymentMethod={selectPaymentMethod} />
      <ActionFab onClick={openCreateDialog} />
      {isCreateDialogOpen && (
        <CreatePaymentMethodDialog isOpen={isCreateDialogOpen} closeDialog={closeCreateDialog} />
      )}
      {!!selectedPaymentMethod && (
        <EditPaymentMethodDialog
          isOpen={!!selectedPaymentMethod}
          closeDialog={closeEditDialogAndReset}
          paymentMethod={selectedPaymentMethod}
        />
      )}
    </PageLayout>
  );
};

export default PaymentMethodsPage;
