import Row from '@/components/Layout/Row';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '@/components/Layout/PageHeader';

interface TransactionHeaderProps {
  openCreateTransaction?: () => void;
}

const TransactionsHeader = ({ openCreateTransaction }: TransactionHeaderProps) => (
  <PageHeader pageTitle={'Transactions'}>
    <Row spacing={1}>
      <Button variant={'outlined'}>Import CVS</Button>
      <Button variant={'contained'} onClick={openCreateTransaction} startIcon={<AddIcon />}>
        Add Transaction
      </Button>
    </Row>
  </PageHeader>
);

export default TransactionsHeader;
