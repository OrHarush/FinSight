import { PaymentMethodType } from '@lyra/shared';
import {
  AccountBalance,
  Autorenew,
  CreditCard,
  Payments,
  ReceiptLong,
  SvgIconComponent,
} from '@mui/icons-material';

export const paymentMethodTypeIconMap: Record<PaymentMethodType, SvgIconComponent> = {
  'Credit Card': CreditCard,
  Debit: CreditCard,
  'Bank Transfer': AccountBalance,
  Checks: ReceiptLong,
  'Standing Order': Autorenew,
  PayPal: Payments,
  Bit: Payments,
  PayBox: Payments,
  Cash: Payments,
};
