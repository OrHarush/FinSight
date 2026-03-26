import { Box, useMediaQuery, useTheme } from '@mui/material';

import ResponsiveRow from '@/components/shared/layout/containers/ResponsiveRow';
import Row from '@/components/shared/layout/containers/Row';
import DateSelector from '@/components/shared/ui/DateSelector';
import ClearFiltersChip from '@/pages/Transactions/TransactionFilters/ClearFiltersChip ';
import TransactionFilterChips from '@/pages/Transactions/TransactionFilters/TransactionFilterChips';
import TransactionSearchInput from '@/pages/Transactions/TransactionFilters/TransactionSearchInput';
import { useTransactionPageData } from '@/pages/Transactions/TransactionPageDataProvider';

const TransactionsFilters = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const hasActiveFilters =
    selectedCategoryIds.length > 0 ||
    selectedAccountIds.length > 0 ||
    selectedPaymentMethodIds.length > 0;

  const filterChips = (
    <TransactionFilterChips
      selectedCategoryIds={selectedCategoryIds}
      selectedAccountIds={selectedAccountIds}
      selectedPaymentMethodIds={selectedPaymentMethodIds}
      onCategoryChange={setSelectedCategoryIds}
      onAccountChange={setSelectedAccountIds}
      onPaymentMethodChange={setSelectedPaymentMethodIds}
    />
  );

  return (
    <ResponsiveRow spacing={1} alignItems="center">
      <DateSelector value={selectedMonth} onChange={setSelectedMonth} />
      <TransactionSearchInput />
      {isMobile ? (
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flex: 1,
              justifyContent: hasActiveFilters ? 'flex-start' : 'center',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {filterChips}
          </Box>
          {hasActiveFilters && <ClearFiltersChip onClick={resetFilters} iconOnly />}
        </Box>
      ) : (
        <Row spacing={1}>
          {filterChips}
          {hasActiveFilters && <ClearFiltersChip onClick={resetFilters} />}
        </Row>
      )}
    </ResponsiveRow>
  );
};

export default TransactionsFilters;
