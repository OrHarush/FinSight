import Column from '@/components/shared/layout/containers/Column';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CategoryPreview from '@/pages/Categories/components/CategoryForm/CategoryPreview';
import TextInput from '@/components/shared/inputs/TextInput';
import CategoryTypeToggle from '@/pages/Categories/components/CategoryForm/CategoryTypeToggle';

const CategoryForm = () => {
  const { t } = useTranslation('categories');

  return (
    <Column spacing={3}>
      <Column spacing={1.5}>
        <CategoryPreview />
        <TextInput name="name" label={t('fields.name')} required />
      </Column>
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
    </Column>
  );
};

export default CategoryForm;
