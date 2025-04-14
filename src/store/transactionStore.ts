import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  날짜: string;
  유형: "수입" | "지출";
  관: string;
  항: string;
  목: string;
  금액: number;
  메모?: string;
}

interface TransactionState {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (transaction: Transaction) => void;
  resetTransactions: () => void;
}

const STORAGE_KEY = 'transactions';

const loadFromStorage = (): Transaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('거래내역 로드 실패:', error);
    return [];
  }
};

const saveToStorage = (transactions: Transaction[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('거래내역 저장 실패:', error);
  }
};

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],

      setTransactions: (transactions) => {
        set({ transactions });
      },

      addTransaction: (transaction) => {
        const { transactions } = get();
        set({ transactions: [...transactions, transaction] });
      },

      updateTransaction: (updatedTransaction) => {
        const { transactions } = get();
        set({
          transactions: transactions.map(transaction =>
            transaction.id === updatedTransaction.id ? updatedTransaction : transaction
          )
        });
      },

      deleteTransaction: (transactionToDelete) => {
        const { transactions } = get();
        set({
          transactions: transactions.filter(
            transaction => transaction.id !== transactionToDelete.id
          )
        });
      },

      resetTransactions: () => {
        set({ transactions: [] });
      }
    }),
    {
      name: 'transaction-storage',
      getStorage: () => localStorage,
    }
  )
); 