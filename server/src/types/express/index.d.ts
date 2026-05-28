declare namespace Express {
  interface Request {
    id: string;
    userId: string;
    userRole: 'admin' | 'user';
    workspaceId: string;
    validatedQuery?: unknown;
    validatedBody?: unknown;
  }
}
