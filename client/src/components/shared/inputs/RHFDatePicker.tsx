import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextFieldProps } from '@mui/material';

interface RHFDatePickerProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  textFieldProps?: TextFieldProps;
  views?: ('year' | 'month' | 'day')[];
}

export function RHFDatePicker<T extends FieldValues>({
  name,
  label,
  textFieldProps,
  views = ['year', 'month', 'day'],
}: RHFDatePickerProps<T>) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <DatePicker
          {...field}
          label={label}
          value={field.value || null}
          onChange={date => field.onChange(date)}
          views={views}
          slotProps={{
            textField: {
              ...textFieldProps,
              error: !!fieldState.error,
              helperText: fieldState.error?.message,
              size: 'small',
              sx: { width: 200 },
            },
          }}
        />
      )}
    />
  );
}
