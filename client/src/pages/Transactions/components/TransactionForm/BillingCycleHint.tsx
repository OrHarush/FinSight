import { TransactionFormValues } from '@lyra/shared';
import { alpha, Box, Collapse, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
import InfoTooltip from '@/components/shared/ui/InfoTooltip';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';

const BillingCycleHint = () => {
  const { t, i18n } = useTranslation('transactions');
  const theme = useTheme();
  const { control } = useFormContext<TransactionFormValues>();
  const { paymentMethods } = usePaymentMethods();

  const paymentMethodId = useWatch({ control, name: 'paymentMethod' });
  const date = useWatch({ control, name: 'date' });

  const paymentMethod = paymentMethods.find(pm => pm._id === paymentMethodId);
  const billingDay = paymentMethod?.type === 'Credit Card' ? paymentMethod.billingDay : undefined;

  const parsedDate = date && dayjs(date).isValid() ? dayjs(date) : null;
  const show = !!billingDay && !!parsedDate && parsedDate.date() < billingDay;

  const prevMonth = show ? parsedDate!.subtract(1, 'month').locale(i18n.language).format('MMMM') : '';

  return (
    <Collapse in={show} unmountOnExit>
      <Row justifyContent="center">
        <Row
          alignItems="center"
          spacing={0.75}
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
            borderRadius: '20px',
            px: 1.5,
            py: 0.5,
          }}
        >
          <Box
            component="span"
            sx={{
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: alpha(theme.palette.primary.main, 0.9),
              lineHeight: 1,
            }}
          >
            {t('billingCycleHint', { month: prevMonth })}
          </Box>
          <InfoTooltip content={t('billingCycleHintTooltip', { billingDay })} size="small" />
        </Row>
      </Row>
    </Collapse>
  );
};

export default BillingCycleHint;
