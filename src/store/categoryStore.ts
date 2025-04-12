import { create } from 'zustand';
import type { Category } from '@/components/category/CategoryManager';
import { saveToStorage } from '@/utils/categoryUtils';

interface CategoryState {
  categories: Category[];
  selectedType: "수입" | "지출";
  isModalOpen: boolean;
  editingCategory: Category | null;
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (oldCategory: Category, newCategory: Category) => void;
  deleteCategory: (category: Category) => void;
  moveCategoryUp: (관: string, type: "수입" | "지출") => void;
  moveCategoryDown: (관: string, type: "수입" | "지출") => void;
  setSelectedType: (type: "수입" | "지출") => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setEditingCategory: (category: Category | null) => void;
}

// 카테고리 비교 함수
const isSameCategory = (a: Category, b: Category) => 
  a.유형 === b.유형 && 
  a.관 === b.관 && 
  a.항 === b.항 && 
  a.목 === b.목;

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  selectedType: "수입",
  isModalOpen: false,
  editingCategory: null,

  setCategories: (categories) => {
    saveToStorage(categories);
    set({ categories });
  },
  
  addCategory: (category) =>
    set((state) => {
      const newCategories = [...state.categories, category];
      saveToStorage(newCategories);
      return { categories: newCategories };
    }),

  updateCategory: (oldCategory, newCategory) =>
    set((state) => {
      const newCategories = state.categories.map((cat) =>
        isSameCategory(cat, oldCategory) ? newCategory : cat
      );
      saveToStorage(newCategories);
      return { categories: newCategories };
    }),

  deleteCategory: (category) =>
    set((state) => {
      const newCategories = state.categories.filter((cat) => !isSameCategory(cat, category));
      saveToStorage(newCategories);
      return { categories: newCategories };
    }),

  moveCategoryUp: (관, type) =>
    set((state) => {
      const typeCategories = state.categories
        .filter(cat => cat.유형 === type)
        .reduce<string[]>((acc, cat) => {
          if (!acc.includes(cat.관)) {
            acc.push(cat.관);
          }
          return acc;
        }, []);

      const currentIndex = typeCategories.indexOf(관);
      if (currentIndex <= 0) return state;

      const prevCategory = typeCategories[currentIndex - 1];
      const updatedCategories = state.categories.map(cat => {
        if (cat.유형 !== type) return cat;
        if (cat.관 === 관) return { ...cat, 관: prevCategory };
        if (cat.관 === prevCategory) return { ...cat, 관: 관 };
        return cat;
      });

      saveToStorage(updatedCategories);
      return { categories: updatedCategories };
    }),

  moveCategoryDown: (관, type) =>
    set((state) => {
      const typeCategories = state.categories
        .filter(cat => cat.유형 === type)
        .reduce<string[]>((acc, cat) => {
          if (!acc.includes(cat.관)) {
            acc.push(cat.관);
          }
          return acc;
        }, []);

      const currentIndex = typeCategories.indexOf(관);
      if (currentIndex === -1 || currentIndex === typeCategories.length - 1) return state;

      const nextCategory = typeCategories[currentIndex + 1];
      const updatedCategories = state.categories.map(cat => {
        if (cat.유형 !== type) return cat;
        if (cat.관 === 관) return { ...cat, 관: nextCategory };
        if (cat.관 === nextCategory) return { ...cat, 관: 관 };
        return cat;
      });

      saveToStorage(updatedCategories);
      return { categories: updatedCategories };
    }),

  setSelectedType: (type) => set({ selectedType: type }),
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  setEditingCategory: (category) => set({ editingCategory: category }),
})); 