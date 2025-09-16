import { Request, Response } from 'express';
import * as accountService from '../services/accountService';

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await accountService.getAccounts();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createAccount = async (req: Request, res: Response) => {
  try {
    const account = await accountService.createAccount(req.body);
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err });
  }
};

export const getAccountById = async (req: Request, res: Response) => {
  try {
    const account = await accountService.getAccountById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAccountBalance = async (req: Request, res: Response) => {
  try {
    const { balance } = req.body;
    const account = await accountService.updateAccountBalance(req.params.id, balance);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json(account);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const account = await accountService.deleteAccount(req.params.id);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
