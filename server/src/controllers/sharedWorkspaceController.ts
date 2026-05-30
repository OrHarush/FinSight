import {
  CreateInvitationDTO,
  CreateWorkspaceDTO,
  UpdateWorkspaceDTO,
} from '@lyra/shared';
import { Request, Response } from 'express';

import { ApiResponse } from '../http/ApiResponse';
import { asyncHandler } from '../middlewares/asyncHandler';
import * as sharedWorkspaceService from '../services/sharedWorkspaceService';
import { buildWorkspaceExport } from '../services/userExportService';

export const createWorkspace = asyncHandler(async (req: Request, res: Response) => {
  const workspace = await sharedWorkspaceService.createSharedWorkspace(
    req.userId,
    req.validatedBody as CreateWorkspaceDTO
  );

  return ApiResponse.created(res, workspace);
});

export const listWorkspaces = asyncHandler(async (req: Request, res: Response) => {
  const workspaces = await sharedWorkspaceService.listMyWorkspaces(req.userId);

  return ApiResponse.ok(res, workspaces);
});

export const updateWorkspace = asyncHandler(async (req: Request, res: Response) => {
  const workspace = await sharedWorkspaceService.updateWorkspace(
    req.userId,
    req.params.id as string,
    req.validatedBody as UpdateWorkspaceDTO
  );

  return ApiResponse.ok(res, workspace);
});

export const createInvitation = asyncHandler(async (req: Request, res: Response) => {
  const invitation = await sharedWorkspaceService.createInvitation(
    req.userId,
    req.params.id as string,
    req.validatedBody as CreateInvitationDTO
  );

  return ApiResponse.created(res, invitation);
});

export const revokeInvitation = asyncHandler(async (req: Request, res: Response) => {
  await sharedWorkspaceService.revokeInvitation(
    req.userId,
    req.params.id as string,
    req.params.invId as string
  );

  return ApiResponse.ok(res, { ok: true });
});

export const getInvitationByToken = asyncHandler(async (req: Request, res: Response) => {
  const invitation = await sharedWorkspaceService.getInvitationPublic(
    req.params.token as string
  );

  return ApiResponse.ok(res, invitation);
});

export const acceptInvitation = asyncHandler(async (req: Request, res: Response) => {
  const result = await sharedWorkspaceService.acceptInvitation(
    req.userId,
    req.params.token as string
  );

  return ApiResponse.ok(res, result);
});

export const declineInvitation = asyncHandler(async (req: Request, res: Response) => {
  const result = await sharedWorkspaceService.declineInvitation(
    req.userId,
    req.params.token as string
  );

  return ApiResponse.ok(res, result);
});

export const leaveWorkspace = asyncHandler(async (req: Request, res: Response) => {
  const result = await sharedWorkspaceService.leaveWorkspace(
    req.userId,
    req.params.id as string
  );

  return ApiResponse.ok(res, result);
});

export const removeMember = asyncHandler(async (req: Request, res: Response) => {
  const result = await sharedWorkspaceService.removeMember(
    req.userId,
    req.params.id as string,
    req.params.userId as string
  );

  return ApiResponse.ok(res, result);
});

const sanitizeForFilename = (raw: string): string => {
  const trimmed = raw
    .trim()
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, '-');

  return trimmed.length > 0 ? trimmed.slice(0, 40) : 'workspace';
};

export const exportWorkspaceData = asyncHandler(async (req: Request, res: Response) => {
  const { data, workspaceName } = await buildWorkspaceExport(
    req.params.id as string,
    req.userId!
  );

  const date = new Date().toISOString().slice(0, 10);
  const utf8Name = `lyra-${sanitizeForFilename(workspaceName)}-${date}.json`;
  const asciiFallback = `lyra-workspace-${date}.json`;

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(utf8Name)}`
  );
  res.send(JSON.stringify(data, null, 2));
});
