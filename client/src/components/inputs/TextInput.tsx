import { InputLabel, TextField, TextFieldProps } from '@mui/material';
import { RegisterOptions, useFormContext } from 'react-hook-form';
import Column from '@/components/Layout/Column';

interface TextInputProps extends Omit<TextFieldProps, 'name' | 'required'> {
  name: string;
  label: string;
  required?: boolean | string;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  rules?: RegisterOptions;
}

const TextInput = ({
  name,
  label,
  required,
  min,
  max,
  minLength,
  maxLength,
  rules,
  ...rest
}: TextInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const baseRules: RegisterOptions = {
    ...rules,
  };

  if (required) {
    baseRules.required = typeof required === 'string' ? required : `${label} is required`;
  }
  if (min !== undefined) {
    baseRules.min = { value: min, message: `${label} must be at least ${min}` };
  }
  if (max !== undefined) {
    baseRules.max = { value: max, message: `${label} must be at most ${max}` };
  }
  if (minLength !== undefined) {
    baseRules.minLength = {
      value: minLength,
      message: `${label} must be at least ${minLength} characters`,
    };
  }
  if (maxLength !== undefined) {
    baseRules.maxLength = {
      value: maxLength,
      message: `${label} must be at most ${maxLength} characters`,
    };
  }

  const fieldError = errors[name]?.message as string | undefined;

  return (
    <Column spacing={0.5}>
      <InputLabel>{label}</InputLabel>
      <TextField
        {...register(name, baseRules)}
        fullWidth
        helperText={fieldError}
        slotProps={{
          htmlInput: {
            ...(min !== undefined ? { min: String(min) } : {}),
            ...(max !== undefined ? { max: String(max) } : {}),
          },
        }}
        error={!!fieldError}
        {...rest}
      />
    </Column>
  );
};

export default TextInput;
