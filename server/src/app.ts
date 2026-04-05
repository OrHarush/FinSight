import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import helmet from 'helmet';

import { authLimiter } from './config/rateLimiters';
import { corsConfig } from './config/security';
import { mcpMiddleware } from './mcp/mcpServer';
import { authMiddleware } from './middlewares/authMiddleware';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware';
import { notFoundMiddleware } from './middlewares/notFoundMiddleware';
import accountRoutes from './routes/accountRoutes';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';
import budgetRoutes from './routes/budgetRoutes';
import categoryRoutes from './routes/categoryRoutes';
import chatRoutes from './routes/chatRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import importRoutes from './routes/importRoutes';
import paymentMethodRoutes from './routes/paymentMethodsRoutes';
import recurringTemplateRoutes from './routes/recurringTemplateRoutes';
import transactionRoutes from './routes/transactionRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  })
);

app.use(corsConfig);

app.use(express.json({ limit: '200kb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/api/auth', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api', authMiddleware);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/recurring-templates', recurringTemplateRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/import', importRoutes);

app.post('/mcp', mcpMiddleware);

app.get('/', (_req: Request, res: Response) => {
  res.send('FinSight server is running');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
