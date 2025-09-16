import Row from '@/components/Layout/Row';
import { Button, Typography } from '@mui/material';

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
        <Button variant={'contained'} onClick={openCreateTransaction}>
          Add Transaction
        </Button>
      </Row>
    </Row>
  );
};

export default TransactionsHeader;
