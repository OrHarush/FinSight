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
import adminRoutes from './routes/adminRoutes';
import { authMiddleware } from './middlewares/authMiddleware';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware';
import { mcpMiddleware } from './mcp/mcpServer';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { notFoundMiddleware } from './middlewares/notFoundMiddleware';

const app = express();
app.set('trust proxy', 1);

app.use(helmet());

app.use(
  cors({
    origin: [
      'https://fin-sight-ors-projects-5fe0be55.vercel.app',
      'https://finsight-app.com',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '200kb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api', authMiddleware);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

app.post('/mcp', mcpMiddleware);

app.get('/', (_req: Request, res: Response) => {
  res.send('FinSight server is running');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
