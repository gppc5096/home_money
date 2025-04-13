"use client";

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import TransactionModal from './TransactionModal';
import Pagination from './Pagination';
import { useTransactionStore } from '@/store/transactionStore';
import { toast } from 'react-hot-toast';
import DateDivider from './DateDivider';
import { formatNumber } from '@/utils/formatNumber';
import DeleteConfirmModal from './DeleteConfirmModal';
import { loadTransactions } from '@/utils/transactionUtils';
import TransactionItem from './TransactionItem';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

interface GroupedTransactions {
  [date: string]: {
    transactions: Transaction[];
    totalIncome: number;
    totalExpense: number;
  };
}

const ITEMS_PER_PAGE = 10;

const TransactionList = () => {
  const { transactions, setTransactions, updateTransaction, deleteTransaction } = useTransactionStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [groupedTransactions, setGroupedTransactions] = useState<GroupedTransactions>({});
  const [mounted, setMounted] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (transactions.length === 0) {
      loadTransactions().then((data) => {
        if (data) setTransactions(data);
      });
    }
  }, [transactions.length, setTransactions]);

  useEffect(() => {
    const grouped = transactions.reduce((acc: GroupedTransactions, transaction) => {
      const date = transaction.날짜;
      if (!acc[date]) {
        acc[date] = {
          transactions: [],
          totalIncome: 0,
          totalExpense: 0,
        };
      }
      acc[date].transactions.push(transaction);
      if (transaction.유형 === '수입') {
        acc[date].totalIncome += transaction.금액;
      } else {
        acc[date].totalExpense += transaction.금액;
      }
      return acc;
    }, {});

    const sortedGrouped: GroupedTransactions = {};
    Object.keys(grouped)
      .sort((a, b) => b.localeCompare(a))
      .forEach((date) => {
        sortedGrouped[date] = grouped[date];
      });

    setGroupedTransactions(sortedGrouped);
  }, [transactions]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  const totalPages = Math.ceil(Object.keys(groupedTransactions).length / ITEMS_PER_PAGE);
  const currentDates = Object.keys(groupedTransactions)
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleSave = (updatedTransaction: Transaction) => {
    updateTransaction(updatedTransaction);
    setIsEditModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleConfirmDelete = () => {
    if (selectedTransaction) {
      deleteTransaction(selectedTransaction);
      setIsDeleteModalOpen(false);
      setSelectedTransaction(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">거래 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {currentDates.map((date) => (
          <div key={date} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">
                {format(new Date(date.replace(/\./g, '-')), 'yyyy년 M월 d일 (EEEE)', { locale: ko })}
              </h3>
              <div className="text-sm">
                <span className="text-blue-500 mr-4">수입: {groupedTransactions[date].totalIncome.toLocaleString()}원</span>
                <span className="text-red-500">지출: {groupedTransactions[date].totalExpense.toLocaleString()}원</span>
              </div>
            </div>
            <div className="divide-y">
              {groupedTransactions[date].transactions.map((transaction) => (
                <div key={transaction.id} className="py-2 flex justify-between items-center">
                  <div>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      transaction.유형 === '수입' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    } mr-2`}>
                      {transaction.유형}
                    </span>
                    <span className="text-gray-900">{transaction.관} &gt; {transaction.항} &gt; {transaction.목}</span>
                    {transaction.메모 && (
                      <span className="text-gray-500 text-sm ml-2">({transaction.메모})</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className={`font-medium ${
                      transaction.유형 === '수입' ? 'text-blue-600' : 'text-red-600'
                    } mr-4`}>
                      {transaction.금액.toLocaleString()}원
                    </span>
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="p-1 text-gray-500 hover:text-blue-500 mr-1"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction)}
                      className="p-1 text-gray-500 hover:text-red-500"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

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
        transaction={selectedTransaction}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default TransactionList; 