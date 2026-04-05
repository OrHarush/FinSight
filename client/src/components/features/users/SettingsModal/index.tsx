import SettingsIcon from '@mui/icons-material/Settings';
import {
  Button,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import LyraDialog, { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import DangerZone from '@/components/features/users/SettingsModal/DangerZone';
import UserDeletionDialog from '@/components/features/users/UserDeletionDialog';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { CURRENCIES } from '@/constants/currencies';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useOpen } from '@/hooks/common/useOpen';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useAuth } from '@/providers/AuthProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { UserDto } from '@/types/User';

interface UpdatePreferencesDto {
  displayCurrency: string;
}

const SettingsModal = ({ isOpen, closeDialog }: BaseDialogProps) => {
  const { t } = useTranslation('user');
  const { user, updateUser, logout } = useAuth();
  const { alertSuccess, alertError } = useSnackbar();
  const [isDeletionDialogOpen, openDeletionDialog, closeDeletionDialog] = useOpen();

  const [selectedCurrency, setSelectedCurrency] = useState(user?.displayCurrency ?? 'ILS');

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

  const deleteUser = useApiMutation<void, void>({
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

  const confirmDeletion = () => {
    deleteUser.mutate();
  };

  return (
    <>
      <LyraDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={t('settingsModal.title')}
        titleIcon={SettingsIcon}
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
