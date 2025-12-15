import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import transactionRoutes from './routes/transactionRoutes';
import accountRoutes from './routes/accountRoutes';
import categoryRoutes from './routes/categoryRoutes';
import paymentMethodRoutes from './routes/paymentMethodsRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import { authMiddleware } from './middlewares/authMiddleware';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', authMiddleware);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('FinSight server is running 🚀');
});

app.use(errorHandlerMiddleware);

export default app;
