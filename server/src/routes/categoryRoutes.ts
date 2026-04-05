import { CreateCategorySchema, UpdateCategorySchema } from '@lyra/shared';
import express from 'express';

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '../controllers/categoryController';
import { validateBody } from '../middlewares/validate';

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', validateBody(CreateCategorySchema), createCategory);
router.put('/:id', validateBody(UpdateCategorySchema), updateCategory);
router.delete('/:id', deleteCategory);

export default router;
