import { RegisterOptions } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import TextInput from '@/components/shared/inputs/TextInput';

const AMOUNT_REGEX = /^\d+(\.\d{1,2})?$/;

interface AmountInputProps {
  name: string;
  label: string;
  min?: number;
  required?: boolean | string;
}

const AmountInput = ({ name, label, min = 0, required }: AmountInputProps) => {
  const { t } = useTranslation('common');

  const rules: RegisterOptions = {
    min,
    validate: value => AMOUNT_REGEX.test(String(value)) || t('validation.maxTwoDecimals'),
  };

  return <TextInput name={name} label={label} type="number" required={required} rules={rules} />;
};

export default AmountInput;
