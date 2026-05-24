import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Divider, Grid, Paper, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { bankAccountIconMap } from '@/constants/BankAccountIcons';
import { paymentMethodTypeIconMap } from '@/constants/PaymentMethodIcons';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES, ROUTES } from '@/constants/Routes';
import { ApiResponse } from '@/hooks/common/useFetch';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useImportWizard } from '@/pages/Import/ImportWizardContext';
import CardBreakdown from '@/pages/Import/steps/confirmSummary/CardBreakdown';
import ImportSuccessScreen from '@/pages/Import/steps/confirmSummary/ImportSuccessScreen';
import SkippedChip from '@/pages/Import/steps/confirmSummary/SkippedChip';
import {
  getSummaryCardStyle,
  getSummaryDividerStyle,
} from '@/pages/Import/steps/confirmSummary/styles';
import SummaryEntityCard from '@/pages/Import/steps/confirmSummary/SummaryEntityCard';
import { SINGLE_CARD_KEY, WizardRow } from '@/pages/Import/types/importWizard';
import { getAccountDisplayName } from '@/utils/entities/account';
import { getPaymentMethodDisplayName } from '@/utils/entities/paymentMethod';

interface ImportResult {
  inserted: number;
  skipped: number;
  failed: number;
}

interface ImportBody {
  rows: {
    date: string;
    name: string;
    amount: number;
    categoryId?: string;
    paymentMethodId?: string;
  }[];
  accountId: string;
  paymentMethodId: string;
  dateFilter?: { from: string; to: string };
}

const latestRowDate = (rows: WizardRow[]): string =>
  rows.reduce((max, r) => (r.date > max ? r.date : max), '');

const formatDmy = (ymd: string): string => {
  const [year, month, day] = ymd.split('-');

  return `${day}/${month}/${year}`;
};

const isWithinFilter = (
  date: string,
  filter: { from: string; to: string } | null | undefined
): boolean => {
  if (!filter) {
    return true;
  }

  return date >= filter.from && date <= filter.to;
};

