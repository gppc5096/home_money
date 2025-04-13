// 금액을 천단위 구분기호가 있는 문자열로 변환
export const formatAmount = (amount: string | number): string => {
  if (!amount) return '';
  
  // 문자열로 변환하고 숫자가 아닌 문자 제거
  const numStr = amount.toString().replace(/[^0-9]/g, '');
  
  // 천단위 구분기호 추가
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 포맷된 금액 문자열에서 숫자만 추출
export const parseAmount = (formattedAmount: string): number => {
  return parseInt(formattedAmount.replace(/[^0-9]/g, '')) || 0;
};

// 날짜를 YYYY-MM-DD 형식으로 포맷
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// 날짜를 YYYY년 MM월 DD일 형식으로 포맷
export const formatDateKorean = (date: string): string => {
  const [year, month, day] = date.split('-');
  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;
}; 