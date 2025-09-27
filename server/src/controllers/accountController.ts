import { Request, Response } from 'express';
import * as accountService from '../services/accountService';
import { updateAccount } from '../services/accountService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getAccounts = async (req: AuthRequest, res: Response) => {
  try {
    console.log(req.userId);
    const accounts = await accountService.getAccounts(req.userId!);
    console.log(accounts);
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createAccount = async (req: AuthRequest, res: Response) => {
  try {
    const account = await accountService.createAccount(req.body, req.userId!);
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err });
  }
};

export const getAccountById = async (req: AuthRequest, res: Response) => {
  try {
    const account = await accountService.getAccountById(req.params.id, req.userId!);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAccountBalance = async (req: AuthRequest, res: Response) => {
  try {
    const { balance } = req.body;
    const account = await accountService.updateAccount(req.params.id, balance, req.userId!);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json(account);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    const account = await accountService.deleteAccount(req.params.id, req.userId!);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
