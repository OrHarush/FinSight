import { TransactionFormValues } from '@lyra/shared';
import { FormControl, ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  getToggleButtonGroupStyles,
  getToggleButtonStyles,
} from '@/components/shared/inputs/TypeToggleField/styles';

const FREQUENCY_OPTIONS = [
  { value: 'None' as const, labelKey: 'recurrence.none' },
  { value: 'Monthly' as const, labelKey: 'recurrence.monthly' },
  { value: 'Yearly' as const, labelKey: 'recurrence.yearly' },
];

const FrequencyToggle = () => {
  const { t } = useTranslation('transactions');
  const theme = useTheme();
  const { control } = useFormContext<TransactionFormValues>();
  const color = theme.palette.primary.main;

  return (
    <Controller
      name="recurrence"
      control={control}
      render={({ field }) => {
        const selectedIndex = FREQUENCY_OPTIONS.findIndex(opt => opt.value === field.value);

        return (
          <FormControl component="fieldset" fullWidth>
            <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
              {t('fields.recurrence')}
            </Typography>
            <ToggleButtonGroup
              value={field.value}
              exclusive
              onChange={(_, nextValue) => {
                if (!nextValue) {
                  return;
                }

                field.onChange(nextValue);
              }}
              sx={[
                getToggleButtonGroupStyles(color, selectedIndex, FREQUENCY_OPTIONS.length),
                { width: '100%' },
              ]}
            >
              {FREQUENCY_OPTIONS.map(({ value, labelKey }) => (
                <ToggleButton
                  key={value}
                  value={value}
                  size="small"
                  sx={[getToggleButtonStyles(field.value === value, color), { flex: 1, minWidth: 0 }]}
                >
                  {t(labelKey)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </FormControl>
        );
      }}
    />
  );
};

export default FrequencyToggle;
