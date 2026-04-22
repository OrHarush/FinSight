import { TransactionFormValues } from '@lyra/shared';
import { Grid, Skeleton } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import CategoriesSelect from '@/components/features/categories/CategoriesSelect';
import CreateCategoryBottomSheet from '@/components/features/categories/CreateCategoryBottomSheet';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import { useOpen } from '@/hooks/common/useOpen';
import { useCategories } from '@/hooks/entities/useCategories';
import CreateCategoryDialog from '@/pages/Categories/components/dialogs/CreateCategoryDialog';
import { CategoryDto } from '@/types/Category';

interface ClassificationSectionProps {
  isFullWidth?: boolean;
}

const ClassificationSection = ({ isFullWidth = false }: ClassificationSectionProps) => {
  const { control, setValue } = useFormContext<TransactionFormValues>();
  const { categories, isLoading } = useCategories();
  const isSmallScreen = useIsSmallScreen();
  const [isCreateNewCategoryOpen, openCreateNewCategory, closeCreateNewCategory] = useOpen();

  const transactionType = useWatch({ control, name: 'type' });

  const isFirstRender = useRef(true);

  const filteredCategories = categories.filter(
    c => c.type.toLowerCase() === transactionType?.toLowerCase()
  );

  const gridSize = { xs: 12, sm: isFullWidth ? 12 : 6 };

  const selectCreatedCategory = (category: CategoryDto) => {
    setValue('category', category._id, { shouldValidate: true });
    closeCreateNewCategory();
  };

  const categoryType = transactionType === 'Transfer' ? 'Expense' : transactionType;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setValue('category', '', { shouldDirty: true });
  }, [transactionType]);

  return (
    <>
      {!isLoading ? (
        <Grid size={gridSize}>
          <CategoriesSelect
            filteredCategories={filteredCategories}
            openCreateNewCategory={openCreateNewCategory}
            grouped
          />
        </Grid>
      ) : (
        <Grid size={gridSize}>
          <Skeleton variant="rectangular" height={52} sx={{ borderRadius: 1 }} />
        </Grid>
      )}
      {isSmallScreen
        ? isCreateNewCategoryOpen && (
            <CreateCategoryBottomSheet
              open={isCreateNewCategoryOpen}
              transactionType={categoryType}
              onClose={closeCreateNewCategory}
              onCreated={selectCreatedCategory}
            />
          )
        : isCreateNewCategoryOpen && (
            <CreateCategoryDialog
              isOpen={isCreateNewCategoryOpen}
              closeDialog={closeCreateNewCategory}
              onCreated={selectCreatedCategory}
              categoryType={categoryType}
            />
          )}
    </>
  );
};

export default ClassificationSection;
