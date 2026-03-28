import { Chip, Popover, useTheme } from '@mui/material';
import { useState } from 'react';

import MultiSelectChipList, {
  MultiSelectChipItem,
} from '@/components/shared/inputs/MultiSelectChip/MultiSelectChipList';
import { useIsMobile } from '@/hooks/common/useIsMobile';

import { getActiveChipStyle, getPopoverPaperStyle } from './styles';

interface MultiSelectChipProps {
  label: string;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  items: MultiSelectChipItem[];
  icon?: React.ReactElement;
}

const MultiSelectChip = ({ label, selectedIds, onChange, items, icon }: MultiSelectChipProps) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isMobile = useIsMobile();
  const isActive = selectedIds.length > 0;

  const chipLabel = label;

  const openChipMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeChipMenu = () => {
    setAnchorEl(null);
  };

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(s => s !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <>
      <Chip
        label={chipLabel}
        icon={icon}
        variant="outlined"
        onClick={openChipMenu}
        sx={getActiveChipStyle(isMobile, isActive, theme)}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={closeChipMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: getPopoverPaperStyle(theme) } }}
      >
        <MultiSelectChipList items={items} selectedIds={selectedIds} onToggle={handleToggle} />
      </Popover>
    </>
  );
};

export default MultiSelectChip;
