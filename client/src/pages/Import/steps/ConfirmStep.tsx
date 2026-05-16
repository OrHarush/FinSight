import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES, ROUTES } from '@/constants/Routes';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useImportWizard } from '@/pages/Import/ImportWizardContext';
import {
  SINGLE_CARD_KEY,
  UNKNOWN_CARD_KEY,
  WizardRow,
} from '@/pages/Import/types/importWizard';
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

interface CardBreakdownProps {
  cardKey: string;
  rowsForCard: WizardRow[];
  paymentMethodName: string | null;
}

const CardBreakdown = ({ cardKey, rowsForCard, paymentMethodName }: CardBreakdownProps) => {
  const { t } = useTranslation('transactions');

  const categorizedCount = rowsForCard.filter(r => r.categoryId !== null).length;
  const uncategorizedCount = rowsForCard.length - categorizedCount;
  const cardLabel =
    cardKey === UNKNOWN_CARD_KEY
      ? t('importWizard.categorize.cardUnassigned')
      : t('importWizard.categorize.cardLabel', { last4: cardKey });

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5 }}>
      <Column spacing={1}>
        <Row justifyContent="space-between" alignItems="center">
          <Typography fontWeight={600}>{cardLabel}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('importWizard.categorize.cardRowCount', { count: rowsForCard.length })}
          </Typography>
        </Row>
        {paymentMethodName && (
          <Row justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              {t('importWizard.settings.paymentMethod')}
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {paymentMethodName}
            </Typography>
          </Row>
        )}
        <Row justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {t('importWizard.confirm.categorized')}
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {categorizedCount}
          </Typography>
        </Row>
        <Row justifyContent="space-between" alignItems="center">
          <Row spacing={0.5} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {t('importWizard.confirm.uncategorized')}
            </Typography>
            {uncategorizedCount > 0 && (
              <WarningAmberIcon sx={{ fontSize: 14, color: 'warning.main' }} />
            )}
          </Row>
          <Typography variant="body2" fontWeight={500}>
            {uncategorizedCount}
          </Typography>
        </Row>
      </Column>
    </Paper>
  );
};

