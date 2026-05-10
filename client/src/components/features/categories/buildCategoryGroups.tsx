import CategoryIcon from '@mui/icons-material/Category';
import { Typography } from '@mui/material';
import { TFunction } from 'i18next';
import { ElementType } from 'react';

import { SelectOptionGroup } from '@/components/shared/inputs/RHFGroupedSelect';
import Row from '@/components/shared/layout/containers/Row';
import { categoryIconMap } from '@/constants/categoryIconMap';
import { CategoryDto } from '@/types/Category';
import { getCategoryDisplayName } from '@/utils/entities/category';

const buildOption = (category: CategoryDto, displayName: string) => {
  const IconComponent: ElementType =
    (category.icon && categoryIconMap[category.icon]) || CategoryIcon;

  return {
    label: displayName,
    value: category._id,
    design: (
      <Row spacing={1} alignItems="center" sx={{ minWidth: 0, overflow: 'hidden' }}>
        <IconComponent sx={{ fontSize: '1.3rem', color: category.color, flexShrink: 0 }} />
        <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {displayName}
        </Typography>
      </Row>
    ),
  };
};

export const buildCategoryGroups = (
  categories: CategoryDto[],
  tCategories: TFunction<'categories'>
): SelectOptionGroup[] => {
  const withDisplay = categories.map(c => ({
    category: c,
    displayName: getCategoryDisplayName(c, tCategories),
  }));

  const savings = withDisplay
    .filter(x => x.category.type === 'Savings')
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  const nonSavings = withDisplay.filter(x => x.category.type !== 'Savings');

  const frequent = nonSavings
    .filter(x => x.category.isFrequent)
    .sort(
      (a, b) =>
        (b.category.usageCount ?? 0) - (a.category.usageCount ?? 0) ||
        a.displayName.localeCompare(b.displayName)
    );

  const rest = nonSavings
    .filter(x => !x.category.isFrequent)
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  const groups: SelectOptionGroup[] = [];

  if (frequent.length > 0) {
    groups.push({
      groupLabel: tCategories('groups.frequent'),
      options: frequent.map(x => buildOption(x.category, x.displayName)),
    });
  }

  groups.push({
    groupLabel: frequent.length > 0 ? tCategories('groups.all') : '',
    options: rest.map(x => buildOption(x.category, x.displayName)),
  });

  if (savings.length > 0) {
    groups.push({
      groupLabel: tCategories('groups.savings'),
      options: savings.map(x => buildOption(x.category, x.displayName)),
    });
  }

  return groups.filter(g => g.options.length > 0);
};
