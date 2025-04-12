"use client";

import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

interface Transaction {
  날짜: string;
  유형: '수입' | '지출';
  관: string;
  항: string;
  목: string;
  금액: number;
  메모?: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction;
  mode: 'edit' | 'delete';
  onConfirm: (transaction?: Transaction) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
  mode,
  onConfirm
}) => {
  const [editedTransaction, setEditedTransaction] = useState<Transaction | undefined>(transaction);

  useEffect(() => {
    setEditedTransaction(transaction);
  }, [transaction]);

  if (!isOpen) return null;

  if (mode === 'delete') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">거래내역 삭제</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <IoClose size={24} />
            </button>
          </div>
          <p className="text-gray-300 mb-6">
            이 거래내역을 삭제하시겠습니까?<br />
            삭제된 데이터는 복구할 수 없습니다.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => onConfirm(transaction)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              삭제
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">거래내역 수정</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <IoClose size={24} />
          </button>
        </div>
        {editedTransaction && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onConfirm(editedTransaction);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm text-gray-400 mb-1">날짜</label>
              <input
                type="date"
                value={editedTransaction.날짜.split('.').join('-')}
                onChange={(e) => setEditedTransaction({
                  ...editedTransaction,
                  날짜: e.target.value.split('-').join('.')
                })}
                className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">유형</label>
              <select
                value={editedTransaction.유형}
                onChange={(e) => setEditedTransaction({
                  ...editedTransaction,
                  유형: e.target.value as '수입' | '지출'
                })}
                className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="수입">수입</option>
                <option value="지출">지출</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">관</label>
                <input
                  type="text"
                  value={editedTransaction.관}
                  onChange={(e) => setEditedTransaction({
                    ...editedTransaction,
                    관: e.target.value
                  })}
                  className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">항</label>
                <input
                  type="text"
                  value={editedTransaction.항}
                  onChange={(e) => setEditedTransaction({
                    ...editedTransaction,
                    항: e.target.value
                  })}
                  className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">목</label>
                <input
                  type="text"
                  value={editedTransaction.목}
                  onChange={(e) => setEditedTransaction({
                    ...editedTransaction,
                    목: e.target.value
                  })}
                  className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">금액</label>
              <input
                type="number"
                value={editedTransaction.금액}
                onChange={(e) => setEditedTransaction({
                  ...editedTransaction,
                  금액: parseInt(e.target.value) || 0
                })}
                className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">메모</label>
              <textarea
                value={editedTransaction.메모 || ''}
                onChange={(e) => setEditedTransaction({
                  ...editedTransaction,
                  메모: e.target.value
                })}
                className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 h-24"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                수정
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                취소
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TransactionModal; 