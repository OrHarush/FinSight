import crypto from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

import { ApiError } from '../errors/ApiError';
import ShortcutToken from '../models/ShortcutToken';
import * as categoryRepository from '../repositories/categoryRepository';
import * as workspaceMemberRepository from '../repositories/workspaceMemberRepository';
import * as workspaceRepository from '../repositories/workspaceRepository';

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

const ANDROID_WALLET_AMOUNT_PATTERN = /(\d+(?:[.,]\d{2}))/;

export const parseAndroidWalletAmount = (text: string): number => {
  const match = text.match(ANDROID_WALLET_AMOUNT_PATTERN);

  if (!match) {
    throw ApiError.badRequest('Could not parse amount');
  }

  return Number(match[1].replace(',', '.'));
};

export const resolveWorkspaceForCategory = async (
  userId: string,
  categoryId: string
): Promise<string> => {
  const category = await categoryRepository.findByIdUnscoped(categoryId);

  if (!category?.workspaceId) {
    throw ApiError.badRequest('Category not found');
  }

  const membership = await workspaceMemberRepository.findOne(category.workspaceId, userId);

  if (!membership) {
    throw ApiError.forbidden('Category does not belong to your workspaces');
  }

  return category.workspaceId.toString();
};

export const getShortcutCategories = async (userId: string): Promise<ShortcutCategory[]> => {
  const memberships = await workspaceMemberRepository.findByUser(userId);
  const workspaceIds = memberships.map(membership => membership.workspaceId);

  const workspaces = await workspaceRepository.findManyByIds(workspaceIds);
  const workspaceById = new Map(
    workspaces.map(workspace => [workspace._id.toString(), workspace])
  );

  const isSingleWorkspace = workspaceIds.length <= 1;

  const perWorkspaceCategories = await Promise.all(
    workspaceIds.map(workspaceId =>
      categoryRepository.findByType(workspaceId.toString(), 'Expense')
    )
  );

  return perWorkspaceCategories.flatMap(categories =>
    categories.map(category => {
      const workspace = category.workspaceId
        ? workspaceById.get(category.workspaceId.toString())
        : undefined;

      if (isSingleWorkspace) {
        return { id: category._id.toString(), name: category.name };
      }

      return {
        id: category._id.toString(),
        name: category.name,
        workspaceName: workspace?.name,
        isPersonal: workspace?.type === 'personal',
      };
    })
  );
};
