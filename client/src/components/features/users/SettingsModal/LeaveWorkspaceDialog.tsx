import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { downloadWorkspaceData } from '@/api/users';
import LyraDialog, { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useLeaveWorkspace } from '@/components/features/users/SettingsModal/hooks/useLeaveWorkspace';
import { useSnackbar } from '@/providers/SnackbarProvider';

interface LeaveWorkspaceDialogProps extends BaseDialogProps {
  workspaceId: string;
  workspaceName: string;
}

const LeaveWorkspaceDialog = ({
  isOpen,
  closeDialog,
  workspaceId,
  workspaceName,
}: LeaveWorkspaceDialogProps) => {
  const { t } = useTranslation('user');
  const { alertSuccess, alertError } = useSnackbar();
  const [isDownloading, setIsDownloading] = useState(false);

  const leave = useLeaveWorkspace({
    workspaceId,
    onSuccess: result => {
      alertSuccess(
        result.deleted
          ? t('sharedHousehold.leave.successDeleted')
          : t('sharedHousehold.leave.success')
      );
      closeDialog();
    },
    onError: () => alertError(t('sharedHousehold.leave.error')),
  });

  const downloadData = async () => {
    setIsDownloading(true);

    try {
      await downloadWorkspaceData(workspaceId);
    } catch (err) {
      console.error('Data download failed:', err);
      alertError(t('sharedHousehold.leave.exportError'));
    } finally {
      setIsDownloading(false);
    }
  };

  const isBusy = leave.isPending || isDownloading;

  return (
    <LyraDialog
      isOpen={isOpen}
      closeDialog={closeDialog}
      title={t('sharedHousehold.leave.confirmTitle', { household: workspaceName })}
      maxWidth="xs"
      forceDialog
    >
      <DialogContent>
        <Column spacing={2.5}>
          <Typography variant="body2" color="text.secondary">
            {t('sharedHousehold.leave.confirmBody')}
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<DownloadRoundedIcon />}
            onClick={downloadData}
            disabled={isBusy}
          >
            {t('sharedHousehold.leave.exportButton')}
          </Button>
        </Column>
      </DialogContent>
      <DialogActions>
        <Row spacing={1} sx={{ px: 2, pb: 1 }}>
          <Button variant="outlined" onClick={closeDialog} disabled={isBusy}>
            {t('sharedHousehold.leave.cancel')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => leave.mutate()}
            disabled={isBusy}
            startIcon={
              leave.isPending ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            {t('sharedHousehold.leave.confirm')}
          </Button>
        </Row>
      </DialogActions>
    </LyraDialog>
  );
};

export default LeaveWorkspaceDialog;
