"use client";

import { useState, useEffect } from "react";
import { MdAdd, MdKeyboardArrowUp } from "react-icons/md";
import { useCategoryStore } from "@/store/categoryStore";
import { groupCategories } from "@/utils/categoryUtils";
import toast from "react-hot-toast";

interface TransactionInputProps {
  onSave: (transaction: {
    date: string;
    type: "수입" | "지출";
    관: string;
    항: string;
    목: string;
    amount: number;
    memo?: string;
  }) => void;
}

export default function TransactionInput({ onSave }: TransactionInputProps) {
  const { categories } = useCategoryStore();
  const [mounted, setMounted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: "지출" as "수입" | "지출",
    관: "",
    항: "",
    목: "",
    amount: "",
    memo: "",
  });

  const [availableCategories, setAvailableCategories] = useState<{
    [key: string]: {
      [key: string]: string[];
    };
  }>({});

  useEffect(() => {
    setMounted(true);
    const grouped = groupCategories(categories, formData.type);
    setAvailableCategories(grouped);
  }, [categories, formData.type]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.관 || !formData.항 || !formData.목 || !formData.amount) {
      toast.error('모든 필수 항목을 입력해주세요.');
      return;
    }

    try {
      onSave({
        ...formData,
        amount: Number(formData.amount),
      });
      
      // 폼 초기화
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: "지출",
        관: "",
        항: "",
        목: "",
        amount: "",
        memo: "",
      });
      
      toast.success('거래가 저장되었습니다.');
    } catch (error) {
      console.error('거래 저장 실패:', error);
      toast.error('거래 저장에 실패했습니다.');
    }
  };

  const handleTypeChange = (type: "수입" | "지출") => {
    setFormData(prev => ({ ...prev, type, 관: "", 항: "", 목: "" }));
    const grouped = groupCategories(categories, type);
    setAvailableCategories(grouped);
  };

  const handle관Change = (관: string) => {
    setFormData(prev => ({ ...prev, 관, 항: "", 목: "" }));
  };

  const handle항Change = (항: string) => {
    setFormData(prev => ({ ...prev, 항, 목: "" }));
  };

  // 초기 마운트 전에는 기본 구조만 렌더링
  if (!mounted) {
    return (
      <div className="space-y-4 bg-gray-800 p-6 rounded-lg">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-gray-300 mb-2">날짜</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-300 mb-2">유형</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.type === "수입"}
                  onChange={() => handleTypeChange("수입")}
                  className="text-purple-500 focus:ring-purple-500"
                />
                <span className="text-white">수입</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.type === "지출"}
                  onChange={() => handleTypeChange("지출")}
                  className="text-purple-500 focus:ring-purple-500"
                />
                <span className="text-white">지출</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">관</label>
            <select
              value={formData.관}
              onChange={(e) => handle관Change(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">선택하세요</option>
              {Object.keys(availableCategories).map((관) => (
                <option key={관} value={관}>{관}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">항</label>
            <select
              value={formData.항}
              onChange={(e) => handle항Change(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={!formData.관}
            >
              <option value="">선택하세요</option>
              {formData.관 && Object.keys(availableCategories[formData.관] || {}).map((항) => (
                <option key={항} value={항}>{항}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">목</label>
            <select
              value={formData.목}
              onChange={(e) => setFormData(prev => ({ ...prev, 목: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={!formData.항}
            >
              <option value="">선택하세요</option>
              {formData.관 && formData.항 && (availableCategories[formData.관]?.[formData.항] || []).map((목) => (
                <option key={목} value={목}>{목}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">금액</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="금액을 입력하세요"
            min="0"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">메모</label>
          <textarea
            value={formData.memo}
            onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
            className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="메모를 입력하세요 (선택사항)"
            rows={3}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-600 transition-colors"
          >
            <MdAdd className="h-5 w-5" />
            <span>저장</span>
          </button>
        </div>
      </form>
      
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 transition-all transform hover:scale-110 focus:outline-none"
          aria-label="위로 가기"
        >
          <MdKeyboardArrowUp className="h-6 w-6" />
        </button>
      )}
    </>
  );
} 