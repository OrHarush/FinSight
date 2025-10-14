import { InputLabel, TextField, TextFieldProps } from '@mui/material';
import { RegisterOptions, useFormContext } from 'react-hook-form';
import Column from '@/components/layout/Containers/Column';

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
  type,
  ...rest
}: TextInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  let baseRules: RegisterOptions;

  if (type === 'number') {
    baseRules = {
      valueAsNumber: true,
      ...(required && {
        required: typeof required === 'string' ? required : `${label} is required`,
      }),
      ...(min !== undefined && { min: { value: min, message: `${label} ≥ ${min}` } }),
      ...(max !== undefined && { max: { value: max, message: `${label} ≤ ${max}` } }),
    };
  } else if (type === 'date') {
    baseRules = {
      valueAsDate: true,
      ...(required && {
        required: typeof required === 'string' ? required : `${label} is required`,
      }),
    };
  } else {
    baseRules = {
      ...(required && {
        required: typeof required === 'string' ? required : `${label} is required`,
      }),
      ...(minLength !== undefined && {
        minLength: { value: minLength, message: `${label} ≥ ${minLength} chars` },
      }),
      ...(maxLength !== undefined && {
        maxLength: { value: maxLength, message: `${label} ≤ ${maxLength} chars` },
      }),
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
        type={type}
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
