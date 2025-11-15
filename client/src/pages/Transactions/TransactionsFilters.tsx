import { ChangeEvent } from 'react';
import ResponsiveRow from '@/components/layout/Containers/ResponsiveRow';
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CategorySelect from '@/pages/Transactions/CategorySelect';
import Row from '@/components/layout/Containers/Row';
import { ClearIcon } from '@mui/x-date-pickers';
import DateSelector from '@/components/appCommon/DateSelector';
import { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';

interface TransactionsFiltersProps {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  selectedCategory: string;
  setSelectedCategory: (selectedCategory: string) => void;
  selectedMonth: Dayjs;
  setSelectedMonth: (selectedMonth: Dayjs) => void;
}

const TransactionsFilters = ({
  searchValue,
  setSearchValue,
  selectedCategory,
  setSelectedCategory,
  selectedMonth,
  setSelectedMonth,
}: TransactionsFiltersProps) => {
  const { t } = useTranslation('common');

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <ResponsiveRow spacing={2}>
      <DateSelector value={selectedMonth} onChange={setSelectedMonth} />
      <Row spacing={1}>
        <CategorySelect
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <TextField
          placeholder={t('actions.search')}
          value={searchValue}
          onChange={handleSearch}
          size="small"
          sx={{ mb: 2, width: '160px' }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
        <Tooltip title="Clear filters">
          <IconButton
            onClick={() => {
              setSelectedCategory('');
              setSearchValue('');
            }}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </Row>
    </ResponsiveRow>
  );
};

export default TransactionsFilters;
