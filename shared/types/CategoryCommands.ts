import {PresetColor} from "./colors";
import {DefaultCategoryKey} from "./defaultCategories";

export type CategoryType = 'Income' | 'Expense'

export interface CreateCategoryCommand {
    key?: DefaultCategoryKey;
    name: string;
    type: CategoryType;
    color?: PresetColor;
    icon?: string;
    monthlyLimit?: number;
}

export interface UpdateCategoryCommand {
    name?: string;
    type?: CategoryType;
    color?: PresetColor;
    icon?: string;
    monthlyLimit?: number;
}