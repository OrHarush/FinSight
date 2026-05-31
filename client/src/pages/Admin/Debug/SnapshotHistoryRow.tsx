import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Button, IconButton, TableCell, TableRow } from '@mui/material';

import Row from '@/components/shared/layout/containers/Row';
import { DebugSnapshotDto } from '@/types/AdminDebug';

import { formatRelativeTime } from './formatRelativeTime';
import SnapshotStatusBadge from './SnapshotStatusBadge';

interface SnapshotHistoryRowProps {
  snapshot: DebugSnapshotDto;
  isRestoring: boolean;
  isDeleting: boolean;
  onRestore: (snapshotId: string) => void;
  onDelete: (snapshotId: string) => void;
}

const SnapshotHistoryRow = ({
  snapshot,
  isRestoring,
  isDeleting,
  onRestore,
  onDelete,
}: SnapshotHistoryRowProps) => {
  const isActive = snapshot.restoredAt === null;

  const triggerRestore = () => onRestore(snapshot._id);

  const triggerDelete = () => onDelete(snapshot._id);

  return (
    <TableRow hover>
      <TableCell>{formatRelativeTime(snapshot.takenAt)}</TableCell>
      <TableCell align="center">{snapshot.createdTxIds.length}</TableCell>
      <TableCell align="center">
        <SnapshotStatusBadge restoredAt={snapshot.restoredAt} />
      </TableCell>
      <TableCell align="center">
        <Row spacing={0.5} justifyContent="center" alignItems="center">
          {isActive && (
            <Button
              size="small"
              color="error"
              variant="text"
              disabled={isRestoring}
              onClick={triggerRestore}
            >
              שחזר
            </Button>
          )}
          <IconButton size="small" color="error" disabled={isDeleting} onClick={triggerDelete}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Row>
      </TableCell>
    </TableRow>
  );
};

export default SnapshotHistoryRow;
