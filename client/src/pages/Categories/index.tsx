import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import PageHeader from '@/components/shared/layout/page/PageHeader';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import ActionFab from '@/components/shared/ui/ActionFab';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import { useOpen } from '@/hooks/common/useOpen';
import CategoriesDialogManager from '@/pages/Categories/CategoriesDialogManager';
import CategoriesPageContent from '@/pages/Categories/CategoriesPageContent';
import { CategoryDto } from '@/types/Category';

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
