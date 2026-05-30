import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Box, ButtonBase, Divider, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import WorkspaceSwitcherRow from '@/components/shared/layout/sidebar/WorkspaceSwitcher/WorkspaceSwitcherRow';
import { WorkspaceListItemDto } from '@/types/Workspace';

interface WorkspaceSwitcherMenuProps {
  items: WorkspaceListItemDto[];
  activeWorkspaceId?: string;
  pendingWorkspaceId: string | null;
  onSelect: (workspaceId: string) => void;
  onCreateSharedHousehold: () => void;
}

const WorkspaceSwitcherMenu = ({
  items,
  activeWorkspaceId,
  pendingWorkspaceId,
  onSelect,
  onCreateSharedHousehold,
}: WorkspaceSwitcherMenuProps) => {
  const { t } = useTranslation('user');
  const theme = useTheme();

  return (
    <Column
      spacing={0.5}
      sx={{
        mt: 1,
        p: 0.75,
        border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
        borderRadius: 2,
        backgroundColor: 'background.paper',
      }}
    >
      {items.map(item => (
        <WorkspaceSwitcherRow
          key={item.workspace._id}
          item={item}
          isActive={item.workspace._id === activeWorkspaceId}
          isLoading={pendingWorkspaceId === item.workspace._id}
          disabled={pendingWorkspaceId !== null}
          onSelect={() => onSelect(item.workspace._id)}
        />
      ))}
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Divider sx={{ my: 0.5 }} />
        <ButtonBase
          onClick={onCreateSharedHousehold}
          disabled={pendingWorkspaceId !== null}
          sx={{
            width: '100%',
            justifyContent: 'flex-start',
            px: 1.25,
            py: 1,
            borderRadius: 1.5,
            color: 'primary.main',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
            '&:focus-visible': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: 2,
            },
          }}
        >
          <Row spacing={1.25} alignItems="center" sx={{ width: '100%' }}>
            <AddRoundedIcon sx={{ fontSize: 22 }} />
            <Typography variant="body2" fontWeight={600} sx={{ textAlign: 'start' }}>
              {t('sharedHousehold.switcher.openCreate')}
            </Typography>
          </Row>
        </ButtonBase>
      </Box>
    </Column>
  );
};

export default WorkspaceSwitcherMenu;
