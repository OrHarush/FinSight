import { Divider, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import AccountSelect from '@/components/features/accounts/AccountSelect';
import { buildPaymentMethodGroups } from '@/components/features/paymentMethods/buildPaymentMethodGroups';
import { RHFDatePicker } from '@/components/shared/inputs/RHFDatePicker';
import RHFGroupedSelect from '@/components/shared/inputs/RHFGroupedSelect';
import Column from '@/components/shared/layout/containers/Column';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { useImportWizard } from '@/pages/Import/ImportWizardContext';
import { SINGLE_CARD_KEY, UNKNOWN_CARD_KEY } from '@/pages/Import/types/importWizard';

interface SettingsFormValues {
  accountId: string;
  cardAssignments: Record<string, string>;
  dateFrom: string;
  dateTo: string;
}

const isMultiCard = (cards: string[]) => cards.length >= 2;

const getCardKeysForForm = (cards: string[]): string[] =>
  isMultiCard(cards) ? cards : [SINGLE_CARD_KEY];

const SettingsStep = () => {
  const { t } = useTranslation('transactions');
  const isMobile = useIsMobile();
  const { preview, settings, setSettings, setCanProceed, cards } = useImportWizard();
  const { primaryAccount } = useAccounts();
  const { paymentMethods, primaryPaymentMethod } = usePaymentMethods();

  const groups = buildPaymentMethodGroups(paymentMethods, t);
  const formCardKeys = useMemo(() => getCardKeysForForm(cards), [cards]);

  const defaultFrom = preview?.dateRange?.from
    ? dayjs(preview.dateRange.from).startOf('month').format('YYYY-MM-DD')
    : '';
  const defaultTo = preview?.dateRange?.to
    ? dayjs(preview.dateRange.to).endOf('month').format('YYYY-MM-DD')
    : '';

  const defaultCardAssignments: Record<string, string> = useMemo(() => {
    const next: Record<string, string> = {};

    for (const key of formCardKeys) {
      next[key] = settings.cardAssignments?.[key] || primaryPaymentMethod?._id || '';
    }

    return next;
  }, [formCardKeys, settings.cardAssignments, primaryPaymentMethod]);

  const methods = useForm<SettingsFormValues>({
    defaultValues: {
      accountId: settings.accountId || primaryAccount?._id || '',
      cardAssignments: defaultCardAssignments,
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
    if (!primaryPaymentMethod) {
      return;
    }

    const current = getValues('cardAssignments') ?? {};
    const next = { ...current };
    let changed = false;

    for (const key of formCardKeys) {
      if (!next[key]) {
        next[key] = primaryPaymentMethod._id;
        changed = true;
      }
    }

    if (changed) {
      setValue('cardAssignments', next, { shouldDirty: true });
    }
  }, [primaryPaymentMethod, formCardKeys, getValues, setValue]);

  useEffect(() => {
    const syncSettings = (values: {
      accountId?: string;
      cardAssignments?: Record<string, string | undefined>;
      dateFrom?: string;
      dateTo?: string;
    }) => {
      const rawAssignments = values.cardAssignments ?? {};
      const assignments: Record<string, string> = {};

      for (const [key, value] of Object.entries(rawAssignments)) {
        if (typeof value === 'string') {
          assignments[key] = value;
        }
      }

      const allFilled = formCardKeys.every(key => !!assignments[key]);

      setCanProceed(!!values.accountId && allFilled);
      setSettings({
        accountId: values.accountId ?? '',
        cardAssignments: assignments,
        dateFilter:
          values.dateFrom && values.dateTo ? { from: values.dateFrom, to: values.dateTo } : null,
      });
    };

    syncSettings(getValues());

    const subscription = watch(values => syncSettings(values));

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formCardKeys.join('|')]);

  const labelForCard = (cardKey: string): string => {
    if (cardKey === UNKNOWN_CARD_KEY) {
      return t('importWizard.settings.paymentMethodUnassigned');
    }

    return t('importWizard.settings.paymentMethodPerCard', { last4: cardKey });
  };

  const subLabelForCard = (cardKey: string): string => {
    const count = preview?.cardCounts?.[cardKey] ?? 0;

    return t('importWizard.settings.paymentMethodPerCardCount', { count });
  };

  return (
    <FormProvider {...methods}>
      <Column alignItems={'center'}>
        <Column spacing={3} flex={1} maxWidth={isMobile ? '280px' : '400px'}>
          <AccountSelect name="accountId" label={t('importWizard.settings.account')} />
          {isMultiCard(cards) ? (
            <Column spacing={2}>
              {formCardKeys.map(cardKey => (
                <Column key={cardKey} spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    {subLabelForCard(cardKey)}
                  </Typography>
                  <RHFGroupedSelect
                    name={`cardAssignments.${cardKey}`}
                    label={labelForCard(cardKey)}
                    required
                    groups={groups}
                  />
                </Column>
              ))}
            </Column>
          ) : (
            <RHFGroupedSelect
              name={`cardAssignments.${SINGLE_CARD_KEY}`}
              label={t('importWizard.settings.paymentMethod')}
              required
              groups={groups}
            />
          )}
          <Divider />
          <Column spacing={1.5}>
            <Typography variant="body2" color="text.secondary">
              {t('importWizard.settings.dateFilterLabel')}
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFDatePicker name="dateFrom" label={t('importWizard.settings.from')} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFDatePicker name="dateTo" label={t('importWizard.settings.to')} />
              </Grid>
            </Grid>
          </Column>
        </Column>
      </Column>
    </FormProvider>
  );
};

export default SettingsStep;
