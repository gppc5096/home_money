"use client";

import { useState, useEffect } from "react";
import { useCategoryStore } from "@/store/categoryStore";
import { formatAmount, parseAmount } from "@/utils/formatters";
import { useTransactionStore } from "@/store/transactionStore";
import toast from "react-hot-toast";
import { format } from 'date-fns';

interface FormData {
  date: string;
  유형: "수입" | "지출";
  관: string;
  항: string;
  목: string;
  amount: string;
  memo: string;
}

const initialFormData: FormData = {
  date: format(new Date(), 'yyyy-MM-dd'),
  유형: "지출",
  관: "",
  항: "",
  목: "",
  amount: "",
  memo: ""
};

export default function TransactionForm() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const { categories, loadCategories } = useCategoryStore();
  const { addTransaction } = useTransactionStore();

  // 컴포넌트 마운트 시 카테고리 데이터 로드
  useEffect(() => {
    const initializeData = async () => {
      try {
        await loadCategories();
        setMounted(true);
      } catch (error) {
        console.error('카테고리 데이터 로드 실패:', error);
        toast.error('카테고리 데이터를 불러오는데 실패했습니다.');
      }
    };

    initializeData();
  }, [loadCategories]);

  // 카테고리 데이터가 변경될 때마다 선택된 값들 유효성 검사
  useEffect(() => {
    if (mounted && categories.length > 0) {
      const isValidCategory = categories.some(cat => 
        cat.유형 === formData.유형 && 
        cat.관 === formData.관 && 
        cat.항 === formData.항 && 
        cat.목 === formData.목
      );

      if (!isValidCategory && formData.관) {
        setFormData(prev => ({
          ...prev,
          관: "",
          항: "",
          목: ""
        }));
      }
    }
  }, [categories, mounted, formData.유형]);

  // 유형에 따른 관 목록
  const 관목록 = Array.from(new Set(
    categories
      .filter(cat => cat.유형 === formData.유형)
      .map(cat => cat.관)
  ));

  // 선택된 관에 따른 항 목록
  const 항목록 = Array.from(new Set(
    categories
      .filter(cat => cat.유형 === formData.유형 && cat.관 === formData.관)
      .map(cat => cat.항)
  ));

  // 선택된 항에 따른 목 목록
  const 목목록 = Array.from(new Set(
    categories
      .filter(cat => 
        cat.유형 === formData.유형 && 
        cat.관 === formData.관 && 
        cat.항 === formData.항
      )
      .map(cat => cat.목)
  ));

  if (!mounted) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-700 rounded-md" />
        <div className="h-10 bg-gray-700 rounded-md" />
        <div className="h-10 bg-gray-700 rounded-md" />
        <div className="h-10 bg-gray-700 rounded-md" />
        <div className="h-10 bg-gray-700 rounded-md" />
      </div>
    );
  }

  // 입력값 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // 금액 입력 처리
    if (name === 'amount') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
      return;
    }

    // 유형 변경 시 관련 필드 초기화
    if (name === '유형') {
      setFormData(prev => ({
        ...prev,
        유형: value as "수입" | "지출",
        관: "",
        항: "",
        목: ""
      }));
      return;
    }

    // 관 변경 시 항, 목 초기화
    if (name === '관') {
      setFormData(prev => ({
        ...prev,
        관: value,
        항: "",
        목: ""
      }));
      return;
    }

    // 항 변경 시 목 초기화
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

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.date) {
      newErrors.date = '날짜를 선택해주세요.';
    }

    if (!formData.관) {
      newErrors.관 = '관을 선택해주세요.';
    }

    if (!formData.항) {
      newErrors.항 = '항을 선택해주세요.';
    }

    if (!formData.목) {
      newErrors.목 = '목을 선택해주세요.';
    }

    if (!formData.amount) {
      newErrors.amount = '금액을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const newTransaction = {
        id: Date.now().toString(),
        date: formData.date,
        type: formData.유형,
        관: formData.관,
        항: formData.항,
        목: formData.목,
        amount: parseInt(formData.amount),
        memo: formData.memo
      };

      await addTransaction(newTransaction);
      toast.success('거래가 추가되었습니다.');
      
      // 폼 초기화
      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      console.error('거래 추가 실패:', error);
      toast.error('거래 추가에 실패했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">날짜</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.date ? 'border-red-500' : ''
            }`}
          />
          {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">유형</label>
          <select
            name="유형"
            value={formData.유형}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="지출">지출</option>
            <option value="수입">수입</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">관</label>
          <select
            name="관"
            value={formData.관}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.관 ? 'border-red-500' : ''
            }`}
          >
            <option value="">선택하세요</option>
            {관목록.map(관 => (
              <option key={관} value={관}>{관}</option>
            ))}
          </select>
          {errors.관 && <p className="mt-1 text-sm text-red-500">{errors.관}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">항</label>
          <select
            name="항"
            value={formData.항}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.항 ? 'border-red-500' : ''
            }`}
          >
            <option value="">선택하세요</option>
            {항목록.map(항 => (
              <option key={항} value={항}>{항}</option>
            ))}
          </select>
          {errors.항 && <p className="mt-1 text-sm text-red-500">{errors.항}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">목</label>
          <select
            name="목"
            value={formData.목}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.목 ? 'border-red-500' : ''
            }`}
          >
            <option value="">선택하세요</option>
            {목목록.map(목 => (
              <option key={목} value={목}>{목}</option>
            ))}
          </select>
          {errors.목 && <p className="mt-1 text-sm text-red-500">{errors.목}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">금액</label>
          <input
            type="text"
            name="amount"
            value={formData.amount ? formatAmount(formData.amount) : ''}
            onChange={handleChange}
            placeholder="0"
            className={`mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.amount ? 'border-red-500' : ''
            }`}
          />
          {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">메모</label>
        <input
          type="text"
          name="memo"
          value={formData.memo}
          onChange={handleChange}
          placeholder="메모를 입력하세요"
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          거래 추가
        </button>
      </div>
    </form>
  );
} 