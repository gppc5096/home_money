# 커밋 히스토리

### [11] 커밋: 거래통계 - 카테고리별 통계분석 차트 개선 및 레이아웃 최적화
- 📅 날짜: 2024-04-13
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: 844a382
- 📝 변경된 파일:
  - src/components/statistics/CategoryAnalysis.tsx
  - src/components/statistics/HeatmapCalendar.tsx
  - src/components/statistics/PeriodicalAnalysis.tsx
  - src/utils/formatUtils.ts
  - src/app/statistics/page.tsx
- 💡 주요 변경사항:
  - 카테고리별 통계분석 컴포넌트 개선
    - 수입/지출 파이 차트 시각화 개선
    - 카테고리별 금액 및 비율 자동 계산
    - 호버 시 상세 정보 표시 기능 추가
  - 통계 페이지 레이아웃 최적화
    - 재무현황, 상세통계, 기간별통계, 카테고리별통계 섹션 구조화
    - 다크모드 컬러 스킴 적용
    - 반응형 레이아웃 구현

### [10] 커밋: 신규 저장 데이터 미분류 문제 해결-거래입력 페이지
- 📅 날짜: 2025-04-13 11:30:25
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: b3cf37c
- 📝 변경된 파일:
  - src/components/transaction/TransactionInput/TransactionForm.tsx
- 💡 주요 변경사항:
  - 데이터 형식 통일 (날짜: YYYY.MM.DD, 필드명 한글화)
  - 데이터 정규화 처리 (trim, 기본값 설정)
  - 로깅 시스템 추가

### [3] 커밋: 'use client' 지시어 추가로 React hooks 사용 가능하도록 수정
- 📅 날짜: 2025-04-12 10:51:15
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: c9bc0c20b279002fc9d1b6055e6599f8d96eb259
- 📝 변경된 파일:
  - src/app/settings/page.tsx

### [9] 커밋: 거래목록 데이터 영구 저장 기능 구현
- 📅 날짜: 2025-04-12 16:31:46
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: 3edf24f38daf630312a7b3e1d26fe2a155ef31e4
- 📝 변경된 파일:
  - src/app/input/page.tsx
  - src/components/transaction/TransactionInput/index.tsx
  - src/components/transaction/TransactionList/index.tsx
  - src/store/transactionStore.ts

### [8] 커밋: 거래목록 수정/삭제 기능 및 페이지네이션 구현
- 📅 날짜: 2025-04-12 15:51:53
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: b5a5f4366263836d30e1600de757ac74c03597e8
- 📝 변경된 파일:
  - package-lock.json
  - package.json
  - src/app/input/page.tsx
  - src/components/transaction/TransactionList/Pagination.tsx
  - src/components/transaction/TransactionList/TransactionModal.tsx
  - src/components/transaction/TransactionList/index.tsx

### [7] 커밋: 거래설정 페이지 섹션 간격 조정 (gap-12 -> gap-10)
- 📅 날짜: 2025-04-12 15:38:16
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: 2b4cd5f0a7be3e1013eb0a25cdbd1b8b4ba36500
- 📝 변경된 파일:
  - src/app/settings/page.tsx

### [6] 커밋: 크롬 확장프로그램 오류 처리 개선
- 📅 날짜: 2025-04-12 15:30:09
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: f907de502041c97ac173563fc34b6d4e21fe9adf
- 📝 변경된 파일:
  - src/app/settings/page.tsx
  - src/utils/categoryUtils.ts

### [5] 커밋: 비밀번호 관리 버튼 색상 변경: 변경(파란색), 복구(녹색)
- 📅 날짜: 2025-04-12 11:43:54
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: 412323d171aefc8d3cc0c18abc422d970810ed75
- 📝 변경된 파일:
  - package-lock.json
  - package.json
  - src/app/settings/page.tsx
  - src/components/category/CategoryEditModal.tsx
  - src/components/category/CategoryManager.tsx
  - src/components/category/CategoryTree.tsx
  - src/store/categoryStore.ts
  - src/utils/categoryUtils.ts

### [4] 커밋: 카테고리 관리 컴포넌트 구현 - CategoryManager, CategoryControls, CategoryTree, CategoryEditModal
- 📅 날짜: 2025-04-12 11:20:53
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: b8e4846fb4b0e6645a3aaeb25c68d11d2a9581ab
- 📝 변경된 파일:
  - docs/commit-history.md
  - "public/1-\352\261\260\353\236\230\353\202\264\354\227\255.json"
  - "public/1-\354\271\264\355\205\214\352\263\240\353\246\254.json"
  - "public/\354\271\264\355\205\214\352\263\240\353\246\254\352\264\200\353\246\254.md"
  - "public/\354\271\264\355\205\214\352\263\240\353\246\254\352\264\200\353\246\254_todo.md"
  - src/app/settings/page.tsx
  - src/components/category/CategoryControls.tsx
  - src/components/category/CategoryEditModal.tsx
  - src/components/category/CategoryManager.tsx
  - src/components/category/CategoryTree.tsx

### [2] 커밋: 통계 페이지 컴포넌트 간격 gap-17로 통일
- 📅 날짜: 2025-04-12 10:37:08
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: 0c75243712ea2c1bf6513a89ef28e90827078c76
- 📝 변경된 파일:
  - README.md
  - src/app/page.tsx
  - src/app/statistics/page.tsx

### 2024-03-26
#### feat: 거래통계 - 상세통계분석 로직 구현 [47be712]
- 계층형 카테고리 분석 컴포넌트 구현
  - `src/components/statistics/HierarchicalAnalysis.tsx`
  - 대분류/중분류별 금액 및 비율 계산
  - 프로그레스 바를 통한 시각화
  - 접기/펼치기 기능 구현
- 지출 패턴 분석 컴포넌트 구현
  - `src/components/statistics/SpendingInsights.tsx`
  - 전월 대비 지출 증감 분석
  - 카테고리별 지출 경고
  - 지출 예측 기능
- 통계 페이지 레이아웃 개선
  - `src/app/statistics/page.tsx`
  - 상세통계분석 섹션에 새로운 컴포넌트 통합
