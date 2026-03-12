import helmet from 'helmet';
import cors from 'cors';

export const helmetConfig = helmet({
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
});

export const corsConfig = cors({
  origin: [
    'https://fin-sight-ors-projects-5fe0be55.vercel.app',
    'https://finsight-app.com',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

