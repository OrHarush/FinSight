import { InputLabel, TextField, TextFieldProps } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import Column from '@/components/Layout/Column';

interface TextInputProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  label: string;
  rules?: object; // validation rules
}

const TextInput = ({ name, label, rules, ...rest }: TextInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors[name]?.message as string | undefined;

  return (
    <Column>
      <InputLabel>{label}</InputLabel>
      <TextField
        fullWidth
        error={!!fieldError}
        helperText={fieldError}
        {...register(name, rules)}
        {...rest}
      />
    </Column>
  );
};

export default TextInput;
