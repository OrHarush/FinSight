import { TableCell, TableHead, TableRow } from '@mui/material';

const TransactionTableHeaders = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell align="left">Amount</TableCell>
        <TableCell align="left">Category</TableCell>
        <TableCell align="left">Account</TableCell>
        <TableCell align="left">Recurrence</TableCell>
        <TableCell align="left">Date</TableCell>
        <TableCell align="left">Actions</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default TransactionTableHeaders;
