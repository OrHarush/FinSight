import { Menu, MenuItem, MenuProps } from '@mui/material';

export interface ActionMenuItem {
  label: string;
  onClick: () => void;
  color?: 'default' | 'error';
  disabled?: boolean;
}

interface ActionMenuProps extends Omit<MenuProps, 'open'> {
  open: boolean;
  onClose: (event: React.MouseEvent<HTMLElement>) => void;
  items: ActionMenuItem[];
}

const ActionMenu = ({ open, onClose, items, ...menuProps }: ActionMenuProps) => (
    <Menu open={open} onClose={onClose} {...menuProps}>
      {items.map((item, index) => (
        <MenuItem
          key={index}
          disabled={item.disabled}
          onClick={e => {
            onClose(e);
            item.onClick();
          }}
          sx={item.color === 'error' ? { color: 'error.main' } : undefined}
        >
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );

export default ActionMenu;
