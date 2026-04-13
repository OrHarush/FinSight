import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import CreateTransactionButton from '@/pages/OnBoarding/CreateTransactionButton';
import { QuickAddPreset } from '@/pages/OnBoarding/types';

interface AddTransactionButtonProps {
  openWithPreset: (preset: QuickAddPreset) => void;
}

const AddTransactionButtons = ({ openWithPreset }: AddTransactionButtonProps) => {
  const { t } = useTranslation('overview');

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
    </Column>
  );
};

export default AddTransactionButtons;
