"use client";

import { useState, useEffect } from "react";
import { MdAdd, MdCategory } from "react-icons/md";
import { FaFileExport, FaFileImport } from "react-icons/fa";
import toast from "react-hot-toast";
import CategoryList from "./CategoryList";
import CategoryEditModal from "./CategoryEditModal";
import { useCategoryStore } from "@/store/categoryStore";
import { loadCategories, exportCategories, importCategories } from "@/utils/categoryUtils";

export interface Category {
  유형: "수입" | "지출";
  관: string;
  항: string;
  목: string;
}

export default function CategoryManager() {
  const {
    categories,
    selectedType,
    isModalOpen,
    editingCategory,
    setCategories,
    setSelectedType,
    setIsModalOpen,
    setEditingCategory,
  } = useCategoryStore();

  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initializeCategories = async () => {
      try {
        const initialCategories = await loadCategories();
        setCategories(initialCategories);
      } catch (error) {
        console.error('카테고리 초기화 실패:', error);
        toast.error('카테고리를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeCategories();
    setMounted(true);
  }, [setCategories]);

  const handleAddClick = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    try {
      exportCategories(categories);
      toast.success('카테고리를 내보냈습니다.');
    } catch (error) {
      console.error('카테고리 내보내기 실패:', error);
      toast.error('카테고리 내보내기에 실패했습니다.');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const loadingToast = toast.loading('카테고리를 가져오는 중...');
    try {
      const importedCategories = await importCategories(file);
      setCategories(importedCategories);
      toast.success('카테고리를 가져왔습니다.', { id: loadingToast });
    } catch (error) {
      console.error('카테고리 가져오기 실패:', error);
      toast.error(
        error instanceof Error ? error.message : '파일을 가져오는 중 오류가 발생했습니다.',
        { id: loadingToast }
      );
    }
    // 파일 입력 초기화
    event.target.value = '';
  };

  // 초기 마운트 전에는 기본 구조만 렌더링
  if (!mounted || isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="mb-6 flex items-center gap-3">
          <MdCategory className="h-6 w-6 text-purple-200" />
          <h2 className="text-xl font-semibold text-white">카테고리 관리</h2>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="mb-6 flex items-center gap-3">
        <MdCategory className="h-6 w-6 text-purple-200" />
        <h2 className="text-xl font-semibold text-white">카테고리 관리</h2>
      </div>

      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType("수입")}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedType === "수입"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              수입
            </button>
            <button
              onClick={() => setSelectedType("지출")}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedType === "지출"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              지출
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              onChange={handleImport}
              className="hidden"
              accept=".csv"
              id="categoryFileInput"
            />
            <button
              onClick={() => document.getElementById('categoryFileInput')?.click()}
              className="flex items-center gap-2 text-sky-300 hover:text-sky-200 transition-colors px-3 py-2 rounded-md"
            >
              <FaFileImport className="h-5 w-5" />
              <span>가져오기</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition-colors px-3 py-2 rounded-md"
            >
              <FaFileExport className="h-5 w-5" />
              <span>내보내기</span>
            </button>
            <button
              onClick={handleAddClick}
              className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors px-3 py-2 rounded-md"
            >
              <MdAdd className="h-6 w-6" />
              <span>추가</span>
            </button>
          </div>
        </div>

        <CategoryList type={selectedType} />

        <CategoryEditModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCategory(null);
          }}
          initialData={editingCategory}
        />
      </section>
    </div>
  );
} 