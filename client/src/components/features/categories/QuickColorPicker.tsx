import CheckIcon from '@mui/icons-material/Check';
import { IconButton } from '@mui/material';

import ExpandPickerButton from '@/components/features/categories/ExpandPickerButton';
import { getSwatchStyle } from '@/components/features/categories/styles';
import Row from '@/components/shared/layout/containers/Row';
import ColorGridPicker from '@/pages/Categories/components/CategoryForm/ColorGridPicker';
import { getContrastColor } from '@/utils/color';

interface QuickColorPickerProps {
  colors: readonly string[];
  selected: string;
  expanded: boolean;
  onSelect: (color: string) => void;
  onExpand: () => void;
}

const QuickColorPicker = ({
  colors,
  selected,
  expanded,
  onSelect,
  onExpand,
}: QuickColorPickerProps) => {
  if (expanded) {
    return <ColorGridPicker value={selected} onChange={onSelect} />;
  }

  return (
    <Row spacing={1} justifyContent="flex-start" alignItems="center">
      {colors.map(color => {
        const isSelected = selected === color;

        return (
          <IconButton
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            sx={{
              ...getSwatchStyle(isSelected),
              backgroundColor: color,
              '&:hover': { backgroundColor: color, opacity: 0.9 },
            }}
          >
            {isSelected && (
              <CheckIcon sx={{ color: getContrastColor(color), fontSize: 18 }} />
            )}
          </IconButton>
        );
      })}
      <ExpandPickerButton onClick={onExpand} />
    </Row>
  );
};

export default QuickColorPicker;
