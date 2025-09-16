import { TextField, TextFieldProps } from '@mui/material';
import { UseFormRegister } from 'react-hook-form';

interface Props extends Omit<TextFieldProps, 'name' | 'inputRef' | 'onChange' | 'onBlur'> {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

const TextInput = ({
  name,
  label,
  register,
  required,
  min,
  max,
  minLength,
  maxLength,
  pattern,
  ...rest
}: Props) => {
  const validationRules = {
    required,
    min,
    max,
    minLength,
    maxLength,
    pattern,
  };

  const reg = register(name, validationRules);

  return (
    <TextField
      {...rest}
      label={label}
      name={name}
      inputRef={reg.ref}
      onChange={reg.onChange}
      onBlur={reg.onBlur}
    />
  );
};

export default TextInput;
