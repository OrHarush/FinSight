import { Response } from 'express';
import * as transactionService from '../services/transactionService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '20', from, to, sort = 'desc' } = req.query;

    const result = await transactionService.getTransactions(req.userId!, {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      from: from as string | undefined,
      to: to as string | undefined,
      sort: sort as 'asc' | 'desc',
    });

    console.log('==================');
    console.log(page);

    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch transactions' });
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

// GET /transactions/summary?year=2025 OR ?year=2025&month=9
export const getTransactionSummary = async (req: AuthRequest, res: Response) => {
  try {
    const { year, month } = req.query;

    if (!year) {
      return res.status(400).json({ success: false, error: 'Year is required' });
    }

    let summary;

    if (month !== undefined) {
      summary = await transactionService.getTransactionSummary(
        req.userId!,
        Number(year),
        Number(month)
      );
    } else {
      summary = await transactionService.getTransactionSummary(req.userId!, Number(year));
    }
    return res.json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch summary' });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await transactionService.createTransaction(req.body, req.userId!);
    res.status(201).json(transaction);
  } catch (err: any) {
    console.log(err);
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
