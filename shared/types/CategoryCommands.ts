export type CategoryType = 'Income' | 'Expense'

export interface CreateCategoryCommand {
    name: string;
    type: CategoryType;
    color?: string;
    icon?: string;
    monthlyLimit?: number;
}

export interface UpdateCategoryCommand {
    name?: string;
    type?: CategoryType;
    color?: string;
    icon?: string;
    monthlyLimit?: number;
}