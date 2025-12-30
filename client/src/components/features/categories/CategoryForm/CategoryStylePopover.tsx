import { Divider, Popover } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import Column from '@/components/shared/layout/containers/Column';
import IconGridPicker from '@/components/features/categories/CategoryForm/IconGridPicker';
import ColorGridPicker from '@/components/features/categories/CategoryForm/ColorGridPicker';

interface CategoryStylePopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  icons: string[];
}

const CategoryStylePopover = ({ anchorEl, onClose, icons }: CategoryStylePopoverProps) => {
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
            <IconGridPicker icons={icons} value={field.value} onChange={field.onChange} />
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

export default CategoryStylePopover;
