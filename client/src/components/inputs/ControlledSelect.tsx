import { TextField, MenuItem, TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

export interface ControlledSelectOption {
  label: string;
  value: string | number;
}

interface ControlledSelectProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  label: string;
  options: ControlledSelectOption[];
}

const ControlledSelect = ({ name, label, options, ...rest }: ControlledSelectProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField {...field} select label={label} fullWidth {...rest}>
          {options.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default ControlledSelect;
