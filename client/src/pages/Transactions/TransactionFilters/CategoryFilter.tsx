import CategoryIcon from '@mui/icons-material/Category';
import { Typography } from '@mui/material';
import { ElementType } from 'react';
import { useTranslation } from 'react-i18next';

import MultiSelectChip, { MultiSelectChipItem } from '@/components/shared/inputs/MultiSelectChip';
import Row from '@/components/shared/layout/containers/Row';
import { categoryIconMap } from '@/constants/categoryIconMap';
import { useCategories } from '@/hooks/entities/useCategories';
import { useCategoryName } from '@/hooks/entities/useCategoryName';
import { getFilterChipLabel } from '@/utils/transactionUtils';

interface CategoryFilterProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

const CategoryFilter = ({ selectedIds, onChange }: CategoryFilterProps) => {
  const { t: tTx } = useTranslation('transactions');
  const { categories } = useCategories();
  const getCategoryName = useCategoryName();

  const items: MultiSelectChipItem[] = categories.map(cat => {
    const IconComponent: ElementType = (cat.icon && categoryIconMap[cat.icon]) || CategoryIcon;

    return {
      id: cat._id,
      renderRow: () => (
        <Row spacing={1.5} alignItems="center">
          <IconComponent sx={{ color: cat.color, fontSize: '20px' }} />
          <Typography variant="body2">{getCategoryName(cat)}</Typography>
        </Row>
      ),
    };
  });

  return (
    <MultiSelectChip
      label={getFilterChipLabel(
        selectedIds.length,
        tTx('filters.allCategories'),
        tTx,
        'filters.selectedCategories'
      )}
      selectedIds={selectedIds}
      onChange={onChange}
      items={items}
    />
  );
};

export default CategoryFilter;
