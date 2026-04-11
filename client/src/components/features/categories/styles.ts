import { SxProps, Theme } from '@mui/material';

export const getSwatchStyle = (isSelected: boolean): SxProps<Theme> => ({
  width: 36,
  height: 36,
  borderRadius: 1,
  border: isSelected ? '2px solid' : '2px solid transparent',
  borderColor: isSelected ? 'primary.main' : 'transparent',
});
