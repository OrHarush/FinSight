import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestoreIcon from '@mui/icons-material/Restore';
import { Button } from '@mui/material';
import { useState } from 'react';

import Row from '@/components/shared/layout/containers/Row';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { DebugRunResultDto, DebugSnapshotDto } from '@/types/AdminDebug';

import DebugSectionCard from './DebugSectionCard';
import DebugStatTile from './DebugStatTile';
import RestoreConfirmDialog from './RestoreConfirmDialog';
import { useDebugRestoreMutation } from './useDebugRestoreMutation';
import { useDebugRunMutation } from './useDebugRunMutation';

interface RunCardProps {
  snapshots: DebugSnapshotDto[];
}

const RunCard = ({ snapshots }: RunCardProps) => {
  const { alertSuccess, alertError } = useSnackbar();
  const runMutation = useDebugRunMutation();
  const restoreMutation = useDebugRestoreMutation();
  const [lastResult, setLastResult] = useState<DebugRunResultDto | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const hasActiveSnapshot = snapshots.some(s => s.restoredAt === null);

  const openConfirm = () => setConfirmOpen(true);
  const closeConfirm = () => setConfirmOpen(false);

  const runJob = () => {
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

  const submitRestore = () => {
    restoreMutation.mutate(
      {},
      {
        onSuccess: data => {
          closeConfirm();
          const { tx, accounts, templates } = data.restoredCounts;
          alertSuccess(`שוחזר — עסקאות:${tx} · חשבונות:${accounts} · טמפלטים:${templates}`);
        },
        onError: () => {
          closeConfirm();
          alertError('שחזור נכשל');
        },
      }
    );
  };

  return (
    <DebugSectionCard title="הרצת עבודה" subtitle="יוצר snapshot ואז מריץ generate + sync">
      <Row spacing={2} alignItems="center" flexWrap="wrap">
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlayArrowIcon />}
          onClick={runJob}
          disabled={runMutation.isPending}
        >
          {runMutation.isPending ? 'רץ…' : 'הרץ עכשיו'}
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<RestoreIcon />}
          onClick={openConfirm}
          disabled={!hasActiveSnapshot || restoreMutation.isPending}
        >
          שחזר אחרון
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

      <RestoreConfirmDialog
        open={confirmOpen}
        isPending={restoreMutation.isPending}
        onCancel={closeConfirm}
        onConfirm={submitRestore}
      />
    </DebugSectionCard>
  );
};

export default RunCard;
