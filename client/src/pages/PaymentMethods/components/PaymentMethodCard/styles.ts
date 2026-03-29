import { SxProps, Theme } from '@mui/material/styles';

export const CARD_HEIGHT = 120;

export const getCardStyle = (isPrimary: boolean): SxProps<Theme> => ({
  height: CARD_HEIGHT,
  width: '100%',
  minWidth: '200px',
  maxWidth: '280px',
  overflow: 'hidden',
  borderRadius: 3,
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    borderColor: 'primary.main',
  },
  border: isPrimary ? '1.5px solid' : '0.5px solid',
  borderColor: isPrimary ? 'primary.main' : 'divider',
  boxShadow: isPrimary ? '0 0 0 1px rgba(108,92,231,0.15)' : 'none',
});
