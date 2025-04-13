"use client";

import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import TransactionModal from './TransactionModal';
import { useTransactionStore } from '@/store/transactionStore';
import DeleteConfirmModal from './DeleteConfirmModal';
import { loadTransactions } from '@/utils/transactionUtils';

const ITEMS_PER_PAGE = 10;

const TransactionList: React.FC = () => {
  const { transactions, setTransactions, updateTransaction, deleteTransaction } = useTransactionStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      if (mounted) return; // 이미 초기화되었다면 실행하지 않음
      
      try {
        setIsLoading(true);
        setError(null);
        const loadedTransactions = await loadTransactions();
        if (loadedTransactions && loadedTransactions.length > 0) {
          setTransactions(loadedTransactions);
        }
      } catch (err) {
        console.error('Failed to load transactions:', err);
        setError('거래 내역을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
        setMounted(true);
      }
    };

    initializeData();
  }, [mounted, setTransactions]); // transactions 제거, mounted 추가

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">등록된 거래 내역이 없습니다.</p>
      </div>
    );
  }

  // 날짜 기준 내림차순 정렬 (최신 날짜가 위로)
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.날짜.split('.').join('-'));
    const dateB = new Date(b.날짜.split('.').join('-'));
    return dateB.getTime() - dateA.getTime();
  });
  
  // 날짜별로 거래 내역 그룹화 및 합계 계산
  const groupedTransactions = sortedTransactions.reduce((groups, transaction) => {
    const date = transaction.날짜;
    if (!groups[date]) {
      groups[date] = {
        transactions: [],
        수입합계: 0,
        지출합계: 0
      };
    }
    
    groups[date].transactions.push(transaction);
    if (transaction.유형 === '수입') {
      groups[date].수입합계 += transaction.금액;
    } else {
      groups[date].지출합계 += transaction.금액;
    }
    
    return groups;
  }, {});

  // 페이지네이션을 위한 날짜 그룹 분할
  const dates = Object.keys(groupedTransactions).sort((a, b) => {
    const dateA = new Date(a.split('.').join('-'));
    const dateB = new Date(b.split('.').join('-'));
    return dateB.getTime() - dateA.getTime();
  });

  const totalPages = Math.ceil(dates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDates = dates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const handleEdit = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleDelete = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (updatedTransaction: any) => {
    try {
      await updateTransaction(updatedTransaction);
      setIsEditModalOpen(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Failed to update transaction:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTransaction) return;
    
    try {
      await deleteTransaction(selectedTransaction.id);
      setIsDeleteModalOpen(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mx-auto max-w-full overflow-hidden">
      <div className="overflow-x-auto">
        {paginatedDates.map((date) => (
          <div key={date} className="mb-8">
            <div className="flex justify-between items-center mb-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{date}</h3>
              <div className="flex gap-6">
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  수입: {formatAmount(groupedTransactions[date].수입합계)}원
                </span>
                <span className="text-red-600 dark:text-red-400 font-medium">
                  지출: {formatAmount(groupedTransactions[date].지출합계)}원
                </span>
              </div>
            </div>
            
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">유형</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">관</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">항</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">목</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">금액</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">메모</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {groupedTransactions[date].transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <span className={transaction.유형 === '지출' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}>
                        {transaction.유형}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{transaction.관}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{transaction.항}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{transaction.목}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">
                      {formatAmount(transaction.금액)}원
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{transaction.메모 || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 inline-flex items-center"
                        title="수정"
                      >
                        <FiEdit2 className="w-5 h-5" />
                        <span className="sr-only">수정</span>
                      </button>
                      <button
                        onClick={() => handleDelete(transaction)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 ml-3 inline-flex items-center"
                        title="삭제"
                      >
                        <FiTrash2 className="w-5 h-5" />
                        <span className="sr-only">삭제</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      <TransactionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTransaction(null);
        }}
        onConfirm={handleConfirmDelete}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default TransactionList; 