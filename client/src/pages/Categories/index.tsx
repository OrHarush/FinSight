import Column from '@/components/Layout/Column';
import Row from '@/components/Layout/Row';
import { Button, Typography } from '@mui/material';
import { useOpen } from '@/hooks/useOpen';
import CreateCategoryDialog, { CategoryFormData } from '@/components/CreateCategoryDialog';
import api from '@/api/axios';
import CategoryList from '@/pages/Categories/CategoryList';

const Categories = () => {
  const [isDialogOpen, openDialog, closeDialog] = useOpen();

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await api.post('/categories', data);

      closeDialog();
    } catch (err) {
      console.error('❌ Failed to save category:', err);
    }
  };

  return (
    <Column height="100%" width={'1200px'} spacing={4} alignSelf={'center'}>
      <Row alignItems={'center'} justifyContent={'space-between'}>
        <Typography variant={'h3'} fontWeight={700}>
          Categories
        </Typography>
        <Row spacing={1}>
          <Button variant={'outlined'} onClick={openDialog}>
            Create Category
          </Button>
        </Row>
      </Row>
      <CategoryList />
      <CreateCategoryDialog open={isDialogOpen} onClose={closeDialog} onSubmit={onSubmit} />
    </Column>
  );
};

export default Categories;
