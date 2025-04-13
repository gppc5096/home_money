"use client";

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { formatAmount, formatDate } from '@/utils/formatUtils';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: any;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  transaction
}: DeleteConfirmModalProps) {
  if (!transaction) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4"
                >
                  거래 내역 삭제
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
                    다음 거래 내역을 삭제하시겠습니까?
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">날짜:</span> {formatDate(transaction.날짜)}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">유형:</span>{' '}
                      <span className={transaction.유형 === '지출' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}>
                        {transaction.유형}
                      </span>
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">분류:</span> {transaction.관} &gt; {transaction.항} &gt; {transaction.목}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">금액:</span> {formatAmount(transaction.금액)}원
                    </p>
                    {transaction.메모 && (
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">메모:</span> {transaction.메모}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 dark:bg-gray-600 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
                    onClick={onConfirm}
                  >
                    삭제
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 