"use client";

import { Transaction } from "@/store/transactionStore";
import { formatNumber } from "@/utils/formatNumber";

interface DateDividerProps {
  date: string;
  transactions: Transaction[];
}

export default function DateDivider({ date, transactions }: DateDividerProps) {
  const totalIncome = transactions
    .filter(t => t.type === "수입")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "지출")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="py-2">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-200">{date}</div>
        <div className="space-x-4 text-sm">
          <span className="text-green-500">
            수입: {formatNumber(totalIncome)}원
          </span>
          <span className="text-red-500">
            지출: {formatNumber(totalExpense)}원
          </span>
        </div>
      </div>
      <div className="mt-2 border-t border-gray-700" />
    </div>
  );
} 