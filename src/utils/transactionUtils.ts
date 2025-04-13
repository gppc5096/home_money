"use client";

import { Transaction } from "@/store/transactionStore";
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = "transactions";
const DEFAULT_TRANSACTION_PATH = '/1-거래내역.json'; // 경로 수정

interface RawTransaction {
  날짜: string;
  유형: "수입" | "지출";
  관: string;
  항: string;
  목: string;
  금액: number;
  메모?: string;
}

export const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    // 먼저 localStorage 확인
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log('Data loaded from localStorage:', parsedData);
      if (parsedData && parsedData.length > 0) {
        return parsedData;
      }
    }

    // localStorage에 데이터가 없으면 JSON 파일에서 로드
    console.log('Fetching from:', DEFAULT_TRANSACTION_PATH);
    const response = await fetch(DEFAULT_TRANSACTION_PATH);
    
    if (!response.ok) {
      throw new Error(`JSON 파일을 불러오는데 실패했습니다. Status: ${response.status}`);
    }
    
    const rawData: RawTransaction[] = await response.json();
    console.log('Raw data loaded:', rawData);
    
    // 각 거래 데이터에 고유 ID 추가
    const data: Transaction[] = rawData.map(transaction => ({
      ...transaction,
      id: uuidv4()
    }));
    
    // 불러온 데이터를 localStorage에 저장
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('Data saved to localStorage:', data);
    
    return data;
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