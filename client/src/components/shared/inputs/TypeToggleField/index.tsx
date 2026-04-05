import { TransactionType } from '@lyra/shared';
import { SvgIconComponent } from '@mui/icons-material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { FormControl, FormHelperText, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { getIconStyles, getToggleButtonGroupStyles, getToggleButtonStyles } from './styles';

interface ToggleTypeOption {
  value: TransactionType;
  icon: SvgIconComponent;
  color: string;
}

interface TypeToggleFieldProps {
  name?: string;
  required?: boolean | string;
  disabled?: boolean;
  showTransfer?: boolean;
  label: string;
  namespace: string;
  translationKeyPrefix: string;
}

const TOGGLE_OPTIONS: ToggleTypeOption[] = [
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
];

const getAvailableOptions = (showTransfer: boolean) => {
  if (!showTransfer) {
    return TOGGLE_OPTIONS.filter(option => option.value !== 'Transfer');
  }

  return TOGGLE_OPTIONS;
};

const getSelectedOption = (
  options: ToggleTypeOption[],
  value: TransactionType | null | undefined
) => options.find(option => option.value === value) ?? options[0];

const getSelectedOptionIndex = (
  options: ToggleTypeOption[],
  value: TransactionType | null | undefined
) => options.findIndex(option => option.value === value);

const TypeToggleField = ({
  name = 'type',
  required = true,
  disabled = false,
  showTransfer = true,
  label,
  namespace,
  translationKeyPrefix,
}: TypeToggleFieldProps) => {
  const { t } = useTranslation(namespace);
  const { t: tCommon } = useTranslation('common');
  const { control } = useFormContext();
  const options = getAvailableOptions(showTransfer);
  const requiredMessage =
    typeof required === 'string' ? required : tCommon('validation.required', { field: label });

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? requiredMessage : false,
      }}
      render={({ field, fieldState }) => {
        const selectedOption = getSelectedOption(options, field.value);
        const selectedOptionIndex = getSelectedOptionIndex(options, field.value);

        return (
          <FormControl component="fieldset" error={Boolean(fieldState.error)}>
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
              sx={getToggleButtonGroupStyles(
                selectedOption.color,
                selectedOptionIndex,
                options.length
              )}
            >
              {options.map(({ value, icon: Icon, color }) => (
                <ToggleButton
                  key={value}
                  value={value}
                  size="small"
                  sx={getToggleButtonStyles(field.value === value, color)}
                >
                  <Icon sx={getIconStyles()} />
                  {t(`${translationKeyPrefix}.${value.toLowerCase()}`)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};

export default TypeToggleField;
