import { FormControl, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const TRANSACTION_TYPES = [
  {
    value: 'Expense',
    label: 'Expense',
    icon: TrendingDownIcon,
    color: '#ef4444',
  },
  {
    value: 'Income',
    label: 'Income',
    icon: TrendingUpIcon,
    color: '#22c55e',
  },
  {
    value: 'Transfer',
    label: 'Transfer',
    icon: SwapHorizIcon,
    color: '#3b82f6',
  },
];

const TransactionTypeSelector = ({ name = 'type', required = true }) => {
  const { control } = useFormContext();

  return (
    <FormControl component="fieldset">
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field }) => (
          <ToggleButtonGroup
            {...field}
            exclusive
            fullWidth
            sx={{
              '& .MuiToggleButton-root': {
                py: { xs: 0.5, sm: 1.5 },
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                border: '1px solid',
                borderColor: 'divider',
                '&.Mui-selected': {
                  fontWeight: 600,
                },
                ...TRANSACTION_TYPES.reduce(
                  (acc, type) => ({
                    ...acc,
                    [`&[value="${type.value}"]`]: {
                      '&:hover': {
                        bgcolor: `${type.color}14`,
                      },
                      '&.Mui-selected': {
                        bgcolor: `${type.color}1F`,
                        borderColor: type.color,
                        color: type.color,
                        '&:hover': {
                          bgcolor: `${type.color}29`,
                        },
                      },
                    },
                  }),
                  {}
                ),
              },
            }}
          >
            {TRANSACTION_TYPES.map(({ value, label, icon: Icon, color }) => (
              <ToggleButton
                key={value}
                value={value}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center',
                  gap: { xs: 0.5, sm: 1 },
                }}
              >
                <Icon
                  sx={{
                    mr: 1,
                    fontSize: 20,
                    color: field.value === value ? color : 'inherit',
                  }}
                />
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
      />
    </FormControl>
  );
};

export default TransactionTypeSelector;
