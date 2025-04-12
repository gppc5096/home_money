import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  날짜: string;
  유형: '수입' | '지출';
  관: string;
  항: string;
  목: string;
  금액: number;
  메모?: string;
}

interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (oldTransaction: Transaction, newTransaction: Transaction) => void;
  deleteTransaction: (transaction: Transaction) => void;
  setTransactions: (transactions: Transaction[]) => void;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transactions: [],
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [...state.transactions, transaction],
        })),
      updateTransaction: (oldTransaction, newTransaction) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t === oldTransaction ? newTransaction : t
          ),
        })),
      deleteTransaction: (transaction) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t !== transaction),
        })),
      setTransactions: (transactions) =>
        set(() => ({
          transactions,
        })),
    }),
    {
      name: 'transaction-storage',
    }
  )
); 