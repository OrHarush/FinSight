import AddIcon from '@mui/icons-material/Add';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
import PageHeader from '@/components/shared/layout/page/PageHeader';

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
          <Button
            variant={'contained'}
            onClick={openCreateTransaction}
            startIcon={<AddIcon />}
            sx={{ width: '180px' }}
          >
            {t('actions.create')}
          </Button>
        </Row>
      )}
    </PageHeader>
  );
};

export default TransactionsHeader;
