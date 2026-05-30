export type WorkspaceType = 'personal' | 'shared';

export type WorkspaceRole = 'owner' | 'member';

export interface WorkspaceDto {
  _id: string;
  name: string;
  type: WorkspaceType;
  currency: string;
  icon?: string;
  color?: string;
}

export interface WorkspaceMemberView {
  userId: string;
  name: string;
  email: string;
  role: WorkspaceRole;
}

export interface PendingInvitationView {
  _id: string;
  invitedEmail: string;
  expiresAt: string;
}

export interface WorkspaceListItemDto {
  workspace: WorkspaceDto;
  role: WorkspaceRole;
  memberCount: number;
  members: WorkspaceMemberView[];
  pendingInvitations: PendingInvitationView[];
}

export interface CreateWorkspaceResponseDto {
  _id: string;
  name: string;
  type: WorkspaceType;
  currency: string;
  icon: string;
  color: string;
  role: WorkspaceRole;
  memberCount: number;
}

export interface CreateInvitationResponseDto {
  _id: string;
  workspaceId: string;
  invitedEmail: string;
  token: string;
  expiresAt: string;
  emailSent: boolean;
  emailError?: string;
}

export type InvitationStatus =
  | 'pending'
  | 'accepted'
  | 'expired'
  | 'revoked'
  | 'declined';

export interface InvitationPublicView {
  workspaceName: string;
  workspaceColor?: string;
  inviterName: string;
  inviterPicture?: string;
  invitedEmail: string;
  status: InvitationStatus;
  expiresAt: string;
}

export interface AcceptInvitationResponseDto {
  workspaceId: string;
}
