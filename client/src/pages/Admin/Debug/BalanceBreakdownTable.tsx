import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { BalanceBreakdownEntry } from '@lyra/shared';

import BalanceBreakdownRow from './BalanceBreakdownRow';

interface BalanceBreakdownTableProps {
  entries: BalanceBreakdownEntry[];
}

const BalanceBreakdownTable = ({ entries }: BalanceBreakdownTableProps) => {
  if (entries.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        אין עסקאות מאז ה-checkpoint.
      </Typography>
    );
  }

  return (
    <TableContainer sx={{ maxHeight: 480 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>שם / סוג</TableCell>
            <TableCell>תאריך</TableCell>
            <TableCell align="left">סכום</TableCell>
            <TableCell>אמצעי תשלום</TableCell>
            <TableCell>תאריך אפקטיבי</TableCell>
            <TableCell align="center">נכלל</TableCell>
            <TableCell align="left">תרומה</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map(entry => (
            <BalanceBreakdownRow key={entry._id} entry={entry} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BalanceBreakdownTable;
