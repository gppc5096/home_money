"use client";

import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { Transaction } from '@/store/transactionStore';
import { useCategoryStore } from '@/store/categoryStore';
import { formatNumber } from '@/utils/formatNumber';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'edit' | 'delete';
  transaction?: Transaction;
  onConfirm: (transaction?: Transaction) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  mode,
  transaction,
  onConfirm
}) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({});
  const { categories, loadCategories } = useCategoryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadCategories();
    setMounted(true);
  }, [loadCategories]);

  useEffect(() => {
    if (transaction && mode === 'edit') {
      setFormData(transaction);
    }
  }, [transaction, mode]);

  if (!isOpen || !transaction) return null;

  // 유형에 따른 관 목록
  const 관목록 = Array.from(new Set(
    categories
      .filter(cat => cat.유형 === formData.type)
      .map(cat => cat.관)
  ));

  // 선택된 관에 따른 항 목록
  const 항목록 = Array.from(new Set(
    categories
      .filter(cat => cat.유형 === formData.type && cat.관 === formData.관)
      .map(cat => cat.항)
  ));

  // 선택된 항에 따른 목 목록
  const 목목록 = Array.from(new Set(
    categories
      .filter(cat => 
        cat.유형 === formData.type && 
        cat.관 === formData.관 && 
        cat.항 === formData.항
      )
      .map(cat => cat.목)
  ));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(numericValue) || 0
      }));
      return;
    }

    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        type: value as "수입" | "지출",
        관: "",
        항: "",
        목: ""
      }));
      return;
    }

    if (name === '관') {
      setFormData(prev => ({
        ...prev,
        관: value,
        항: "",
        목: ""
      }));
      return;
    }

    if (name === '항') {
      setFormData(prev => ({
        ...prev,
        항: value,
        목: ""
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'edit' && formData) {
      onConfirm({
        ...transaction,
        ...formData
      });
    } else {
      onConfirm(transaction);
    }
  };

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">날짜</label>
            <input
              type="date"
              name="date"
              value={formData.date?.split('T')[0]}
              onChange={handleChange}
              className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">유형</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="수입"
                  checked={formData.type === "수입"}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>수입</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="지출"
                  checked={formData.type === "지출"}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>지출</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">관</label>
            <select
              name="관"
              value={formData.관}
              onChange={handleChange}
              className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">선택하세요</option>
              {관목록.map(관 => (
                <option key={관} value={관}>{관}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">항</label>
            <select
              name="항"
              value={formData.항}
              onChange={handleChange}
              className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={!formData.관}
            >
              <option value="">선택하세요</option>
              {항목록.map(항 => (
                <option key={항} value={항}>{항}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">목</label>
            <select
              name="목"
              value={formData.목}
              onChange={handleChange}
              className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={!formData.항}
            >
              <option value="">선택하세요</option>
              {목목록.map(목 => (
                <option key={목} value={목}>{목}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">금액</label>
            <input
              type="text"
              name="amount"
              value={formatNumber(formData.amount || 0)}
              onChange={handleChange}
              className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">메모</label>
            <input
              type="text"
              name="memo"
              value={formData.memo || ''}
              onChange={handleChange}
              className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
      </div>
    </div>
  );
};

export default TransactionModal; 