const ConfirmStep = () => {
  const { t } = useTranslation('transactions');
  const { t: tPM } = useTranslation('paymentMethods');
  const { t: tAccounts } = useTranslation('accounts');
  const navigate = useNavigate();
  const { rows, settings, preview, cards } = useImportWizard();
  const { accounts } = useAccounts();
  const { paymentMethods } = usePaymentMethods();
  const [result, setResult] = useState<ImportResult | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const { mutate: runImport, isPending } = useApiMutation<ImportResult, ImportBody>({
    method: 'post',
    url: API_ROUTES.IMPORT_TRANSACTIONS,
    queryKeysToInvalidate: [queryKeys.allTransactions(), queryKeys.quickChips(), queryKeys.categories()],
    options: {
      onSuccess: data => setResult(data),
    },
  });

  const categorizedCount = rows.filter(r => r.categoryId !== null).length;
  const uncategorizedCount = rows.length - categorizedCount;

  const account = accounts.find(a => a._id === settings.accountId);
  const isMultiCard = cards.length >= 2;
  const singlePaymentMethodId = settings.cardAssignments[SINGLE_CARD_KEY];
  const singlePaymentMethod = paymentMethods.find(pm => pm._id === singlePaymentMethodId);
  const dateRange = settings.dateFilter ?? preview?.dateRange;

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

  const triggerImport = () => {
    if (uncategorizedCount > 0) {
      setConfirmDialogOpen(true);
    } else {
      submitImport();
    }
  };

  if (result) {
    return (
      <Column flex={1} alignItems="center" justifyContent="center" spacing={3}>
        <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'success.main' }} />
        <Typography variant="h5" fontWeight={600}>
          {t('importWizard.confirm.success.title')}
        </Typography>
        <Paper variant="outlined" sx={{ px: 4, py: 3, minWidth: 260 }}>
          <Column spacing={1.5}>
            <Row justifyContent="space-between" spacing={4}>
              <Typography color="text.secondary">
                {t('importWizard.confirm.success.imported')}
              </Typography>
              <Typography fontWeight={600}>{result.inserted}</Typography>
            </Row>
            {result.skipped > 0 && (
              <Row justifyContent="space-between" spacing={4}>
                <Typography color="text.secondary">
                  {t('importWizard.confirm.success.skipped')}
                </Typography>
                <Typography fontWeight={600}>{result.skipped}</Typography>
              </Row>
            )}
            {result.failed > 0 && (
              <Row justifyContent="space-between" spacing={4}>
                <Typography color="text.secondary">
                  {t('importWizard.confirm.success.failed')}
                </Typography>
                <Typography color="error" fontWeight={600}>
                  {result.failed}
                </Typography>
              </Row>
            )}
          </Column>
        </Paper>
        <Button variant="contained" onClick={() => navigate(ROUTES.TRANSACTIONS_URL)}>
          {t('importWizard.confirm.success.goToTransactions')}
        </Button>
      </Column>
    );
  }

  return (
    <>
      <Column flex={1} spacing={3}>
        <Typography variant="h6" fontWeight={600}>
          {t('importWizard.confirm.summary')}
        </Typography>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Column spacing={2}>
            <Row justifyContent="space-between">
              <Typography color="text.secondary">{t('importWizard.confirm.total')}</Typography>
              <Typography fontWeight={600}>{rows.length}</Typography>
            </Row>
            <Divider />
            <Row justifyContent="space-between">
              <Typography color="text.secondary">
                {t('importWizard.confirm.categorized')}
              </Typography>
              <Typography fontWeight={600}>{categorizedCount}</Typography>
            </Row>
            <Row justifyContent="space-between" alignItems="center">
              <Row spacing={0.5} alignItems="center">
                <Typography color="text.secondary">
                  {t('importWizard.confirm.uncategorized')}
                </Typography>
                {uncategorizedCount > 0 && (
                  <WarningAmberIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                )}
              </Row>
              <Typography fontWeight={600}>{uncategorizedCount}</Typography>
            </Row>
            {account && (
              <>
                <Divider />
                <Row justifyContent="space-between">
                  <Typography color="text.secondary">
                    {t('importWizard.settings.account')}
                  </Typography>
                  <Typography fontWeight={600}>
                    {getAccountDisplayName(account, tAccounts)}
                  </Typography>
                </Row>
              </>
            )}
            {!isMultiCard && singlePaymentMethod && (
              <Row justifyContent="space-between">
                <Typography color="text.secondary">
                  {t('importWizard.settings.paymentMethod')}
                </Typography>
                <Typography fontWeight={600}>
                  {getPaymentMethodDisplayName(singlePaymentMethod, tPM)}
                </Typography>
              </Row>
            )}
            {dateRange && (
              <>
                <Divider />
                <Column spacing={0.25}>
                  <Typography color="text.secondary">
                    {t('importWizard.upload.dateRangeLabel')}
                  </Typography>
                  <Typography fontWeight={600}>
                    {dateRange.from} – {dateRange.to}
                  </Typography>
                </Column>
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
        <Button
          variant="contained"
          size="large"
          disabled={rows.length === 0 || isPending}
          onClick={triggerImport}
          startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
          sx={{ alignSelf: 'center', minWidth: 160 }}
        >
          {isPending
            ? t('importWizard.confirm.importing')
            : t('importWizard.navigation.confirm')}
        </Button>
      </Column>

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>{t('importWizard.confirm.dialog.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('importWizard.confirm.dialog.body', { count: uncategorizedCount })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>
            {t('importWizard.confirm.dialog.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setConfirmDialogOpen(false);
              submitImport();
            }}
          >
            {t('importWizard.confirm.dialog.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmStep;
