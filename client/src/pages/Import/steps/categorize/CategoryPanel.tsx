import { Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import ScrollableColumn from '@/components/shared/layout/containers/ScrollableColumn';
import { useCategoryName } from '@/hooks/entities/useCategoryName';
import CategoryCard from '@/pages/Import/steps/categorize/CategoryCard';
import { WizardRow } from '@/pages/Import/types/importWizard';
import { CategoryDto } from '@/types/Category';

interface CategoryPanelProps {
  categories: CategoryDto[];
  rows: WizardRow[];
  draggingIndices: number[];
  overId: string | null;
  onSetOverId: (id: string | null) => void;
  onAssign: (categoryId: string, indices: number[]) => void;
}

const CategoryPanel = ({
  categories,
  rows,
  draggingIndices,
  overId,
  onSetOverId,
  onAssign,
}: CategoryPanelProps) => {
  const { t } = useTranslation('transactions');
  const getCategoryName = useCategoryName();

  const selectedIndices = rows
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => r.selected)
    .map(({ i }) => i);

  const assignSelected = (categoryId: string) => {
    if (selectedIndices.length > 0) {
      onAssign(categoryId, selectedIndices);
    }
  };

  const assignDragged = (categoryId: string) => {
    if (draggingIndices.length > 0) {
      onAssign(categoryId, draggingIndices);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{ flex: 1, borderRadius: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      <ScrollableColumn flex={1} sx={{ p: 2 }}>
        <Column spacing={1}>
          {categories.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
              {t('importWizard.categorize.noCategories')}
            </Typography>
          ) : (
            categories.map(category => (
              <CategoryCard
                key={category._id}
                category={category}
                name={getCategoryName(category)}
                assignedRows={rows.filter(r => r.categoryId === category._id)}
                isOver={overId === category._id}
                onAssign={() => assignSelected(category._id)}
                onDragEnter={() => onSetOverId(category._id)}
                onDragLeave={() => onSetOverId(null)}
                onDrop={() => assignDragged(category._id)}
              />
            ))
          )}
        </Column>
      </ScrollableColumn>
    </Paper>
  );
};

export default CategoryPanel;
