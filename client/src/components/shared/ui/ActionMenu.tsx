import { Menu, MenuItem, MenuProps, Tooltip } from '@mui/material';

export interface ActionMenuItem {
  label: string;
  onClick: () => void;
  color?: 'default' | 'error';
  disabled?: boolean;
  tooltip?: string;
}

interface ActionMenuProps extends Omit<MenuProps, 'open'> {
  open: boolean;
  onClose: (event: React.MouseEvent<HTMLElement>) => void;
  items: ActionMenuItem[];
}

const ActionMenu = ({ open, onClose, items, ...menuProps }: ActionMenuProps) => (
  <Menu open={open} onClose={onClose} {...menuProps}>
    {items.map((item, index) => {
      const menuItem = (
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
      );

      if (item.disabled && item.tooltip) {
        return (
          <Tooltip key={index} title={item.tooltip} placement="left" arrow>
            <span>{menuItem}</span>
          </Tooltip>
        );
      }

      return menuItem;
    })}
  </Menu>
);

export default ActionMenu;
