import { Request, Response } from 'express';
import * as transactionService from '../services/transactionService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await transactionService.getTransactions(req.userId!);
    res.json(transactions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getTransactionById = async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id, req.userId!);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await transactionService.createTransaction(req.body, req.userId!);
    res.status(201).json(transaction);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const updatedTransaction = await transactionService.updateTransaction(
      req.params.id,
      req.body,
      req.userId!
    );

    if (!updatedTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(updatedTransaction);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const transactionToDelete = await transactionService.deleteTransaction(
      req.params.id,
      req.userId!
    );

    if (!transactionToDelete) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
