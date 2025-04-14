# 가계부 웹 애플리케이션 개발 명세서

## 1. 프로젝트 개요

### 1.1 프로젝트 소개
- **프로젝트명**: House Holder (가계부)
- **개발 기간**: 2024.03 ~ 2024.04
- **개발 목적**: 
  - 개인 재무 관리를 위한 직관적인 웹 기반 가계부 시스템 구축
  - 수입/지출 데이터의 효과적인 시각화 및 분석 제공
  - 카테고리 기반의 체계적인 거래 관리 지원

### 1.2 기술 스택
- **Frontend Framework**: Next.js 14, TypeScript 5.x
- **상태 관리**: Zustand
- **스타일링**: Tailwind CSS
- **데이터 시각화**: Chart.js
- **데이터 저장소**: LocalStorage
- **개발 도구**: VS Code, Git

## 2. 시스템 아키텍처

### 2.1 디렉토리 구조
```
project-root/
├── src/
│   ├── app/                 # 페이지 컴포넌트
│   │   ├── input/          # 거래 입력 페이지
│   │   ├── statistics/     # 통계 페이지
│   │   └── settings/       # 설정 페이지
│   ├── components/         # 재사용 컴포넌트
│   │   ├── common/        # 공통 컴포넌트
│   │   ├── transaction/   # 거래 관련 컴포넌트
│   │   └── statistics/    # 통계 관련 컴포넌트
│   ├── store/             # Zustand 상태 관리
│   └── utils/             # 유틸리티 함수
└── public/                # 정적 파일
```

### 2.2 핵심 컴포넌트 구조
```typescript
// 거래 입력 폼
interface TransactionFormProps {
  onSubmit: (data: TransactionData) => void;
  initialData?: TransactionData;
}

// 통계 차트
interface StatisticsChartProps {
  data: ChartData;
  type: 'bar' | 'pie' | 'line';
  options?: ChartOptions;
}

// 카테고리 관리
interface CategoryManagerProps {
  categories: Category[];
  onUpdate: (categories: Category[]) => void;
}
```

## 3. 기능별 상세 명세

### 3.1 거래 입력/관리
- **데이터 입력**
  - 날짜, 유형(수입/지출), 카테고리, 금액, 메모 입력
  - 실시간 유효성 검사
  - 자동 저장 기능

- **거래 목록**
  - 페이지네이션 지원
  - 필터링 및 정렬 기능
  - 수정/삭제 기능

### 3.2 통계 분석
- **요약 통계**
  - 총 수입/지출/잔액 표시
  - 기간별 추이 분석

- **카테고리별 분석**
  - 파이 차트로 비율 시각화
  - 카테고리별 금액 집계

- **기간별 분석**
  - 월별 추이 그래프
  - 전월 대비 증감 분석

### 3.3 카테고리 관리
- **카테고리 CRUD**
  - 카테고리 추가/수정/삭제
  - 계층 구조 지원 (관/항/목)

- **데이터 관리**
  - CSV 가져오기/내보내기
  - 데이터 백업/복원

## 4. 데이터 모델

### 4.1 거래 데이터
```typescript
interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: {
    main: string;    // 관
    sub: string;     // 항
    detail: string;  // 목
  };
  amount: number;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 4.2 카테고리 데이터
```typescript
interface Category {
  id: string;
  type: 'income' | 'expense';
  main: string;      // 관
  sub: string[];     // 항
  detail: string[];  // 목
}
```

## 5. UI/UX 디자인 시스템

### 5.1 색상 시스템
```css
:root {
  /* 주요 색상 */
  --primary: #3B82F6;      /* 파란색 계열 */
  --secondary: #10B981;    /* 녹색 계열 */
  --accent: #F59E0B;       /* 강조색 */

  /* 배경색 */
  --bg-primary: #1F2937;   /* 다크 모드 주 배경 */
  --bg-secondary: #374151; /* 다크 모드 보조 배경 */

  /* 텍스트 색상 */
  --text-primary: #F9FAFB;
  --text-secondary: #D1D5DB;
}
```

### 5.2 컴포넌트 스타일
- **버튼 시스템**
  ```css
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md;
  }
  .btn-secondary {
    @apply bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md;
  }
  .btn-danger {
    @apply bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md;
  }
  ```

- **카드 컴포넌트**
  ```css
  .card {
    @apply bg-gray-800 rounded-lg p-6 shadow-lg;
  }
  ```

### 5.3 반응형 디자인
```css
/* 브레이크포인트 */
sm: '640px',   /* 모바일 */
md: '768px',   /* 태블릿 */
lg: '1024px',  /* 데스크톱 */
xl: '1280px'   /* 대형 디스플레이 */
```

## 6. 상태 관리

### 6.1 Zustand 스토어
```typescript
// 거래 내역 스토어
interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setTransactions: (transactions: Transaction[]) => void;
}

// 카테고리 스토어
interface CategoryState {
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  setCategories: (categories: Category[]) => void;
}
```

### 6.2 영구 저장소 연동
```typescript
// LocalStorage 미들웨어
const localStorageMiddleware = (config: any) => (
  set: any,
  get: any,
  api: any
) => config(
  (args: any) => {
    set(args);
    localStorage.setItem('app-state', JSON.stringify(get()));
  },
  get,
  api
);
```

## 7. 성능 최적화

### 7.1 컴포넌트 최적화
```typescript
// 메모이제이션 예시
const MemoizedTransactionList = memo(TransactionList, (prev, next) => {
  return isEqual(prev.transactions, next.transactions);
});

// 계산 최적화
const calculatedStats = useMemo(() => {
  return calculateStatistics(transactions);
}, [transactions]);
```

### 7.2 데이터 처리 최적화
- 페이지네이션 구현
- 가상 스크롤 적용
- 데이터 캐싱

## 8. 데이터 관리

### 8.1 로컬 스토리지 구조
```typescript
// 데이터 저장 형식
interface LocalStorageData {
  transactions: Transaction[];
  categories: Category[];
  settings: AppSettings;
  version: string;
}
```

### 8.2 데이터 백업/복원
```typescript
// CSV 내보내기
const exportToCSV = (data: any[], filename: string) => {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
};

// CSV 가져오기
const importFromCSV = async (file: File) => {
  const text = await file.text();
  return parseCSV(text);
};
```

## 9. 에러 처리

### 9.1 전역 에러 처리
```typescript
// 에러 바운더리
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 로깅
    console.error('Error:', error);
    // 사용자에게 피드백
    toast.error('오류가 발생했습니다.');
  }
}
```

### 9.2 폼 유효성 검사
```typescript
// 거래 입력 유효성 검사
const validateTransaction = (data: TransactionData) => {
  const errors: ValidationErrors = {};
  
  if (!data.amount || data.amount <= 0) {
    errors.amount = '유효한 금액을 입력하세요';
  }
  
  if (!data.category) {
    errors.category = '카테고리를 선택하세요';
  }
  
  return errors;
};
```

### 9.3 사용자 피드백
- 토스트 메시지 시스템
- 로딩 상태 표시
- 에러 메시지 표시 