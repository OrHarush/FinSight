import { Button, TableCell, TableRow } from '@mui/material';

import { DebugSnapshotDto } from '@/types/AdminDebug';

import { formatRelativeTime } from './formatRelativeTime';
import SnapshotStatusBadge from './SnapshotStatusBadge';

interface SnapshotHistoryRowProps {
  snapshot: DebugSnapshotDto;
  isRestoring: boolean;
  onRestore: (snapshotId: string) => void;
}

const SnapshotHistoryRow = ({ snapshot, isRestoring, onRestore }: SnapshotHistoryRowProps) => {
  const isActive = snapshot.restoredAt === null;

  const triggerRestore = () => onRestore(snapshot._id);

  return (
    <TableRow hover>
      <TableCell>{formatRelativeTime(snapshot.takenAt)}</TableCell>
      <TableCell align="center">{snapshot.createdTxIds.length}</TableCell>
      <TableCell align="center">
        <SnapshotStatusBadge restoredAt={snapshot.restoredAt} />
      </TableCell>
      <TableCell align="center">
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
      </TableCell>
    </TableRow>
  );
};

export default SnapshotHistoryRow;
