"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCategoryStore } from '@/store/categoryStore';
import { useTransactionStore } from '@/store/transactionStore';
import { v4 as uuidv4 } from 'uuid';

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
  
  // 날짜 문자열을 YYYY.MM.DD 형식으로 변환
  const formatDateString = (dateStr: string): string => {
    try {
      // 날짜가 이미 YYYY.MM.DD 형식인 경우
      if (dateStr.includes('.')) {
        const [year, month, day] = dateStr.split('.');
        if (year && month && day) {
          return `${year}.${month}.${day}`;
        }
      }
      
      // YYYY-MM-DD 형식인 경우
      if (dateStr.includes('-')) {
        const [year, month, day] = dateStr.split('-');
        if (year && month && day) {
          return `${year}.${month}.${day}`;
        }
      }

      // 유효한 날짜 문자열이 아닌 경우 현재 날짜 사용
      const today = new Date();
      return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    } catch (error) {
      console.error('날짜 형식 변환 오류:', error);
      const today = new Date();
      return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    }
  };

  // 날짜를 YYYY-MM-DD 형식으로 변환 (input type="date"용)
  const formatDateForInput = (dateStr: string): string => {
    try {
      const [year, month, day] = dateStr.split('.');
      return `${year}-${month}-${day}`;
    } catch (error) {
      return new Date().toISOString().split('T')[0];
    }
  };

  const [formData, setFormData] = useState({
    날짜: initialData?.날짜 ? formatDateForInput(initialData.날짜) : new Date().toISOString().split('T')[0],
    유형: initialData?.유형 || '지출',
    관: initialData?.관 || '',
    항: initialData?.항 || '',
    목: initialData?.목 || '',
    금액: initialData?.금액 ? Number(initialData.금액).toLocaleString('ko-KR') : '',
    메모: initialData?.메모 || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 유형에 따른 카테고리 필터링
  const filteredCategories = categories.filter(cat => cat.유형 === formData.유형);
  const 관목록 = [...new Set(filteredCategories.map(cat => cat.관))];
  const 항목록 = [...new Set(filteredCategories.filter(cat => cat.관 === formData.관).map(cat => cat.항))];
  const 목목록 = filteredCategories
    .filter(cat => cat.관 === formData.관 && cat.항 === formData.항)
    .map(cat => cat.목);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 날짜 검증
    if (!formData.날짜) {
      newErrors.날짜 = '날짜를 선택해주세요';
    }

    // 유형 검증
    if (!formData.유형 || !['수입', '지출'].includes(formData.유형)) {
      newErrors.유형 = '유형을 선택해주세요';
    }

    // 관/항/목 검증
    if (!formData.관) {
      newErrors.관 = '관을 선택해주세요';
    }
    if (!formData.항) {
      newErrors.항 = '항을 선택해주세요';
    }
    if (!formData.목) {
      newErrors.목 = '목을 선택해주세요';
    }

    // 금액 검증
    const amountValue = Number(formData.금액.replace(/[,]/g, ''));
    if (!formData.금액 || isNaN(amountValue) || amountValue <= 0) {
      newErrors.금액 = '올바른 금액을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('폼 제출 시작 - 모드:', mode);  // 모드 로깅 추가
    
    if (!validateForm()) {
      console.log('폼 검증 실패:', errors);  // 검증 실패 시 에러 로깅
      return;
    }

    try {
      // 입력된 폼 데이터 로깅
      console.log('=== 거래 저장 프로세스 시작 ===');
      console.log('1. 원본 폼 데이터:', {
        ...formData,
        mode: mode,
        isEdit: mode === 'edit',
        hasInitialData: !!initialData
      });

      const transactionData = normalizeTransactionData({
        id: initialData?.id,
        날짜: formData.날짜,
        유형: formData.유형,
        관: formData.관,
        항: formData.항,
        목: formData.목,
        금액: formData.금액,
        메모: formData.메모
      });

      // 정규화된 데이터 로깅
      console.log('2. 정규화된 데이터:', transactionData);

      if (mode === 'edit' && initialData) {
        console.log('3. 수정 모드로 저장 실행');
        await updateTransaction(transactionData);
      } else {
        console.log('3. 신규 저장 모드로 저장 실행');
        await addTransaction(transactionData);
      }

      console.log('4. 저장 완료');

      if (onSubmit) {
        console.log('5. onSubmit 콜백 실행');
        onSubmit(transactionData);
      }

      console.log('=== 거래 저장 프로세스 완료 ===');
    } catch (error) {
      console.error('거래 저장 실패:', error);
      console.error('실패 시 데이터 상태:', { formData, mode, initialData });
      setErrors({ submit: error instanceof Error ? error.message : '거래 저장에 실패했습니다' });
    }
  };

  // 금액 입력 처리
  const handleAmountChange = (value: string) => {
    try {
      // 숫자와 콤마만 허용
      const cleanValue = value.replace(/[^\d,]/g, '');
      // 콤마 제거 후 숫자만
      const numberValue = cleanValue.replace(/,/g, '');
      
      if (numberValue) {
        const numAmount = Number(numberValue);
        if (!isNaN(numAmount) && numAmount >= 0) {
          // 숫자를 천단위 구분자가 있는 문자열로 변환
          const formattedValue = numAmount.toLocaleString('ko-KR');
          setFormData(prev => ({ ...prev, 금액: formattedValue }));
        }
      } else {
        setFormData(prev => ({ ...prev, 금액: '' }));
      }
    } catch (error) {
      console.error('금액 변환 오류:', error);
      setFormData(prev => ({ ...prev, 금액: '' }));
    }
  };

  // normalizeTransactionData 함수 내부에도 로깅 추가
  const normalizeTransactionData = (data: any) => {
    console.log('데이터 정규화 시작:', data);
    
    // 날짜 정규화 - YYYY.MM.DD 형식 강제
    let normalizedDate;
    try {
      if (data.날짜.includes('-')) {
        const [year, month, day] = data.날짜.split('-');
        normalizedDate = `${year}.${month.padStart(2, '0')}.${day.padStart(2, '0')}`;
        console.log('날짜 변환 (하이픈):', data.날짜, '->', normalizedDate);
      } else if (data.날짜.includes('.')) {
        const [year, month, day] = data.날짜.split('.');
        normalizedDate = `${year}.${month.padStart(2, '0')}.${day.padStart(2, '0')}`;
        console.log('날짜 변환 (점):', data.날짜, '->', normalizedDate);
      } else {
        throw new Error('잘못된 날짜 형식');
      }

      // 날짜 유효성 검증
      const [year, month, day] = normalizedDate.split('.');
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      if (isNaN(date.getTime())) {
        throw new Error('유효하지 않은 날짜입니다');
      }
    } catch (error) {
      console.error('날짜 정규화 오류:', error);
      const today = new Date();
      normalizedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
      console.log('날짜 오류로 인한 현재 날짜 사용:', normalizedDate);
    }
    
    // 금액 정규화 - 숫자로 변환
    const normalizedAmount = Number(String(data.금액).replace(/[,]/g, ''));
    console.log('금액 정규화:', data.금액, '->', normalizedAmount);
    
    if (isNaN(normalizedAmount) || normalizedAmount <= 0) {
      throw new Error('올바르지 않은 금액 형식입니다');
    }

    // 유형 정규화
    if (!['수입', '지출'].includes(data.유형)) {
      throw new Error('올바르지 않은 유형입니다');
    }

    // 필수 필드 검증
    if (!data.관?.trim() || !data.항?.trim() || !data.목?.trim()) {
      throw new Error('관/항/목은 필수 입력 항목입니다');
    }

    const normalizedData = {
      id: data.id || uuidv4(),
      날짜: normalizedDate,
      유형: data.유형,
      관: data.관.trim(),
      항: data.항.trim(),
      목: data.목.trim(),
      금액: normalizedAmount,
      메모: data.메모?.trim() || '-'
    };

    console.log('최종 정규화된 데이터:', normalizedData);
    return normalizedData;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
      {/* 날짜 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">날짜</label>
        <input
          type="date"
          value={formData.날짜}
          onChange={(e) => setFormData({ ...formData, 날짜: e.target.value })}
          className={`w-full px-6 py-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base ${
            errors.날짜 ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.날짜 && <p className="mt-1 text-sm text-red-500">{errors.날짜}</p>}
      </div>

      {/* 유형 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">유형</label>
        <select
          value={formData.유형}
          onChange={(e) => setFormData({ ...formData, 유형: e.target.value, 관: '', 항: '', 목: '' })}
          className={`w-full px-6 py-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base ${
            errors.유형 ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value="지출">지출</option>
          <option value="수입">수입</option>
        </select>
        {errors.유형 && <p className="mt-1 text-sm text-red-500">{errors.유형}</p>}
      </div>

      {/* 관 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">관</label>
        <select
          value={formData.관}
          onChange={(e) => setFormData({ ...formData, 관: e.target.value, 항: '', 목: '' })}
          className={`w-full px-6 py-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base ${
            errors.관 ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value="">선택하세요</option>
          {관목록.map(관 => (
            <option key={관} value={관}>{관}</option>
          ))}
        </select>
        {errors.관 && <p className="mt-1 text-sm text-red-500">{errors.관}</p>}
      </div>

      {/* 항 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">항</label>
        <select
          value={formData.항}
          onChange={(e) => setFormData({ ...formData, 항: e.target.value, 목: '' })}
          className={`w-full px-6 py-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base ${
            errors.항 ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value="">선택하세요</option>
          {항목록.map(항 => (
            <option key={항} value={항}>{항}</option>
          ))}
        </select>
        {errors.항 && <p className="mt-1 text-sm text-red-500">{errors.항}</p>}
      </div>

      {/* 목 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">목</label>
        <select
          value={formData.목}
          onChange={(e) => setFormData({ ...formData, 목: e.target.value })}
          className={`w-full px-6 py-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base ${
            errors.목 ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value="">선택하세요</option>
          {목목록.map(목 => (
            <option key={목} value={목}>{목}</option>
          ))}
        </select>
        {errors.목 && <p className="mt-1 text-sm text-red-500">{errors.목}</p>}
      </div>

      {/* 금액 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">금액</label>
        <input
          type="text"
          value={formData.금액}
          onChange={(e) => handleAmountChange(e.target.value)}
          className={`w-full px-6 py-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base ${
            errors.금액 ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="0"
          required
        />
        {errors.금액 && <p className="mt-1 text-sm text-red-500">{errors.금액}</p>}
      </div>

      {/* 메모 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">메모</label>
        <textarea
          value={formData.메모}
          onChange={(e) => setFormData({ ...formData, 메모: e.target.value })}
          className="w-full px-6 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base"
          rows={3}
          placeholder="메모를 입력하세요"
        />
      </div>

      {errors.submit && (
        <div className="text-red-500 text-sm">{errors.submit}</div>
      )}

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