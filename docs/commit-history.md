# 커밋 히스토리

### [20] 커밋: feat: 데이터 관리 기능 구현 - 거래내역/카테고리 데이터 가져오기/내보내기 기능, CSV 형식 지원, 데이터 유효성 검사, Zustand persist 미들웨어 적용
- 📅 날짜: 2025-04-14
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: 72d2f7a
- 📝 변경된 파일:
  - "public/2-\352\260\200\352\263\204\353\266\200_\352\261\260\353\236\230\353\202\264\354\227\255_2025.
  - 4.
  - 14..csv"
  - "public/2-\354\271\264\355\205\214\352\263\240\353\246\254_\353\202\264\353\263\264\353\202\264\352\270\260_2025.
  - 4.
  - 14.csv"
  - src/app/input/page.tsx
  - src/app/login/page.tsx
  - src/app/page.tsx
  - src/app/settings/page.tsx
  - src/app/statistics/page.tsx
  - src/components/auth/ProtectedRoute.tsx
  - src/components/common/Menubar.tsx
  - src/components/common/ProtectedRoute.tsx
  - src/components/settings/CategoryManager.tsx
  - src/components/settings/PasswordManager.tsx
  - src/store/authStore.ts
  - src/store/categoryStore.ts
  - src/store/transactionStore.ts
  - src/utils/categoryUtils.ts
- 💡 주요 변경사항:
    - feat: 데이터 관리 기능 구현 - 거래내역/카테고리 데이터 가져오기/내보내기 기능, CSV 형식 지원, 데이터 유효성 검사, Zustand persist 미들웨어 적용


### [19] 커밋: refactor: 내보내기 파일명의 날짜 형식을 yyyy.MM.dd로 통일
- 📅 날짜: 2025-04-14
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: 4509172
- 📝 변경된 파일:
  - src/app/settings/page.tsx
  - src/utils/categoryUtils.ts
- 💡 주요 변경사항:
    - refactor: 내보내기 파일명의 날짜 형식을 yyyy.MM.dd로 통일


### [18] 커밋: refactor: 내보내기 파일명 형식 통일
- 📅 날짜: 2025-04-14
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: 8670e51
- 📝 변경된 파일:
  - src/app/settings/page.tsx
  - src/utils/categoryUtils.ts
- 💡 주요 변경사항:
    - refactor: 내보내기 파일명 형식 통일


### [17] 커밋: feat: 거래내역 CSV 내보내기/가져오기 기능 구현
- 📅 날짜: 2025-04-14
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: efc1249
- 📝 변경된 파일:
  - src/app/settings/page.tsx
- 💡 주요 변경사항:
    - feat: 거래내역 CSV 내보내기/가져오기 기능 구현


### [16] 커밋: refactor: 카테고리별 계층분석 제목을 심층분석으로 변경
- 📅 날짜: 2025-04-14
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: 9f50b3d
- 📝 변경된 파일:
  - src/components/statistics/HierarchicalAnalysis.tsx
- 💡 주요 변경사항:
    - refactor: 카테고리별 계층분석 제목을 심층분석으로 변경


### [15] 커밋: refactor: SpendingInsights를 SpendingPatternAnalysis로 대체하고 통계 페이지 구조 개선
- 📅 날짜: 2025-04-14
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: ae5ffba
- 📝 변경된 파일:
  - docs/commit-history.md
  - src/app/statistics/page.tsx
  - src/components/statistics/SpendingInsights.tsx
  - src/components/statistics/SpendingPatternAnalysis.tsx
- 💡 주요 변경사항:
    - refactor: SpendingInsights를 SpendingPatternAnalysis로 대체하고 통계 페이지 구조 개선


### [14] 커밋: feat: Install Git Hook for automatic commit-history.md updates
- 📅 날짜: 2025-04-14
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: cd61e41
- 📝 변경된 파일:
  - docs/commit-history.md
  - src/app/input/page.tsx
- 💡 주요 변경사항:
    - feat: Install Git Hook for automatic commit-history.md updates


### [13] 커밋: PageTitle 컴포넌트 스타일 일괄 수정
- 📅 날짜: 2024-03-27
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: e28959b
- 📝 변경된 파일:
  - src/components/common/PageTitle.tsx
- 💡 주요 변경사항:
  - 모든 페이지의 PageTitle 컴포넌트 스타일 통일
    - 테두리 둥글기 45px로 수정
    - 간격과 패딩 최적화
    - 텍스트 중앙 정렬 적용
  - 적용 페이지
    - 거래입력
    - 거래통계
    - 거래설정

### [12] 커밋: 카테고리별 필터분석 컴포넌트 타이틀 섹션 추가
- 📅 날짜: 2024-04-13
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: 545039d
- 📝 변경된 파일:
  - src/components/statistics/CategoryFilterAnalysis.tsx
- 💡 주요 변경사항:
  - 컴포넌트 타이틀 섹션 구현
    - '카테고리별 계층분석' 타이틀 추가
    - FaLayerGroup 아이콘 통합 (파란색)
    - 타이틀 텍스트 스타일링 적용
  - 컴포넌트 UI 개선
    - 배경색 및 투명도 조정
    - 패딩 및 간격 최적화
    - 라운드 처리된 모서리 적용

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

### [3] 커밋: 'use client' 지시어 추가로 React hooks 사용 가능하도록 수정
- 📅 날짜: 2025-04-12 10:51:15
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: c9bc0c20b279002fc9d1b6055e6599f8d96eb259
- 📝 변경된 파일:
  - src/app/settings/page.tsx

### [2] 커밋: 통계 페이지 컴포넌트 간격 gap-17로 통일
- 📅 날짜: 2025-04-12 10:37:08
- 👤 작성자: Jongchoon Na
- 🔍 커밋 해시: 0c75243712ea2c1bf6513a89ef28e90827078c76
- 📝 변경된 파일:
  - README.md
  - src/app/page.tsx
  - src/app/statistics/page.tsx

