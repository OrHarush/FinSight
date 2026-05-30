import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import CreateSharedHouseholdDialog from '@/components/features/users/SettingsModal/CreateSharedHouseholdDialog';
import SharedHouseholdEmptyState from '@/components/features/users/SettingsModal/SharedHouseholdEmptyState';
import SharedHouseholdList from '@/components/features/users/SettingsModal/SharedHouseholdList';
import SharedHouseholdLoadError from '@/components/features/users/SettingsModal/SharedHouseholdLoadError';
import SharedHouseholdSkeleton from '@/components/features/users/SettingsModal/SharedHouseholdSkeleton';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import ScrollableColumn from '@/components/shared/layout/containers/ScrollableColumn';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useOpen } from '@/hooks/common/useOpen';
import { useFetch } from '@/hooks/common/useFetch';
import { WorkspaceListItemDto } from '@/types/Workspace';

const SharedHouseholdTab = () => {
  const { t } = useTranslation('user');
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();

  const { data, isLoading, isError, refetch } = useFetch<WorkspaceListItemDto[]>({
    url: API_ROUTES.WORKSPACES,
    queryKey: queryKeys.workspaces(),
  });

  const sharedHouseholds =
    data?.filter(item => item.workspace.type === 'shared') ?? [];
  const hasSharedHouseholds = sharedHouseholds.length > 0;

  return (
    <>
      <Column spacing={2} sx={{ height: '100%', minHeight: 380 }}>
        {isLoading && <SharedHouseholdSkeleton />}

        {!isLoading && isError && <SharedHouseholdLoadError onRetry={() => refetch()} />}

        {!isLoading && !isError && !hasSharedHouseholds && (
          <SharedHouseholdEmptyState openCreateDialog={openCreateDialog} />
        )}

        {!isLoading && !isError && hasSharedHouseholds && (
          <Column spacing={2} sx={{ minHeight: 0, flex: 1 }}>
            <Row
              sx={{
                justifyContent: 'flex-end',
                display: { xs: 'none', sm: 'flex' },
              }}
            >
              <Button variant="contained" size="small" onClick={openCreateDialog}>
                {t('sharedHousehold.empty.createButton')}
              </Button>
            </Row>
            <ScrollableColumn
              spacing={2}
              sx={{
                flex: 1,
                minHeight: 0,
                maxHeight: { xs: 'calc(92dvh - 200px)', sm: 480 },
              }}
            >
              <SharedHouseholdList items={sharedHouseholds} />
              <Row
                sx={{
                  justifyContent: 'flex-end',
                  display: { xs: 'flex', sm: 'none' },
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={openCreateDialog}
                  fullWidth
                >
                  {t('sharedHousehold.empty.createButton')}
                </Button>
              </Row>
            </ScrollableColumn>
          </Column>
        )}
      </Column>

      {isCreateDialogOpen && (
        <CreateSharedHouseholdDialog
          isOpen={isCreateDialogOpen}
          closeDialog={closeCreateDialog}
        />
      )}
    </>
  );
};

export default SharedHouseholdTab;
