"use client";

import { useState } from "react";
import { MdExpandMore, MdChevronRight, MdEdit, MdDelete } from "react-icons/md";
import type { Category } from "./CategoryManager";
import { useCategoryStore } from "@/store/categoryStore";
import { groupCategories } from "@/utils/categoryUtils";

interface CategoryTreeProps {
  categories: Category[];
  selectedType: "수입" | "지출";
  onEditClick: (category: Category) => void;
}

export default function CategoryTree({
  categories,
  selectedType,
  onEditClick,
}: CategoryTreeProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { deleteCategory } = useCategoryStore();

  const groupedCategories = groupCategories(categories, selectedType);

  const toggleExpand = (item: string) => {
    setExpandedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const handleDelete = (category: Category) => {
    if (confirm('이 카테고리를 삭제하시겠습니까?')) {
      deleteCategory(category);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      {Object.entries(groupedCategories).map(([관, 항목들]) => (
        <div key={관} className="mb-4">
          <div
            className="flex items-center gap-2 text-white cursor-pointer hover:bg-gray-700 p-2 rounded-md"
            onClick={() => toggleExpand(관)}
          >
            {expandedItems.includes(관) ? (
              <MdExpandMore className="h-5 w-5" />
            ) : (
              <MdChevronRight className="h-5 w-5" />
            )}
            <span className="font-medium">{관}</span>
            <div className="ml-auto flex gap-2">
              <button
                className="p-1 hover:text-purple-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick({ 유형: selectedType, 관, 항: "", 목: "" });
                }}
              >
                <MdEdit className="h-4 w-4" />
              </button>
              <button
                className="p-1 hover:text-red-300 text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete({ 유형: selectedType, 관, 항: "", 목: "" });
                }}
              >
                <MdDelete className="h-4 w-4" />
              </button>
            </div>
          </div>

          {expandedItems.includes(관) && (
            <div className="ml-6 mt-2">
              {Object.entries(항목들).map(([항, 목록]) => (
                <div key={항} className="mb-2">
                  <div className="flex items-center gap-2 text-gray-300 hover:bg-gray-700 p-2 rounded-md">
                    <span>{항}</span>
                    <div className="ml-auto flex gap-2">
                      <button
                        className="p-1 hover:text-purple-300"
                        onClick={() => onEditClick({ 유형: selectedType, 관, 항, 목: "" })}
                      >
                        <MdEdit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 hover:text-red-300 text-red-500"
                        onClick={() => handleDelete({ 유형: selectedType, 관, 항, 목: "" })}
                      >
                        <MdDelete className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="ml-6">
                    {목록.map((목) => (
                      <div
                        key={목}
                        className="flex items-center gap-2 text-gray-400 hover:bg-gray-700 p-2 rounded-md"
                      >
                        <span>{목}</span>
                        <div className="ml-auto flex gap-2">
                          <button
                            className="p-1 hover:text-purple-300"
                            onClick={() => onEditClick({ 유형: selectedType, 관, 항, 목 })}
                          >
                            <MdEdit className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 hover:text-red-300 text-red-500"
                            onClick={() => handleDelete({ 유형: selectedType, 관, 항, 목 })}
                          >
                            <MdDelete className="h-4 w-4" />
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