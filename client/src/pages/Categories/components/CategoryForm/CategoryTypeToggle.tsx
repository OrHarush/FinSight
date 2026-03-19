import { useTranslation } from 'react-i18next';
import TypeToggleField from '@/components/shared/inputs/TypeToggleField';

interface CategoryTypeToggleProps {
  name?: string;
  required?: boolean;
  disabled?: boolean;
}

const CategoryTypeToggle = ({
  name = 'type',
  required = true,
  disabled = false,
}: CategoryTypeToggleProps) => {
  const { t } = useTranslation('categories');

  return (
    <TypeToggleField
      namespace="categories"
      translationKeyPrefix="options"
      label={t('fields.type')}
      showTransfer={false}
      disabled={disabled}
      required={required}
      name={name}
    />
  );
};

export default CategoryTypeToggle;
