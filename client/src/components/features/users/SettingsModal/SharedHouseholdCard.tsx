import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Button, ButtonBase, Divider, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import CreateSharedHouseholdDialog from '@/components/features/users/SettingsModal/CreateSharedHouseholdDialog';
import HouseholdIconFrame from '@/components/features/users/SettingsModal/HouseholdIconFrame';
import HouseholdMembersList from '@/components/features/users/SettingsModal/HouseholdMembersList';
import InvitePartnerForm from '@/components/features/users/SettingsModal/InvitePartnerForm';
import LeaveWorkspaceDialog from '@/components/features/users/SettingsModal/LeaveWorkspaceDialog';
import PendingInvitationsList from '@/components/features/users/SettingsModal/PendingInvitationsList';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useOpen } from '@/hooks/common/useOpen';
import { useAuth } from '@/providers/AuthProvider';
import { WorkspaceListItemDto } from '@/types/Workspace';

const MAX_WORKSPACE_MEMBERS = 2;

interface SharedHouseholdCardProps {
  item: WorkspaceListItemDto;
}

const SharedHouseholdCard = ({ item }: SharedHouseholdCardProps) => {
  const { t } = useTranslation('user');
  const { user } = useAuth();
  const [isEditOpen, openEdit, closeEdit] = useOpen();
  const [isLeaveOpen, openLeave, closeLeave] = useOpen();

  const filledSlots = item.memberCount + item.pendingInvitations.length;
  const isFull = filledSlots >= MAX_WORKSPACE_MEMBERS;
  const isOwner = item.role === 'owner';
  const currentUserIsMember = item.members.some(m => m.userId === user?._id);

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Column spacing={2}>
        <ButtonBase
          onClick={openEdit}
          aria-label={t('sharedHousehold.edit.ariaLabel')}
          sx={{
            alignSelf: 'flex-start',
            maxWidth: '100%',
            borderRadius: 1.5,
            px: 1,
            py: 0.75,
            textAlign: 'inherit',
            transition: 'background-color 160ms ease',
            '&:hover': { backgroundColor: 'action.hover' },
            '&:focus-visible': {
              outline: theme => `2px solid ${theme.palette.primary.main}`,
              outlineOffset: 2,
            },
          }}
        >
          <Row spacing={1} alignItems="center" sx={{ gap: 1, minWidth: 0 }}>
            <HouseholdIconFrame icon={item.workspace.icon} size={44} />
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ minWidth: 0, wordBreak: 'break-word' }}
            >
              {item.workspace.name}
            </Typography>
            <EditOutlinedIcon
              sx={{
                color: 'text.secondary',
                flexShrink: 0,
                fontSize: '1rem',
              }}
            />
          </Row>
        </ButtonBase>

        <HouseholdMembersList
          workspaceId={item.workspace._id}
          members={item.members}
          canRemoveMembers={isOwner}
        />

        <Divider />

        <InvitePartnerForm workspaceId={item.workspace._id} isFull={isFull} />

        <PendingInvitationsList
          workspaceId={item.workspace._id}
          pendingInvitations={item.pendingInvitations}
        />

        {currentUserIsMember && (
          <>
            <Divider />
            <Row justifyContent="flex-end">
              <Button
                variant="text"
                color="error"
                size="small"
                startIcon={<LogoutRoundedIcon />}
                onClick={openLeave}
              >
                {t('sharedHousehold.leave.button')}
              </Button>
            </Row>
          </>
        )}
      </Column>

      {isEditOpen && (
        <CreateSharedHouseholdDialog
          isOpen={isEditOpen}
          closeDialog={closeEdit}
          workspace={item.workspace}
        />
      )}

      {isLeaveOpen && (
        <LeaveWorkspaceDialog
          isOpen={isLeaveOpen}
          closeDialog={closeLeave}
          workspaceId={item.workspace._id}
          workspaceName={item.workspace.name}
        />
      )}
    </Paper>
  );
};

export default SharedHouseholdCard;
