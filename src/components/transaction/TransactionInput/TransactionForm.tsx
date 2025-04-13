"use client";

import { useState } from "react";
import { useTransactionStore } from "@/store/transactionStore";
import { useCategoryStore } from "@/store/categoryStore";
import { Category } from "@/components/category/CategoryManager";

export default function TransactionForm() {
  const { addTransaction } = useTransactionStore();
  const { categories } = useCategoryStore();
  const [type, setType] = useState<"수입" | "지출">("지출");
  const [selectedGwan, setSelectedGwan] = useState("");
  const [selectedHang, setSelectedHang] = useState("");
  const [selectedMok, setSelectedMok] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [memo, setMemo] = useState("");

  const filteredCategories = categories.filter(
    (category: Category) => category.유형 === type
  );

  const gwanList = Array.from(
    new Set(filteredCategories.map((category: Category) => category.관))
  );

  const hangList = Array.from(
    new Set(
      filteredCategories
        .filter((category: Category) => category.관 === selectedGwan)
        .map((category: Category) => category.항)
    )
  );

  const mokList = Array.from(
    new Set(
      filteredCategories
        .filter(
          (category: Category) =>
            category.관 === selectedGwan && category.항 === selectedHang
        )
        .map((category: Category) => category.목)
    )
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGwan || !selectedHang || !selectedMok || !amount) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    addTransaction({
      id: Date.now().toString(),
      type,
      관: selectedGwan,
      항: selectedHang,
      목: selectedMok,
      amount: Number(amount),
      date,
      memo,
    });

    // 입력 필드 초기화
    setSelectedGwan("");
    setSelectedHang("");
    setSelectedMok("");
    setAmount("");
    setMemo("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1단: 날짜, 유형, 금액 */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            날짜
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            유형
          </label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as "수입" | "지출");
              setSelectedGwan("");
              setSelectedHang("");
              setSelectedMok("");
            }}
            className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="수입">수입</option>
            <option value="지출">지출</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            금액
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="금액을 입력하세요"
            className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 2단: 관, 항, 목, 메모 */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            관
          </label>
          <select
            value={selectedGwan}
            onChange={(e) => {
              setSelectedGwan(e.target.value);
              setSelectedHang("");
              setSelectedMok("");
            }}
            className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">선택하세요</option>
            {gwanList.map((gwan) => (
              <option key={gwan} value={gwan}>
                {gwan}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            항
          </label>
          <select
            value={selectedHang}
            onChange={(e) => {
              setSelectedHang(e.target.value);
              setSelectedMok("");
            }}
            disabled={!selectedGwan}
            className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">선택하세요</option>
            {hangList.map((hang) => (
              <option key={hang} value={hang}>
                {hang}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            목
          </label>
          <select
            value={selectedMok}
            onChange={(e) => setSelectedMok(e.target.value)}
            disabled={!selectedHang}
            className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">선택하세요</option>
            {mokList.map((mok) => (
              <option key={mok} value={mok}>
                {mok}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            메모
          </label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="메모를 입력하세요"
            className="w-full bg-gray-700/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 3단: 거래추가 버튼 */}
      <div className="w-full">
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition-colors font-medium text-lg"
        >
          거래추가
        </button>
      </div>
    </form>
  );
} 