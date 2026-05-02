import RestoreIcon from '@mui/icons-material/Restore';
import { Button } from '@mui/material';
import { useState } from 'react';

import Row from '@/components/shared/layout/containers/Row';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { DebugSnapshotDto } from '@/types/AdminDebug';

import DebugSectionCard from './DebugSectionCard';
import RestoreConfirmDialog from './RestoreConfirmDialog';
import { useDebugRestoreMutation } from './useDebugRestoreMutation';

interface RestoreCardProps {
  snapshots: DebugSnapshotDto[];
}

const RestoreCard = ({ snapshots }: RestoreCardProps) => {
  const { alertSuccess, alertError } = useSnackbar();
  const restoreMutation = useDebugRestoreMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const hasActiveSnapshot = snapshots.some(s => s.restoredAt === null);

  const openConfirm = () => setConfirmOpen(true);
  const closeConfirm = () => setConfirmOpen(false);

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
    <DebugSectionCard
      title="שחזור"
      subtitle="מחזיר את הנתונים למצב לפני ההרצה האחרונה"
    >
      <Row spacing={2} alignItems="center" flexWrap="wrap">
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

      <RestoreConfirmDialog
        open={confirmOpen}
        isPending={restoreMutation.isPending}
        onCancel={closeConfirm}
        onConfirm={submitRestore}
      />
    </DebugSectionCard>
  );
};

export default RestoreCard;
