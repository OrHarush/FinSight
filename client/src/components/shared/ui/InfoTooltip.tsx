import { Box, ClickAwayListener, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { type ReactNode, useState } from 'react';

export interface InfoTooltipProps {
  content: string | ReactNode;
  size?: 'small' | 'medium';
}

const SIZES = { small: 16, medium: 20 } as const;

const TOOLTIP_SLOT_PROPS = {
  tooltip: {
    sx: {
      bgcolor: '#1e293b',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.08)',
      fontSize: '0.8rem',
      maxWidth: 240,
      px: 1.5,
      py: 1,
    },
  },
  arrow: {
    sx: { color: '#1e293b' },
  },
};

const InfoTooltip = ({ content, size = 'small' }: InfoTooltipProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const dim = SIZES[size];

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
        borderRadius: '50%',
        border: '1.5px solid currentColor',
        fontSize: dim * 0.62,
        fontWeight: 700,
        lineHeight: 1,
        cursor: isMobile ? 'pointer' : 'help',
        flexShrink: 0,
        color: 'text.secondary',
        userSelect: 'none',
        transition: 'color 0.15s',
        '&:hover': { color: 'primary.main' },
        '&:active': { color: 'primary.main' },
      }}
    >
      <Box component="span" sx={{ display: 'inline-block', transform: 'translateY(1px)' }}>
        ?
      </Box>
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
          slotProps={TOOLTIP_SLOT_PROPS}
        >
          {button}
        </Tooltip>
      </ClickAwayListener>
    );
  }

  return (
    <Tooltip title={content} placement="top" arrow slotProps={TOOLTIP_SLOT_PROPS}>
      {button}
    </Tooltip>
  );
};

export default InfoTooltip;
