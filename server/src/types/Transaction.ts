export interface TransactionQueryOptions {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  sort?: 'asc' | 'desc';
  categoryId?: string;
  accountId?: string;
}
