import crypto from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

import { ApiError } from '../errors/ApiError';
import Category from '../models/Category';
import ShortcutToken from '../models/ShortcutToken';
import Workspace from '../models/Workspace';
import * as workspaceMemberRepository from '../repositories/workspaceMemberRepository';

const SHORTCUT_JWT_SECRET = process.env.SHORTCUT_JWT_SECRET as string;
const CODE_TTL_MS = 10 * 60 * 1000;
const SHORTCUT_TOKEN_TTL = '365d';

export interface ShortcutCategory {
  id: string;
  name: string;
  workspaceName?: string;
  isPersonal?: boolean;
}

export const createCode = async (userId: string): Promise<string> => {
  const code = crypto.randomUUID();

  await ShortcutToken.create({
    userId: new Types.ObjectId(userId),
    code,
    status: 'pending',
    expiresAt: new Date(Date.now() + CODE_TTL_MS),
  });

  return code;
};

export const approveCode = async (code: string, userId: string): Promise<void> => {
  const record = await ShortcutToken.findOne({ code, status: 'pending' });

  if (!record) {
    throw ApiError.notFound('Shortcut authorization code not found');
  }

  record.status = 'approved';
  record.userId = new Types.ObjectId(userId);
  await record.save();
};

export const exchangeToken = async (code: string): Promise<string | null> => {
  const record = await ShortcutToken.findOne({ code });

  if (!record || record.status === 'used') {
    throw ApiError.gone('Shortcut authorization code is no longer valid');
  }

  if (record.status === 'pending') {
    return null;
  }

  const token = jwt.sign({ userId: record.userId.toString() }, SHORTCUT_JWT_SECRET, {
    expiresIn: SHORTCUT_TOKEN_TTL,
  });

  record.status = 'used';
  await record.save();

  return token;
};

export const validateShortcutToken = (token: string): string => {
  try {
    const decoded = jwt.verify(token, SHORTCUT_JWT_SECRET) as JwtPayload;

    if (!decoded || typeof decoded.userId !== 'string') {
      throw ApiError.unauthorized('Invalid shortcut token');
    }

    return decoded.userId;
  } catch {
    throw ApiError.unauthorized('Invalid shortcut token');
  }
};

export interface ShortcutConnection {
  userId: string;
  connectedAt: Date;
}

export const getShortcutConnection = (token: string): ShortcutConnection => {
  try {
    const decoded = jwt.verify(token, SHORTCUT_JWT_SECRET) as JwtPayload;

    if (!decoded || typeof decoded.userId !== 'string' || typeof decoded.iat !== 'number') {
      throw ApiError.unauthorized('Invalid shortcut token');
    }

    return { userId: decoded.userId, connectedAt: new Date(decoded.iat * 1000) };
  } catch {
    throw ApiError.unauthorized('Invalid shortcut token');
  }
};

export const revokeAllForUser = async (userId: string): Promise<void> => {
  await ShortcutToken.deleteMany({ userId: new Types.ObjectId(userId) });
};

export const getShortcutCategories = async (userId: string): Promise<ShortcutCategory[]> => {
  // TODO(workspace-migration step 3): query by workspaceId per workspace instead of userId
  const categories = await Category.find({
    userId: new Types.ObjectId(userId),
    type: 'Expense',
  }).lean();

  const workspaceCount = await workspaceMemberRepository.countByUser(userId);

  if (workspaceCount <= 1) {
    return categories.map(category => ({
      id: category._id.toString(),
      name: category.name,
    }));
  }

  const workspaces = await Workspace.find({
    _id: { $in: categories.map(category => category.workspaceId).filter(Boolean) },
  }).lean();

  const workspaceById = new Map(workspaces.map(workspace => [workspace._id.toString(), workspace]));

  return categories.map(category => {
    const workspace = category.workspaceId
      ? workspaceById.get(category.workspaceId.toString())
      : undefined;

    return {
      id: category._id.toString(),
      name: category.name,
      workspaceName: workspace?.name,
      isPersonal: workspace?.type === 'personal',
    };
  });
};
