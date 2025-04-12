"use client";

import { useEffect, useState } from "react";
import { MdCategory } from "react-icons/md";
import CategoryControls from "./CategoryControls";
import CategoryTree from "./CategoryTree";
import CategoryEditModal from "./CategoryEditModal";
import { useCategoryStore } from "@/store/categoryStore";
import { loadCategories } from "@/utils/categoryUtils";

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

  useEffect(() => {
    const initializeCategories = async () => {
      try {
        setIsLoading(true);
        const loadedCategories = await loadCategories();
        setCategories(loadedCategories);
      } catch (error) {
        console.error('카테고리 초기화 에러:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCategories();
  }, [setCategories]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="mb-6 flex items-center gap-3">
          <MdCategory className="h-6 w-6 text-purple-200" />
          <h2 className="text-xl font-semibold text-white">카테고리 관리</h2>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400">카테고리를 불러오는 중...</p>
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

      <CategoryControls
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        onAddClick={() => {
          setEditingCategory(null);
          setIsModalOpen(true);
        }}
      />

      <CategoryTree
        categories={categories}
        selectedType={selectedType}
        onEditClick={(category) => {
          setEditingCategory(category);
          setIsModalOpen(true);
        }}
      />

      <CategoryEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        initialData={editingCategory}
      />
    </div>
  );
} 