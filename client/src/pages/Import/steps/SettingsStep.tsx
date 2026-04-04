import { Divider, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import AccountSelect from '@/components/features/accounts/AccountSelect';
import { buildPaymentMethodGroups } from '@/components/features/paymentMethods/buildPaymentMethodGroups';
import { RHFDatePicker } from '@/components/shared/inputs/RHFDatePicker';
import RHFGroupedSelect from '@/components/shared/inputs/RHFGroupedSelect';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { useImportWizard } from '@/pages/Import/ImportWizardContext';

interface SettingsFormValues {
  accountId: string;
  paymentMethodId: string;
  dateFrom: string;
  dateTo: string;
}

const SettingsStep = () => {
  const { t } = useTranslation('transactions');
  const isMobile = useIsMobile();
  const { preview, settings, setSettings, setCanProceed } = useImportWizard();
  const { primaryAccount } = useAccounts();
  const { paymentMethods, primaryPaymentMethod } = usePaymentMethods();

  const groups = buildPaymentMethodGroups(paymentMethods, t);

  const defaultFrom = preview?.dateRange?.from
    ? dayjs(preview.dateRange.from).startOf('month').format('YYYY-MM-DD')
    : '';
  const defaultTo = preview?.dateRange?.to
    ? dayjs(preview.dateRange.to).endOf('month').format('YYYY-MM-DD')
    : '';

  const methods = useForm<SettingsFormValues>({
    defaultValues: {
      accountId: settings.accountId || primaryAccount?._id || '',
      paymentMethodId: settings.paymentMethodId || primaryPaymentMethod?._id || '',
      dateFrom: settings.dateFilter?.from ?? defaultFrom,
      dateTo: settings.dateFilter?.to ?? defaultTo,
    },
  });

  const { watch, getValues, setValue } = methods;

  useEffect(() => {
    if (primaryAccount && !getValues('accountId')) {
      setValue('accountId', primaryAccount._id, { shouldDirty: true });
    }
  }, [primaryAccount, getValues, setValue]);

  useEffect(() => {
    if (primaryPaymentMethod && !getValues('paymentMethodId')) {
      setValue('paymentMethodId', primaryPaymentMethod._id, { shouldDirty: true });
    }
  }, [primaryPaymentMethod, getValues, setValue]);

  useEffect(() => {
    const checkProceed = (values: Partial<SettingsFormValues>) => {
      setCanProceed(!!values.accountId && !!values.paymentMethodId);
    };

    checkProceed(getValues());

    const { unsubscribe } = watch(values => {
      checkProceed(values);
      setSettings({
        accountId: values.accountId ?? '',
        paymentMethodId: values.paymentMethodId ?? '',
        dateFilter:
          values.dateFrom && values.dateTo ? { from: values.dateFrom, to: values.dateTo } : null,
      });
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider {...methods}>
      <Column alignItems={'center'}>
        <Column spacing={3} flex={1} maxWidth={isMobile ? '280px' : '400px'}>
          <AccountSelect name="accountId" label={t('importWizard.settings.account')} />
          <RHFGroupedSelect
            name={'paymentMethodId'}
            label={t('importWizard.settings.paymentMethod')}
            required
            groups={groups}
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
