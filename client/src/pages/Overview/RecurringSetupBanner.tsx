import CloseIcon from '@mui/icons-material/Close';
import { alpha, IconButton, Theme, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import CreateTransactionDialog from '@/components/features/transactions/CreateTransactionDialog';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useOpen } from '@/hooks/common/useOpen';
import { useRecurringSetupBanner } from '@/hooks/business/useRecurringSetupBanner';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { useOverviewFilters } from '@/pages/Overview/OverviewFiltersProvider';

const RecurringSetupBanner = () => {
  const { t } = useTranslation('overview');
  const { year, month, account, date } = useOverviewFilters();
  const { transactions, isLoading } = useTransactions(year, month);
  const [isDialogOpen, openDialog, closeDialog] = useOpen();

  const isCurrentMonth = date.isSame(dayjs(), 'month');
  const { shouldShow, dismiss } = useRecurringSetupBanner(transactions, account?._id ?? '');

  if (isLoading || !isCurrentMonth || !shouldShow) {
    return null;
  }

  const dismissButtonSx = {
    color: 'text.secondary',
    p: 1,
    '&:hover': { color: 'text.primary' },
  };

  return (
    <>
      <Column
        sx={{
          borderRadius: 2,
          py: { xs: 2, sm: 1.25 },
          px: { xs: 2, sm: 2.5 },
          bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.06),
          border: '1px solid',
          borderColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.15),
          flexDirection: { sm: 'row' },
          alignItems: { sm: 'center' },
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Column spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
          <Row alignItems="center" justifyContent="space-between">
            <Typography variant="body1" fontWeight={600}>
              {t('recurringBanner.title')}
            </Typography>
            {/* X inline with title — mobile only */}
            <IconButton
              size="small"
              onClick={dismiss}
              aria-label={t('recurringBanner.dismiss')}
              sx={{ ...dismissButtonSx, display: { sm: 'none' } }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Row>
          <Typography variant="body2" color="text.secondary">
            <Typography
              component="span"
              variant="body2"
              color="primary"
              onClick={openDialog}
              sx={{ fontWeight: 500, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              {t('recurringBanner.bodyLink')}
            </Typography>
            {t('recurringBanner.bodyRest')}
          </Typography>
        </Column>

        {/* X as flex sibling, vertically centered by parent alignItems:center — desktop only */}
        <IconButton
          size="small"
          onClick={dismiss}
          aria-label={t('recurringBanner.dismiss')}
          sx={{ ...dismissButtonSx, display: { xs: 'none', sm: 'flex' }, flexShrink: 0 }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Column>

      {isDialogOpen && (
        <CreateTransactionDialog
          isOpen={isDialogOpen}
          closeDialog={closeDialog}
          initialType="Expense"
          initialValues={{ type: 'Expense', name: '', recurrence: 'Monthly' }}
        />
      )}
    </>
  );
};

export default RecurringSetupBanner;
