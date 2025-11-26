import Row from '@/components/layout/Containers/Row';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '@/components/layout/Page/PageHeader';
import { useTranslation } from 'react-i18next';

interface TransactionHeaderProps {
  openCreateTransaction?: () => void;
}

const TransactionsHeader = ({ openCreateTransaction }: TransactionHeaderProps) => {
  const { t } = useTranslation('transactions');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <PageHeader entityName={'transactions'}>
      {!isMobile && (
        <Row spacing={1} justifyItems={'flex-end'} alignItems={'flex-end'}>
          {/*<Button variant={'outlined'}> {t('actions.import')}</Button>*/}
          <Button variant={'contained'} onClick={openCreateTransaction} startIcon={<AddIcon />}>
            {t('actions.add')}
          </Button>
        </Row>
      )}
    </PageHeader>
  );
};

export default TransactionsHeader;
