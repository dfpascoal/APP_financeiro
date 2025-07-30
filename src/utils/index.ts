import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Transaction, TransactionType } from '../types';

export const formatCurrency = (value: number, currency: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value);
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR });
};

export const formatMonth = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMMM yyyy', { locale: ptBR });
};

export const getTransactionIcon = (type: TransactionType): string => {
  switch (type) {
    case 'income':
      return '💰';
    case 'expense':
      return '💸';
    case 'transfer':
      return '🔄';
    default:
      return '📊';
  }
};

export const getTransactionColor = (type: TransactionType): string => {
  switch (type) {
    case 'income':
      return 'text-success-600';
    case 'expense':
      return 'text-danger-600';
    case 'transfer':
      return 'text-primary-600';
    default:
      return 'text-gray-600';
  }
};

export const calculateMonthlyIncome = (transactions: Transaction[]): number => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return transactions
    .filter(t => t.type === 'income' && new Date(t.date) >= startOfMonth)
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateMonthlyExpenses = (transactions: Transaction[]): number => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return transactions
    .filter(t => t.type === 'expense' && new Date(t.date) >= startOfMonth)
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateNetWorth = (accounts: { balance: number }[]): number => {
  return accounts.reduce((sum, account) => sum + account.balance, 0);
};

export const getCategoryColor = (color: string): string => {
  return color || '#6B7280';
};

export const generateId = (): string => {
  return crypto.randomUUID();
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}; 