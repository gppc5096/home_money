"use client";

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import TransactionModal from './TransactionModal';
import Pagination from './Pagination';
import { useTransactionStore, Transaction } from '@/store/transactionStore';

interface DateGroup {
  date: string;
  dayOfWeek: string;
  transactions: Transaction[];
  totalAmount: {
    income: number;
    expense: number;
  };
}

const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const DateDivider: React.FC<DateGroup> = ({ date, dayOfWeek, totalAmount }) => (
  <div className="bg-gray-700/30 px-4 py-2 text-sm flex justify-between items-center">
    <span className="text-blue-200 font-medium">{date} ({dayOfWeek})</span>
    <div className="flex gap-4">
      {totalAmount.income > 0 && (
        <span className="text-blue-400">수입: {formatNumber(totalAmount.income)}원</span>
      )}
      {totalAmount.expense > 0 && (
        <span className="text-red-400">지출: {formatNumber(totalAmount.expense)}원</span>
      )}
    </div>
  </div>
);

const ITEMS_PER_PAGE = 10;

const TransactionList = () => {
  const { transactions, updateTransaction, deleteTransaction, setTransactions } = useTransactionStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();
  const [modalMode, setModalMode] = useState<'edit' | 'delete'>('edit');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 초기 데이터 로드 (localStorage에 데이터가 없을 경우에만)
  useEffect(() => {
    const loadInitialData = async () => {
      if (transactions.length === 0) {
        try {
          const response = await fetch('/1-거래내역.json');
          if (!response.ok) throw new Error('데이터를 불러오는데 실패했습니다.');
          const data = await response.json();
          setTransactions(data);
        } catch (err) {
          console.error('초기 데이터 로드 실패:', err);
        }
      }
    };

    loadInitialData();
  }, [transactions.length, setTransactions]);

  const groupTransactionsByDate = (transactions: Transaction[]): DateGroup[] => {
    const groups: { [key: string]: Transaction[] } = {};
    
    // 날짜별로 거래 그룹화
    transactions.forEach(transaction => {
      const date = transaction.날짜;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
    });

    // DateGroup 배열로 변환
    return Object.entries(groups).map(([date, transactions]) => {
      const [year, month, day] = date.split('.');
      const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const dayOfWeek = format(dateObj, 'EEEE', { locale: ko });

      const totalAmount = transactions.reduce(
        (acc, curr) => {
          if (curr.유형 === '수입') {
            acc.income += curr.금액;
          } else {
            acc.expense += curr.금액;
          }
          return acc;
        },
        { income: 0, expense: 0 }
      );

      return {
        date,
        dayOfWeek,
        transactions,
        totalAmount,
      };
    }).sort((a, b) => b.date.localeCompare(a.date)); // 날짜 내림차순 정렬
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const handleModalConfirm = (updatedTransaction?: Transaction) => {
    if (!selectedTransaction) return;

    if (modalMode === 'edit' && updatedTransaction) {
      updateTransaction(selectedTransaction, updatedTransaction);
    } else if (modalMode === 'delete') {
      deleteTransaction(selectedTransaction);
    }
    
    setIsModalOpen(false);
    setSelectedTransaction(undefined);
  };

  // 페이지네이션 처리
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = transactions.slice(startIndex, endIndex);
  const currentGroupedTransactions = groupTransactionsByDate(currentTransactions);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        등록된 거래가 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-900 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">날짜</th>
              <th className="px-4 py-3 text-left">유형</th>
              <th className="px-4 py-3 text-left">관/항/목</th>
              <th className="px-4 py-3 text-right">금액</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">메모</th>
              <th className="px-4 py-3 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {currentGroupedTransactions.map((group) => (
              <React.Fragment key={group.date}>
                <tr>
                  <td colSpan={6}>
                    <DateDivider {...group} />
                  </td>
                </tr>
                {group.transactions.map((transaction, idx) => (
                  <tr 
                    key={`${group.date}-${idx}`}
                    className="hover:bg-gray-700/50 transition-colors even:bg-gray-800/50"
                  >
                    <td className="px-4 py-3">{transaction.날짜}</td>
                    <td className="px-4 py-3">
                      <span className={transaction.유형 === '수입' ? 'text-blue-400' : 'text-red-400'}>
                        {transaction.유형}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {transaction.관}/{transaction.항}/{transaction.목}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(transaction.금액)}원
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="truncate max-w-xs" title={transaction.메모}>
                        {transaction.메모 || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button 
                          className="text-emerald-500 hover:text-emerald-400 transition-colors"
                          onClick={() => handleEdit(transaction)}
                        >
                          <FaEdit size={16} />
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-400 transition-colors"
                          onClick={() => handleDelete(transaction)}
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTransaction(undefined);
        }}
        transaction={selectedTransaction}
        mode={modalMode}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default TransactionList; 