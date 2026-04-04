import { Divider, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import AccountSelect from '@/components/features/accounts/AccountSelect';
import { RHFDatePicker } from '@/components/shared/inputs/RHFDatePicker';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useImportWizard } from '@/pages/Import/ImportWizardContext';
import WizardPaymentSelect from '@/pages/Import/steps/WizardPaymentSelect';

interface SettingsFormValues {
  accountId: string;
  paymentMethodId: string;
  dateFrom: string;
  dateTo: string;
}

const SettingsStep = () => {
  const { t } = useTranslation('transactions');
  const { preview, settings, setSettings, setCanProceed } = useImportWizard();

  const defaultFrom = preview?.dateRange?.from
    ? dayjs(preview.dateRange.from).startOf('month').format('YYYY-MM-DD')
    : '';
  const defaultTo = preview?.dateRange?.to
    ? dayjs(preview.dateRange.to).endOf('month').format('YYYY-MM-DD')
    : '';

  const methods = useForm<SettingsFormValues>({
    defaultValues: {
      accountId: settings.accountId || '',
      paymentMethodId: settings.paymentMethodId || '',
      dateFrom: settings.dateFilter?.from ?? defaultFrom,
      dateTo: settings.dateFilter?.to ?? defaultTo,
    },
  });

  const { watch } = methods;
  const accountId = watch('accountId');
  const paymentMethodId = watch('paymentMethodId');

  useEffect(() => {
    setCanProceed(!!accountId && !!paymentMethodId);
  }, [accountId, paymentMethodId, setCanProceed]);

  useEffect(() => {
    const subscription = watch(values => {
      setSettings({
        accountId: values.accountId ?? '',
        paymentMethodId: values.paymentMethodId ?? '',
        dateFilter:
          values.dateFrom && values.dateTo ? { from: values.dateFrom, to: values.dateTo } : null,
      });
    });

    return () => subscription.unsubscribe();
  }, [watch, setSettings]);

  return (
    <FormProvider {...methods}>
      <Column alignItems={'center'}>
        <Column spacing={3} flex={1} maxWidth={400}>
          <AccountSelect name="accountId" label={t('importWizard.settings.account')} />
          <WizardPaymentSelect
            name="paymentMethodId"
            label={t('importWizard.settings.paymentMethod')}
          />
          <Divider />
          <Column spacing={1.5}>
            <Typography variant="body2" color="text.secondary">
              {t('importWizard.settings.dateFilterLabel')}
            </Typography>
            <Row spacing={2}>
              <RHFDatePicker name="dateFrom" label={t('importWizard.settings.from')} />
              <RHFDatePicker name="dateTo" label={t('importWizard.settings.to')} />
            </Row>
          </Column>
        </Column>
      </Column>
    </FormProvider>
  );
};

export default SettingsStep;
