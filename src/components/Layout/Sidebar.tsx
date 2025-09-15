import { Divider, Drawer, List, ListItem
  , ListItemButton, Toolbar, ListItemText } from '@mui/material';

const SIDEBAR_NAVIGATION = ['Dashboard', 'Transactions', 'Planner', 'Reports', 'Accounts'];

const Sidebar = () => {
  return (
    <Drawer
      sx={{
        width: '255px',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: '255px',
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Divider />
      <List>
        {SIDEBAR_NAVIGATION.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;