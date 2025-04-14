import { create } from 'zustand';
import { loadFromStorage, saveToStorage } from '@/utils/categoryUtils';

export interface Category {
  유형: "수입" | "지출";
  관: string;
  항: string;
  목: string;
}

interface CategoryState {
  categories: Category[];
  selectedType: "수입" | "지출";
  isModalOpen: boolean;
  editingCategory: Category | null;
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (oldCategory: Category, newCategory: Category) => void;
  deleteCategory: (category: Category) => void;
  moveCategoryUp: (category: Category) => void;
  moveCategoryDown: (category: Category) => void;
  setSelectedType: (type: "수입" | "지출") => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setEditingCategory: (category: Category | null) => void;
  loadCategories: () => Promise<void>;
  resetCategories: () => void;
}

// 카테고리 비교 함수
const isSameCategory = (a: Category, b: Category) => 
  a.유형 === b.유형 && 
  a.관 === b.관 && 
  a.항 === b.항 && 
  a.목 === b.목;

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  selectedType: "지출",
  isModalOpen: false,
  editingCategory: null,

  loadCategories: async () => {
    try {
      const categories = await loadFromStorage();
      set({ categories });
    } catch (error) {
      console.error('카테고리 로드 실패:', error);
      throw error;
    }
  },

  setCategories: (categories) => {
    set({ categories });
    saveToStorage(categories);
  },
  
  addCategory: (category) => {
    const { categories } = get();
    const newCategories = [...categories, category];
    set({ categories: newCategories });
    saveToStorage(newCategories);
  },

  updateCategory: (oldCategory, newCategory) => {
    const { categories } = get();
    const newCategories = categories.map(cat => 
      isSameCategory(cat, oldCategory) ? newCategory : cat
    );
    set({ categories: newCategories });
    saveToStorage(newCategories);
  },

  deleteCategory: (category) => {
    const { categories } = get();
    const newCategories = categories.filter(cat => !isSameCategory(cat, category));
    set({ categories: newCategories });
    saveToStorage(newCategories);
  },

  moveCategoryUp: (category) => {
    const { categories } = get();
    const index = categories.findIndex(cat => isSameCategory(cat, category));
    if (index <= 0) return;

    const newCategories = [...categories];
    [newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]];
    set({ categories: newCategories });
    saveToStorage(newCategories);
  },

  moveCategoryDown: (category) => {
    const { categories } = get();
    const index = categories.findIndex(cat => isSameCategory(cat, category));
    if (index === -1 || index === categories.length - 1) return;

    const newCategories = [...categories];
    [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
    set({ categories: newCategories });
    saveToStorage(newCategories);
  },

  setSelectedType: (type) => set({ selectedType: type }),
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  setEditingCategory: (category) => set({ editingCategory: category }),

  resetCategories: () => {
    set({ categories: [] });
    localStorage.removeItem('categories');
  }
})); 