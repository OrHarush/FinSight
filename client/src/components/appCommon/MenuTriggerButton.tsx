import { IconButton, IconButtonProps } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface MenuTriggerButtonProps extends Omit<IconButtonProps, 'onClick' | 'children'> {
  openMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const MenuTriggerButton = ({ openMenu, size = 'small', ...props }: MenuTriggerButtonProps) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    openMenu(event);
  };

  return (
    <IconButton size={size} onClick={handleClick} {...props}>
      <MoreVertIcon />
    </IconButton>
  );
};

export default MenuTriggerButton;
