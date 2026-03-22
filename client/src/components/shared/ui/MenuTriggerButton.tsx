import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, IconButtonProps, useTheme } from '@mui/material';

interface MenuTriggerButtonProps extends Omit<IconButtonProps, 'onClick' | 'children'> {
  openMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const MenuTriggerButton = ({ openMenu, size = 'small' }: MenuTriggerButtonProps) => {
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    openMenu(event);
  };

  return (
    <IconButton
      size={size}
      onClick={handleClick}
      sx={{
        width: '32px',
        height: '32px',
        position: 'absolute',
        top: 8,
        right: 8,
        border: `solid 2px ${theme.palette.divider}`,
        borderRadius: '12px',
      }}
    >
      <MoreVertIcon />
    </IconButton>
  );
};

export default MenuTriggerButton;
