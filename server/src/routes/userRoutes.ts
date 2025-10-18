import express from 'express';
import { deleteUserController } from '../controllers/userController';

const router = express.Router();

router.delete('/:userId', deleteUserController);

export default router;
