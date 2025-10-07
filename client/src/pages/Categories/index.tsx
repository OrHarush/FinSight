import Row from '@/components/Layout/Containers/Row';
import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useOpen } from '@/hooks/useOpen';
import CreateCategoryDialog from '@/components/Dialogs/CategoryDialogs/CreateCategoryDialog';
import PageLayout from '@/components/Layout/PageLayout';
import EditCategoryDialog from '@/components/Dialogs/CategoryDialogs/EditCategoryDialog';
import { useState } from 'react';
import { CategoryDto } from '@/types/Category';
import CategoriesPageContent from '@/pages/Categories/CategoriesPageContent';

const Categories = () => {
  const [isDialogOpen, openDialog, closeDialog] = useOpen();
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
      <Row alignItems={'center'} justifyContent={isMobile ? 'center' : 'space-between'}>
        <Typography variant={'h4'} fontWeight={700}>
          Categories
        </Typography>
        <Row spacing={1}>
          <Button variant={'outlined'} onClick={openDialog}>
            Create Category
          </Button>
        </Row>
      </Row>
      <CategoriesPageContent selectCategory={selectCategory} />
      {isDialogOpen && <CreateCategoryDialog isOpen={isDialogOpen} closeDialog={closeDialog} />}
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
