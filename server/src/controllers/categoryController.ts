import { Response } from 'express';
import * as categoryService from '../services/categoryService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const category = await categoryService.createCategory(req.body, req.userId!);
    res.status(201).json({ success: true, data: category });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await categoryService.getCategories(req.userId!);
    res.json({ success: true, data: categories });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getCategoryById = async (req: AuthRequest, res: Response) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id, req.userId!);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    res.json({ success: true, data: category });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await categoryService.updateCategory(req.params.id, req.body, req.userId!);

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await categoryService.deleteCategory(req.params.id, req.userId!);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
