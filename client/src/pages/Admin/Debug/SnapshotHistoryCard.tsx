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
import DeleteSnapshotConfirmDialog from './DeleteSnapshotConfirmDialog';
import RestoreConfirmDialog from './RestoreConfirmDialog';
import SnapshotHistoryRow from './SnapshotHistoryRow';
import { useDebugDeleteSnapshotMutation } from './useDebugDeleteSnapshotMutation';
import { useDebugRestoreMutation } from './useDebugRestoreMutation';

interface SnapshotHistoryCardProps {
  snapshots: DebugSnapshotDto[];
  isLoading: boolean;
}

const SnapshotHistoryCard = ({ snapshots, isLoading }: SnapshotHistoryCardProps) => {
  const { alertSuccess, alertError } = useSnackbar();
  const restoreMutation = useDebugRestoreMutation();
  const deleteMutation = useDebugDeleteSnapshotMutation();
  const [pendingRestoreId, setPendingRestoreId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const cancelRestore = () => setPendingRestoreId(null);

  const cancelDelete = () => setPendingDeleteId(null);

  const requestRestore = (snapshotId: string) => setPendingRestoreId(snapshotId);

  const requestDelete = (snapshotId: string) => setPendingDeleteId(snapshotId);

  const submitRestore = () => {
    if (!pendingRestoreId) {
      return;
    }

    restoreMutation.mutate(
      { snapshotId: pendingRestoreId },
      {
        onSuccess: data => {
          setPendingRestoreId(null);
          const { tx, accounts, templates } = data.restoredCounts;
          alertSuccess(`שוחזר — עסקאות:${tx} · חשבונות:${accounts} · טמפלטים:${templates}`);
        },
        onError: () => {
          setPendingRestoreId(null);
          alertError('שחזור נכשל');
        },
      }
    );
  };

  const submitDelete = () => {
    if (!pendingDeleteId) {
      return;
    }

    deleteMutation.mutate(pendingDeleteId, {
      onSuccess: () => {
        setPendingDeleteId(null);
        alertSuccess('snapshot נמחק');
      },
      onError: () => {
        setPendingDeleteId(null);
        alertError('מחיקה נכשלה');
      },
    });
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
                  isRestoring={restoreMutation.isPending && pendingRestoreId === snapshot._id}
                  isDeleting={deleteMutation.isPending && pendingDeleteId === snapshot._id}
                  onRestore={requestRestore}
                  onDelete={requestDelete}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <RestoreConfirmDialog
        open={pendingRestoreId !== null}
        isPending={restoreMutation.isPending}
        onCancel={cancelRestore}
        onConfirm={submitRestore}
      />

      <DeleteSnapshotConfirmDialog
        open={pendingDeleteId !== null}
        isPending={deleteMutation.isPending}
        onCancel={cancelDelete}
        onConfirm={submitDelete}
      />
    </DebugSectionCard>
  );
};

export default SnapshotHistoryCard;
