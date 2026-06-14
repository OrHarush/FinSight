import { alpha, SxProps, Theme } from '@mui/material';

export const getCardStyles = (isToday: boolean, needsReview = false): SxProps<Theme> => theme => ({
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
  backgroundColor: needsReview
    ? alpha(theme.palette.primary.main, 0.1)
    : isToday
      ? 'rgba(56, 189, 248, 0.08)'
      : 'default',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '3px',
    background: needsReview ? theme.palette.primary.main : 'transparent',
    transition: 'background 0.2s ease',
  },
  '&:hover': {
    backgroundColor: needsReview ? alpha(theme.palette.primary.main, 0.16) : 'action.hover',
    paddingLeft: '23px',
  },
  '&:hover::before': {
    background: needsReview
      ? theme.palette.primary.main
      : 'linear-gradient(180deg, #7c6bea, #ff6b9d)',
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
