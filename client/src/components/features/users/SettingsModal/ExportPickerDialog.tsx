import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import {
  Button,
  ButtonBase,
  CircularProgress,
  DialogActions,
  DialogContent,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { downloadWorkspaceData } from '@/api/users';
import LyraDialog, { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import WorkspaceMonogramBadge from '@/components/shared/layout/sidebar/WorkspaceSwitcher/WorkspaceMonogramBadge';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { WorkspaceListItemDto } from '@/types/Workspace';

const SEQUENTIAL_DOWNLOAD_DELAY_MS = 400;

interface ExportPickerDialogProps extends BaseDialogProps {
  workspaces: WorkspaceListItemDto[];
}

const ExportPickerDialog = ({ isOpen, closeDialog, workspaces }: ExportPickerDialogProps) => {
  const { t } = useTranslation('user');
  const theme = useTheme();
  const { alertError } = useSnackbar();
  const [pendingId, setPendingId] = useState<string | 'all' | null>(null);

  const captionFor = (item: WorkspaceListItemDto) =>
    item.workspace.type === 'personal'
      ? t('settingsModal.exportPicker.personalCaption')
      : t('settingsModal.exportPicker.sharedCaption');

  const downloadOne = async (workspaceId: string) => {
    setPendingId(workspaceId);

    try {
      await downloadWorkspaceData(workspaceId);
      closeDialog();
    } catch {
      alertError(t('settingsModal.downloadDataError'));
    } finally {
      setPendingId(null);
    }
  };

  const downloadAll = async () => {
    setPendingId('all');

    try {
      for (let i = 0; i < workspaces.length; i += 1) {
        await downloadWorkspaceData(workspaces[i].workspace._id);

        if (i < workspaces.length - 1) {
          await new Promise(resolve => setTimeout(resolve, SEQUENTIAL_DOWNLOAD_DELAY_MS));
        }
      }
      closeDialog();
    } catch {
      alertError(t('settingsModal.downloadDataError'));
    } finally {
      setPendingId(null);
    }
  };

  const isBusy = pendingId !== null;

  return (
    <LyraDialog
      isOpen={isOpen}
      closeDialog={closeDialog}
      title={t('settingsModal.exportPicker.title')}
      maxWidth="xs"
      forceDialog
    >
      <DialogContent>
        <Column spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {t('settingsModal.exportPicker.subtitle')}
          </Typography>
          <Column spacing={0.5}>
            {workspaces.map(item => {
              const isLoading = pendingId === item.workspace._id;

              return (
                <ButtonBase
                  key={item.workspace._id}
                  onClick={() => downloadOne(item.workspace._id)}
                  disabled={isBusy}
                  sx={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    px: 1.25,
                    py: 1,
                    borderRadius: 1.5,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                    '&:focus-visible': {
                      outline: `2px solid ${theme.palette.primary.main}`,
                      outlineOffset: 2,
                    },
                    opacity: isBusy && !isLoading ? 0.5 : 1,
                  }}
                >
                  <Row spacing={1.25} alignItems="center" sx={{ width: '100%', minWidth: 0 }}>
                    <WorkspaceMonogramBadge
                      name={item.workspace.name}
                      color={item.workspace.color}
                      icon={item.workspace.icon}
                      size={32}
                    />
                    <Column sx={{ flex: 1, minWidth: 0, textAlign: 'start' }}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.workspace.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {captionFor(item)}
                      </Typography>
                    </Column>
                    {isLoading && <CircularProgress size={16} />}
                  </Row>
                </ButtonBase>
              );
            })}
            <Divider sx={{ my: 0.5 }} />
            <ButtonBase
              onClick={downloadAll}
              disabled={isBusy}
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
                opacity: isBusy && pendingId !== 'all' ? 0.5 : 1,
              }}
            >
              <Row spacing={1.25} alignItems="center" sx={{ width: '100%' }}>
                <DoneAllRoundedIcon sx={{ fontSize: 22 }} />
                <Column sx={{ flex: 1, minWidth: 0, textAlign: 'start' }}>
                  <Typography variant="body2" fontWeight={600}>
                    {t('settingsModal.exportPicker.allOption')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('settingsModal.exportPicker.allCaption')}
                  </Typography>
                </Column>
                {pendingId === 'all' && <CircularProgress size={16} />}
              </Row>
            </ButtonBase>
          </Column>
        </Column>
      </DialogContent>
      <DialogActions>
        <Row spacing={1} sx={{ px: 2, pb: 1 }}>
          <Button variant="outlined" onClick={closeDialog} disabled={isBusy}>
            {t('settingsModal.exportPicker.cancel')}
          </Button>
        </Row>
      </DialogActions>
    </LyraDialog>
  );
};

export default ExportPickerDialog;
