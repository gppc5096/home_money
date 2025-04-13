"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCategoryStore } from '@/store/categoryStore';
import { useTransactionStore } from '@/store/transactionStore';

interface TransactionFormProps {
  onCancel?: () => void;
  initialData?: any;
  onSubmit?: (data: any) => void;
  mode?: 'create' | 'edit';
}

export default function TransactionForm({ onCancel, initialData, onSubmit, mode = 'create' }: TransactionFormProps) {
  const router = useRouter();
  const { categories } = useCategoryStore();
  const { addTransaction, updateTransaction } = useTransactionStore();
  
  const [formData, setFormData] = useState({
    날짜: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
    유형: '지출',
    관: '',
    항: '',
    목: '',
    금액: '',
    메모: ''
  });

  // 초기 데이터가 있을 경우 폼 데이터 초기화
  useEffect(() => {
    if (initialData) {
      setFormData({
        날짜: initialData.날짜 || new Date().toISOString().split('T')[0].replace(/-/g, '.'),
        유형: initialData.유형 || '지출',
        관: initialData.관 || '',
        항: initialData.항 || '',
        목: initialData.목 || '',
        금액: initialData.금액?.toString() || '',
        메모: initialData.메모 || ''
      });
    }
  }, [initialData]);

  // 유형에 따른 카테고리 필터링
  const filteredCategories = categories.filter(cat => cat.유형 === formData.유형);
  const 관목록 = [...new Set(filteredCategories.map(cat => cat.관))];
  const 항목록 = [...new Set(filteredCategories.filter(cat => cat.관 === formData.관).map(cat => cat.항))];
  const 목목록 = filteredCategories
    .filter(cat => cat.관 === formData.관 && cat.항 === formData.항)
    .map(cat => cat.목);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionData = {
      ...formData,
      금액: Number(formData.금액),
      id: initialData?.id || Date.now().toString()
    };

    if (mode === 'edit' && initialData) {
      await updateTransaction(transactionData);
    } else {
      await addTransaction(transactionData);
    }

    if (onSubmit) {
      onSubmit(transactionData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
      {/* 날짜 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">날짜</label>
        <input
          type="date"
          value={formData.날짜.replace(/\./g, '-')}
          onChange={(e) => setFormData({ ...formData, 날짜: e.target.value.replace(/-/g, '.') })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      {/* 유형 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">유형</label>
        <select
          value={formData.유형}
          onChange={(e) => setFormData({ ...formData, 유형: e.target.value, 관: '', 항: '', 목: '' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        >
          <option value="지출">지출</option>
          <option value="수입">수입</option>
        </select>
      </div>

      {/* 관 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">관</label>
        <select
          value={formData.관}
          onChange={(e) => setFormData({ ...formData, 관: e.target.value, 항: '', 목: '' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        >
          <option value="">선택하세요</option>
          {관목록.map(관 => (
            <option key={관} value={관}>{관}</option>
          ))}
        </select>
      </div>

      {/* 항 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">항</label>
        <select
          value={formData.항}
          onChange={(e) => setFormData({ ...formData, 항: e.target.value, 목: '' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        >
          <option value="">선택하세요</option>
          {항목록.map(항 => (
            <option key={항} value={항}>{항}</option>
          ))}
        </select>
      </div>

      {/* 목 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">목</label>
        <select
          value={formData.목}
          onChange={(e) => setFormData({ ...formData, 목: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        >
          <option value="">선택하세요</option>
          {목목록.map(목 => (
            <option key={목} value={목}>{목}</option>
          ))}
        </select>
      </div>

      {/* 금액 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">금액</label>
        <input
          type="number"
          value={formData.금액}
          onChange={(e) => setFormData({ ...formData, 금액: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
          min="0"
        />
      </div>

      {/* 메모 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">메모</label>
        <textarea
          value={formData.메모}
          onChange={(e) => setFormData({ ...formData, 메모: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={3}
        />
      </div>

      {/* 버튼 그룹 */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {mode === 'edit' ? '수정' : '추가'}
        </button>
      </div>
    </form>
  );
} 