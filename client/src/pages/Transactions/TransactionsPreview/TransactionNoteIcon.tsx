import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Box, ClickAwayListener, Tooltip } from '@mui/material';
import { useState } from 'react';

import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';

interface TransactionNoteIconProps {
  note: string;
}

const TransactionNoteIcon = ({ note }: TransactionNoteIconProps) => {
  const isSmallScreen = useIsSmallScreen();
  const [open, setOpen] = useState(false);

  const iconSx = {
    fontSize: isSmallScreen ? 16 : 19,
    color: 'text.secondary',
    opacity: 0.6,
    flexShrink: 0,
  };

  if (!isSmallScreen) {
    return (
      <Tooltip title={note} arrow placement="top">
        <Box component="span" sx={{ display: 'inline-flex' }}>
          <ChatBubbleOutlineIcon sx={iconSx} />
        </Box>
      </Tooltip>
    );
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Tooltip
        title={note}
        open={open}
        arrow
        placement="top"
        disableFocusListener
        disableHoverListener
        disableTouchListener
      >
        <Box
          component="span"
          sx={{ display: 'inline-flex', cursor: 'pointer' }}
          onClick={e => {
            e.stopPropagation();
            setOpen(prev => !prev);
          }}
        >
          <ChatBubbleOutlineIcon sx={iconSx} />
        </Box>
      </Tooltip>
    </ClickAwayListener>
  );
};

export default TransactionNoteIcon;
