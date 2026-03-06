export interface CreateBudgetCommand {
  categoryId: string;
  year: number;
  month: number; // 0-11 (JavaScript month format)
  limit: number;
}

export interface UpdateBudgetCommand {
  limit?: number;
}

// For bulk operations like "apply to rest of year"
export interface BulkCreateBudgetCommand {
  categoryId: string;
  year: number;
  startMonth: number; // 0-11
  endMonth: number; // 0-11
  limit: number;
}

