import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageLayout from '@/components/layout/Page/PageLayout';
import PageHeader from '@/components/layout/Page/PageHeader';
import { useOpen } from '@/hooks/useOpen';
import CreatePaymentMethodDialog from '@/components/dialogs/PaymentMethods/CreatePaymentMethodDialog';
import PaymentMethodsPageContent from '@/pages/PaymentMethods/PaymentMethodsPageContent';
import { useState } from 'react';
import { PaymentMethodDto } from '@/types/PaymentMethod';
import EditPaymentMethodDialog from '@/components/dialogs/PaymentMethods/EditPaymentMethodDialog';

const PaymentMethodsPage = () => {
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodDto>();

  const closeEditDialogAndReset = () => {
    setSelectedPaymentMethod(undefined);
  };

  const selectPaymentMethod = (paymentMethod: PaymentMethodDto) => {
    setSelectedPaymentMethod(paymentMethod);
  };

  return (
    <PageLayout>
      <PageHeader entityName={'paymentMethods'}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
          Add
        </Button>
      </PageHeader>
      <PaymentMethodsPageContent selectPaymentMethod={selectPaymentMethod} />
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
