import React, { useState, useMemo } from 'react';
import { useTransactionStore } from '@/store/transactionStore';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  ResponsiveContainer
} from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';

type PeriodType = 'monthly' | 'yearly' | 'all';
type DataType = 'income' | 'expense' | 'balance' | 'all';
type ChartType = 'bar' | 'line' | 'combined';

interface ChartData {
  period: string;
  수입: number;
  지출: number;
  잔액: number;
}

export const PeriodicalAnalysis: React.FC = () => {
  const { transactions } = useTransactionStore();
  const [periodType, setPeriodType] = useState<PeriodType>('monthly');
  const [dataType, setDataType] = useState<DataType>('all');
  const [chartType, setChartType] = useState<ChartType>('combined');

  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: ChartData } = {};

    // 모든 거래 데이터를 월별로 집계
    transactions.forEach(transaction => {
      try {
        // 날짜가 없거나 유효하지 않은 경우 스킵
        if (!transaction.날짜) return;

        // 날짜 문자열에서 하이픈(-) 또는 점(.) 통일
        const normalizedDate = transaction.날짜.replace(/\./g, '-');
        const date = parseISO(normalizedDate);

        // 유효하지 않은 날짜인 경우 스킵
        if (!isValid(date)) {
          console.warn('Invalid date:', transaction.날짜);
          return;
        }

        const monthKey = format(date, 'yyyy.MM');
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            period: monthKey,
            수입: 0,
            지출: 0,
            잔액: 0
          };
        }

        const amount = transaction.금액 || 0;
        if (transaction.유형 === '수입') {
          monthlyData[monthKey].수입 += amount;
        } else {
          monthlyData[monthKey].지출 += amount;
        }
        monthlyData[monthKey].잔액 = monthlyData[monthKey].수입 - monthlyData[monthKey].지출;
      } catch (error) {
        console.error('Error processing transaction:', transaction, error);
      }
    });

    // 데이터가 없는 경우 현재 월 데이터 추가
    if (Object.keys(monthlyData).length === 0) {
      const currentMonth = format(new Date(), 'yyyy.MM');
      monthlyData[currentMonth] = {
        period: currentMonth,
        수입: 0,
        지출: 0,
        잔액: 0
      };
    }

    return Object.values(monthlyData).sort((a, b) => a.period.localeCompare(b.period));
  }, [transactions]);

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <select
          className="bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600"
          value={periodType}
          onChange={(e) => setPeriodType(e.target.value as PeriodType)}
        >
          <option value="monthly">월별 보기</option>
          <option value="yearly">연간 보기</option>
          <option value="all">전체 보기</option>
        </select>

        <select
          className="bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600"
          value={dataType}
          onChange={(e) => setDataType(e.target.value as DataType)}
        >
          <option value="all">전체</option>
          <option value="income">수입</option>
          <option value="expense">지출</option>
          <option value="balance">잔액</option>
        </select>

        <select
          className="bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600"
          value={chartType}
          onChange={(e) => setChartType(e.target.value as ChartType)}
        >
          <option value="combined">복합 차트</option>
          <option value="bar">막대 그래프</option>
          <option value="line">선 그래프</option>
        </select>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="period" 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              tickFormatter={formatAmount}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
                color: '#F3F4F6'
              }}
              formatter={(value: number) => formatAmount(value) + '원'}
            />
            <Legend 
              wrapperStyle={{
                color: '#F3F4F6'
              }}
            />
            {(dataType === 'all' || dataType === 'income') && (
              <Bar dataKey="수입" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            )}
            {(dataType === 'all' || dataType === 'expense') && (
              <Bar dataKey="지출" fill="#EF4444" radius={[4, 4, 0, 0]} />
            )}
            {(dataType === 'all' || dataType === 'balance') && (
              <Line
                type="monotone"
                dataKey="잔액"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', r: 4 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 