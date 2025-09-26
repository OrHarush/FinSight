import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const category = await categoryService.createCategory(req.body, req.userId!);
    res.status(201).json(category);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await categoryService.getCategories(req.userId!);
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategoryById = async (req: AuthRequest, res: Response) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id, req.userId!);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await categoryService.updateCategory(req.params.id, req.body, req.userId!);

    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await categoryService.deleteCategory(req.params.id, req.userId!);

    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
