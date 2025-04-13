"use client";

import { Transaction } from "@/store/transactionStore";

const STORAGE_KEY = "transactions";

export const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return [];
  } catch (error) {
    console.error("거래 데이터 로드 중 오류 발생:", error);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error("거래 데이터 저장 중 오류 발생:", error);
  }
}; 