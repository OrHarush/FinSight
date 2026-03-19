import { InputLabel, TextField, TextFieldProps } from '@mui/material';
import { RegisterOptions, useFormContext, useController } from 'react-hook-form';
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
  const { control } = useFormContext();

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
        max: { value: max, message: t('validation.max', { field: label, value: max }) },
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
        minLength: {
          value: minLength,
          message: t('validation.min', { field: label, value: minLength }),
        },
      }),
      ...(maxLength !== undefined && {
        maxLength: {
          value: maxLength,
          message: t('validation.max', { field: label, value: maxLength }),
        },
      }),
    };
  }

  const finalRules = { ...baseRules, ...rules };
  const { field, fieldState } = useController({ name, control, rules: finalRules });
  const fieldError = fieldState.error?.message;

  return (
    <Column spacing={0.5} sx={{ minWidth: fullWidth ? 0.5 : undefined }}>
      {label && <InputLabel>{label}</InputLabel>}
      <TextField
        {...field}
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
