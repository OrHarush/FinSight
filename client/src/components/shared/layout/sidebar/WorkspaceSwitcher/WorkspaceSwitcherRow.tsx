import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { ButtonBase, CircularProgress, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

import Row from '@/components/shared/layout/containers/Row';
import WorkspaceMonogramBadge from '@/components/shared/layout/sidebar/WorkspaceSwitcher/WorkspaceMonogramBadge';
import { WorkspaceListItemDto } from '@/types/Workspace';

interface WorkspaceSwitcherRowProps {
  item: WorkspaceListItemDto;
  isActive: boolean;
  isLoading: boolean;
  disabled: boolean;
  onSelect: () => void;
}

const WorkspaceSwitcherRow = ({
  item,
  isActive,
  isLoading,
  disabled,
  onSelect,
}: WorkspaceSwitcherRowProps) => {
  const theme = useTheme();

  return (
    <ButtonBase
      onClick={onSelect}
      disabled={disabled}
      sx={{
        width: '100%',
        justifyContent: 'flex-start',
        px: 1.25,
        py: 1,
        borderRadius: 1.5,
        backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
        },
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
        opacity: disabled && !isLoading ? 0.5 : 1,
      }}
    >
      <Row spacing={1.25} alignItems="center" sx={{ width: '100%', minWidth: 0 }}>
        <WorkspaceMonogramBadge
          name={item.workspace.name}
          color={item.workspace.color}
          icon={item.workspace.icon}
          size={28}
        />
        <Typography
          variant="body2"
          fontWeight={isActive ? 600 : 500}
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'start',
          }}
        >
          {item.workspace.name}
        </Typography>
        {isLoading ? (
          <CircularProgress size={16} />
        ) : (
          isActive && (
            <CheckRoundedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
          )
        )}
      </Row>
    </ButtonBase>
  );
};

export default WorkspaceSwitcherRow;
