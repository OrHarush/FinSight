import { ButtonBase } from '@mui/material';
import { ElementType, useState } from 'react';

import { categoryIconMap } from '@/constants/categoryIconMap';
import { categoryIcons } from '@/constants/CategoryIcons';
import GoalStylePopover from '@/pages/Goals/components/form/GoalStylePopover';

interface GoalStyleTriggerProps {
  icon?: string | null;
  color?: string | null;
  onIconUserSelected: () => void;
}

const DEFAULT_ICON = 'TrackChanges';
const FALLBACK_COLOR = '#9ca3af';

const resolveIcon = (icon?: string | null): ElementType =>
  (icon && categoryIconMap[icon]) || categoryIconMap[DEFAULT_ICON];

const GoalStyleTrigger = ({ icon, color, onIconUserSelected }: GoalStyleTriggerProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const IconComponent = resolveIcon(icon);
  const tint = color ?? FALLBACK_COLOR;

  const openPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => setAnchorEl(null);

  return (
    <>
      <ButtonBase
        type="button"
        onClick={openPopover}
        sx={{
          width: 56,
          height: 56,
          borderRadius: '12px',
          backgroundColor: `${tint}20`,
          transition: 'background-color 0.15s ease, transform 0.1s ease',
          '&:hover': { backgroundColor: `${tint}30` },
          '&:active': { transform: 'scale(0.97)' },
        }}
        aria-label="Pick icon and color"
      >
        <IconComponent sx={{ color: tint, fontSize: 28 }} />
      </ButtonBase>
      <GoalStylePopover
        anchorEl={anchorEl}
        onClose={closePopover}
        icons={categoryIcons}
        onIconUserSelected={onIconUserSelected}
      />
    </>
  );
};

export default GoalStyleTrigger;
