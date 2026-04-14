import { TransactionFormValues } from '@lyra/shared';
import { Grid, InputLabel, Skeleton } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import CategoriesSelect from '@/components/features/categories/CategoriesSelect';
import CreateCategoryBottomSheet from '@/components/features/categories/CreateCategoryBottomSheet';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import { useCategories } from '@/hooks/entities/useCategories';
import CreateCategoryDialog from '@/pages/Categories/components/dialogs/CreateCategoryDialog';
import { CategoryDto } from '@/types/Category';

interface ClassificationSectionProps {
  isFullWidth?: boolean;
}

const ClassificationSection = ({ isFullWidth = false }: ClassificationSectionProps) => {
  const { t } = useTranslation('transactions');
  const { control, setValue } = useFormContext<TransactionFormValues>();
  const { categories, isLoading } = useCategories();
  const isSmallScreen = useIsSmallScreen();
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);

  const transactionType = useWatch({ control, name: 'type' });

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setValue('category', null as unknown as string, { shouldDirty: true });
  }, [transactionType]);

  const filteredCategories = categories.filter(
    c => c.type.toLowerCase() === transactionType?.toLowerCase()
  );

  const gridSize = { xs: 12, sm: isFullWidth ? 12 : 6 };

  const openCreateCategory = () => setCreateCategoryOpen(true);
  const closeCreateCategory = () => setCreateCategoryOpen(false);

  const selectCreatedCategory = (category: CategoryDto) => {
    setValue('category', category._id, { shouldValidate: true });
    setCreateCategoryOpen(false);
  };

  const categoryType = transactionType === 'Transfer' ? 'Expense' : transactionType;

  return (
    <>
      {!isLoading ? (
        <Grid size={gridSize}>
          <CategoriesSelect
            filteredCategories={filteredCategories}
            onCreateNew={openCreateCategory}
          />
        </Grid>
      ) : (
        <Grid size={gridSize}>
          <InputLabel>{t('fields.category')}</InputLabel>
          <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
        </Grid>
      )}

      {isSmallScreen ? (
        <CreateCategoryBottomSheet
          open={createCategoryOpen}
          transactionType={categoryType}
          onClose={closeCreateCategory}
          onCreated={selectCreatedCategory}
        />
      ) : (
        <CreateCategoryDialog
          isOpen={createCategoryOpen}
          closeDialog={closeCreateCategory}
          onCreated={selectCreatedCategory}
          categoryType={categoryType}
        />
      )}
    </>
  );
};

export default ClassificationSection;
