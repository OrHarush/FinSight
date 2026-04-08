import { Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  value: 'expense' | 'income';
  onChange: (value: 'expense' | 'income') => void;
  /** Stretch tabs to fill full width equally */
  centered?: boolean;
}

const CategorizeTabBar = ({ value, onChange, centered = false }: Props) => {
  const { t } = useTranslation('transactions');

  return (
    <Tabs
      value={value}
      onChange={(_, v) => onChange(v)}
      variant={centered ? 'fullWidth' : 'standard'}
      sx={{ minHeight: 36, '& .MuiTab-root': { minHeight: 36, py: 0.5 } }}
    >
      <Tab label={t('importWizard.categorize.tabExpenses')} value="expense" />
      <Tab label={t('importWizard.categorize.tabIncome')} value="income" />
    </Tabs>
  );
};

export default CategorizeTabBar;
