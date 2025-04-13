"use client";

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import TransactionModal from './TransactionModal';
import Pagination from './Pagination';
import { useTransactionStore, Transaction } from '@/store/transactionStore';
import { toast } from 'react-hot-toast';
import DateDivider from './DateDivider';
import { formatNumber } from '@/utils/formatNumber';

interface DateGroup {
  date: string;
  dayOfWeek: string;
  transactions: Transaction[];
  totalAmount: {
    income: number;
    expense: number;
  };
}

const ITEMS_PER_PAGE = 10;

const TransactionList = () => {
  const [mounted, setMounted] = useState(false);
  const { transactions, updateTransaction, deleteTransaction } = useTransactionStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();
  const [modalMode, setModalMode] = useState<'edit' | 'delete'>('edit');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-gray-700 rounded-md" />
        <div className="h-20 bg-gray-700 rounded-md" />
        <div className="h-20 bg-gray-700 rounded-md" />
      </div>
    );
  }

  const groupTransactionsByDate = (transactions: Transaction[]): DateGroup[] => {
    const groups: { [key: string]: Transaction[] } = {};
    
    transactions.forEach(transaction => {
      try {
        const transactionDate = new Date(transaction.date);
        if (isNaN(transactionDate.getTime())) {
          console.error('Invalid date:', transaction.date);
          return;
        }
        
        const date = format(transactionDate, 'yyyy년 MM월 dd일');
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(transaction);
      } catch (error) {
        console.error('Date processing error:', error);
      }
    });

    return Object.entries(groups).map(([date, transactions]) => {
      try {
        const firstTransaction = transactions[0];
        const transactionDate = new Date(firstTransaction.date);
        const dayOfWeek = format(transactionDate, 'EEEE', { locale: ko });
        
        const totalAmount = transactions.reduce(
          (acc, curr) => {
            if (curr.type === '수입') {
              acc.income += curr.amount;
            } else {
              acc.expense += curr.amount;
            }
            return acc;
          },
          { income: 0, expense: 0 }
        );
        
        return { date, dayOfWeek, transactions, totalAmount };
      } catch (error) {
        console.error('Date group processing error:', error);
        return {
          date,
          dayOfWeek: '요일 정보 없음',
          transactions,
          totalAmount: { income: 0, expense: 0 }
        };
      }
    }).sort((a, b) => {
      try {
        const dateA = new Date(a.transactions[0].date);
        const dateB = new Date(b.transactions[0].date);
        return dateB.getTime() - dateA.getTime();
      } catch (error) {
        console.error('Date sorting error:', error);
        return 0;
      }
    });
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

  const handleConfirmDelete = () => {
    if (selectedTransaction) {
      deleteTransaction(selectedTransaction);
      setIsModalOpen(false);
      toast.success('거래가 삭제되었습니다');
    }
  };

  const handleConfirmEdit = (updatedTransaction: Transaction) => {
    updateTransaction(updatedTransaction);
    setIsModalOpen(false);
    toast.success('거래가 수정되었습니다');
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  const totalPages = Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const groupedTransactions = groupTransactionsByDate(paginatedTransactions);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden bg-gray-900 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {groupedTransactions.length > 0 ? (
            groupedTransactions.map(({ date, dayOfWeek, transactions, totalAmount }) => (
              <div key={date} className="space-y-2">
                <DateDivider
                  date={date}
                  dayOfWeek={dayOfWeek}
                  transactions={transactions}
                  totalAmount={totalAmount}
                />
                <div className="space-y-2">
                  {transactions.map(transaction => (
                    <div
                      key={transaction.id}
                      className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">
                            {transaction.관} &gt; {transaction.항} &gt; {transaction.목}
                          </span>
                          <span className={`font-medium ${
                            transaction.type === '수입' ? 'text-blue-400' : 'text-red-400'
                          }`}>
                            {transaction.type === '수입' ? '+' : '-'}{formatNumber(transaction.amount)}원
                          </span>
                        </div>
                        {transaction.memo && (
                          <p className="text-sm text-gray-300">{transaction.memo}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              거래 내역이 없습니다.
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTransaction(undefined);
        }}
        mode={modalMode}
        transaction={selectedTransaction}
        onConfirm={modalMode === 'edit' ? handleConfirmEdit : handleConfirmDelete}
      />
    </div>
  );
};

export default TransactionList; 