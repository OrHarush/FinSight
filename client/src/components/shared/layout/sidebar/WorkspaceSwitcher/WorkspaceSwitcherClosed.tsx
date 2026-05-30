import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { ButtonBase, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import WorkspaceMonogramBadge from '@/components/shared/layout/sidebar/WorkspaceSwitcher/WorkspaceMonogramBadge';
import { WorkspaceListItemDto } from '@/types/Workspace';

interface WorkspaceSwitcherClosedProps {
  active: WorkspaceListItemDto;
  isOpen: boolean;
  onToggle: () => void;
}

const WorkspaceSwitcherClosed = ({
  active,
  isOpen,
  onToggle,
}: WorkspaceSwitcherClosedProps) => {
  const { t } = useTranslation('user');
  const theme = useTheme();

  const isPersonal = active.workspace.type === 'personal';
  const caption = isPersonal
    ? t('sharedHousehold.switcher.personalCaption')
    : t('sharedHousehold.switcher.sharedCaption', { count: active.memberCount });

  return (
    <ButtonBase
      onClick={onToggle}
      aria-label={t('sharedHousehold.switcher.ariaOpen')}
      aria-expanded={isOpen}
      sx={{
        width: '100%',
        justifyContent: 'flex-start',
        px: 1.25,
        py: 1,
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
        backgroundColor: alpha(theme.palette.text.primary, 0.03),
        '&:hover': {
          backgroundColor: alpha(theme.palette.text.primary, 0.06),
        },
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
      }}
    >
      <Row spacing={1.25} alignItems="center" sx={{ width: '100%', minWidth: 0 }}>
        <WorkspaceMonogramBadge
          name={active.workspace.name}
          color={active.workspace.color}
          icon={active.workspace.icon}
          size={36}
        />
        <Column sx={{ minWidth: 0, flex: 1, textAlign: 'start' }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {active.workspace.name}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {caption}
          </Typography>
        </Column>
        <ExpandMoreRoundedIcon
          sx={{
            color: 'text.secondary',
            transition: 'transform 200ms ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
          }}
        />
      </Row>
    </ButtonBase>
  );
};

export default WorkspaceSwitcherClosed;
