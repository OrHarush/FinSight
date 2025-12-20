import TextInput from '@/components/inputs/TextInput';
import RHFSelect from '@/components/inputs/RHFSelect';
import Column from '@/components/layout/Containers/Column';
import { useTranslation } from 'react-i18next';
import Row from '@/components/layout/Containers/Row';
import { useFormContext, useWatch } from 'react-hook-form';
import { PaymentMethodFormValues } from '@/types/PaymentMethod';

const PaymentMethodForm = () => {
  const { t } = useTranslation('paymentMethods');
  const { control } = useFormContext<PaymentMethodFormValues>();
  const paymentType = useWatch({ control, name: 'type' });

  return (
    <Column spacing={2}>
      <TextInput name="name" label={t('fields.name')} required />
      <RHFSelect
        name="type"
        label={t('fields.type')}
        required
        options={[
          { value: 'Credit', label: t('types.credit') },
          { value: 'Debit', label: t('types.debit') },
          { value: 'BankTransfer', label: t('types.bankTransfer') },
          { value: 'PayPal', label: t('types.paypal') },
          { value: 'Other', label: t('types.other') },
        ]}
      />
      <Row spacing={2}>
        {paymentType === 'Credit' && (
          <TextInput
            name="billingDay"
            label={t('fields.billingDay')}
            type="number"
            min={1}
            max={31}
            required
          />
        )}
        {(paymentType === 'Credit' || paymentType === 'Debit') && (
          <TextInput
            name="last4"
            label={t('fields.last4')}
            type="text"
            minLength={4}
            maxLength={4}
          />
        )}
      </Row>
    </Column>
  );
};

export default PaymentMethodForm;
