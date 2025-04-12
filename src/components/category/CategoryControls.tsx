"use client";

import { MdAdd } from "react-icons/md";
import { useEffect, useState } from "react";

interface CategoryControlsProps {
  selectedType: "수입" | "지출";
  onTypeChange: (type: "수입" | "지출") => void;
  onAddClick: () => void;
}

export default function CategoryControls({
  selectedType,
  onTypeChange,
  onAddClick,
}: CategoryControlsProps) {
  // 클라이언트 사이드 렌더링을 위한 상태
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 초기 렌더링 시 빈 버튼 반환
  if (!mounted) {
    return (
      <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
        <div className="flex gap-4">
          <button className="px-4 py-2 rounded-md transition-colors text-gray-300">수입</button>
          <button className="px-4 py-2 rounded-md transition-colors text-gray-300">지출</button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-md">
          <MdAdd className="h-5 w-5" />
          <span>카테고리 추가</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
      <div className="flex gap-4">
        <button
          onClick={() => onTypeChange("수입")}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedType === "수입"
              ? "bg-emerald-500 text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          수입
        </button>
        <button
          onClick={() => onTypeChange("지출")}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedType === "지출"
              ? "bg-rose-500 text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          지출
        </button>
      </div>
      
      <button
        onClick={onAddClick}
        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
      >
        <MdAdd className="h-5 w-5" />
        <span>카테고리 추가</span>
      </button>
    </div>
  );
} 