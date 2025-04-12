import { create } from 'zustand';
import type { Category } from '@/components/category/CategoryManager';

interface CategoryState {
  categories: Category[];
  selectedType: "수입" | "지출";
  isModalOpen: boolean;
  editingCategory: Category | null;
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (oldCategory: Category, newCategory: Category) => void;
  deleteCategory: (category: Category) => void;
  setSelectedType: (type: "수입" | "지출") => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setEditingCategory: (category: Category | null) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  selectedType: "수입",
  isModalOpen: false,
  editingCategory: null,

  setCategories: (categories) => set({ categories }),
  
  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),

  updateCategory: (oldCategory, newCategory) =>
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat === oldCategory ? newCategory : cat
      ),
    })),

  deleteCategory: (category) =>
    set((state) => ({
      categories: state.categories.filter((cat) => 
        !(cat.유형 === category.유형 && 
          cat.관 === category.관 && 
          cat.항 === category.항 && 
          cat.목 === category.목)
      ),
    })),

  setSelectedType: (type) => set({ selectedType: type }),
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  setEditingCategory: (category) => set({ editingCategory: category }),
})); 