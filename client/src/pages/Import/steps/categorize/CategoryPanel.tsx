import { Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import { useCategoryName } from '@/hooks/entities/useCategoryName';
import { WizardRow } from '@/pages/Import/ImportWizardContext';
import CategoryCard from '@/pages/Import/steps/categorize/CategoryCard';
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

  const handleClick = (categoryId: string) => {
    if (selectedIndices.length > 0) {
      onAssign(categoryId, selectedIndices);
    }
  };

  const handleDrop = (categoryId: string) => {
    if (draggingIndices.length > 0) {
      onAssign(categoryId, draggingIndices);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{ width: 260, flexShrink: 0, borderRadius: 2, overflow: 'auto', p: 1.5 }}
    >
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
              assignedCount={rows.filter(r => r.categoryId === category._id).length}
              isOver={overId === category._id}
              onClick={() => handleClick(category._id)}
              onDragEnter={() => onSetOverId(category._id)}
              onDragLeave={() => onSetOverId(null)}
              onDrop={() => handleDrop(category._id)}
            />
          ))
        )}
      </Column>
    </Paper>
  );
};

export default CategoryPanel;
