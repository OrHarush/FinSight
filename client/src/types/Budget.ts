export interface BudgetFormValues {
  categoryId: string;
  limit: number;
  applyToRestOfYear: boolean;
}

export interface BudgetDto {
  _id: string;
  userId: string;
  categoryId: string;
  year: number;
  month: number;
  limit: number;
  createdAt: string;
  updatedAt: string;
}
