import { InputLabel, TextField, TextFieldProps } from '@mui/material';
import { RegisterOptions, useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';

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
  const fieldError = fieldState.error?.message
    ? t(fieldState.error.message, { field: label })
    : undefined;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'number') {
      const raw = event.target.value;

      field.onChange(raw === '' ? undefined : Number(raw));
      return;
    }

    if (type === 'date') {
      field.onChange(event.target.value === '' ? undefined : event.target.value);
      return;
    }

    field.onChange(event);
  };

  return (
    <Column spacing={0.5} sx={{ minWidth: fullWidth ? 0.5 : undefined }}>
      {label && <InputLabel>{label}</InputLabel>}
      <TextField
        {...field}
        value={field.value ?? ''}
        onChange={handleChange}
        fullWidth={fullWidth}
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
