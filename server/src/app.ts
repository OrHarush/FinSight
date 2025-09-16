import express, { Request, Response } from 'express';
import cors from 'cors';
import transactionRoutes from './routes/transactionRoutes';
import accountRoutes from './routes/accountRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/accounts', accountRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('FinSight server is running 🚀');
});

export default app;
