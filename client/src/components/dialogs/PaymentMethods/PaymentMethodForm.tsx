import TextInput from '@/components/inputs/TextInput';
import RHFSelect from '@/components/inputs/RHFSelect';
import Column from '@/components/layout/Containers/Column';
import { FormControlLabel, Checkbox } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Row from '@/components/layout/Containers/Row';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { PaymentMethodFormValues } from '@/types/PaymentMethod';

const PaymentMethodForm = () => {
  const { t } = useTranslation('paymentMethods');
  const { control } = useFormContext<PaymentMethodFormValues>();
  const { paymentMethods } = usePaymentMethods();
  const paymentType = useWatch({ control, name: 'type' });

  const hasPaymentMethods = paymentMethods.length > 0;

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
        <TextInput
          name="billingDay"
          label={t('fields.billingDay')}
          type="number"
          min={1}
          max={31}
          required
        />
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
      <FormControlLabel
        control={
          <Controller
            name="isPrimary"
            control={control}
            render={({ field }) => (
              <Checkbox
                {...field}
                checked={field.value || !hasPaymentMethods}
                onChange={e => field.onChange(e.target.checked)}
                disabled={!hasPaymentMethods}
              />
            )}
          />
        }
        label={t('fields.isPrimary')}
      />
    </Column>
  );
};

export default PaymentMethodForm;
