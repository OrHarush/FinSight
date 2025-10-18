import { Button, useMediaQuery, useTheme } from '@mui/material';
import CreateCategoryDialog from '@/components/dialogs/CategoryDialogs/CreateCategoryDialog';
import PageLayout from '@/components/layout/Page/PageLayout';
import EditCategoryDialog from '@/components/dialogs/CategoryDialogs/EditCategoryDialog';
import { useState } from 'react';
import { CategoryDto } from '@/types/Category';
import CategoriesPageContent from '@/pages/Categories/CategoriesPageContent';
import { useOpen } from '@/hooks/useOpen';
import PageHeader from '@/components/layout/Page/PageHeader';
import ActionFab from '@/components/appCommon/ActionFab';
import { useTranslation } from 'react-i18next';

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
          <Button variant={'contained'} onClick={openCreateDialog}>
            {t('actions.create')}
          </Button>
        )}
      </PageHeader>
      <ActionFab onClick={openCreateDialog} />
      <CategoriesPageContent selectCategory={selectCategory} />
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
