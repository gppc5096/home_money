"use client";

import React, { useState } from 'react';
import { FaFolderPlus } from 'react-icons/fa';
import { useCategoryStore } from '@/store/categoryStore';
import { toast } from 'react-hot-toast';

export const CategoryManager = () => {
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [item, setItem] = useState('');
  const { categories, addCategory, removeCategory, resetCategories } = useCategoryStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category.trim()) {
      toast.error('카테고리명을 입력해주세요.');
      return;
    }

    const success = addCategory({
      type,
      category: category.trim(),
      item: item.trim() || undefined,
    });

    if (success) {
      toast.success('카테고리가 추가되었습니다.');
      setCategory('');
      setItem('');
    } else {
      toast.error('이미 존재하는 카테고리입니다.');
    }
  };

  const handleRemove = (type: string, category: string, item?: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const success = removeCategory({ type, category, item });
      if (success) {
        toast.success('카테고리가 삭제되었습니다.');
      }
    }
  };

  const handleReset = () => {
    if (window.confirm('모든 카테고리를 초기화하시겠습니까?')) {
      resetCategories();
      toast.success('카테고리가 초기화되었습니다.');
    }
  };

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <FaFolderPlus className="h-6 w-6 text-yellow-500" />
        <h2 className="text-xl font-semibold text-white">카테고리 관리</h2>
      </div>
      <div className="bg-gray-800 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                유형
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="expense">지출</option>
                <option value="income">수입</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                카테고리
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="예: 식비, 교통비"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                항목 (선택)
              </label>
              <input
                type="text"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="예: 식당, 카페"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              초기화
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              추가
            </button>
          </div>
        </form>

        <div className="space-y-6">
          {['expense', 'income'].map((categoryType) => (
            <div key={categoryType} className="space-y-4">
              <h3 className="text-lg font-medium text-white">
                {categoryType === 'expense' ? '지출' : '수입'} 카테고리
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(categories[categoryType] || {}).map(([categoryName, items]) => (
                  <div key={categoryName} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-white font-medium">{categoryName}</h4>
                      <button
                        onClick={() => handleRemove(categoryType, categoryName)}
                        className="text-red-400 hover:text-red-300"
                      >
                        삭제
                      </button>
                    </div>
                    {Array.isArray(items) && items.length > 0 && (
                      <ul className="space-y-2">
                        {items.map((item) => (
                          <li key={item} className="flex justify-between items-center text-gray-300">
                            <span>{item}</span>
                            <button
                              onClick={() => handleRemove(categoryType, categoryName, item)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              삭제
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 