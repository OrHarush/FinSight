import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, ClickAwayListener, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { type ReactNode, useState } from 'react';

export interface InfoTooltipProps {
  content: string | ReactNode;
  size?: 'small' | 'medium';
  maxWidth?: number;
}

const SIZES = { small: 20, medium: 24 } as const;

const DEFAULT_MAX_WIDTH = 240;

const buildSlotProps = (maxWidth: number) => ({
  tooltip: {
    sx: {
      bgcolor: '#1e293b',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.08)',
      fontSize: '0.8rem',
      maxWidth,
      px: 1.5,
      py: 1,
    },
  },
  arrow: {
    sx: { color: '#1e293b' },
  },
});

const InfoTooltip = ({ content, size = 'small', maxWidth = DEFAULT_MAX_WIDTH }: InfoTooltipProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const dim = SIZES[size];
  const slotProps = buildSlotProps(maxWidth);

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(prev => !prev);
  };

  const button = (
    <Box
      component="span"
      role="button"
      tabIndex={0}
      onClick={isMobile ? toggleOpen : undefined}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dim,
        height: dim,
        cursor: isMobile ? 'pointer' : 'help',
        flexShrink: 0,
        color: 'text.secondary',
        userSelect: 'none',
        transition: 'color 0.15s',
        '&:hover': { color: 'primary.main' },
        '&:active': { color: 'primary.main' },
      }}
    >
      <HelpOutlineIcon sx={{ fontSize: dim, color: 'inherit' }} />
    </Box>
  );

  if (isMobile) {
    return (
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Tooltip
          title={content}
          placement="top"
          arrow
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          slotProps={slotProps}
        >
          {button}
        </Tooltip>
      </ClickAwayListener>
    );
  }

  return (
    <Tooltip title={content} placement="top" arrow slotProps={slotProps}>
      {button}
    </Tooltip>
  );
};

export default InfoTooltip;
