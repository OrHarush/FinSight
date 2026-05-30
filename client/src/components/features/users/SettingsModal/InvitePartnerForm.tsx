import SendIcon from '@mui/icons-material/Send';
import { Alert, IconButton, InputAdornment, Typography } from '@mui/material';
import { isAxiosError } from 'axios';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import TextInput from '@/components/shared/inputs/TextInput';
import Column from '@/components/shared/layout/containers/Column';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { ApiResponse } from '@/hooks/common/useFetch';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { CreateInvitationResponseDto } from '@/types/Workspace';

interface InvitePartnerFormProps {
  workspaceId: string;
  isFull: boolean;
}

interface InvitePartnerFormValues {
  email: string;
}

interface CreateInvitationPayload {
  invitedEmail: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const InvitePartnerForm = ({ workspaceId, isFull }: InvitePartnerFormProps) => {
  const { t } = useTranslation('user');
  const { alertSuccess, alertError } = useSnackbar();

  const methods = useForm<InvitePartnerFormValues>({
    defaultValues: { email: '' },
  });

  const createInvitation = useApiMutation<
    ApiResponse<CreateInvitationResponseDto>,
    CreateInvitationPayload
  >({
    method: 'post',
    url: API_ROUTES.WORKSPACE_INVITATIONS(workspaceId),
    queryKeysToInvalidate: [queryKeys.workspaces()],
    options: {
      onSuccess: response => {
        if (response.data?.emailSent) {
          alertSuccess(t('sharedHousehold.invite.success'));
        } else {
          alertSuccess(t('sharedHousehold.invite.successNoEmail'));
        }

        methods.reset();
      },
      onError: error => {
        const code = isAxiosError<{ error?: string }>(error)
          ? error.response?.data?.error
          : null;

        switch (code) {
          case 'SELF_INVITE':
            alertError(t('sharedHousehold.invite.errorSelfInvite'));
            break;
          case 'ALREADY_MEMBER':
            alertError(t('sharedHousehold.invite.errorAlreadyMember'));
            break;
          case 'ALREADY_INVITED':
            alertError(t('sharedHousehold.invite.errorAlreadyInvited'));
            break;
          case 'MEMBER_CAP_REACHED':
            alertError(t('sharedHousehold.invite.errorMemberCap'));
            break;
          default:
            alertError(t('sharedHousehold.invite.errorGeneric'));
        }
      },
    },
  });

  const submit = (values: InvitePartnerFormValues) => {
    createInvitation.mutate({ invitedEmail: values.email.trim().toLowerCase() });
  };

  if (isFull) {
    return (
      <Alert severity="info" sx={{ borderRadius: 2 }}>
        {t('sharedHousehold.invite.fullMessage')}
      </Alert>
    );
  }

  return (
    <Column spacing={1}>
      <Typography variant="subtitle2" fontWeight={600}>
        {t('sharedHousehold.invite.title')}
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submit)} noValidate>
          <TextInput
            name="email"
            type="email"
            label={t('sharedHousehold.invite.emailLabel')}
            placeholder={t('sharedHousehold.invite.emailPlaceholder')}
            required={t('sharedHousehold.invite.emailRequired')}
            fullWidth
            rules={{
              pattern: {
                value: EMAIL_PATTERN,
                message: t('sharedHousehold.invite.emailInvalid'),
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                      color="primary"
                      edge="end"
                      disabled={createInvitation.isPending}
                      aria-label={t('sharedHousehold.invite.submit')}
                    >
                      <SendIcon
                        sx={{
                          transform: theme =>
                            theme.direction === 'rtl' ? 'scaleX(-1)' : 'none',
                        }}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </form>
      </FormProvider>
    </Column>
  );
};

export default InvitePartnerForm;
