"use client";

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import TransactionForm from '../TransactionForm';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: any;
  onSave: (data: any) => void;
}

export default function TransactionModal({ isOpen, onClose, transaction, onSave }: TransactionModalProps) {
  const handleSubmit = (data: any) => {
    onSave(data);
    onClose();
  };

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
                  {transaction ? '거래 수정' : '거래 추가'}
                </Dialog.Title>
                
                <TransactionForm
                  initialData={transaction}
                  onSubmit={handleSubmit}
                  onCancel={onClose}
                  mode={transaction ? 'edit' : 'create'}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 