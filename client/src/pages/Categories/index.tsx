import { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { useOpen } from '@/hooks/common/useOpen';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import { CategoryDto } from '@/types/Category';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import PageHeader from '@/components/shared/layout/page/PageHeader';
import ActionFab from '@/components/shared/ui/ActionFab';
import CategoriesPageContent from '@/pages/Categories/CategoriesPageContent';
import CategoriesDialogManager from '@/pages/Categories/CategoriesDialogManager';

const Categories = () => {
  const { t } = useTranslation('categories');
  const isMobile = useIsMobile();
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const [selectedCategory, setSelectedCategory] = useState<CategoryDto>();

  const handleSelectCategory = (category: CategoryDto) => {
    setSelectedCategory(category);
  };

  const handleCloseEdit = () => {
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
      <CategoriesPageContent selectCategory={handleSelectCategory} />
      <ActionFab onClick={openCreateDialog} />
      <CategoriesDialogManager
        isCreateOpen={isCreateDialogOpen}
        selectedCategory={selectedCategory}
        onCloseCreate={closeCreateDialog}
        onCloseEdit={handleCloseEdit}
      />
    </PageLayout>
  );
};

export default Categories;
