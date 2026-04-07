import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { ROUTES } from '@/constants/Routes';
import CreateTransactionButton from '@/pages/Overview/SetupPanel/CreateTransactionButton';
import { QuickAddPreset } from '@/pages/Overview/SetupPanel/types';

interface AddTransactionButtonProps {
  openWithPreset: (preset: QuickAddPreset) => void;
}

const AddTransactionButtons = ({ openWithPreset }: AddTransactionButtonProps) => {
  const { t } = useTranslation('overview');
  const navigate = useNavigate();

  const goToImport = () => {
    navigate(ROUTES.IMPORT_URL);
  };

  return (
    <Column spacing={1.5} width="100%">
      <Row spacing={1.5} justifyContent={{ xs: 'center', sm: 'flex-start' }} width="100%">
        <CreateTransactionButton
          type="Income"
          label={t('setup.addIncome')}
          onClick={() => openWithPreset({ type: 'Income', name: '' })}
          sx={{ flex: { xs: 1, sm: 'unset' } }}
        />
        <CreateTransactionButton
          type="Expense"
          label={t('setup.addExpense')}
          onClick={() => openWithPreset({ type: 'Expense', name: '' })}
          sx={{ flex: { xs: 1, sm: 'unset' } }}
        />
      </Row>
      <Row justifyContent={{ xs: 'center', sm: 'flex-start' }}>
        <Typography
          component="button"
          onClick={goToImport}
          variant="body2"
          color="text.secondary"
          sx={{
            background: 'none',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            px: 2,
            py: 0.75,
            cursor: 'pointer',
            fontFamily: 'inherit',
            '&:hover': { color: 'text.primary', borderColor: 'text.secondary' },
            transition: 'color 0.2s, border-color 0.2s',
          }}
        >
          {t('setup.importBank')} ↑
        </Typography>
      </Row>
    </Column>
  );
};

export default AddTransactionButtons;
