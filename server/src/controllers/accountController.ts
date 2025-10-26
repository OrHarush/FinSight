import { Response } from 'express';
import * as accountService from '../services/accountService';
import { AuthRequest } from '../middlewares/authMiddleware';
import { calculateAccountBalanceCurve } from '../services/balanceService';

export const getAccounts = async (req: AuthRequest, res: Response) => {
  try {
    const accounts = await accountService.findAll(req.userId!);
    res.json({ success: true, data: accounts });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getAccountById = async (req: AuthRequest, res: Response) => {
  try {
    const account = await accountService.getAccountById(req.params.id, req.userId!);

    if (!account) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }
    res.json({ success: true, data: account });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getAccountBalanceCurve = async (req: AuthRequest, res: Response) => {
  try {
    const { id: accountId } = req.params;
    const { from, to } = req.query;

    const data = await calculateAccountBalanceCurve(
      req.userId!,
      accountId,
      from as string | undefined,
      to as string | undefined
    );

    res.json({ success: true, data });
  } catch (err: any) {
    console.error('❌ Balance curve error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch balance curve' });
  }
};

export const createAccount = async (req: AuthRequest, res: Response) => {
  try {
    const account = await accountService.create(req.body, req.userId!);
    res.status(201).json({ success: true, data: account });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Invalid data' });
  }
};

export const updateAccount = async (req: AuthRequest, res: Response) => {
  try {
    const account = await accountService.update(req.params.id, req.body, req.userId!);

    if (!account) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }
    res.json({ success: true, data: account });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Invalid data' });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    const account = await accountService.deleteAccount(req.params.id, req.userId!);

    if (!account) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getLinkedTransactionsCount = async (req: AuthRequest, res: Response) => {
  try {
    const count = await accountService.getLinkedTransactionsCount(req.userId!, req.params.id);

    if (count === null) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }

    res.json({ success: true, count });
  } catch (err) {
    console.error('Error getting linked transactions count:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
