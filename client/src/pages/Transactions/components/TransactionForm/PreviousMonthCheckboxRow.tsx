import { Checkbox, FormControlLabel } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { TransactionFormValues } from '@finsight/shared';

const PreviousMonthCheckboxRow = () => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext<TransactionFormValues>();
  const { paymentMethods } = usePaymentMethods();
  const paymentMethodId = useWatch({ control, name: 'paymentMethod' });
  const paymentMethod = paymentMethods.find(currentMethod => currentMethod._id === paymentMethodId);

  if (paymentMethod?.type === 'Credit') {
    return null;
  }

  return (
    <Row alignItems="center">
      <FormControlLabel
        control={
          <Controller
            name="belongToPreviousMonth"
            control={control}
            render={({ field }) => (
              <Checkbox
                {...field}
                size="small"
                checked={Boolean(field.value)}
                onChange={event => field.onChange(event.target.checked)}
              />
            )}
          />
        }
        label={t('fields.countTowardPreviousMonth')}
        sx={{
          ml: 0,
          '& .MuiFormControlLabel-label': {
            fontSize: '0.875rem',
            color: 'text.secondary',
          },
        }}
      />
    </Row>
  );
};

export default PreviousMonthCheckboxRow;

