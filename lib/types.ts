export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export interface CreateExpenseInput {
  amount: number;
  category: string;
  description: string;
  date: string;
  idempotency_key?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Stats {
  monthly: { month: string; total: number; count: number }[];
  categories: { category: string; total: number; count: number }[];
}

export interface ApiError {
  error: string;
  details?: string[];
}

export const CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Other'
] as const;

export type Category = typeof CATEGORIES[number];
