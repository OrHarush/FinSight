import { Box, useMediaQuery, useTheme } from '@mui/material';

import ResponsiveRow from '@/components/shared/layout/containers/ResponsiveRow';
import Row from '@/components/shared/layout/containers/Row';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import { useTransactionPageData } from '@/pages/Transactions/TransactionPageDataProvider';
import ClearFiltersChip from '@/pages/Transactions/TransactionsFilters/ClearFiltersChip ';
import TransactionFilterChips from '@/pages/Transactions/TransactionsFilters/TransactionFilterChips';
import TransactionSearchInput from '@/pages/Transactions/TransactionsFilters/TransactionSearchInput';

const TransactionsFilters = () => {
  const isSmallScreen = useIsSmallScreen();
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.only('md'));
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));

  const {
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
    <ResponsiveRow width={'100%'} spacing={1} alignItems="center">
      <TransactionSearchInput />
      {isSmallScreen ? (
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
              justifyContent: isXs ? 'center' : 'flex-start',
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
        <Row spacing={1} alignItems="center" sx={{ flex: 1 }}>
          {filterChips}
          {hasActiveFilters && (
            <ClearFiltersChip onClick={resetFilters} iconOnly={isMediumScreen} />
          )}
        </Row>
      )}
    </ResponsiveRow>
  );
};

export default TransactionsFilters;
