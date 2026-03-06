import CreatePaymentMethodDialog from '@/pages/PaymentMethods/components/dialogs/CreatePaymentMethodDialog';
import EditPaymentMethodDialog from '@/pages/PaymentMethods/components/dialogs/EditPaymentMethodDialog';
import { PaymentMethodDto } from '@/types/PaymentMethod';

interface PaymentMethodsDialogManagerProps {
  isCreateOpen: boolean;
  selectedPaymentMethod?: PaymentMethodDto;
  onCloseCreate: () => void;
  onCloseEdit: () => void;
}

const PaymentMethodsDialogManager = ({
  isCreateOpen,
  selectedPaymentMethod,
  onCloseCreate,
  onCloseEdit,
}: PaymentMethodsDialogManagerProps) => (
  <>
    {isCreateOpen && (
      <CreatePaymentMethodDialog isOpen={isCreateOpen} closeDialog={onCloseCreate} />
    )}
    {selectedPaymentMethod && (
      <EditPaymentMethodDialog
        isOpen={!!selectedPaymentMethod}
        closeDialog={onCloseEdit}
        paymentMethod={selectedPaymentMethod}
      />
    )}
  </>
);

export default PaymentMethodsDialogManager;
