import { Button, DialogActions, DialogContent } from '@mui/material';
import { isAxiosError } from 'axios';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import LyraDialog, { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import HouseholdPreview from '@/components/features/users/SettingsModal/HouseholdPreview';
import TextInput from '@/components/shared/inputs/TextInput';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { DEFAULT_HOUSEHOLD_ICON } from '@/constants/HouseholdIcons';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useAuth } from '@/providers/AuthProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { CreateWorkspaceResponseDto, WorkspaceDto } from '@/types/Workspace';

interface CreateSharedHouseholdDialogProps extends BaseDialogProps {
  workspace?: WorkspaceDto;
}

interface HouseholdFormValues {
  name: string;
  icon: string;
  color: string;
}

interface CreateWorkspacePayload {
  name: string;
  icon: string;
  color: string;
  currency?: string;
}

interface UpdateWorkspacePayload {
  name: string;
  icon: string;
  color: string;
}

const MAX_NAME_LENGTH = 40;
const DEFAULT_HOUSEHOLD_COLOR = '#9ca3af';

const CreateSharedHouseholdDialog = ({
  isOpen,
  closeDialog,
  workspace,
}: CreateSharedHouseholdDialogProps) => {
  const { t } = useTranslation('user');
  const { user } = useAuth();
  const { alertSuccess, alertError } = useSnackbar();
  const isEdit = !!workspace;

  const methods = useForm<HouseholdFormValues>({
    defaultValues: {
      name: workspace?.name ?? '',
      icon: workspace?.icon ?? DEFAULT_HOUSEHOLD_ICON,
      color: workspace?.color ?? DEFAULT_HOUSEHOLD_COLOR,
    },
  });

  const createWorkspace = useApiMutation<
    CreateWorkspaceResponseDto,
    CreateWorkspacePayload
  >({
    method: 'post',
    url: API_ROUTES.WORKSPACES,
    queryKeysToInvalidate: [queryKeys.workspaces()],
    options: {
      onSuccess: () => {
        alertSuccess(t('sharedHousehold.create.success'));
        methods.reset();
        closeDialog();
      },
      onError: error => {
        const code = isAxiosError<{ error?: string }>(error)
          ? error.response?.data?.error
          : null;

        if (code === 'WORKSPACE_CAP_REACHED') {
          alertError(t('sharedHousehold.create.capReached'));

          return;
        }

        alertError(t('sharedHousehold.create.error'));
      },
    },
  });

  const updateWorkspace = useApiMutation<WorkspaceDto, UpdateWorkspacePayload>({
    method: 'patch',
    url: workspace ? API_ROUTES.WORKSPACE_BY_ID(workspace._id) : undefined,
    queryKeysToInvalidate: [queryKeys.workspaces()],
    options: {
      onSuccess: () => {
        alertSuccess(t('sharedHousehold.edit.success'));
        methods.reset();
        closeDialog();
      },
      onError: () => {
        alertError(t('sharedHousehold.edit.error'));
      },
    },
  });

  const isPending = createWorkspace.isPending || updateWorkspace.isPending;

  const submit = (values: HouseholdFormValues) => {
    const payload = {
      name: values.name.trim(),
      icon: values.icon || DEFAULT_HOUSEHOLD_ICON,
      color: values.color || DEFAULT_HOUSEHOLD_COLOR,
    };

    if (isEdit) {
      updateWorkspace.mutate(payload);

      return;
    }

    createWorkspace.mutate({
      ...payload,
      currency: user?.displayCurrency ?? undefined,
    });
  };

  const title = isEdit
    ? t('sharedHousehold.edit.title')
    : t('sharedHousehold.create.title');
  const submitLabel = isEdit
    ? t('sharedHousehold.edit.submit')
    : t('sharedHousehold.create.submit');

  return (
    <LyraDialog
      isOpen={isOpen}
      closeDialog={closeDialog}
      title={title}
      maxWidth="xs"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submit)} noValidate>
          <DialogContent sx={{ py: 1 }}>
            <Column spacing={2.5} sx={{ pt: 1 }}>
              <HouseholdPreview />
              <TextInput
                name="name"
                label={t('sharedHousehold.create.nameLabel')}
                placeholder={t('sharedHousehold.create.namePlaceholder')}
                required={t('sharedHousehold.create.nameRequired')}
                maxLength={MAX_NAME_LENGTH}
                autoFocus
                fullWidth
                rules={{
                  maxLength: {
                    value: MAX_NAME_LENGTH,
                    message: t('sharedHousehold.create.nameTooLong'),
                  },
                }}
              />
            </Column>
          </DialogContent>
          <DialogActions>
            <Row spacing={1} sx={{ px: 2, pb: 1 }}>
              <Button variant="outlined" onClick={closeDialog} disabled={isPending}>
                {t('sharedHousehold.create.cancel')}
              </Button>
              <Button type="submit" variant="contained" disabled={isPending}>
                {submitLabel}
              </Button>
            </Row>
          </DialogActions>
        </form>
      </FormProvider>
    </LyraDialog>
  );
};

export default CreateSharedHouseholdDialog;
