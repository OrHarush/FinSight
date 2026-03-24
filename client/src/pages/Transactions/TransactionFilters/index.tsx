import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Chip, IconButton, InputAdornment } from '@mui/material';
import { ClearIcon } from '@mui/x-date-pickers';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import TextInput from '@/components/shared/inputs/TextInput';
import ResponsiveRow from '@/components/shared/layout/containers/ResponsiveRow';
import Row from '@/components/shared/layout/containers/Row';
import DateSelector from '@/components/shared/ui/DateSelector';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import AccountFilter from '@/pages/Transactions/TransactionFilters/AccountFilter';
import CategoryFilter from '@/pages/Transactions/TransactionFilters/CategoryFilter';
import PaymentMethodFilter from '@/pages/Transactions/TransactionFilters/PaymentMethodFilter';
import { useTransactionPageData } from '@/pages/Transactions/TransactionPageDataProvider';
import { TransactionPageFormValues } from '@/types/Transaction';

const TransactionsFilters = () => {
  const { t } = useTranslation('common');
  const { t: tTx } = useTranslation('transactions');
  const isMobile = useIsMobile();

  const {
    selectedMonth,
    setSelectedMonth,
    selectedCategoryIds,
    setSelectedCategoryIds,
    selectedAccountIds,
    setSelectedAccountIds,
    selectedPaymentMethodIds,
    setSelectedPaymentMethodIds,
    resetFilters,
  } = useTransactionPageData();
  const methods = useForm<TransactionPageFormValues>();
  const { control, setValue } = methods;

  const searchValue = useWatch({ control, name: 'searchValue' });

  const hasActiveFilters =
    selectedCategoryIds.length > 0 ||
    selectedAccountIds.length > 0 ||
    selectedPaymentMethodIds.length > 0;

  return (
    <ResponsiveRow spacing={1} alignItems="center">
      <DateSelector value={selectedMonth} onChange={setSelectedMonth} />
      <TextInput
        name="searchValue"
        placeholder={t('actions.search')}
        value={searchValue}
        size="small"
        fullWidth={isMobile}
        sx={{ width: { xs: '100%', sm: '220px' } }}
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
      <Row spacing={1}>
        <CategoryFilter selectedIds={selectedCategoryIds} onChange={setSelectedCategoryIds} />
        <AccountFilter selectedIds={selectedAccountIds} onChange={setSelectedAccountIds} />
        <PaymentMethodFilter
          selectedIds={selectedPaymentMethodIds}
          onChange={setSelectedPaymentMethodIds}
        />
      </Row>
      {hasActiveFilters && (
        <Chip
          label={tTx('filters.reset')}
          variant="outlined"
          deleteIcon={<CloseIcon />}
          onDelete={resetFilters}
          onClick={resetFilters}
          sx={{
            color: 'error.main',
            borderColor: 'error.main',
            height: '40px',
            borderRadius: '8px',
            '& .MuiChip-deleteIcon': { color: 'error.main' },
          }}
        />
      )}
    </ResponsiveRow>
  );
};

export default TransactionsFilters;
