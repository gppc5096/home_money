import { create } from 'zustand';

export interface Transaction {
  id: string;
  date: string;
  type: "수입" | "지출";
  관: string;
  항: string;
  목: string;
  amount: number;
  memo?: string;
}

interface TransactionState {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (transaction: Transaction) => void;
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

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: loadFromStorage(),

  setTransactions: (transactions) => {
    set({ transactions });
    saveToStorage(transactions);
  },

  addTransaction: (transaction) => {
    const { transactions } = get();
    const newTransactions = [...transactions, transaction];
    set({ transactions: newTransactions });
    saveToStorage(newTransactions);
  },

  updateTransaction: (updatedTransaction) => {
    const { transactions } = get();
    const newTransactions = transactions.map(transaction =>
      transaction.id === updatedTransaction.id ? updatedTransaction : transaction
    );
    set({ transactions: newTransactions });
    saveToStorage(newTransactions);
  },

  deleteTransaction: (transactionToDelete) => {
    const { transactions } = get();
    const newTransactions = transactions.filter(
      transaction => transaction.id !== transactionToDelete.id
    );
    set({ transactions: newTransactions });
    saveToStorage(newTransactions);
  }
})); 