import { Request, Response } from 'express';
import * as transactionService from '../services/transactionService';

export const getTransactions = async (_req: Request, res: Response) => {
  try {
    const transactions = await transactionService.getTransactions();
    res.json(transactions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json(transaction);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await transactionService.createTransaction(req.body);
    res.status(201).json(transaction);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const updated = await transactionService.updateTransaction(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Transaction not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const deleted = await transactionService.deleteTransaction(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
