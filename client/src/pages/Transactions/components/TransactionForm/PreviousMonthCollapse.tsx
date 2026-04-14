import { TransactionFormValues } from '@lyra/shared';
import { Checkbox, Collapse, FormControlLabel } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';

const PreviousMonthCollapse = () => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext<TransactionFormValues>();
  const { paymentMethods } = usePaymentMethods();
  const paymentMethodId = useWatch({ control, name: 'paymentMethod' });
  const paymentMethod = paymentMethods.find(pm => pm._id === paymentMethodId);

  const show = !!paymentMethodId && paymentMethod?.type !== 'Credit Card';

  return (
    <Collapse in={show} unmountOnExit>
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
    </Collapse>
  );
};

export default PreviousMonthCollapse;
