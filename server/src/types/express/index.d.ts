declare namespace Express {
  interface Request {
    id: string;
    userId: string;
    userRole: 'admin' | 'user';
    validatedQuery?: unknown;
    validatedBody?: unknown;
  }
}
