import CheckIcon from '@mui/icons-material/Check';
import { Button, CircularProgress, Divider, Grid, Paper, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import api from '@/api/axios';
import AccountSelect from '@/components/features/accounts/AccountSelect';
import { buildPaymentMethodGroups } from '@/components/features/paymentMethods/buildPaymentMethodGroups';
import { RHFDatePicker } from '@/components/shared/inputs/RHFDatePicker';
import RHFGroupedSelect from '@/components/shared/inputs/RHFGroupedSelect';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { useImportWizard } from '@/pages/Import/ImportWizardContext';
import { SINGLE_CARD_KEY, UNKNOWN_CARD_KEY } from '@/pages/Import/types/importWizard';
import { PaymentMethodDto } from '@/types/PaymentMethod';

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
  const queryClient = useQueryClient();
  const { preview, settings, setSettings, setCanProceed, cards } = useImportWizard();
  const { primaryAccount } = useAccounts();
  const { paymentMethods, primaryPaymentMethod } = usePaymentMethods();

  const isBankStatement = preview?.format === 'bank-statement';
  const bankTransferPMs = useMemo(
    () => paymentMethods.filter(pm => pm.type === 'Bank Transfer'),
    [paymentMethods]
  );
  const visiblePMs = isBankStatement ? bankTransferPMs : paymentMethods;
  const groups = buildPaymentMethodGroups(visiblePMs, t);
  const formCardKeys = useMemo(() => getCardKeysForForm(cards), [cards]);
  const defaultPMId = isBankStatement
    ? bankTransferPMs[0]?._id ?? ''
    : primaryPaymentMethod?._id ?? '';
  const [isCreatingDefault, setIsCreatingDefault] = useState(false);
  const [createError, setCreateError] = useState(false);
  const [autoCreated, setAutoCreated] = useState(false);
  const autoCreateAttempted = useRef(false);

  const defaultFrom = preview?.dateRange?.from
    ? dayjs(preview.dateRange.from).startOf('month').format('YYYY-MM-DD')
    : '';
  const defaultTo = preview?.dateRange?.to
    ? dayjs(preview.dateRange.to).endOf('month').format('YYYY-MM-DD')
    : '';

  const defaultCardAssignments: Record<string, string> = useMemo(() => {
    const next: Record<string, string> = {};

    for (const key of formCardKeys) {
      next[key] = settings.cardAssignments?.[key] || defaultPMId;
    }

    return next;
  }, [formCardKeys, settings.cardAssignments, defaultPMId]);

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
    if (!defaultPMId) {
      return;
    }

    const current = getValues('cardAssignments') ?? {};
    const next = { ...current };
    let changed = false;

    for (const key of formCardKeys) {
      if (!next[key]) {
        next[key] = defaultPMId;
        changed = true;
      }
    }

    if (changed) {
      setValue('cardAssignments', next, { shouldDirty: true });
    }
  }, [defaultPMId, formCardKeys, getValues, setValue]);

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

  const createDefaultBankTransfer = async (opts: { auto: boolean } = { auto: false }) => {
    setIsCreatingDefault(true);
    setCreateError(false);

    try {
      const { data: res } = await api.post<{ success: boolean; data: PaymentMethodDto }>(
        API_ROUTES.PAYMENT_METHODS_DEFAULT_BANK_TRANSFER
      );
      const created = res.data;

      await queryClient.invalidateQueries({ queryKey: queryKeys.paymentMethods() });
      setValue(`cardAssignments.${SINGLE_CARD_KEY}`, created._id, { shouldDirty: true });

      if (opts.auto) {
        setAutoCreated(true);
      }
    } catch {
      setCreateError(true);
    } finally {
      setIsCreatingDefault(false);
    }
  };

  useEffect(() => {
    if (
      !isBankStatement ||
      isMultiCard(cards) ||
      bankTransferPMs.length > 0 ||
      autoCreateAttempted.current
    ) {
      return;
    }

    autoCreateAttempted.current = true;
    void createDefaultBankTransfer({ auto: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBankStatement, cards, bankTransferPMs.length]);

  const showBankStatementEmptyState =
    isBankStatement && !isMultiCard(cards) && bankTransferPMs.length === 0 && createError;

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
      <Column alignItems={'center'} sx={{ pt: { xs: 3, sm: 6 } }}>
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
          ) : showBankStatementEmptyState ? (
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5 }}>
              <Column spacing={1.5}>
                <Typography variant="body2" color="text.secondary">
                  {t('importWizard.settings.bankStatementHelper')}
                </Typography>
                <Row justifyContent="flex-end">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => createDefaultBankTransfer({ auto: false })}
                    disabled={isCreatingDefault}
                    startIcon={
                      isCreatingDefault ? <CircularProgress size={14} color="inherit" /> : undefined
                    }
                  >
                    {t('importWizard.settings.bankStatementAddPM')}
                  </Button>
                </Row>
                <Typography variant="caption" color="error">
                  {t('importWizard.settings.bankStatementAddPMError')}
                </Typography>
              </Column>
            </Paper>
          ) : (
            <Column spacing={0.75}>
              <RHFGroupedSelect
                name={`cardAssignments.${SINGLE_CARD_KEY}`}
                label={t('importWizard.settings.paymentMethod')}
                required
                groups={groups}
              />
              {isBankStatement && autoCreated && (
                <Row spacing={0.5} alignItems="center" justifyContent="flex-end">
                  <CheckIcon sx={{ fontSize: 14, color: 'var(--color-text-success, success.main)' }} />
                  <Typography
                    variant="caption"
                    sx={{ color: 'var(--color-text-success, success.main)' }}
                  >
                    {t('importWizard.settings.bankStatementAutoCreated')}
                  </Typography>
                </Row>
              )}
            </Column>
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
