"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import { useCategoryStore } from '@/store/categoryStore';
import { useTransactionStore } from '@/store/transactionStore';

interface TransactionFormData {
  날짜: Date;
  유형: '수입' | '지출';
  관: string;
  항: string;
  목: string;
  금액: number;
  메모?: string;
}

const TransactionInput = () => {
  const { control, handleSubmit, watch, setValue, reset } = useForm<TransactionFormData>({
    defaultValues: {
      날짜: new Date(),
      유형: '지출',
    }
  });

  const { categories } = useCategoryStore();
  const { addTransaction } = useTransactionStore();

  const selectedType = watch('유형');
  const selectedKwan = watch('관');
  const selectedHang = watch('항');

  // 관 변경 시 항 초기화
  useEffect(() => {
    setValue('항', '');
    setValue('목', '');
  }, [selectedKwan, setValue]);

  // 항 변경 시 목 초기화
  useEffect(() => {
    setValue('목', '');
  }, [selectedHang, setValue]);

  const onSubmit = async (data: TransactionFormData) => {
    const formattedData = {
      ...data,
      날짜: format(data.날짜, 'yyyy.MM.dd'),
      금액: Number(data.금액)
    };

    try {
      addTransaction(formattedData);
      reset({
        날짜: new Date(),
        유형: '지출',
      });
    } catch (error) {
      console.error('저장 실패:', error);
    }
  };

  // 선택된 유형의 관 목록
  const kwanList = Object.keys(categories[selectedType] || {});
  
  // 선택된 관의 항 목록
  const hangList = selectedKwan
    ? categories[selectedType][selectedKwan]?.map(item => item.name) || []
    : [];
  
  // 선택된 항의 목 목록
  const mokList = selectedKwan && selectedHang
    ? categories[selectedType][selectedKwan]
        ?.find(item => item.name === selectedHang)
        ?.subcategories || []
    : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 날짜 선택 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">날짜</label>
          <Controller
            name="날짜"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={field.onChange}
                locale={ko}
                dateFormat="yyyy.MM.dd"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              />
            )}
          />
        </div>

        {/* 유형 선택 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">유형</label>
          <div className="flex gap-4">
            <Controller
              name="유형"
              control={control}
              render={({ field }) => (
                <>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="수입"
                      checked={field.value === '수입'}
                      onChange={() => {
                        field.onChange('수입');
                        setValue('관', '');
                        setValue('항', '');
                        setValue('목', '');
                      }}
                      className="form-radio text-blue-500"
                    />
                    <span className="ml-2 text-white">수입</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="지출"
                      checked={field.value === '지출'}
                      onChange={() => {
                        field.onChange('지출');
                        setValue('관', '');
                        setValue('항', '');
                        setValue('목', '');
                      }}
                      className="form-radio text-red-500"
                    />
                    <span className="ml-2 text-white">지출</span>
                  </label>
                </>
              )}
            />
          </div>
        </div>

        {/* 금액 입력 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">금액</label>
          <Controller
            name="금액"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                value={field.value || ''}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                placeholder="금액을 입력하세요"
              />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 관 선택 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">관</label>
          <Controller
            name="관"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              >
                <option value="">선택하세요</option>
                {kwanList.map((kwan) => (
                  <option key={kwan} value={kwan}>{kwan}</option>
                ))}
              </select>
            )}
          />
        </div>

        {/* 항 선택 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">항</label>
          <Controller
            name="항"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                disabled={!selectedKwan}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              >
                <option value="">선택하세요</option>
                {hangList.map((hang) => (
                  <option key={hang} value={hang}>{hang}</option>
                ))}
              </select>
            )}
          />
        </div>

        {/* 목 선택 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">목</label>
          <Controller
            name="목"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                disabled={!selectedHang}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              >
                <option value="">선택하세요</option>
                {mokList.map((mok) => (
                  <option key={mok} value={mok}>{mok}</option>
                ))}
              </select>
            )}
          />
        </div>

        {/* 메모 입력 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">메모</label>
          <Controller
            name="메모"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                {...field}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                placeholder="메모를 입력하세요"
              />
            )}
          />
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          저장하기
        </button>
      </div>
    </form>
  );
};

export default TransactionInput; 