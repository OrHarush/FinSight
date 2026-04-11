import { alpha, IconButton, useTheme } from '@mui/material';

import ExpandPickerButton from '@/components/features/categories/ExpandPickerButton';
import { getSwatchStyle } from '@/components/features/categories/styles';
import Row from '@/components/shared/layout/containers/Row';
import { categoryIconMap } from '@/constants/categoryIconMap';
import { categoryIcons } from '@/constants/CategoryIcons';
import IconGridPicker from '@/pages/Categories/components/CategoryForm/IconGridPicker';

interface QuickIconPickerProps {
  icons: string[];
  selected: string;
  expanded: boolean;
  onSelect: (icon: string) => void;
  onExpand: () => void;
}

const QuickIconPicker = ({
  icons,
  selected,
  expanded,
  onSelect,
  onExpand,
}: QuickIconPickerProps) => {
  const theme = useTheme();

  if (expanded) {
    return (
      <IconGridPicker
        icons={categoryIcons}
        value={selected}
        onChange={onSelect}
      />
    );
  }

  return (
    <Row spacing={1} justifyContent="flex-start" alignItems="center">
      {icons.map(iconName => {
        const IconComp = categoryIconMap[iconName];

        if (!IconComp) {
          return null;
        }

        const isSelected = selected === iconName;

        return (
          <IconButton
            key={iconName}
            type="button"
            onClick={() => onSelect(iconName)}
            sx={{
              ...getSwatchStyle(isSelected),
              color: isSelected ? 'primary.main' : 'text.secondary',
              backgroundColor: isSelected
                ? alpha(theme.palette.primary.main, 0.12)
                : 'transparent',
              '&:hover': {
                backgroundColor: isSelected
                  ? alpha(theme.palette.primary.main, 0.16)
                  : 'action.hover',
              },
            }}
          >
            <IconComp fontSize="small" />
          </IconButton>
        );
      })}
      <ExpandPickerButton onClick={onExpand} />
    </Row>
  );
};

export default QuickIconPicker;
