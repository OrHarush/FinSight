import Column from '@/components/Layout/Column';
import Row from '@/components/Layout/Row';
import { Button, Typography } from '@mui/material';
import { useOpen } from '@/hooks/useOpen';
import CreateCategoryDialog from '@/components/Dialogs/CreateCategoryDialog';
import CategoryList from '@/pages/Categories/CategoryList';

const Categories = () => {
  const [isDialogOpen, openDialog, closeDialog] = useOpen();

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
      <CreateCategoryDialog isOpen={isDialogOpen} closeDialog={closeDialog} />
    </Column>
  );
};

export default Categories;
