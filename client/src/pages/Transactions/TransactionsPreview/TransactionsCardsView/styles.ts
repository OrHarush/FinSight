import { SxProps, Theme } from '@mui/material';

export const getCardStyles = (isToday: boolean): SxProps<Theme> => ({
  p: '18px 20px',
  borderRadius: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  position: 'relative',
  boxShadow: 'none',
  borderBottom: '1px solid',
  borderColor: 'divider',
  backgroundColor: isToday ? 'rgba(56, 189, 248, 0.08)' : 'default',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '3px',
    background: 'transparent',
    transition: 'background 0.2s ease',
  },
  '&:hover': {
    backgroundColor: 'action.hover',
    paddingLeft: '23px',
  },
  '&:hover::before': {
    background: 'linear-gradient(180deg, #7c6bea, #ff6b9d)',
  },
  '.swipeable-wrapper:first-of-type &': {
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
  },
  '.swipeable-wrapper:last-of-type &': {
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
    borderBottom: 'none',
  },
});
