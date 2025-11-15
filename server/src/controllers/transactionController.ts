import { Response } from 'express';
import * as transactionService from '../services/transactionService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit, sort = 'desc', categoryId, year, month, search } = req.query;
    console.log(req.query);
    let fromDate: string | undefined;
    let toDate: string | undefined;

    if (year && month) {
      const y = parseInt(year as string, 10);
      const m = parseInt(month as string, 10) - 1;
      const start = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));
      const end = new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999));
      fromDate = start.toISOString();
      toDate = end.toISOString();
    }

    const result = await transactionService.findAll(req.userId!, {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      from: fromDate,
      to: toDate,
      sort: sort as 'asc' | 'desc',
      categoryId: categoryId as string | undefined,
      search: search as string | undefined,
    });

    res.json({ success: true, ...result });
  } catch (err) {
    console.error(err);
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

export const getTransactionSummary = async (req: AuthRequest, res: Response) => {
  try {
    const { year, month, accountId } = req.query;

    if (!year) {
      return res.status(400).json({ success: false, error: 'Year is required' });
    }

    let summary;

    if (month !== undefined) {
      summary = await transactionService.getTransactionSummary(
        req.userId!,
        Number(year),
        Number(month),
        accountId?.toString() || ''
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
    const transaction = await transactionService.create(req.body, req.userId!);
    res.status(201).json(transaction);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const updatedTransaction = await transactionService.update(
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
