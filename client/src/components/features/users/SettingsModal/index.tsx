import DownloadIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Button,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  Switch,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { downloadMyData } from '@/api/users';
import LyraDialog, { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import DangerZone from '@/components/features/users/SettingsModal/DangerZone';
import UserDeletionDialog, {
  DeletionFeedbackPayload,
} from '@/components/features/users/UserDeletionDialog';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { CURRENCIES } from '@/constants/currencies';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import { useOpen } from '@/hooks/common/useOpen';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useAuth } from '@/providers/AuthProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { UserDto } from '@/types/User';

interface UpdatePreferencesDto {
  displayCurrency: string;
}

interface UpdateConsentDto {
  analyticsConsent: 'accepted' | 'rejected';
}

interface UpdateMarketingEmailsDto {
  marketingEmailsEnabled: boolean;
}

const SettingsModal = ({ isOpen, closeDialog }: BaseDialogProps) => {
  const { t } = useTranslation('user');
  const { user, updateUser, logout } = useAuth();
  const { alertSuccess, alertError } = useSnackbar();
  const [isDeletionDialogOpen, openDeletionDialog, closeDeletionDialog] = useOpen();
  const isSmallScreen = useIsSmallScreen();

  const [selectedCurrency, setSelectedCurrency] = useState(user?.displayCurrency ?? 'ILS');
  const [isDownloadingData, setIsDownloadingData] = useState(false);

  const downloadData = async () => {
    setIsDownloadingData(true);

    try {
      await downloadMyData();
    } catch {
      alertError(t('settingsModal.downloadDataError'));
    } finally {
      setIsDownloadingData(false);
    }
  };

  const updatePreferences = useApiMutation<UserDto, UpdatePreferencesDto>({
    method: 'patch',
    url: API_ROUTES.USERS_PREFERENCES,
    queryKeysToInvalidate: [queryKeys.user()],
    options: {
      onMutate: async ({ displayCurrency }) => {
        const previousUser = user;

        if (user) {
          updateUser({ ...user, displayCurrency });
        }

        return { previousUser };
      },
      onError: (_, __, context) => {
        const ctx = context as { previousUser: UserDto | null };

        if (ctx?.previousUser) {
          updateUser(ctx.previousUser);
          setSelectedCurrency(ctx.previousUser.displayCurrency ?? 'ILS');
        }

        alertError(t('settingsModal.updateError'));
      },
      onSuccess: () => {
        alertSuccess(t('settingsModal.updateSuccess'));
      },
    },
  });

  const updateConsent = useApiMutation<UserDto, UpdateConsentDto>({
    method: 'patch',
    url: API_ROUTES.USERS_CONSENT,
    queryKeysToInvalidate: [queryKeys.user()],
    options: {
      onMutate: ({ analyticsConsent }) => {
        const previousUser = user;

        if (user) {
          updateUser({ ...user, analyticsConsent });
        }

        return { previousUser };
      },
      onError: (_, __, context) => {
        const ctx = context as { previousUser: UserDto | null };

        if (ctx?.previousUser) {
          updateUser(ctx.previousUser);
        }

        alertError(t('settingsModal.updateError'));
      },
    },
  });

  const toggleAnalyticsConsent = (accepted: boolean) => {
    updateConsent.mutate({ analyticsConsent: accepted ? 'accepted' : 'rejected' });
  };

  const updateMarketingEmails = useApiMutation<UserDto, UpdateMarketingEmailsDto>({
    method: 'patch',
    url: API_ROUTES.USERS_MARKETING_EMAILS,
    queryKeysToInvalidate: [queryKeys.user()],
    options: {
      onMutate: ({ marketingEmailsEnabled }) => {
        const previousUser = user;

        if (user) {
          updateUser({ ...user, marketingEmailsEnabled });
        }

        return { previousUser };
      },
      onError: (_, __, context) => {
        const ctx = context as { previousUser: UserDto | null };

        if (ctx?.previousUser) {
          updateUser(ctx.previousUser);
        }

        alertError(t('settingsModal.updateError'));
      },
    },
  });

  const toggleMarketingEmails = (enabled: boolean) => {
    updateMarketingEmails.mutate({ marketingEmailsEnabled: enabled });
  };

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

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
    updatePreferences.mutate({ displayCurrency: currency });
  };

  const confirmDeletion = (feedback: DeletionFeedbackPayload) => {
    deleteUser.mutate({ feedback });
  };

  return (
    <>
      <LyraDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={t('settingsModal.title')}
        titleIcon={SettingsIcon}
        maxWidth="sm"
      >
        <DialogContent sx={{ py: 1 }}>
          <Column spacing={3} sx={{ pt: 1 }}>
            <Column spacing={1.5}>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.secondary"
                textTransform="uppercase"
                fontSize="0.7rem"
                letterSpacing={0.8}
              >
                {t('settingsModal.general')}
              </Typography>
              <FormControl fullWidth size="small">
                <Typography variant="body2" mb={0.5}>
                  {t('settingsModal.currency')}
                </Typography>
                <Select
                  value={selectedCurrency}
                  onChange={e => handleCurrencyChange(e.target.value)}
                >
                  {CURRENCIES.map(c => (
                    <MenuItem key={c.value} value={c.value}>
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{t('settingsModal.currencyHelper')}</FormHelperText>
              </FormControl>
            </Column>
            <Divider />
            <Column spacing={1.5}>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.secondary"
                textTransform="uppercase"
                fontSize="0.7rem"
                letterSpacing={0.8}
              >
                {t('settingsModal.privacy')}
              </Typography>
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Switch
                    checked={user?.analyticsConsent === 'accepted'}
                    onChange={(_, checked) => toggleAnalyticsConsent(checked)}
                    disabled={updateConsent.isPending}
                    sx={{ flexShrink: 0 }}
                  />
                }
                label={
                  <Column sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2">{t('settingsModal.analyticsLabel')}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('settingsModal.analyticsHelper')}
                    </Typography>
                  </Column>
                }
                sx={{
                  alignItems: 'center',
                  m: 0,
                  gap: 2,
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              />
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Switch
                    checked={user?.marketingEmailsEnabled !== false}
                    onChange={(_, checked) => toggleMarketingEmails(checked)}
                    disabled={updateMarketingEmails.isPending}
                    sx={{ flexShrink: 0 }}
                  />
                }
                label={
                  <Column sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2">
                      {t('settingsModal.marketingEmailsLabel')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('settingsModal.marketingEmailsHelper')}
                    </Typography>
                  </Column>
                }
                sx={{
                  alignItems: 'center',
                  m: 0,
                  gap: 2,
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              />
              <FormControlLabel
                labelPlacement="start"
                control={<Switch checked disabled sx={{ flexShrink: 0 }} />}
                label={
                  <Column sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2">{t('settingsModal.essentialLabel')}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('settingsModal.essentialHelper')}
                    </Typography>
                  </Column>
                }
                sx={{
                  alignItems: 'center',
                  m: 0,
                  gap: 2,
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              />
              <FormControlLabel
                labelPlacement="start"
                control={
                  isSmallScreen ? (
                    <IconButton
                      color="primary"
                      onClick={downloadData}
                      disabled={isDownloadingData}
                      aria-label={t('settingsModal.downloadDataButton')}
                      sx={{ flexShrink: 0 }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  ) : (
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={downloadData}
                      disabled={isDownloadingData}
                      startIcon={<DownloadIcon />}
                      sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                    >
                      {t('settingsModal.downloadDataButton')}
                    </Button>
                  )
                }
                label={
                  <Column sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2">{t('settingsModal.yourDataLabel')}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('settingsModal.yourDataHelper')}
                    </Typography>
                  </Column>
                }
                sx={{
                  alignItems: 'center',
                  m: 0,
                  gap: 2,
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              />
            </Column>
            <Divider />
            <DangerZone openDeletionDialog={openDeletionDialog} />
          </Column>
        </DialogContent>
        <DialogActions>
          <Row sx={{ px: 2, pb: 1 }}>
            <Button variant="outlined" onClick={closeDialog}>
              {t('deleteDialog.cancel')}
            </Button>
          </Row>
        </DialogActions>
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
