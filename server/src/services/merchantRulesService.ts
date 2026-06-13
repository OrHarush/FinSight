import { IMerchantRule } from '../models/MerchantRule';
import * as merchantRuleRepository from '../repositories/merchantRuleRepository';

const normalizeMerchant = (raw: string): string => raw.trim().toLowerCase();

export const lookupRule = (
  userId: string,
  rawMerchant: string
): Promise<IMerchantRule | null> =>
  merchantRuleRepository.findByMatchKey(userId, normalizeMerchant(rawMerchant));

export const upsertRule = (
  userId: string,
  rawMerchant: string,
  data: { alias?: string | null; categoryId?: string | null }
) => merchantRuleRepository.upsert(userId, normalizeMerchant(rawMerchant), data);
