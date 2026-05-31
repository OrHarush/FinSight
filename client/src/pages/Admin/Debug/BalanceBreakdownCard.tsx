import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';

import Column from '@/components/shared/layout/containers/Column';
import ResponsiveRow from '@/components/shared/layout/containers/ResponsiveRow';
import { useSnackbar } from '@/providers/SnackbarProvider';

import BalanceBreakdownTable from './BalanceBreakdownTable';
import BalanceBreakdownTotals from './BalanceBreakdownTotals';
import DebugSectionCard from './DebugSectionCard';
import { formatBreakdownClipboard } from './formatBreakdownClipboard';
import { useBalanceBreakdown } from './useBalanceBreakdown';

const BalanceBreakdownCard = () => {
  const { alertSuccess, alertError } = useSnackbar();
  const [enabled, setEnabled] = useState(false);
  const { data, isLoading, isError, refetch } = useBalanceBreakdown({ enabled });

  const triggerFetch = () => {
    if (enabled) {
      refetch();
      return;
    }

    setEnabled(true);
  };

  const copyAll = async () => {
    if (!data) {
      return;
    }

    try {
      await navigator.clipboard.writeText(formatBreakdownClipboard(data));
      alertSuccess('הפירוט הועתק ללוח');
    } catch {
      alertError('העתקה נכשלה');
    }
  };

  return (
    <DebugSectionCard
      title="פירוט חישוב יתרה"
      subtitle="מציג בדיוק כיצד syncAccountBalance מחשב את היתרה לחשבון הראשי שלך"
    >
      <ResponsiveRow spacing={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<VisibilityIcon />}
          onClick={triggerFetch}
          disabled={isLoading}
        >
          {isLoading ? 'טוען…' : enabled ? 'רענן פירוט' : 'הצג פירוט'}
        </Button>

        {data && !isLoading && (
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={copyAll}
          >
            העתק הכל
          </Button>
        )}
      </ResponsiveRow>

      {isLoading && (
        <Column alignItems="center" sx={{ py: 3 }}>
          <CircularProgress size={24} />
        </Column>
      )}

      {isError && (
        <Typography variant="body2" color="error">
          שליפת הפירוט נכשלה.
        </Typography>
      )}

      {data && !isLoading && (
        <Column spacing={2}>
          <BalanceBreakdownTotals result={data} />
          <BalanceBreakdownTable entries={data.breakdown} />
        </Column>
      )}
    </DebugSectionCard>
  );
};

export default BalanceBreakdownCard;
