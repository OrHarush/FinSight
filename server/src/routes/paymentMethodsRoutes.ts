import express from 'express';
import {
  getPaymentMethods,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  setPrimaryPaymentMethod,
} from '../controllers/paymentMethodController';

const router = express.Router();

router.get('/', getPaymentMethods);
router.get('/:id', getPaymentMethodById);
router.post('/', createPaymentMethod);
router.put('/:id', updatePaymentMethod);
router.post('/:id/set-primary', setPrimaryPaymentMethod);
router.delete('/:id', deletePaymentMethod);

export default router;
