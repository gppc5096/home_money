"use client";

import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import type { Category } from "./CategoryManager";
import { useCategoryStore } from "@/store/categoryStore";
import { validateCategory, isCategoryDuplicate } from "@/utils/categoryUtils";

interface CategoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Category | null;
}

export default function CategoryEditModal({
  isOpen,
  onClose,
  initialData,
}: CategoryEditModalProps) {
  const { categories, addCategory, updateCategory } = useCategoryStore();
  const [formData, setFormData] = useState<Partial<Category>>(
    initialData || { 유형: "수입" }
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateCategory(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    const category = formData as Category;
    if (isCategoryDuplicate(categories, category, initialData)) {
      setError('이미 존재하는 카테고리입니다.');
      return;
    }

    if (initialData) {
      updateCategory(initialData, category);
    } else {
      addCategory(category);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            {initialData ? "카테고리 수정" : "새 카테고리 추가"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <MdClose className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 text-red-300 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">유형</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="수입"
                  checked={formData.유형 === "수입"}
                  onChange={(e) =>
                    setFormData({ ...formData, 유형: e.target.value as "수입" | "지출" })
                  }
                  className="text-purple-500 focus:ring-purple-500"
                />
                <span className="text-white">수입</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="지출"
                  checked={formData.유형 === "지출"}
                  onChange={(e) =>
                    setFormData({ ...formData, 유형: e.target.value as "수입" | "지출" })
                  }
                  className="text-purple-500 focus:ring-purple-500"
                />
                <span className="text-white">지출</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">관</label>
            <input
              type="text"
              value={formData.관 || ""}
              onChange={(e) => setFormData({ ...formData, 관: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="관 입력"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">항</label>
            <input
              type="text"
              value={formData.항 || ""}
              onChange={(e) => setFormData({ ...formData, 항: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="항 입력"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">목</label>
            <input
              type="text"
              value={formData.목 || ""}
              onChange={(e) => setFormData({ ...formData, 목: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="목 입력"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-purple-500 text-white rounded-md py-2 hover:bg-purple-600 transition-colors"
            >
              저장
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white rounded-md py-2 hover:bg-gray-700 transition-colors"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 