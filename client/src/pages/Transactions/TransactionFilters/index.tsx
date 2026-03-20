import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment } from '@mui/material';
import { ClearIcon } from '@mui/x-date-pickers';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import TextInput from '@/components/shared/inputs/TextInput';
import ResponsiveRow from '@/components/shared/layout/containers/ResponsiveRow';
import Row from '@/components/shared/layout/containers/Row';
import DateSelector from '@/components/shared/ui/DateSelector';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import CategorySelect from '@/pages/Transactions/TransactionFilters/CategorySelect';
import { useTransactionPageData } from '@/pages/Transactions/TransactionPageDataProvider';
import { TransactionPageFormValues } from '@/types/Transaction';

const TransactionsFilters = () => {
  const { t } = useTranslation('common');
  const { selectedMonth, setSelectedMonth, selectedCategory, setSelectedCategory } =
    useTransactionPageData();
  const methods = useForm<TransactionPageFormValues>();
  const { control, setValue } = methods;
  const isMobile = useIsMobile();

  const searchValue = useWatch({ control, name: 'searchValue' });

  return (
    <ResponsiveRow spacing={1} alignItems={isMobile ? 'center' : 'flex-end'}>
      <DateSelector value={selectedMonth} onChange={setSelectedMonth} />
      <Row spacing={1} alignItems={'center'} justifyContent={'center'}>
        <CategorySelect
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <TextInput
          name={'searchValue'}
          placeholder={t('actions.search')}
          value={searchValue}
          size="small"
          sx={{ flex: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchValue && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setValue('searchValue', '')} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Row>
    </ResponsiveRow>
  );
};

export default TransactionsFilters;
