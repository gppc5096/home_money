"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useTransactionStore } from "@/store/transactionStore";
import TransactionForm from "./TransactionForm";

export default function TransactionInput() {
  const [isOpen, setIsOpen] = useState(false);
  const { addTransaction } = useTransactionStore();

  const handleSubmit = (transaction: any) => {
    addTransaction(transaction);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-500 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg rounded-xl bg-gray-800 p-6 w-full">
            <Dialog.Title className="text-lg font-medium text-white mb-4">
              거래 추가
            </Dialog.Title>

            <TransactionForm
              onSubmit={handleSubmit}
              onCancel={() => setIsOpen(false)}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
} 