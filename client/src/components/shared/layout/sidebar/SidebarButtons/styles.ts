import { SxProps, Theme } from '@mui/material';

export const SidebarButtonsStyles = (activeIndex: number): SxProps<Theme> => ({
  position: 'absolute',
  left: '8px',
  right: '8px',
  height: '44px',
  borderRadius: '12px',
  backgroundColor: 'action.selected',
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: `translateY(${activeIndex * 52 + 12}px)`,
  zIndex: 0,
  opacity: activeIndex >= 0 ? 1 : 0,
  pointerEvents: 'none',
});
