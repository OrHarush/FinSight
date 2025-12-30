import { Button, useMediaQuery, useTheme } from '@mui/material';
import CreateCategoryDialog from '@/components/features/categories/CreateCategoryDialog';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import EditCategoryDialog from '@/components/features/categories/EditCategoryDialog';
import { useState } from 'react';
import { CategoryDto } from '@/types/Category';
import CategoriesPageContent from '@/pages/Categories/CategoriesPageContent';
import { useOpen } from '@/hooks/useOpen';
import PageHeader from '@/components/shared/layout/page/PageHeader';
import ActionFab from '@/components/shared/ui/ActionFab';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';

const Categories = () => {
  const { t } = useTranslation('categories');
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const [selectedCategory, setSelectedCategory] = useState<CategoryDto>();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const selectCategory = (category: CategoryDto) => {
    setSelectedCategory(category);
  };

  const closeEditDialogAndReset = () => {
    setSelectedCategory(undefined);
  };

  return (
    <PageLayout>
      <PageHeader entityName={'categories'}>
        {!isMobile && (
          <Button variant={'contained'} onClick={openCreateDialog} startIcon={<AddIcon />}>
            {t('actions.create')}
          </Button>
        )}
      </PageHeader>
      <CategoriesPageContent selectCategory={selectCategory} />
      <ActionFab onClick={openCreateDialog} />
      {isCreateDialogOpen && (
        <CreateCategoryDialog isOpen={isCreateDialogOpen} closeDialog={closeCreateDialog} />
      )}
      {!!selectedCategory && (
        <EditCategoryDialog
          isOpen={!!selectedCategory}
          closeDialog={closeEditDialogAndReset}
          category={selectedCategory}
        />
      )}
    </PageLayout>
  );
};

export default Categories;
