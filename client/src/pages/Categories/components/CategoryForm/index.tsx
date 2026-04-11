import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import TextInput from '@/components/shared/inputs/TextInput';
import Column from '@/components/shared/layout/containers/Column';
import CategoryPreview from '@/pages/Categories/components/CategoryForm/CategoryPreview';
import CategoryTypeToggle from '@/pages/Categories/components/CategoryForm/CategoryTypeToggle';

interface CategoryFormProps {
  hideTypeToggle?: boolean;
}

const CategoryForm = ({ hideTypeToggle = false }: CategoryFormProps) => {
  const { t } = useTranslation('categories');

  return (
    <Column spacing={3}>
      <Column spacing={1.5}>
        <CategoryPreview />
        <TextInput name="name" label={t('fields.name')} />
      </Column>
      {!hideTypeToggle && (
        <Box
          sx={{
            alignSelf: 'center',
            px: 1,
            py: 0.5,
            borderRadius: 2,
          }}
        >
          <CategoryTypeToggle />
        </Box>
      )}
    </Column>
  );
};

export default CategoryForm;
