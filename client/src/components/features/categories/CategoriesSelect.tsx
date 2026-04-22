import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CategoryIcon from '@mui/icons-material/Category';
import { Divider, MenuItem, Typography } from '@mui/material';
import { ElementType } from 'react';
import { useTranslation } from 'react-i18next';

import RHFGroupedSelect from '@/components/shared/inputs/RHFGroupedSelect';
import RHFSelect from '@/components/shared/inputs/RHFSelect';
import Row from '@/components/shared/layout/containers/Row';
import { categoryIconMap } from '@/constants/categoryIconMap';
import { useCategories } from '@/hooks/entities/useCategories';
import { useCategoryName } from '@/hooks/entities/useCategoryName';
import { CategoryDto } from '@/types/Category';

import { buildCategoryGroups } from './buildCategoryGroups';

interface CategoriesSelectProps {
  filteredCategories?: CategoryDto[];
  openCreateNewCategory?: () => void;
  grouped?: boolean;
}

const CategoriesSelect = ({
  filteredCategories,
  openCreateNewCategory,
  grouped = false,
}: CategoriesSelectProps) => {
  const { t } = useTranslation('transactions');
  const { t: tCategories } = useTranslation('categories');
  const { categories } = useCategories();
  const getCategoryName = useCategoryName();

  const source = filteredCategories ?? categories;

  if (grouped) {
    const groups = buildCategoryGroups(source, tCategories);
    const extraItems = openCreateNewCategory
      ? [
          <Divider key="create-divider" />,
          <MenuItem key="create-new" onClick={openCreateNewCategory} sx={{ color: 'primary.main' }}>
            <Row spacing={1} alignItems="center">
              <AddCircleOutlineIcon fontSize="small" />
              <Typography fontWeight={600}>{tCategories('actions.createNew')}</Typography>
            </Row>
          </MenuItem>,
        ]
      : undefined;

    return (
      <RHFGroupedSelect
        name="category"
        label={t('fields.category')}
        required
        groups={groups}
        extraItems={extraItems}
      />
    );
  }

  const categoriesToDisplay = [...source].reverse();

  return (
    <RHFSelect
      name="category"
      label={t('fields.category')}
      required
      options={categoriesToDisplay.map(category => {
        const IconComponent: ElementType =
          (category.icon && categoryIconMap[category.icon]) || CategoryIcon;

        return {
          label: category.name,
          value: category._id,
          design: (
            <Row spacing={1} alignItems={'center'} sx={{ minWidth: 0, overflow: 'hidden' }}>
              <IconComponent sx={{ fontSize: '1.3rem', color: category.color, flexShrink: 0 }} />
              <Typography
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {getCategoryName(category)}
              </Typography>
            </Row>
          ),
        };
      })}
      extraItems={
        openCreateNewCategory && [
          <Divider key="create-divider" />,
          <MenuItem key="create-new" onClick={openCreateNewCategory} sx={{ color: 'primary.main' }}>
            <Row spacing={1} alignItems="center">
              <AddCircleOutlineIcon fontSize="small" />
              <Typography fontWeight={600}>{tCategories('actions.createNew')}</Typography>
            </Row>
          </MenuItem>,
        ]
      }
    />
  );
};

export default CategoriesSelect;
