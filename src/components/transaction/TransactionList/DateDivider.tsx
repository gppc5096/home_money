import { Transaction } from '@/store/transactionStore';
import { formatNumber } from '@/utils/formatNumber';

interface DateDividerProps {
  date: string;
  dayOfWeek: string;
  transactions: Transaction[];
  totalAmount: {
    income: number;
    expense: number;
  };
}

const DateDivider: React.FC<DateDividerProps> = ({ date, dayOfWeek, totalAmount }) => (
  <div className="bg-gray-700/30 px-4 py-2 rounded-lg text-sm flex justify-between items-center">
    <span className="text-blue-200 font-medium">
      {date} ({dayOfWeek})
    </span>
    <div className="flex gap-4">
      {totalAmount.income > 0 && (
        <span className="text-blue-400">
          수입: {formatNumber(totalAmount.income)}원
        </span>
      )}
      {totalAmount.expense > 0 && (
        <span className="text-red-400">
          지출: {formatNumber(totalAmount.expense)}원
        </span>
      )}
    </div>
  </div>
);

export default DateDivider; 