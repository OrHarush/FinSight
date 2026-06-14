import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import { usePageHeader, usePrimaryAction } from '@/components/shared/layout/PageHeaderContext';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import { useOpen } from '@/hooks/common/useOpen';
import CategoriesDialogManager from '@/pages/Categories/CategoriesDialogManager';
import CategoriesPageContent from '@/pages/Categories/CategoriesPageContent';
import { CategoryDto } from '@/types/Category';

const Categories = () => {
  const { t } = useTranslation('categories');
  const isSmallScreen = useIsSmallScreen();
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();

  usePageHeader(t('pageTitle'));
  usePrimaryAction(openCreateDialog);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDto>();

  const handleSelectCategory = (category: CategoryDto) => {
    setSelectedCategory(category);
  };

  const handleCloseEdit = () => {
    setSelectedCategory(undefined);
  };

  return (
    <PageLayout>
      {!isSmallScreen && (
        <Row justifyContent="flex-end">
          <Button variant={'contained'} onClick={openCreateDialog} startIcon={<AddIcon />}>
            {t('actions.create')}
          </Button>
        </Row>
      )}
      <CategoriesPageContent selectCategory={handleSelectCategory} />
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
