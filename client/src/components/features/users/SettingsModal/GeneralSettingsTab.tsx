import DownloadIcon from '@mui/icons-material/Download';
import {
  Button,
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

import { downloadMyData, downloadWorkspaceData } from '@/api/users';
import DangerZone from '@/components/features/users/SettingsModal/DangerZone';
import ExportPickerDialog from '@/components/features/users/SettingsModal/ExportPickerDialog';
import Column from '@/components/shared/layout/containers/Column';
import { CURRENCIES } from '@/constants/currencies';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/common/useFetch';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import { useOpen } from '@/hooks/common/useOpen';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useAuth } from '@/providers/AuthProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { UserDto } from '@/types/User';
import { WorkspaceListItemDto } from '@/types/Workspace';

interface UpdatePreferencesDto {
  displayCurrency: string;
}

interface UpdateConsentDto {
  analyticsConsent: 'accepted' | 'rejected';
}

interface GeneralSettingsTabProps {
  openDeletionDialog: () => void;
}

const GeneralSettingsTab = ({ openDeletionDialog }: GeneralSettingsTabProps) => {
  const { t } = useTranslation('user');
  const { user, updateUser } = useAuth();
  const { alertSuccess, alertError } = useSnackbar();
  const isSmallScreen = useIsSmallScreen();

  const [selectedCurrency, setSelectedCurrency] = useState(user?.displayCurrency ?? 'ILS');
  const [isDownloadingData, setIsDownloadingData] = useState(false);
  const [isPickerOpen, openPicker, closePicker] = useOpen();

  const { data: workspaces } = useFetch<WorkspaceListItemDto[]>({
    url: API_ROUTES.WORKSPACES,
    queryKey: queryKeys.workspaces(),
  });

  const downloadActiveWorkspaceData = async () => {
    setIsDownloadingData(true);

    try {
      if (workspaces && workspaces.length === 1) {
        await downloadWorkspaceData(workspaces[0].workspace._id);
      } else {
        await downloadMyData();
      }
    } catch {
      alertError(t('settingsModal.downloadDataError'));
    } finally {
      setIsDownloadingData(false);
    }
  };

  const startDownloadFlow = () => {
    if (workspaces && workspaces.length >= 2) {
      openPicker();
      return;
    }

    void downloadActiveWorkspaceData();
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

  const changeCurrency = (currency: string) => {
    setSelectedCurrency(currency);
    updatePreferences.mutate({ displayCurrency: currency });
  };

  return (
    <Column spacing={3}>
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
          <Select value={selectedCurrency} onChange={e => changeCurrency(e.target.value)}>
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
                onClick={startDownloadFlow}
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
                onClick={startDownloadFlow}
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

      {isPickerOpen && workspaces && (
        <ExportPickerDialog
          isOpen={isPickerOpen}
          closeDialog={closePicker}
          workspaces={workspaces}
        />
      )}
    </Column>
  );
};

export default GeneralSettingsTab;
