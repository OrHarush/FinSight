import { alpha, SxProps, Theme } from '@mui/material';

export const BAR_HEIGHT = 60;

export const getBottomNavContainerStyle = (): SxProps<Theme> => ({
  flexShrink: 0,
  borderTop: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
  overflow: 'visible',
  paddingBottom: 'env(safe-area-inset-bottom)',
  zIndex: theme => theme.zIndex.appBar,
});

export const getBottomNavRowStyle = (): SxProps<Theme> => ({
  position: 'relative',
  height: BAR_HEIGHT,
  alignItems: 'stretch',
  overflow: 'visible',
});

export const getCenterSlotStyle = (): SxProps<Theme> => ({
  flex: 1,
  minWidth: 0,
  alignItems: 'center',
  justifyContent: 'center',
});

export const getItemButtonStyle = (): SxProps<Theme> => ({
  flex: 1,
  minWidth: 0,
  height: '100%',
  borderRadius: 0,
});

export const getItemContentStyle = (): SxProps<Theme> => ({
  position: 'relative',
  zIndex: 1,
  minWidth: 0,
  maxWidth: '100%',
  px: 0.5,
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2px',
});

export const INDICATOR_INSET_BLOCK = 7;
export const INDICATOR_INSET_INLINE = 8;
export const INDICATOR_RADIUS = 14;

export const getActiveIndicatorColor = (theme: Theme): string =>
  alpha(theme.palette.primary.main, 0.16);

export const getItemIconStyle = (isActive: boolean): SxProps<Theme> => ({
  fontSize: 24,
  color: isActive ? 'primary.main' : 'text.secondary',
  transition: 'color 0.25s ease',
});

export const getItemLabelStyle = (isActive: boolean): SxProps<Theme> => ({
  fontSize: '0.625rem',
  lineHeight: 1,
  fontWeight: isActive ? 700 : 500,
  color: isActive ? 'primary.main' : 'text.secondary',
  maxWidth: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  transition: 'color 0.25s ease',
});

export const getCreateButtonStyle = (): SxProps<Theme> => ({
  width: 56,
  height: 56,
  transform: 'translateY(-18px)',
  boxShadow: theme => `0 6px 16px ${alpha(theme.palette.primary.main, 0.45)}`,
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:active': {
    transform: 'translateY(-18px) scale(0.92)',
  },
});
