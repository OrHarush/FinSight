import { Response } from 'express';
import * as paymentMethodService from '../services/paymentMethodService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getPaymentMethods = async (req: AuthRequest, res: Response) => {
  try {
    const methods = await paymentMethodService.findAll(req.userId!);
    res.json({ success: true, data: methods });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getPaymentMethodById = async (req: AuthRequest, res: Response) => {
  try {
    const method = await paymentMethodService.getById(req.params.id, req.userId!);

    if (!method) {
      return res.status(404).json({ success: false, error: 'Payment method not found' });
    }

    res.json({ success: true, data: method });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createPaymentMethod = async (req: AuthRequest, res: Response) => {
  try {
    const method = await paymentMethodService.create(req.body, req.userId!);
    res.status(201).json({ success: true, data: method });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const updatePaymentMethod = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await paymentMethodService.update(req.params.id, req.body, req.userId!);

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Payment method not found' });
    }

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const deletePaymentMethod = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await paymentMethodService.deleteById(req.params.id, req.userId!);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Payment method not found' });
    }

    res.json({ success: true, message: 'Payment method deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
