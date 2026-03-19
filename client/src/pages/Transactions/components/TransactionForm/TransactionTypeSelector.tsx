import { useTranslation } from 'react-i18next';
import TypeToggleField from '@/components/shared/inputs/TypeToggleField';

interface TransactionTypeSelectorProps {
  name?: string;
  required?: boolean;
  disabled?: boolean;
}

const TransactionTypeSelector = ({
  name = 'type',
  required = true,
  disabled = false,
}: TransactionTypeSelectorProps) => {
  const { t } = useTranslation('transactions');

  return (
    <TypeToggleField
      namespace="transactions"
      translationKeyPrefix="types"
      label={t('fields.type')}
      showTransfer
      disabled={disabled}
      required={required}
      name={name}
    />
  );
};

export default TransactionTypeSelector;
