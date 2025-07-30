import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Transaction, Category, Account, Budget } from '../types';

interface AppState {
  // User
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // Data
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  budgets: Budget[];
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  addAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  
  // Computed
  getTransactionsByAccount: (accountId: string) => Transaction[];
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  getAccountBalance: (accountId: string) => number;
  getTotalBalance: () => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      transactions: [],
      categories: [],
      accounts: [],
      budgets: [],
      
      // User actions
      setCurrentUser: (user) => set({ currentUser: user }),
      
      // Transaction actions
      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
        
        // Update account balance
        const { updateAccount } = get();
        const account = get().accounts.find(a => a.id === transaction.accountId);
        if (account) {
          const newBalance = account.balance + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
          updateAccount(account.id, { balance: newBalance, updatedAt: new Date() });
        }
      },
      
      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
          ),
        }));
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },
      
      // Category actions
      addCategory: (category) => {
        const newCategory: Category = {
          ...category,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },
      
      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
          ),
        }));
      },
      
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },
      
      // Account actions
      addAccount: (account) => {
        const newAccount: Account = {
          ...account,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          accounts: [...state.accounts, newAccount],
        }));
      },
      
      updateAccount: (id, updates) => {
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === id ? { ...a, ...updates, updatedAt: new Date() } : a
          ),
        }));
      },
      
      deleteAccount: (id) => {
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
        }));
      },
      
      // Budget actions
      addBudget: (budget) => {
        const newBudget: Budget = {
          ...budget,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          budgets: [...state.budgets, newBudget],
        }));
      },
      
      updateBudget: (id, updates) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b
          ),
        }));
      },
      
      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        }));
      },
      
      // Computed values
      getTransactionsByAccount: (accountId) => {
        return get().transactions.filter((t) => t.accountId === accountId);
      },
      
      getTransactionsByCategory: (categoryId) => {
        return get().transactions.filter((t) => t.categoryId === categoryId);
      },
      
      getAccountBalance: (accountId) => {
        const account = get().accounts.find((a) => a.id === accountId);
        return account?.balance || 0;
      },
      
      getTotalBalance: () => {
        return get().accounts.reduce((total, account) => total + account.balance, 0);
      },
    }),
    {
      name: 'financa-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        transactions: state.transactions,
        categories: state.categories,
        accounts: state.accounts,
        budgets: state.budgets,
      }),
    }
  )
); 