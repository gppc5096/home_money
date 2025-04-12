"use client";

import { useMemo, useState, useEffect } from "react";
import { MdEdit, MdDelete, MdArrowUpward, MdArrowDownward, MdExpandMore, MdExpandLess } from "react-icons/md";
import toast from "react-hot-toast";
import { useCategoryStore } from "@/store/categoryStore";
import { groupCategories } from "@/utils/categoryUtils";

interface CategoryListProps {
  type: "수입" | "지출";
}

export default function CategoryList({ type }: CategoryListProps) {
  const {
    categories,
    setEditingCategory,
    setIsModalOpen,
    deleteCategory,
    moveCategoryUp,
    moveCategoryDown,
  } = useCategoryStore();

  const [mounted, setMounted] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  const groupedCategories = useMemo(
    () => groupCategories(categories, type),
    [categories, type]
  );

  const handleEdit = (관: string, 항: string, 목: string) => {
    const category = categories.find(
      (cat) => cat.유형 === type && cat.관 === 관 && cat.항 === 항 && cat.목 === 목
    );
    if (category) {
      setEditingCategory(category);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (관: string, 항: string, 목: string) => {
    const category = categories.find(
      (cat) => cat.유형 === type && cat.관 === 관 && cat.항 === 항 && cat.목 === 목
    );
    if (category && confirm('이 카테고리를 삭제하시겠습니까?')) {
      try {
        deleteCategory(category);
        toast.success('카테고리가 삭제되었습니다.');
      } catch (error) {
        console.error('카테고리 삭제 실패:', error);
        toast.error('카테고리 삭제에 실패했습니다.');
      }
    }
  };

  const handleMoveUp = (관: string) => {
    try {
      moveCategoryUp(관, type);
      toast.success('카테고리가 위로 이동되었습니다.');
    } catch (error) {
      console.error('카테고리 이동 실패:', error);
      toast.error('카테고리 이동에 실패했습니다.');
    }
  };

  const handleMoveDown = (관: string) => {
    try {
      moveCategoryDown(관, type);
      toast.success('카테고리가 아래로 이동되었습니다.');
    } catch (error) {
      console.error('카테고리 이동 실패:', error);
      toast.error('카테고리 이동에 실패했습니다.');
    }
  };

  const toggleCategory = (관: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(관)) {
        next.delete(관);
      } else {
        next.add(관);
      }
      return next;
    });
  };

  // 초기 마운트 전에는 기본 구조만 렌더링
  if (!mounted) {
    return (
      <div className="grid gap-4">
        {Object.entries(groupedCategories).map(([관]) => (
          <div key={`${type}-${관}`} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-white">
                <div className="h-6 w-6" />
                <h3 className="text-lg font-medium">{관}</h3>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-5" />
                <div className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {Object.entries(groupedCategories).map(([관, 항목들]) => (
        <div key={`${type}-${관}`} className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => toggleCategory(관)}
              className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors"
            >
              {expandedCategories.has(관) ? (
                <MdExpandLess className="h-6 w-6" />
              ) : (
                <MdExpandMore className="h-6 w-6" />
              )}
              <h3 className="text-lg font-medium">{관}</h3>
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => handleMoveUp(관)}
                className="text-gray-400 hover:text-white transition-colors"
                title="위로 이동"
              >
                <MdArrowUpward className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleMoveDown(관)}
                className="text-gray-400 hover:text-white transition-colors"
                title="아래로 이동"
              >
                <MdArrowDownward className="h-5 w-5" />
              </button>
            </div>
          </div>
          {expandedCategories.has(관) && (
            <div className="space-y-3">
              {Object.entries(항목들).map(([항, 목록]) => (
                <div key={`${type}-${관}-${항}`} className="pl-4">
                  <h4 className="text-gray-300 mb-2">{항}</h4>
                  <div className="pl-4 space-y-2">
                    {목록.map((목) => (
                      <div
                        key={`${type}-${관}-${항}-${목}`}
                        className="flex items-center justify-between text-gray-400"
                      >
                        <span>{목}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(관, 항, 목)}
                            className="text-sky-400 hover:text-sky-300 transition-colors"
                            title="수정"
                          >
                            <MdEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(관, 항, 목)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="삭제"
                          >
                            <MdDelete className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 