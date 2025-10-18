import { TableCell, TableHead, TableRow } from '@mui/material';

const TransactionTableHeaders = () => (
  <TableHead>
    <TableRow>
      <TableCell sx={{ width: '15%' }}>Name</TableCell>
      <TableCell sx={{ width: '10%' }} align="left">
        Amount
      </TableCell>
      <TableCell sx={{ width: '20%' }} align="left">
        Category
      </TableCell>
      <TableCell sx={{ width: '20%' }} align="left">
        Account
      </TableCell>
      <TableCell sx={{ width: '15%' }} align="left">
        Recurrence
      </TableCell>
      <TableCell sx={{ width: '15%' }} align="left">
        Date
      </TableCell>
      <TableCell sx={{ width: '5%' }} align="left">
        Actions
      </TableCell>
    </TableRow>
  </TableHead>
);

export default TransactionTableHeaders;
