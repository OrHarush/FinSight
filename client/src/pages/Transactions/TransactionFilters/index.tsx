import ResponsiveRow from '@/components/layout/Containers/ResponsiveRow';
import { IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CategorySelect from '@/pages/Transactions/TransactionFilters/CategorySelect';
import Row from '@/components/layout/Containers/Row';
import { ClearIcon } from '@mui/x-date-pickers';
import DateSelector from '@/components/appCommon/DateSelector';
import { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import TextInput from '@/components/inputs/TextInput';
import { TranscationPageFormValues } from '@/types/Transaction';
import { useIsMobile } from '@/hooks/useIsMobile';

interface TransactionsFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (selectedCategory: string) => void;
  selectedMonth: Dayjs;
  setSelectedMonth: (selectedMonth: Dayjs) => void;
}

const TransactionsFilters = ({
  selectedCategory,
  setSelectedCategory,
  selectedMonth,
  setSelectedMonth,
}: TransactionsFiltersProps) => {
  const { t } = useTranslation('common');
  const methods = useForm<TranscationPageFormValues>();
  const { control, setValue } = methods;
  // const { paymentMethods } = usePaymentMethods();
  const isMobile = useIsMobile();

  const searchValue = useWatch({ control, name: 'searchValue' });

  return (
    <FormProvider {...methods}>
      <ResponsiveRow spacing={1} alignItems={isMobile ? 'center' : 'flex-end'}>
        <DateSelector value={selectedMonth} onChange={setSelectedMonth} />
        <Row spacing={1}>
          <CategorySelect
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <TextInput
            name={'searchValue'}
            placeholder={t('actions.search')}
            value={searchValue}
            size="small"
            sx={{ width: '160px' }}
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
          {/*<RHFSelect*/}
          {/*  name={'paymentMethod'}*/}
          {/*  sx={{ width: '160px' }}*/}
          {/*  required*/}
          {/*  options={paymentMethods.map(paymentMethod => ({*/}
          {/*    label: paymentMethod.name,*/}
          {/*    value: paymentMethod._id,*/}
          {/*  }))}*/}
          {/*/>*/}
        </Row>
      </ResponsiveRow>
    </FormProvider>
  );
};

export default TransactionsFilters;
