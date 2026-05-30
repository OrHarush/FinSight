import { SvgIconComponent } from '@mui/icons-material';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import TuneIcon from '@mui/icons-material/Tune';
import { Box, DialogContent, List, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import LyraDialog, { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import GeneralSettingsTab from '@/components/features/users/SettingsModal/GeneralSettingsTab';
import SettingsTabButton from '@/components/features/users/SettingsModal/SettingsTabButton';
import SharedHouseholdTab from '@/components/features/users/SettingsModal/SharedHouseholdTab';
import UserDeletionDialog, {
  DeletionFeedbackPayload,
} from '@/components/features/users/UserDeletionDialog';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import { useOpen } from '@/hooks/common/useOpen';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useAuth } from '@/providers/AuthProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';

type SettingsTabKey = 'general' | 'sharedHousehold';

const SettingsModal = ({ isOpen, closeDialog }: BaseDialogProps) => {
  const { t } = useTranslation('user');
  const { user, logout } = useAuth();
  const { alertSuccess, alertError } = useSnackbar();
  const [isDeletionDialogOpen, openDeletionDialog, closeDeletionDialog] = useOpen();
  const isSmallScreen = useIsSmallScreen();

  const [activeTab, setActiveTab] = useState<SettingsTabKey>('general');

  const deleteUser = useApiMutation<void, { feedback: DeletionFeedbackPayload }>({
    method: 'delete',
    url: `${API_ROUTES.USERS}/${user?._id}`,
    queryKeysToInvalidate: [queryKeys.user()],
    options: {
      onSuccess: () => {
        alertSuccess(t('deleteDialog.success'));
        logout();
      },
      onError: () => {
        alertError(t('deleteDialog.error'));
      },
    },
  });

  const confirmDeletion = (feedback: DeletionFeedbackPayload) => {
    deleteUser.mutate({ feedback });
  };

  const tabs: { key: SettingsTabKey; labelKey: string; icon: SvgIconComponent }[] = [
    { key: 'general', labelKey: 'settingsModal.tabs.general', icon: TuneIcon },
    {
      key: 'sharedHousehold',
      labelKey: 'settingsModal.tabs.sharedHousehold',
      icon: HomeWorkOutlinedIcon,
    },
  ];

  return (
    <>
      <LyraDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={t('settingsModal.title')}
        titleIcon={SettingsIcon}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ py: 1 }}>
          {isSmallScreen ? (
            <Column spacing={2} sx={{ pt: 1 }}>
              <Tabs
                value={activeTab}
                onChange={(_, value: SettingsTabKey) => setActiveTab(value)}
                variant="fullWidth"
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  bgcolor: 'background.paper',
                }}
              >
                {tabs.map(tab => (
                  <Tab key={tab.key} value={tab.key} label={t(tab.labelKey)} />
                ))}
              </Tabs>
              <Box>
                {activeTab === 'general' && (
                  <GeneralSettingsTab openDeletionDialog={openDeletionDialog} />
                )}
                {activeTab === 'sharedHousehold' && <SharedHouseholdTab />}
              </Box>
            </Column>
          ) : (
            <Row
              spacing={2}
              sx={{ pt: 1, alignItems: 'stretch', minHeight: 540 }}
            >
              <List
                sx={{
                  borderInlineEnd: 1,
                  borderColor: 'divider',
                  minWidth: 200,
                  py: 0,
                }}
              >
                {tabs.map(tab => (
                  <SettingsTabButton
                    key={tab.key}
                    icon={tab.icon}
                    label={t(tab.labelKey)}
                    isActive={activeTab === tab.key}
                    onClick={() => setActiveTab(tab.key)}
                  />
                ))}
              </List>
              <Box sx={{ flex: 1, minWidth: 0, px: 1 }}>
                {activeTab === 'general' && (
                  <GeneralSettingsTab openDeletionDialog={openDeletionDialog} />
                )}
                {activeTab === 'sharedHousehold' && <SharedHouseholdTab />}
              </Box>
            </Row>
          )}
        </DialogContent>
      </LyraDialog>

      {isDeletionDialogOpen && (
        <UserDeletionDialog
          isOpen={isDeletionDialogOpen}
          closeDialog={closeDeletionDialog}
          onConfirm={confirmDeletion}
        />
      )}
    </>
  );
};

export default SettingsModal;
