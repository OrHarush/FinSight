import { Collapse } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CreateSharedHouseholdDialog from '@/components/features/users/SettingsModal/CreateSharedHouseholdDialog';
import Column from '@/components/shared/layout/containers/Column';
import { useSidebar } from '@/components/shared/layout/sidebar/SidebarContext';
import WorkspaceMonogramBadge from '@/components/shared/layout/sidebar/WorkspaceSwitcher/WorkspaceMonogramBadge';
import WorkspaceSwitcherClosed from '@/components/shared/layout/sidebar/WorkspaceSwitcher/WorkspaceSwitcherClosed';
import WorkspaceSwitcherMenu from '@/components/shared/layout/sidebar/WorkspaceSwitcher/WorkspaceSwitcherMenu';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useOpen } from '@/hooks/common/useOpen';
import { useFetch } from '@/hooks/common/useFetch';
import { useSetActiveWorkspace } from '@/components/shared/layout/sidebar/WorkspaceSwitcher/hooks/useSetActiveWorkspace';
import { useAuth } from '@/providers/AuthProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { WorkspaceListItemDto } from '@/types/Workspace';

const resolveActive = (
  items: WorkspaceListItemDto[],
  activeWorkspaceId: string | undefined
): WorkspaceListItemDto => {
  if (activeWorkspaceId) {
    const match = items.find(item => item.workspace._id === activeWorkspaceId);

    if (match) {
      return match;
    }
  }

  const personal = items.find(item => item.workspace.type === 'personal');

  return personal ?? items[0];
};

const WorkspaceSwitcher = () => {
  const { t } = useTranslation('user');
  const { user, updateUser } = useAuth();
  const { expanded: sidebarExpanded } = useSidebar();
  const { alertError } = useSnackbar();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [pendingWorkspaceId, setPendingWorkspaceId] = useState<string | null>(null);
  const [isCreateOpen, openCreate, closeCreate] = useOpen();

  const { data: items } = useFetch<WorkspaceListItemDto[]>({
    url: API_ROUTES.WORKSPACES,
    queryKey: queryKeys.workspaces(),
  });

  const setActive = useSetActiveWorkspace({
    onSuccess: workspaceId => {
      if (user) {
        updateUser({ ...user, activeWorkspaceId: workspaceId });
      }

      setPendingWorkspaceId(null);
      setMenuOpen(false);
    },
    onError: () => {
      setPendingWorkspaceId(null);
      alertError(t('sharedHousehold.switcher.switchError'));
    },
  });

  if (!items || items.length < 2) {
    return null;
  }

  const active = resolveActive(items, user?.activeWorkspaceId);

  if (!sidebarExpanded) {
    return (
      <Column alignItems="center" sx={{ px: 1.5, pt: 1, pb: 1 }}>
        <WorkspaceMonogramBadge
          name={active.workspace.name}
          color={active.workspace.color}
          icon={active.workspace.icon}
          size={36}
        />
      </Column>
    );
  }

  const selectWorkspace = (workspaceId: string) => {
    if (workspaceId === active.workspace._id || pendingWorkspaceId) {
      return;
    }

    setPendingWorkspaceId(workspaceId);
    setActive.mutate({ workspaceId });
  };

  const openCreateFlow = () => {
    setMenuOpen(false);
    openCreate();
  };

  return (
    <Column sx={{ px: 1.5, pt: 1, pb: 0.5 }}>
      <WorkspaceSwitcherClosed
        active={active}
        isOpen={isMenuOpen}
        onToggle={() => setMenuOpen(prev => !prev)}
      />
      <Collapse in={isMenuOpen} unmountOnExit>
        <WorkspaceSwitcherMenu
          items={items}
          activeWorkspaceId={active.workspace._id}
          pendingWorkspaceId={pendingWorkspaceId}
          onSelect={selectWorkspace}
          onCreateSharedHousehold={openCreateFlow}
        />
      </Collapse>
      {isCreateOpen && (
        <CreateSharedHouseholdDialog
          isOpen={isCreateOpen}
          closeDialog={closeCreate}
        />
      )}
    </Column>
  );
};

export default WorkspaceSwitcher;
