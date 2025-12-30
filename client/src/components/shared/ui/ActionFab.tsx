import { Fab, SpeedDial, SpeedDialAction, SpeedDialIcon, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { ReactNode } from 'react';

interface FabAction {
  icon: ReactNode;
  name: string;
  onClick: () => void;
}

interface ActionFabProps {
  actions?: FabAction[];
  onClick?: () => void;
}

const ActionFab = ({ actions, onClick }: ActionFabProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!isMobile) {
    return null;
  }

  const positionStyles = {
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 1200,
  } as const;

  if (actions && actions.length > 1) {
    return (
      <SpeedDial
        ariaLabel={'main-action'}
        icon={<SpeedDialIcon />}
        sx={positionStyles}
        direction="up"
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            slotProps={{
              tooltip: {
                open: true,
                title: action.name,
              },
            }}
            icon={action.icon}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    );
  }

  return (
    <Fab color="primary" aria-label={'main-action'} onClick={onClick} sx={positionStyles}>
      <AddIcon />
    </Fab>
  );
};

export default ActionFab;
