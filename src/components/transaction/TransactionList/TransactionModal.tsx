"use client";

import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Transaction } from '@/store/transactionStore';
import { useCategoryStore } from '@/store/categoryStore';
import { Category } from '@/components/category/CategoryManager';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'edit' | 'delete';
  transaction?: Transaction;
  onConfirm: (transaction: Transaction) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  mode,
  transaction,
  onConfirm,
}) => {
  const [editedTransaction, setEditedTransaction] = useState<Transaction | undefined>(transaction);
  const { categories } = useCategoryStore();
  const [selectedType, setSelectedType] = useState<'수입' | '지출'>(transaction?.type || '지출');
  const [selectedGwan, setSelectedGwan] = useState<string>(transaction?.관 || '');
  const [selectedHang, setSelectedHang] = useState<string>(transaction?.항 || '');
  const [selectedMok, setSelectedMok] = useState<string>(transaction?.목 || '');

  useEffect(() => {
    if (transaction) {
      setEditedTransaction(transaction);
      setSelectedType(transaction.type);
      setSelectedGwan(transaction.관);
      setSelectedHang(transaction.항);
      setSelectedMok(transaction.목);
    }
  }, [transaction]);

  const filteredCategories = categories.filter(
    (category: Category) => category.유형 === selectedType
  );

  const gwanList = Array.from(
    new Set(filteredCategories.map((category: Category) => category.관))
  );

  const hangList = Array.from(
    new Set(
      filteredCategories
        .filter((category: Category) => category.관 === selectedGwan)
        .map((category: Category) => category.항)
    )
  );

  const mokList = Array.from(
    new Set(
      filteredCategories
        .filter(
          (category: Category) =>
            category.관 === selectedGwan && category.항 === selectedHang
        )
        .map((category: Category) => category.목)
    )
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTransaction) {
      onConfirm(editedTransaction);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (editedTransaction) {
      setEditedTransaction({
        ...editedTransaction,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as '수입' | '지출';
    setSelectedType(newType);
    setSelectedGwan('');
    setSelectedHang('');
    setSelectedMok('');
    if (editedTransaction) {
      setEditedTransaction({
        ...editedTransaction,
        type: newType,
        관: '',
        항: '',
        목: '',
      });
    }
  };

  const handleGwanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGwan = e.target.value;
    setSelectedGwan(newGwan);
    setSelectedHang('');
    setSelectedMok('');
    if (editedTransaction) {
      setEditedTransaction({
        ...editedTransaction,
        관: newGwan,
        항: '',
        목: '',
      });
    }
  };

  const handleHangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHang = e.target.value;
    setSelectedHang(newHang);
    setSelectedMok('');
    if (editedTransaction) {
      setEditedTransaction({
        ...editedTransaction,
        항: newHang,
        목: '',
      });
    }
  };

  const handleMokChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMok = e.target.value;
    setSelectedMok(newMok);
    if (editedTransaction) {
      setEditedTransaction({
        ...editedTransaction,
        목: newMok,
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
          <Dialog.Title className="text-lg font-medium mb-4">
            {mode === 'edit' ? '거래 수정' : '거래 삭제'}
          </Dialog.Title>

          {mode === 'edit' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">유형</label>
                <select
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="w-full bg-gray-700 rounded-md border-gray-600 text-white"
                >
                  <option value="수입">수입</option>
                  <option value="지출">지출</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">관</label>
                <select
                  value={selectedGwan}
                  onChange={handleGwanChange}
                  className="w-full bg-gray-700 rounded-md border-gray-600 text-white"
                >
                  <option value="">선택하세요</option>
                  {gwanList.map((gwan) => (
                    <option key={gwan} value={gwan}>
                      {gwan}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">항</label>
                <select
                  value={selectedHang}
                  onChange={handleHangChange}
                  className="w-full bg-gray-700 rounded-md border-gray-600 text-white"
                  disabled={!selectedGwan}
                >
                  <option value="">선택하세요</option>
                  {hangList.map((hang) => (
                    <option key={hang} value={hang}>
                      {hang}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">목</label>
                <select
                  value={selectedMok}
                  onChange={handleMokChange}
                  className="w-full bg-gray-700 rounded-md border-gray-600 text-white"
                  disabled={!selectedHang}
                >
                  <option value="">선택하세요</option>
                  {mokList.map((mok) => (
                    <option key={mok} value={mok}>
                      {mok}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">금액</label>
                <input
                  type="number"
                  name="amount"
                  value={editedTransaction?.amount || ''}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 rounded-md border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">날짜</label>
                <input
                  type="date"
                  name="date"
                  value={editedTransaction?.date || ''}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 rounded-md border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">메모</label>
                <textarea
                  name="memo"
                  value={editedTransaction?.memo || ''}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 rounded-md border-gray-600 text-white"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                >
                  수정
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p className="mb-4">이 거래를 삭제하시겠습니까?</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
                >
                  취소
                </button>
                <button
                  onClick={() => transaction && onConfirm(transaction)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
                >
                  삭제
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default TransactionModal; 