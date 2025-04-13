"use client";

import { Transaction } from "@/store/transactionStore";
import { formatNumber } from "@/utils/formatNumber";

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export default function TransactionItem({
  transaction,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const { type, 관, 항, 목, amount, memo } = transaction;

  return (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${type === "수입" ? "text-green-500" : "text-red-500"}`}>
              {type}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-200">{관}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-200">{항}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-200">{목}</span>
          </div>
          {memo && (
            <div className="mt-1 text-sm text-gray-400">{memo}</div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className={`text-lg font-medium ${type === "수입" ? "text-green-500" : "text-red-500"}`}>
            {formatNumber(amount)}원
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(transaction)}
              className="text-blue-500 hover:text-blue-400 transition-colors"
            >
              수정
            </button>
            <button
              onClick={() => onDelete(transaction)}
              className="text-red-500 hover:text-red-400 transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 