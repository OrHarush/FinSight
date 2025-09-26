import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import transactionRoutes from './routes/transactionRoutes';
import accountRoutes from './routes/accountRoutes';
import categoryRoutes from './routes/categoryRoutes';
import session from 'express-session';
import authRoutes from './routes/authRoutes';
import { authMiddleware } from './middlewares/authMiddleware';

const app = express();

app.use(cors());
app.use(express.json());
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || 'supersecret',
//     name: 'session',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 2,
//     },
//   })
// );

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', authMiddleware);
app.use('/api/transactions', transactionRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('FinSight server is running 🚀');
});

// app.get('/counter', (_req: Request, res: Response) => {
//   if (_req.session?.counter) {
//     _req.session.counter++;
//   } else {
//     _req.session.counter = 1;
//   }
//
//   res.send('Each refresh will get another counter!s');
// });
//
// app.get('/view', (_req: Request, res: Response) => {
//   if (_req.session?.counter) {
//     res.send('Counter value ' + _req.session.counter);
//     _req.session.counter++;
//   } else {
//     res.send('You dont have another counter!');
//   }
// });

export default app;
