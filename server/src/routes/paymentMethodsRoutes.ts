import { CreatePaymentMethodSchema, UpdatePaymentMethodSchema } from '@finsight/shared';
import express from 'express';

import {
  createPaymentMethod,
  deletePaymentMethod,
  getPaymentMethodById,
  getPaymentMethods,
  setPrimaryPaymentMethod,
  updatePaymentMethod,
} from '../controllers/paymentMethodController';
import { validateBody } from '../middlewares/validate';

const router = express.Router();

router.get('/', getPaymentMethods);
router.get('/:id', getPaymentMethodById);
router.post('/', validateBody(CreatePaymentMethodSchema), createPaymentMethod);
router.put('/:id', validateBody(UpdatePaymentMethodSchema), updatePaymentMethod);
router.patch('/:id/primary', setPrimaryPaymentMethod);
router.delete('/:id', deletePaymentMethod);

export default router;
