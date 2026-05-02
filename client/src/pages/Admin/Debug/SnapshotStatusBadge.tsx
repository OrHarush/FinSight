import { Chip } from '@mui/material';

import { formatRelativeTime } from './formatRelativeTime';

interface SnapshotStatusBadgeProps {
  restoredAt: string | null;
}

const SnapshotStatusBadge = ({ restoredAt }: SnapshotStatusBadgeProps) => {
  if (restoredAt === null) {
    return <Chip label="פעיל" color="success" size="small" sx={{ fontWeight: 700 }} />;
  }

  return (
    <Chip
      label={`שוחזר ${formatRelativeTime(restoredAt)}`}
      size="small"
      sx={{ bgcolor: 'action.hover', color: 'text.secondary', fontWeight: 600 }}
    />
  );
};

export default SnapshotStatusBadge;
