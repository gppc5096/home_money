import type { Category } from '@/store/categoryStore';

// 기본 카테고리 데이터
const DEFAULT_CATEGORIES: Category[] = [
  // 수입 카테고리
  { 유형: "수입", 관: "근로소득", 항: "급여", 목: "월급" },
  { 유형: "수입", 관: "근로소득", 항: "상여", 목: "성과급" },
  { 유형: "수입", 관: "금융소득", 항: "이자", 목: "예금이자" },
  { 유형: "수입", 관: "금융소득", 항: "배당", 목: "주식배당" },
  
  // 지출 카테고리
  { 유형: "지출", 관: "생활비", 항: "식비", 목: "식료품" },
  { 유형: "지출", 관: "생활비", 항: "식비", 목: "외식" },
  { 유형: "지출", 관: "생활비", 항: "주거비", 목: "월세" },
  { 유형: "지출", 관: "생활비", 항: "주거비", 목: "관리비" },
  { 유형: "지출", 관: "생활비", 항: "교통비", 목: "대중교통" },
  { 유형: "지출", 관: "생활비", 항: "교통비", 목: "주유비" },
];

// localStorage 키
const STORAGE_KEY = 'categories';

// localStorage에서 카테고리 데이터 불러오기
export const loadFromStorage = async (): Promise<Category[]> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('카테고리 데이터 로드 실패:', error);
    return DEFAULT_CATEGORIES;
  }
};

// localStorage에 카테고리 데이터 저장
export const saveToStorage = (categories: Category[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('카테고리 데이터 저장 실패:', error);
  }
};

export async function loadCategories(): Promise<Category[]> {
  // 1. localStorage에서 먼저 확인
  const storedCategories = await loadFromStorage();
  if (storedCategories.length > 0) {
    return storedCategories;
  }

  // 2. localStorage에 없으면 기본 데이터 사용
  return DEFAULT_CATEGORIES;
}

export function validateCategory(category: Partial<Category>): string | null {
  if (!category.유형) {
    return '유형을 선택해주세요.';
  }
  if (!category.관?.trim()) {
    return '관을 입력해주세요.';
  }
  if (!category.항?.trim()) {
    return '항을 입력해주세요.';
  }
  if (!category.목?.trim()) {
    return '목을 입력해주세요.';
  }
  return null;
}

export function isCategoryDuplicate(
  categories: Category[],
  newCategory: Category,
  editingCategory?: Category | null
): boolean {
  return categories.some((cat) => 
    cat.유형 === newCategory.유형 &&
    cat.관 === newCategory.관 &&
    cat.항 === newCategory.항 &&
    cat.목 === newCategory.목 &&
    (!editingCategory || (
      editingCategory.유형 !== cat.유형 ||
      editingCategory.관 !== cat.관 ||
      editingCategory.항 !== cat.항 ||
      editingCategory.목 !== cat.목
    ))
  );
}

export function groupCategories(categories: Category[], selectedType: "수입" | "지출") {
  return categories
    .filter((cat) => cat.유형 === selectedType)
    .reduce<Record<string, Record<string, string[]>>>((acc, cat) => {
      if (!acc[cat.관]) {
        acc[cat.관] = {};
      }
      if (!acc[cat.관][cat.항]) {
        acc[cat.관][cat.항] = [];
      }
      acc[cat.관][cat.항].push(cat.목);
      return acc;
    }, {});
}

export const exportCategories = (categories: Category[]) => {
  try {
    const csvContent = convertCategoriesToCSV(categories);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `카테고리_내보내기_${new Date().toLocaleDateString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Error exporting categories:', error);
    return false;
  }
};

interface UnknownCategory {
  유형: unknown;
  관: unknown;
  항: unknown;
  목: unknown;
}

function isValidCategory(category: UnknownCategory): category is Category {
  return (
    typeof category === 'object' &&
    category !== null &&
    (category.유형 === '수입' || category.유형 === '지출') &&
    typeof category.관 === 'string' &&
    typeof category.항 === 'string' &&
    typeof category.목 === 'string'
  );
}

export function importCategories(file: File): Promise<Category[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const lines = csvText.split('\n').map(line => line.trim()).filter(Boolean);
        
        // 헤더 확인 (첫 번째 줄)
        const header = lines[0].toLowerCase();
        if (!header.includes('유형') || !header.includes('관') || !header.includes('항') || !header.includes('목')) {
          throw new Error('올바른 CSV 형식이 아닙니다. (유형,관,항,목 컬럼이 필요합니다)');
        }

        // 데이터 변환 (헤더 제외)
        const categories = lines.slice(1).map(line => {
          const [유형, 관, 항, 목] = line.split(',').map(val => val.trim());
          
          if (!유형 || !관 || !항 || !목) {
            throw new Error('누락된 데이터가 있습니다.');
          }
          
          if (유형 !== '수입' && 유형 !== '지출') {
            throw new Error('유형은 "수입" 또는 "지출"이어야 합니다.');
          }

          const category = { 유형: 유형 as "수입" | "지출", 관, 항, 목 };
          if (!isValidCategory(category)) {
            throw new Error('유효하지 않은 카테고리 데이터입니다.');
          }
          return category;
        });

        resolve(categories);
      } catch (err) {
        reject(err instanceof Error ? err : new Error('파일을 읽는 중 오류가 발생했습니다.'));
      }
    };
    reader.onerror = () => reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
    reader.readAsText(file, 'utf-8');
  });
} 