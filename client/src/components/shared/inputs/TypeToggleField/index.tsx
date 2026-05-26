import { SvgIconComponent } from '@mui/icons-material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { FormControl, FormHelperText, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { getIconStyles, getToggleButtonGroupStyles, getToggleButtonStyles } from './styles';

export interface ToggleTypeOption {
  value: string;
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
  options?: ToggleTypeOption[];
}

const TRANSACTION_TOGGLE_OPTIONS: ToggleTypeOption[] = [
  { value: 'Expense', icon: TrendingDownIcon, color: '#ef4444' },
  { value: 'Income', icon: TrendingUpIcon, color: '#22c55e' },
  { value: 'Transfer', icon: SwapHorizIcon, color: '#3b82f6' },
];

const getTransactionOptions = (showTransfer: boolean) => {
  if (!showTransfer) {
    return TRANSACTION_TOGGLE_OPTIONS.filter(o => o.value !== 'Transfer');
  }

  return TRANSACTION_TOGGLE_OPTIONS;
};

const getSelectedOption = (options: ToggleTypeOption[], value: string | null | undefined) =>
  options.find(o => o.value === value) ?? options[0];

const getSelectedOptionIndex = (options: ToggleTypeOption[], value: string | null | undefined) =>
  options.findIndex(o => o.value === value);

const TypeToggleField = ({
  name = 'type',
  required = true,
  disabled = false,
  showTransfer = true,
  label,
  namespace,
  translationKeyPrefix,
  options,
}: TypeToggleFieldProps) => {
  const { t } = useTranslation(namespace);
  const { t: tCommon } = useTranslation('common');
  const { control } = useFormContext();
  const resolvedOptions = options ?? getTransactionOptions(showTransfer);
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
        const selectedOption = getSelectedOption(resolvedOptions, field.value);
        const selectedOptionIndex = getSelectedOptionIndex(resolvedOptions, field.value);

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
                resolvedOptions.length
              )}
            >
              {resolvedOptions.map(({ value, icon: Icon, color }) => (
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
