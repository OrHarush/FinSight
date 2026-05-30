import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import { Chip, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import RemoveMemberDialog from '@/components/features/users/SettingsModal/RemoveMemberDialog';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useAuth } from '@/providers/AuthProvider';
import { WorkspaceMemberView } from '@/types/Workspace';

interface HouseholdMembersListProps {
  workspaceId: string;
  members: WorkspaceMemberView[];
  canRemoveMembers: boolean;
}

const HouseholdMembersList = ({
  workspaceId,
  members,
  canRemoveMembers,
}: HouseholdMembersListProps) => {
  const { t } = useTranslation('user');
  const { user } = useAuth();
  const [pendingRemoval, setPendingRemoval] = useState<WorkspaceMemberView | null>(null);

  return (
    <Column spacing={1}>
      <Typography variant="subtitle2" fontWeight={600}>
        {t('sharedHousehold.list.membersTitle')}
      </Typography>
      <Column spacing={0.75}>
        {members.map(member => {
          const isYou = user?._id === member.userId;
          const roleLabel =
            member.role === 'owner'
              ? t('sharedHousehold.list.roleOwner')
              : t('sharedHousehold.list.roleMember');
          const showRemoveButton = canRemoveMembers && !isYou && member.role !== 'owner';

          return (
            <Row
              key={member.userId}
              spacing={1}
              alignItems="center"
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: 1.5,
                bgcolor: 'action.hover',
                gap: 1,
              }}
            >
              <Column sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                  {member.name}
                  {isYou && t('sharedHousehold.list.youSuffix')}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ wordBreak: 'break-all' }}
                >
                  {member.email}
                </Typography>
              </Column>
              <Chip
                label={roleLabel}
                size="small"
                color={member.role === 'owner' ? 'primary' : 'default'}
                variant={member.role === 'owner' ? 'filled' : 'outlined'}
                sx={{ flexShrink: 0 }}
              />
              {showRemoveButton && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => setPendingRemoval(member)}
                  aria-label={t('sharedHousehold.remove.ariaLabel')}
                  sx={{ flexShrink: 0 }}
                >
                  <PersonRemoveOutlinedIcon fontSize="small" />
                </IconButton>
              )}
            </Row>
          );
        })}
      </Column>
      {pendingRemoval && (
        <RemoveMemberDialog
          isOpen
          closeDialog={() => setPendingRemoval(null)}
          workspaceId={workspaceId}
          memberUserId={pendingRemoval.userId}
          memberName={pendingRemoval.name}
        />
      )}
    </Column>
  );
};

export default HouseholdMembersList;
