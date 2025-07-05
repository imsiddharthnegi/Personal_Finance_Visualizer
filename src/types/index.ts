import { ObjectId } from 'mongodb';

export interface Transaction {
  _id?: ObjectId;
  amount: number;
  date: Date;
  description: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  _id?: ObjectId;
  category: string;
  monthlyLimit: number;
  month: string; // Format: YYYY-MM
  createdAt: Date;
  updatedAt: Date;
}

export interface MonthlyExpense {
  month: string;
  total: number;
}

export interface CategoryExpense {
  category: string;
  total: number;
  percentage: number;
}

export interface DashboardSummary {
  totalExpenses: number;
  categoryBreakdown: CategoryExpense[];
  recentTransactions: Transaction[];
  monthlyExpenses: MonthlyExpense[];
}

export interface BudgetComparison {
  category: string;
  budgeted: number;
  actual: number;
  percentage: number;
  status: 'under' | 'over' | 'on-track';
}

export const PREDEFINED_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Personal Care',
  'Other'
] as const;

export type Category = typeof PREDEFINED_CATEGORIES[number];

