"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MdSettings } from "react-icons/md";
import PageTitle from "@/components/common/PageTitle";
import CategoryManager from "@/components/category/CategoryManager";
import { IoSettings } from "react-icons/io5";
import { MdDataUsage, MdDelete, MdWarning } from "react-icons/md";
import { FaFileExport, FaFileImport, FaArrowUp } from "react-icons/fa";
import { useCategoryStore } from "@/store/categoryStore";
import { useTransactionStore } from "@/store/transactionStore";
import { exportCategories, importCategories } from "@/utils/categoryUtils";
import { toast } from 'react-hot-toast';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { PasswordManager } from '@/components/settings/PasswordManager';

export default function SettingsPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { categories, setCategories, resetCategories } = useCategoryStore();
  const { transactions, setTransactions, resetTransactions } = useTransactionStore();
  const categoryFileInputRef = useRef<HTMLInputElement>(null);
  const transactionFileInputRef = useRef<HTMLInputElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // 스크롤 이벤트 핸들링
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // CSV 파일로 거래내역 내보내기
  const exportTransactionsToCSV = () => {
    try {
      // CSV 헤더 생성
      const headers = ['날짜', '유형', '관', '항', '목', '금액', '메모'];
      
      // 데이터를 CSV 형식으로 변환
      const csvData = transactions.map(transaction => [
        transaction.날짜,
        transaction.유형,
        transaction.관 || '',
        transaction.항 || '',
        transaction.목 || '',
        transaction.금액?.toString() || '0',
        transaction.메모 || ''
      ]);

      // 헤더와 데이터 결합
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');

      // Blob 생성 및 다운로드
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // 날짜 형식 포맷팅
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const formattedDate = `${year}.${month}.${day}`;
      
      link.download = `거래내역_내보내기_${formattedDate}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('거래내역이 성공적으로 내보내졌습니다.');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('거래내역 내보내기에 실패했습니다.');
    }
  };

  // CSV 파일에서 거래내역 가져오기
  const importTransactionsFromCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',');

      const importedData = rows.slice(1)
        .filter(row => row.trim() !== '')
        .map((row, index) => {
          const values = row.split(',');
          return {
            id: `imported-${Date.now()}-${index}`,
            날짜: values[0],
            유형: values[1] as "수입" | "지출",
            관: values[2],
            항: values[3],
            목: values[4],
            금액: parseInt(values[5], 10),
            메모: values[6]
          };
        })
        .filter(transaction => 
          transaction.날짜 && 
          !isNaN(transaction.금액) && 
          transaction.금액 !== 0
        );

      if (importedData.length === 0) {
        throw new Error('유효한 거래내역이 없습니다.');
      }

      setTransactions([...transactions, ...importedData]);
      toast.success('거래내역이 성공적으로 가져와졌습니다.');
    } catch (error) {
      console.error('Import error:', error);
      toast.error('거래내역 가져오기에 실패했습니다.');
    }

    // 파일 입력 초기화
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleDataReset = () => {
    try {
      // 카테고리와 거래내역 모두 초기화
      resetCategories();
      resetTransactions();
      
      // localStorage에서 직접 삭제
      localStorage.removeItem('categories');
      localStorage.removeItem('transactions');
      
      setShowResetConfirm(false);
      toast.success('모든 데이터가 초기화되었습니다.');
    } catch (error) {
      console.error('데이터 초기화 오류:', error);
      toast.error('데이터 초기화 중 오류가 발생했습니다.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <PasswordManager />
        <CategoryManager />

        {/* 데이터 관리 섹션 */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <MdDataUsage className="h-6 w-6 text-green-200" />
            <h2 className="text-xl font-semibold text-white">데이터 관리</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 거래내역 관리 */}
            <div className="bg-gray-800 rounded-lg p-8">
              <h3 className="text-lg font-medium text-white mb-4">거래내역 관리</h3>
              <div className="flex justify-between items-center">
                <button 
                  onClick={exportTransactionsToCSV}
                  className="flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition-colors px-4 py-2"
                >
                  <FaFileExport className="h-5 w-5" />
                  <span>내보내기</span>
                </button>
                <input
                  type="file"
                  ref={transactionFileInputRef}
                  onChange={importTransactionsFromCSV}
                  className="hidden"
                  accept=".csv"
                />
                <button 
                  onClick={() => transactionFileInputRef.current?.click()}
                  className="flex items-center gap-2 text-sky-300 hover:text-sky-200 transition-colors px-4 py-2"
                >
                  <FaFileImport className="h-5 w-5" />
                  <span>가져오기</span>
                </button>
              </div>
            </div>
            
            {/* 카테고리 관리 */}
            <div className="bg-gray-800 rounded-lg p-8">
              <h3 className="text-lg font-medium text-white mb-4">카테고리 관리</h3>
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => exportCategories(categories)}
                  className="flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition-colors px-4 py-2"
                >
                  <FaFileExport className="h-5 w-5" />
                  <span>내보내기</span>
                </button>
                <input
                  type="file"
                  ref={categoryFileInputRef}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const importedCategories = await importCategories(file);
                        setCategories(importedCategories);
                        toast.success('카테고리를 성공적으로 가져왔습니다.');
                      } catch (error) {
                        toast.error(error instanceof Error ? error.message : '카테고리를 가져오는 중 오류가 발생했습니다.');
                      }
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                  accept=".csv"
                />
                <button 
                  onClick={() => categoryFileInputRef.current?.click()}
                  className="flex items-center gap-2 text-sky-300 hover:text-sky-200 transition-colors px-4 py-2"
                >
                  <FaFileImport className="h-5 w-5" />
                  <span>가져오기</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 데이터 초기화 섹션 */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <MdDelete className="h-6 w-6 text-red-500" />
            <h2 className="text-xl font-semibold text-white">데이터 초기화</h2>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-red-500/50 hover:border-red-500 transition-colors">
            <div className="flex items-start gap-3">
              <MdWarning className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-base font-medium text-red-400 mb-2">
                  모든 데이터가 영구적으로 삭제됩니다
                </h3>
                <div className="text-sm text-gray-400 mb-4 grid grid-cols-2 gap-2">
                  <span>• 카테고리 데이터</span>
                  <span>• 거래 내역</span>
                </div>
                {!showResetConfirm ? (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
                  >
                    <MdDelete className="h-4 w-4" />
                    <span>데이터 초기화</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-red-400 font-medium">
                      정말로 모든 데이터를 초기화하시겠습니까?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDataReset}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
                      >
                        확인
                      </button>
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-md text-sm transition-colors"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
} 