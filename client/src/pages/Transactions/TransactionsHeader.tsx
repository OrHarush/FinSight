import Row from '@/components/Layout/Row';
import { Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface TransactionHeaderProps {
  openCreateTransaction?: () => void;
}

const TransactionsHeader = ({ openCreateTransaction }: TransactionHeaderProps) => {
  return (
    <Row alignItems={'center'} justifyContent={'space-between'}>
      <Typography variant={'h3'} fontWeight={700}>
        Transactions
      </Typography>
      <Row spacing={1}>
        <Button variant={'outlined'}>Import CVS</Button>
        <Button variant={'contained'} onClick={openCreateTransaction} startIcon={<AddIcon />}>
          Add Transaction
        </Button>
      </Row>
    </Row>
  );
};

export default TransactionsHeader;
