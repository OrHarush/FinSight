import { InputLabel, TextField, TextFieldProps } from '@mui/material';
import { RegisterOptions, useFormContext } from 'react-hook-form';
import Column from '@/components/shared/layout/containers/Column';
import { useTranslation } from 'react-i18next';

interface TextInputProps extends Omit<TextFieldProps, 'name' | 'required'> {
  name: string;
  label?: string;
  required?: boolean | string;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  rules?: RegisterOptions;
}

const TextInput = ({
  name,
  label = '',
  required,
  min,
  max,
  minLength,
  maxLength,
  fullWidth = true,
  type,
  rules,
  ...rest
}: TextInputProps) => {
  const { t } = useTranslation('common');
  const {
    register,
    formState: { errors },
  } = useFormContext();

  let baseRules: RegisterOptions;

  if (type === 'number') {
    baseRules = {
      valueAsNumber: true,
      ...(required && {
        required:
          typeof required === 'string' ? required : t('validation.required', { field: label }),
      }),
      ...(min !== undefined && {
        min: { value: min, message: t('validation.min', { field: label, value: min }) },
      }),
      ...(max !== undefined && {
        max: { value: max, message: t('validation.max', { field: label, value: min }) },
      }),
    };
  } else if (type === 'date') {
    baseRules = {
      valueAsDate: true,
      ...(required && {
        required:
          typeof required === 'string' ? required : t('validation.required', { field: label }),
      }),
    };
  } else {
    baseRules = {
      ...(required && {
        required:
          typeof required === 'string' ? required : t('validation.required', { field: label }),
      }),
      ...(minLength !== undefined && {
        minLength: { value: minLength, message: t('validation.min', { field: label, value: min }) },
      }),
      ...(maxLength !== undefined && {
        maxLength: { value: maxLength, message: t('validation.max', { field: label, value: min }) },
      }),
    };
  }

  const finalRules = { ...baseRules, ...rules };

  const fieldError = errors[name]?.message as string | undefined;

  return (
    <Column
      spacing={0.5}
      sx={{
        minWidth: fullWidth ? 0.5 : undefined,
      }}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <TextField
        {...register(name, finalRules)}
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
