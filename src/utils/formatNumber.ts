/**
 * 숫자를 천 단위로 쉼표가 있는 문자열로 포맷팅합니다.
 * @param value - 포맷팅할 숫자
 * @returns 포맷팅된 문자열
 */
export const formatNumber = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, '')) : value;
  return numValue.toLocaleString('ko-KR');
}; 