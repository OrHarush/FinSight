import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import Column from '@/components/shared/layout/containers/Column';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { DebugSnapshotDto } from '@/types/AdminDebug';

import DebugSectionCard from './DebugSectionCard';
import RestoreConfirmDialog from './RestoreConfirmDialog';
import SnapshotHistoryRow from './SnapshotHistoryRow';
import { useDebugRestoreMutation } from './useDebugRestoreMutation';

interface SnapshotHistoryCardProps {
  snapshots: DebugSnapshotDto[];
  isLoading: boolean;
}

const SnapshotHistoryCard = ({ snapshots, isLoading }: SnapshotHistoryCardProps) => {
  const { alertSuccess, alertError } = useSnackbar();
  const restoreMutation = useDebugRestoreMutation();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const cancelConfirm = () => setPendingId(null);

  const requestRestore = (snapshotId: string) => setPendingId(snapshotId);

  const submitRestore = () => {
    if (!pendingId) {
      return;
    }

    restoreMutation.mutate(
      { snapshotId: pendingId },
      {
        onSuccess: data => {
          setPendingId(null);
          const { tx, accounts, templates } = data.restoredCounts;
          alertSuccess(`שוחזר — עסקאות:${tx} · חשבונות:${accounts} · טמפלטים:${templates}`);
        },
        onError: () => {
          setPendingId(null);
          alertError('שחזור נכשל');
        },
      }
    );
  };

  return (
    <DebugSectionCard title="היסטוריית snapshots">
      {isLoading && (
        <Column alignItems="center" sx={{ py: 3 }}>
          <CircularProgress size={24} />
        </Column>
      )}

      {!isLoading && snapshots.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          אין snapshots עדיין. הרץ עבודה כדי ליצור אחד.
        </Typography>
      )}

      {!isLoading && snapshots.length > 0 && (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>נלקח</TableCell>
                <TableCell align="center">עסקאות</TableCell>
                <TableCell align="center">סטטוס</TableCell>
                <TableCell align="center">פעולה</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {snapshots.map(snapshot => (
                <SnapshotHistoryRow
                  key={snapshot._id}
                  snapshot={snapshot}
                  isRestoring={restoreMutation.isPending && pendingId === snapshot._id}
                  onRestore={requestRestore}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <RestoreConfirmDialog
        open={pendingId !== null}
        isPending={restoreMutation.isPending}
        onCancel={cancelConfirm}
        onConfirm={submitRestore}
      />
    </DebugSectionCard>
  );
};

export default SnapshotHistoryCard;
