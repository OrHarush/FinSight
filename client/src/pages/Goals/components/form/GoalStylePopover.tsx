import { Divider, Popover } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import Column from '@/components/shared/layout/containers/Column';
import ColorGridPicker from '@/pages/Categories/components/CategoryForm/ColorGridPicker';
import IconGridPicker from '@/pages/Categories/components/CategoryForm/IconGridPicker';

interface GoalStylePopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  icons: string[];
  onIconUserSelected: () => void;
}

const GoalStylePopover = ({
  anchorEl,
  onClose,
  icons,
  onIconUserSelected,
}: GoalStylePopoverProps) => {
  const { control } = useFormContext();

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      slotProps={{
        paper: {
          sx: {
            p: 2,
            borderRadius: 2,
            width: 280,
          },
        },
      }}
    >
      <Column spacing={2}>
        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <IconGridPicker
              icons={icons}
              value={field.value}
              onChange={value => {
                onIconUserSelected();
                field.onChange(value);
              }}
            />
          )}
        />
        <Divider />
        <Controller
          name="color"
          control={control}
          render={({ field }) => <ColorGridPicker value={field.value} onChange={field.onChange} />}
        />
      </Column>
    </Popover>
  );
};

export default GoalStylePopover;
