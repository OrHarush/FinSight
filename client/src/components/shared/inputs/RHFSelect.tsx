import { MenuItem, TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { ReactNode } from 'react';
import TextInput from '@/components/shared/inputs/TextInput';

export interface ControlledSelectOption {
  label?: string;
  value: string | number;
  design?: ReactNode;
}

interface ControlledSelectProps extends Omit<TextFieldProps, 'name' | 'required'> {
  name: string;
  label?: string;
  options: ControlledSelectOption[];
  required?: boolean | string;
}

const RHFSelect = ({ name, label, options, required, ...props }: ControlledSelectProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextInput
          {...field}
          select
          label={label || ''}
          name={name}
          required={required}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          {...props}
          sx={{
            ...(props.fullWidth && { flex: 1, minWidth: 0 }),
            ...props.sx,
          }}
        >
          {options.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.design ?? option.label}
            </MenuItem>
          ))}
        </TextInput>
      )}
    />
  );
};

export default RHFSelect;
