import ControlledSelect from '@/components/inputs/ControlledSelect';
import Column from '@/components/Layout/Column';
import TextInput from '@/components/inputs/TextInput';
import Row from '@/components/Layout/Row';
import { useAccounts } from '@/providers/AccountsProvider';
import { useCategories } from '@/providers/CategoriesProvider';
import { Typography } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const recurrenceOptions = ['None', 'Monthly', 'Yearly'];

const TransactionForm = () => {
  const { accounts } = useAccounts();
  const { categories, isLoading } = useCategories();

  return (
    <Column spacing={2}>
      <TextInput name={'name'} label={'Name'} required />
      <Row spacing={2}>
        <TextInput name={'amount'} label={'Amount'} type={'number'} min={1} required />
        <TextInput name={'date'} label={'Transaction date'} type={'date'} />
        <ControlledSelect
          name={'recurrence'}
          label={'Recurrence'}
          required
          options={recurrenceOptions.map(option => ({
            label: option,
            value: option,
          }))}
        />
      </Row>
      <Row spacing={2}>
        {!isLoading ? (
          <ControlledSelect
            name={'category'}
            label={'Category'}
            required
            options={categories.map(category => ({
              label: category.name,
              value: category._id,
            }))}
          />
        ) : (
          <Typography>Text...</Typography>
        )}
        <ControlledSelect
          name={'account'}
          label={'Account'}
          required
          options={
            accounts?.map(account => ({
              label: account.name,
              value: account._id,
              design: (
                <Row spacing={1}>
                  <AccountBalanceIcon />
                  <Typography>{account.name}</Typography>
                </Row>
              ),
            })) || []
          }
        />
      </Row>
    </Column>
  );
};

export default TransactionForm;
