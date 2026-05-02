import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Button } from '@mui/material';
import { useState } from 'react';

import Row from '@/components/shared/layout/containers/Row';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { DebugRunResultDto } from '@/types/AdminDebug';

import DebugSectionCard from './DebugSectionCard';
import DebugStatTile from './DebugStatTile';
import { useDebugRunMutation } from './useDebugRunMutation';

const RunCard = () => {
  const { alertSuccess, alertError } = useSnackbar();
  const runMutation = useDebugRunMutation();
  const [lastResult, setLastResult] = useState<DebugRunResultDto | null>(null);

  const handleRun = () => {
    runMutation.mutate(undefined, {
      onSuccess: data => {
        setLastResult(data);

        if (data.found) {
          alertSuccess(`הרצה הסתיימה — נוצרו ${data.createdTxIds.length} עסקאות`);
        } else {
          alertError(`משתמש לא נמצא: ${data.email}`);
        }
      },
      onError: () => {
        alertError('הרצה נכשלה');
      },
    });
  };

  return (
    <DebugSectionCard
      title="הרצת עבודה"
      subtitle="יוצר snapshot ואז מריץ generate + sync"
    >
      <Row spacing={2} alignItems="center" flexWrap="wrap">
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlayArrowIcon />}
          onClick={handleRun}
          disabled={runMutation.isPending}
        >
          {runMutation.isPending ? 'רץ…' : 'הרץ עכשיו'}
        </Button>
      </Row>

      {lastResult && (
        <Row spacing={1.5} flexWrap="wrap">
          <DebugStatTile label="עסקאות שנוצרו" value={lastResult.createdTxIds.length} />
          <DebugStatTile label="balance synced" value={lastResult.balanceSynced ? 'כן' : 'לא'} />
          <DebugStatTile label="משך" value={`${lastResult.durationMs}ms`} />
          <DebugStatTile
            label="snapshot"
            value={lastResult.snapshotId ? lastResult.snapshotId.slice(-4) : '—'}
          />
        </Row>
      )}
    </DebugSectionCard>
  );
};

export default RunCard;