const ConfirmStep = () => {
  const { t } = useTranslation('transactions');
  const { t: tPM } = useTranslation('paymentMethods');
  const { t: tAccounts } = useTranslation('accounts');
  const navigate = useNavigate();
  const {
    rows,
    settings,
    preview,
    cards,
    resetWizard,
    skippedDuplicatesCount,
    setFooterPrimaryAction,
    setIsImportComplete,
  } = useImportWizard();
  const { accounts } = useAccounts();
  const { paymentMethods } = usePaymentMethods();
  const [result, setResult] = useState<ImportResult | null>(null);

  const { mutate: runImport, isPending } = useApiMutation<ApiResponse<ImportResult>, ImportBody>({
    method: 'post',
    url: API_ROUTES.IMPORT_TRANSACTIONS,
    queryKeysToInvalidate: [
      queryKeys.allTransactions(),
      queryKeys.quickChips(),
      queryKeys.categories(),
    ],
    options: {
      onSuccess: data => setResult(data.data),
    },
  });

  const importingCount = rows.filter(r => isWithinFilter(r.date, settings.dateFilter)).length;
  const dateFilterSkipped = rows.length - importingCount;
  const skippedCount = skippedDuplicatesCount + dateFilterSkipped;

  const account = accounts.find(a => a._id === settings.accountId);
  const AccountIcon = (account?.icon && bankAccountIconMap[account.icon]) || AccountBalanceIcon;
  const isMultiCard = cards.length >= 2;
  const singlePaymentMethodId = settings.cardAssignments[SINGLE_CARD_KEY];
  const singlePaymentMethod = paymentMethods.find(pm => pm._id === singlePaymentMethodId);
  const dateRange = settings.dateFilter ?? preview?.dateRange;

  const goToTransactions = () => {
    const importedMonth = (dateRange?.to || latestRowDate(rows)).slice(0, 7);

    navigate(
      importedMonth ? `${ROUTES.TRANSACTIONS_URL}?month=${importedMonth}` : ROUTES.TRANSACTIONS_URL
    );
  };

  const paymentMethodName = (pmId: string | undefined): string | null => {
    const pm = paymentMethods.find(p => p._id === pmId);

    return pm ? getPaymentMethodDisplayName(pm, tPM) : null;
  };

  const fallbackPaymentMethodId =
    settings.cardAssignments[SINGLE_CARD_KEY] ||
    Object.values(settings.cardAssignments).find(v => !!v) ||
    '';

  const submitImport = () => {
    runImport({
      rows: rows.map(r => {
        const pmId = settings.cardAssignments[r.card] || fallbackPaymentMethodId;

        return {
          date: r.date,
          name: r.name,
          amount: r.amount,
          ...(pmId && { paymentMethodId: pmId }),
          ...(r.categoryId && { categoryId: r.categoryId }),
        };
      }),
      accountId: settings.accountId,
      paymentMethodId: fallbackPaymentMethodId,
      ...(settings.dateFilter && { dateFilter: settings.dateFilter }),
    });
  };

  const submitImportRef = useRef(submitImport);
  submitImportRef.current = submitImport;

  useEffect(() => {
    if (result) {
      setFooterPrimaryAction(null);
      setIsImportComplete(true);

      return () => {
        setIsImportComplete(false);
      };
    }

    setIsImportComplete(false);
    setFooterPrimaryAction({
      label: t('importWizard.confirm.importCount', { count: importingCount }),
      onClick: () => submitImportRef.current(),
      disabled: importingCount === 0 || isPending,
      loading: isPending,
    });

    return () => {
      setFooterPrimaryAction(null);
    };
  }, [result, importingCount, isPending, t, setFooterPrimaryAction, setIsImportComplete]);

  if (result) {
    return (
      <ImportSuccessScreen
        result={result}
        onGoToTransactions={goToTransactions}
        onImportAnother={resetWizard}
      />
    );
  }

  return (
    <Column flex={1} spacing={3}>
      <Paper variant="outlined" sx={getSummaryCardStyle}>
        <Column spacing={2.5}>
          <Row justifyContent="space-between" alignItems="center" spacing={1}>
            <Row spacing={1} alignItems="baseline">
              <Typography sx={{ fontSize: '2.75rem', fontWeight: 700, lineHeight: 1 }}>
                {importingCount}
              </Typography>
              <Typography color="text.secondary">
                {t('importWizard.confirm.readyToImport')}
              </Typography>
            </Row>
            {skippedCount > 0 && <SkippedChip count={skippedCount} />}
          </Row>

          {(account || (!isMultiCard && singlePaymentMethod)) && (
            <>
              <Divider sx={getSummaryDividerStyle} />
              <Grid container spacing={2}>
                {account && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <SummaryEntityCard
                      icon={AccountIcon}
                      label={t('importWizard.settings.account')}
                      value={getAccountDisplayName(account, tAccounts)}
                    />
                  </Grid>
                )}
                {!isMultiCard && singlePaymentMethod && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <SummaryEntityCard
                      icon={paymentMethodTypeIconMap[singlePaymentMethod.type] ?? CreditCardIcon}
                      label={t('importWizard.settings.paymentMethod')}
                      value={getPaymentMethodDisplayName(singlePaymentMethod, tPM)}
                    />
                  </Grid>
                )}
              </Grid>
            </>
          )}

          {dateRange && (
            <>
              <Divider sx={getSummaryDividerStyle} />
              <Row spacing={1.5} alignItems="center">
                <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {t('importWizard.upload.dateRangeLabel')}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatDmy(dateRange.from)} – {formatDmy(dateRange.to)}
                </Typography>
              </Row>
            </>
          )}
        </Column>
      </Paper>
      {isMultiCard && (
        <Column spacing={1.5}>
          <Typography variant="subtitle2" fontWeight={600}>
            {t('importWizard.confirm.perCardTitle')}
          </Typography>
          {cards.map(cardKey => (
            <CardBreakdown
              key={cardKey}
              cardKey={cardKey}
              rowsForCard={rows.filter(r => r.card === cardKey)}
              paymentMethodName={paymentMethodName(settings.cardAssignments[cardKey])}
            />
          ))}
        </Column>
      )}
    </Column>
  );
};

export default ConfirmStep;
