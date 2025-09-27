import ControlledSelect from '@/components/inputs/ControlledSelect';
import Column from '@/components/Layout/Containers/Column';
import TextInput from '@/components/inputs/TextInput';
import Row from '@/components/Layout/Containers/Row';
import { useAccounts } from '@/providers/EntitiesProviders/AccountsProvider';
import { useCategories } from '@/providers/EntitiesProviders/CategoriesProvider';
import { InputLabel, Skeleton, Typography } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CategoryIcon from '@mui/icons-material/Category';
import * as Icons from '@mui/icons-material';
import { SvgIconComponent } from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';

const recurrenceOptions = ['None', 'Monthly', 'Yearly'];

const TransactionForm = () => {
  const { accounts } = useAccounts();
  const { categories, isLoading } = useCategories();
  const { watch } = useFormContext();

  return (
    <Column spacing={2}>
      <TextInput name={'name'} label={'Name'} required />
      <Row spacing={2}>
        <TextInput name={'amount'} label={'Amount'} type={'number'} min={1} required />
        <ControlledSelect
          name={'recurrence'}
          label={'Recurrence'}
          required
          sx={{ width: '190px' }}
          options={recurrenceOptions.map(option => ({
            label: option,
            value: option,
          }))}
        />
      </Row>

      <Row spacing={2}>
        <TextInput
          name={'date'}
          label={'Date'}
          type={watch('recurrence') === 'Monthly' ? 'month' : 'date'}
          sx={{ width: '190px' }}
        />
        {watch('recurrence') !== 'None' && (
          <TextInput
            name="endDate"
            label="End Date"
            type={watch('recurrence') === 'Monthly' ? 'month' : 'date'}
            sx={{ width: '190px' }}
          />
        )}
      </Row>
      {!isLoading ? (
        <ControlledSelect
          name={'category'}
          label={'Category'}
          required
          options={categories.map(category => {
            const IconComponent =
              (category.icon && (Icons as Record<string, SvgIconComponent>)[category.icon]) ||
              CategoryIcon;

            return {
              label: category.name,
              value: category._id,
              design: (
                <Row spacing={1}>
                  <IconComponent sx={{ color: category.color }} />
                  <Typography>{category.name}</Typography>
                </Row>
              ),
            };
          })}
        />
      ) : (
        <Column spacing={0.5}>
          <InputLabel>Category</InputLabel>
          <Skeleton variant="rectangular" width={'120px'} height={40} sx={{ borderRadius: 1 }} />
        </Column>
      )}
      <ControlledSelect
        name={'account'}
        label={'Account'}
        disabled={!accounts?.length}
        required
        options={accounts.map(account => ({
          label: account.name,
          value: account._id,
          design: (
            <Row spacing={1}>
              <AccountBalanceIcon />
              <Typography>{account.name}</Typography>
            </Row>
          ),
        }))}
      />
    </Column>
  );
};

export default TransactionForm;
