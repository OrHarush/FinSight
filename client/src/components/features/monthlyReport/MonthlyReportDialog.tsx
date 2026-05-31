import { Button, DialogActions, DialogContent, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import LyraDialog, { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import CurrencyText from '@/components/shared/ui/CurrencyText';
import { useMonthLabels } from '@/hooks/common/useMonthsLabels';
import { ROUTES } from '@/constants/Routes';
import { MonthlyReportSummary } from '@/hooks/monthlyReport/useMonthlyReportPopup';

import MonthlyReportCategoryRow from './MonthlyReportCategoryRow';

interface MonthlyReportDialogProps extends BaseDialogProps {
  month: string;
  summary: MonthlyReportSummary;
}

interface KpiCardProps {
  label: string;
  value: number;
  subText?: string;
  hasSign?: boolean;
}

const KpiCard = ({ label, value, subText, hasSign }: KpiCardProps) => (
  <Column
    flex={1}
    alignItems="center"
    spacing={0.5}
    sx={{
      bgcolor: 'action.hover',
      borderRadius: 2,
      py: 1.5,
      px: 1,
    }}
  >
    <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ lineHeight: 1 }}>
      {label}
    </Typography>
    <CurrencyText value={value} hasColor hasSign={hasSign} variant="body1" fontWeight={700} />
    {subText && (
      <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ lineHeight: 1.2 }}>
        {subText}
      </Typography>
    )}
  </Column>
);

const MonthlyReportDialog = ({ isOpen, closeDialog, month, summary }: MonthlyReportDialogProps) => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const monthLabels = useMonthLabels();

  const [yearStr, monthStr] = month.split('-');
  const monthIndex = parseInt(monthStr, 10) - 1;
  const monthLabel = `${monthLabels[monthIndex]} ${yearStr}`;

  const net = summary.monthlyIncome - summary.monthlyExpenses;

  const viewTransactions = () => {
    navigate(`${ROUTES.TRANSACTIONS_URL}?month=${month}`);
    closeDialog();
  };

  return (
    <LyraDialog
      forceDialog
      maxWidth="sm"
      isOpen={isOpen}
      closeDialog={closeDialog}
      title={t('monthlyReport.title', { month: monthLabel })}
    >
      <DialogContent sx={{ pt: 0, pb: 1 }}>
        <Column spacing={2}>
          <Row spacing={1}>
            <KpiCard
              label={t('monthlyReport.income')}
              value={summary.monthlyIncome}
              hasSign
            />
            <KpiCard
              label={t('monthlyReport.expenses')}
              value={-summary.monthlyExpenses}
              subText={t('monthlyReport.txCount', { count: summary.expenseCount })}
            />
            <KpiCard
              label={t('monthlyReport.net')}
              value={net}
              subText={
                summary.savingsRate >= 0
                  ? t('monthlyReport.savingsRate', { rate: summary.savingsRate })
                  : t('monthlyReport.deficit')
              }
              hasSign
            />
          </Row>

          {summary.topCategories.length > 0 && (
            <>
              <Divider />
              <Column spacing={0}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
                  {t('monthlyReport.expensesByCategory')}
                </Typography>
                <Column spacing={2}>
                  {summary.topCategories.map((cat, index) => (
                    <MonthlyReportCategoryRow key={cat.categoryId} rank={index + 1} category={cat} />
                  ))}
                </Column>
              </Column>
            </>
          )}
        </Column>
      </DialogContent>

      <DialogActions>
        <Button onClick={viewTransactions} variant="outlined" sx={{ flex: 1 }}>
          {t('monthlyReport.viewTransactions', { month: monthLabel })}
        </Button>
        <Button onClick={closeDialog} variant="contained" sx={{ flex: 1 }}>
          {t('buttons.close')}
        </Button>
      </DialogActions>
    </LyraDialog>
  );
};

export default MonthlyReportDialog;
