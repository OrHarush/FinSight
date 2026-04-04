import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Row from '@/components/shared/layout/containers/Row';
import { ROUTES } from '@/constants/Routes';

interface TransactionActionsProps {
  openCreateDialog?: () => void;
}

const TransactionActions = ({ openCreateDialog }: TransactionActionsProps) => {
  const { t } = useTranslation('transactions');
  const navigate = useNavigate();

  const navigateToImport = () => {
    navigate(ROUTES.IMPORT_URL);
  };

  return (
    <Row spacing={1}>
      <Button
        variant="outlined"
        startIcon={<UploadIcon />}
        onClick={navigateToImport}
        sx={{ width: '120px' }}
      >
        {t('actions.import')}
      </Button>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openCreateDialog}
        sx={{ width: '180px' }}
      >
        {t('actions.create')}
      </Button>
    </Row>
  );
};

export default TransactionActions;
