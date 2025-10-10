import Row from '@/components/Layout/Containers/Row';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '@/components/Layout/PageHeader';

interface TransactionHeaderProps {
  openCreateTransaction?: () => void;
}

const TransactionsHeader = ({ openCreateTransaction }: TransactionHeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <PageHeader pageTitle={'Transactions'}>
      {!isMobile && (
        <Row spacing={1} justifyItems={'flex-end'} alignItems={'flex-end'}>
          <Button variant={'outlined'}>Import CVS</Button>
          <Button variant={'contained'} onClick={openCreateTransaction} startIcon={<AddIcon />}>
            Add Transaction
          </Button>
        </Row>
      )}
    </PageHeader>
  );
};

export default TransactionsHeader;
