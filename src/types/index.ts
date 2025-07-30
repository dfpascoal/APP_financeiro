export type UserType = 'PF' | 'PJ';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: TransactionType;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash';
  balance: number;
  currency: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  categoryId: string;
  period: 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBalance: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface DashboardData {
  summary: FinancialSummary;
  recentTransactions: Transaction[];
  topCategories: ChartData[];
  monthlyTrend: ChartData[];
  accountBalances: ChartData[];
} 