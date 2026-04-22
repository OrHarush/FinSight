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

interface ImportResult {
  inserted: number;
  skipped: number;
  failed: number;
}

interface ImportBody {
  rows: { date: string; name: string; amount: number; categoryId?: string }[];
  accountId: string;
  paymentMethodId: string;
  dateFilter?: { from: string; to: string };
}

const ConfirmStep = () => {
  const { t } = useTranslation('transactions');
  const navigate = useNavigate();
  const { rows, settings, preview } = useImportWizard();
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
  const paymentMethod = paymentMethods.find(pm => pm._id === settings.paymentMethodId);
  const dateRange = settings.dateFilter ?? preview?.dateRange;

  const submitImport = () => {
    runImport({
      rows: rows.map(r => ({
        date: r.date,
        name: r.name,
        amount: r.amount,
        ...(r.categoryId && { categoryId: r.categoryId }),
      })),
      accountId: settings.accountId,
      paymentMethodId: settings.paymentMethodId,
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
                  <Typography fontWeight={600}>{account.name}</Typography>
                </Row>
              </>
            )}
            {paymentMethod && (
              <Row justifyContent="space-between">
                <Typography color="text.secondary">
                  {t('importWizard.settings.paymentMethod')}
                </Typography>
                <Typography fontWeight={600}>{paymentMethod.name}</Typography>
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
