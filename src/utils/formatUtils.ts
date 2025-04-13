export const formatAmount = (amount: number | string | undefined): string => {
  if (amount === undefined || amount === null) return '0';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return '0';
  
  return numAmount.toLocaleString();
};

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '날짜 없음';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
}; 