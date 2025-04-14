"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MdSettings } from "react-icons/md";
import PageTitle from "@/components/common/PageTitle";
import CategoryManager from "@/components/category/CategoryManager";
import { IoSettingsSharp } from "react-icons/io5";
import { MdDataUsage, MdDelete, MdWarning } from "react-icons/md";
import { FaFileExport, FaFileImport, FaArrowUp, FaTrash } from "react-icons/fa";
import { useCategoryStore } from "@/store/categoryStore";
import { useTransactionStore } from "@/store/transactionStore";
import { exportCategories, importCategories } from "@/utils/categoryUtils";
import { toast } from 'react-hot-toast';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { PasswordManager } from '@/components/settings/PasswordManager';
import { format } from 'date-fns';

export default function SettingsPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { categories, setCategories, resetCategories } = useCategoryStore();
  const { transactions, setTransactions, resetTransactions } = useTransactionStore();
  const categoryFileInputRef = useRef<HTMLInputElement>(null);
  const transactionFileInputRef = useRef<HTMLInputElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

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

  // CSV 파일 내보내기 함수
  const handleExport = (data: any[], type: string) => {
    try {
      setIsExporting(true);
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item => Object.values(item).join(','));
      const csvContent = [headers, ...rows].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const currentDate = format(new Date(), 'yyyy. M. d');
      link.href = URL.createObjectURL(blob);
      link.download = `2-${type === 'transactions' ? '가계부_거래내역' : '카테고리_내보내기'}_${currentDate}.csv`;
      link.click();
      toast.success('파일이 성공적으로 내보내졌습니다.');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('파일 내보내기 중 오류가 발생했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  // CSV 파일 가져오기 함수
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const text = await file.text();
      const [headers, ...rows] = text.split('\n');
      const data = rows.map(row => {
        const values = row.split(',');
        return headers.split(',').reduce((obj: any, header, index) => {
          obj[header] = values[index];
          return obj;
        }, {});
      });

      if (type === 'transactions') {
        setTransactions(data);
      } else {
        setCategories(data);
      }
      
      toast.success('파일이 성공적으로 가져와졌습니다.');
      event.target.value = ''; // 파일 입력 초기화
    } catch (error) {
      console.error('Import error:', error);
      toast.error('파일 가져오기 중 오류가 발생했습니다.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-10">
        <PageTitle 
          title="거래설정" 
          description="거래 관련 설정을 관리합니다."
          icon={IoSettingsSharp}
        />

        {/* 1단: 카테고리 관리 */}
        <CategoryManager />

        {/* 2단: 데이터 관리 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <FaFileExport className="h-6 w-6 text-blue-500" />
            데이터 관리
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 거래내역 관리 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">거래내역 관리</h3>
              <div className="space-y-4">
                <button
                  onClick={() => handleExport(transactions, 'transactions')}
                  disabled={isExporting}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isExporting ? '내보내는 중...' : '거래내역 내보내기'}
                </button>
                <div>
                  <label className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 cursor-pointer flex items-center justify-center">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleImport(e, 'transactions')}
                      disabled={isImporting}
                      className="hidden"
                    />
                    {isImporting ? '가져오는 중...' : '거래내역 가져오기'}
                  </label>
                </div>
              </div>
            </div>

            {/* 카테고리 관리 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">카테고리 관리</h3>
              <div className="space-y-4">
                <button
                  onClick={() => handleExport(categories, 'categories')}
                  disabled={isExporting}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isExporting ? '내보내는 중...' : '카테고리 내보내기'}
                </button>
                <div>
                  <label className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 cursor-pointer flex items-center justify-center">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleImport(e, 'categories')}
                      disabled={isImporting}
                      className="hidden"
                    />
                    {isImporting ? '가져오는 중...' : '카테고리 가져오기'}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3단: 비밀번호 관리 */}
        <PasswordManager />

        {/* 4단: 데이터 초기화 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <FaTrash className="h-6 w-6 text-red-500" />
            데이터 초기화
          </h2>
          <div className="bg-gray-800 rounded-lg p-6">
            <p className="text-gray-300 mb-4">
              모든 거래내역과 카테고리 데이터를 초기화합니다. 이 작업은 되돌릴 수 없습니다.
            </p>
            <button
              onClick={handleDataReset}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              데이터 초기화
            </button>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
} 