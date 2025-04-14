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
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('카테고리 로드 실패:', error);
    return [];
  }
};

// localStorage에 카테고리 데이터 저장
export const saveToStorage = (categories: Category[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('카테고리 저장 실패:', error);
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
    // CSV 헤더 생성
    const headers = ['유형', '관', '항', '목'];
    
    // 데이터를 CSV 형식으로 변환
    const csvData = categories.map(category => [
      category.유형,
      category.관,
      category.항,
      category.목
    ]);

    // 헤더와 데이터 결합
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Blob 생성 및 다운로드
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // 날짜 형식 포맷팅
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}.${month}.${day}`;
    
    link.download = `카테고리_내보내기_${formattedDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('카테고리 내보내기 실패:', error);
    throw new Error('카테고리 내보내기에 실패했습니다.');
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

export const importCategories = async (file: File): Promise<Category[]> => {
  try {
    const text = await file.text();
    const rows = text.split('\n');
    const headers = rows[0].split(',');

    const importedData = rows.slice(1)
      .filter(row => row.trim() !== '')
      .map(row => {
        const values = row.split(',');
        return {
          유형: values[0] as "수입" | "지출",
          관: values[1],
          항: values[2],
          목: values[3]
        };
      })
      .filter(category => 
        category.유형 && 
        category.관 && 
        category.항 && 
        category.목 &&
        (category.유형 === "수입" || category.유형 === "지출")
      );

    if (importedData.length === 0) {
      throw new Error('유효한 카테고리가 없습니다.');
    }

    return importedData;
  } catch (error) {
    console.error('카테고리 가져오기 실패:', error);
    throw new Error('카테고리 가져오기에 실패했습니다.');
  }
}; 