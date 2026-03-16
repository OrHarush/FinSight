import { FormControl, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useTranslation } from 'react-i18next';
import { SvgIconComponent } from '@mui/icons-material';
import { TransactionType } from '../../../../../../shared/types/TransactionCommmands';
import { getToggleButtonGroupStyles, getToggleButtonStyles, getIconStyles } from './styles';

const TRANSACTION_TYPES: { value: TransactionType; icon: SvgIconComponent; color: string }[] = [
  {
    value: 'Expense',
    icon: TrendingDownIcon,
    color: '#ef4444',
  },
  {
    value: 'Income',
    icon: TrendingUpIcon,
    color: '#22c55e',
  },
  {
    value: 'Transfer',
    icon: SwapHorizIcon,
    color: '#3b82f6',
  },
] as const;

function getSelectedType(value: TransactionType | null | undefined) {
  return TRANSACTION_TYPES.find(type => type.value === value) ?? TRANSACTION_TYPES[0];
}

function getSelectedTypeIndex(value: TransactionType | null | undefined) {
  return TRANSACTION_TYPES.findIndex(type => type.value === value);
}

const TransactionTypeSelector = ({ name = 'type', required = true, disabled = false }) => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext();

  return (
    <FormControl component="fieldset">
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field }) => {
          const selectedType = getSelectedType(field.value);
          const selectedTypeIndex = getSelectedTypeIndex(field.value);

          return (
            <ToggleButtonGroup
              value={field.value}
              exclusive
              disabled={disabled}
              onChange={(_, nextValue) => {
                if (!nextValue) {
                  return;
                }

                field.onChange(nextValue);
              }}
              sx={getToggleButtonGroupStyles(selectedType.color, selectedTypeIndex)}
            >
              {TRANSACTION_TYPES.map(({ value, icon: Icon, color }) => (
                <ToggleButton
                  key={value}
                  value={value}
                  size="small"
                  sx={getToggleButtonStyles(field.value === value, color)}
                >
                  <Icon sx={getIconStyles()} />
                  {t(`types.${value.toLowerCase()}`)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          );
        }}
      />
    </FormControl>
  );
};

export default TransactionTypeSelector;
