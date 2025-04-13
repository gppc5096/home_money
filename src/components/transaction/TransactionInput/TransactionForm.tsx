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

  // 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.date) {
      newErrors.date = "날짜를 선택해주세요";
    }
    if (!formData.관) {
      newErrors.관 = "관을 선택해주세요";
    }
    if (!formData.항) {
      newErrors.항 = "항을 선택해주세요";
    }
    if (!formData.목) {
      newErrors.목 = "목을 선택해주세요";
    }
    if (!formData.amount) {
      newErrors.amount = "금액을 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("필수 항목을 모두 입력해주세요");
      return;
    }

    try {
      // 날짜를 ISO 문자열로 변환하여 저장
      const transactionDate = new Date(formData.date);
      if (isNaN(transactionDate.getTime())) {
        throw new Error('유효하지 않은 날짜입니다');
      }

      addTransaction({
        id: crypto.randomUUID(),
        date: transactionDate.toISOString(),
        type: formData.유형,
        관: formData.관,
        항: formData.항,
        목: formData.목,
        amount: parseInt(formData.amount),
        memo: formData.memo
      });

      toast.success("거래가 추가되었습니다");
      setFormData(initialFormData);
    } catch (error) {
      toast.error("거래 추가 중 오류가 발생했습니다");
      console.error("거래 추가 오류:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 날짜 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          날짜 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
      </div>

      {/* 유형 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          유형 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="유형"
              value="수입"
              checked={formData.유형 === "수입"}
              onChange={handleChange}
              className="text-purple-500 focus:ring-purple-500 h-4 w-4 mr-2"
            />
            <span className="text-white">수입</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="유형"
              value="지출"
              checked={formData.유형 === "지출"}
              onChange={handleChange}
              className="text-purple-500 focus:ring-purple-500 h-4 w-4 mr-2"
            />
            <span className="text-white">지출</span>
          </label>
        </div>
      </div>

      {/* 관 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          관 <span className="text-red-500">*</span>
        </label>
        <select
          name="관"
          value={formData.관}
          onChange={handleChange}
          className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">선택하세요</option>
          {관목록.map(관 => (
            <option key={관} value={관}>{관}</option>
          ))}
        </select>
        {errors.관 && <p className="text-red-500 text-sm mt-1">{errors.관}</p>}
      </div>

      {/* 항 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          항 <span className="text-red-500">*</span>
        </label>
        <select
          name="항"
          value={formData.항}
          onChange={handleChange}
          disabled={!formData.관}
          className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        >
          <option value="">선택하세요</option>
          {항목록.map(항 => (
            <option key={항} value={항}>{항}</option>
          ))}
        </select>
        {errors.항 && <p className="text-red-500 text-sm mt-1">{errors.항}</p>}
      </div>

      {/* 목 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          목 <span className="text-red-500">*</span>
        </label>
        <select
          name="목"
          value={formData.목}
          onChange={handleChange}
          disabled={!formData.항}
          className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        >
          <option value="">선택하세요</option>
          {목목록.map(목 => (
            <option key={목} value={목}>{목}</option>
          ))}
        </select>
        {errors.목 && <p className="text-red-500 text-sm mt-1">{errors.목}</p>}
      </div>

      {/* 금액 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          금액 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="amount"
          value={formatAmount(formData.amount)}
          onChange={handleChange}
          placeholder="0"
          className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
      </div>

      {/* 메모 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          메모
        </label>
        <input
          type="text"
          name="memo"
          value={formData.memo}
          onChange={handleChange}
          placeholder="메모를 입력하세요"
          className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* 제출 버튼 */}
      <div>
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          거래 추가
        </button>
      </div>
    </form>
  );
} 