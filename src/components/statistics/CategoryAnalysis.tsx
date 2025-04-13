import React, { useMemo } from 'react';
import { useTransactionStore } from '@/store/transactionStore';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Label
} from 'recharts';

interface CategoryData {
  name: string;
  value: number;
  percentage: number;
}

const COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
];

export const CategoryAnalysis: React.FC = () => {
  const { transactions } = useTransactionStore();

  const categoryData = useMemo(() => {
    const incomeByCategory: { [key: string]: number } = {};
    const expenseByCategory: { [key: string]: number } = {};
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {
      const amount = transaction.금액 || 0;
      const category = transaction.분류 || '미분류';

      if (transaction.유형 === '수입') {
        incomeByCategory[category] = (incomeByCategory[category] || 0) + amount;
        totalIncome += amount;
      } else {
        expenseByCategory[category] = (expenseByCategory[category] || 0) + amount;
        totalExpense += amount;
      }
    });

    const incomeData: CategoryData[] = Object.entries(incomeByCategory)
      .map(([name, value]) => ({
        name,
        value,
        percentage: (value / totalIncome) * 100
      }))
      .sort((a, b) => b.value - a.value);

    const expenseData: CategoryData[] = Object.entries(expenseByCategory)
      .map(([name, value]) => ({
        name,
        value,
        percentage: (value / totalExpense) * 100
      }))
      .sort((a, b) => b.value - a.value);

    return { incomeData, expenseData, totalIncome, totalExpense };
  }, [transactions]);

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-200 font-semibold">{data.name}</p>
          <p className="text-gray-300">{formatAmount(data.value)}원</p>
          <p className="text-gray-400">{data.percentage.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  const renderCategoryChart = (
    data: CategoryData[],
    title: string,
    total: number,
    colors: string[]
  ) => (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
        <p className="text-gray-400">
          총 {formatAmount(total)}원
        </p>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
              <Label
                content={({ viewBox: { cx, cy } }) => (
                  <text
                    x={cx}
                    y={cy}
                    fill="#E5E7EB"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-sm"
                  >
                    {data.length}개 카테고리
                  </text>
                )}
              />
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value, entry: any) => (
                <span className="text-gray-300">
                  {value} ({entry.payload.percentage.toFixed(1)}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* 카테고리 목록 */}
      <div className="mt-6 space-y-2">
        {data.map((item, index) => (
          <div 
            key={item.name}
            className="flex items-center justify-between p-2 rounded hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-300">{item.name}</span>
            </div>
            <div className="text-gray-400">
              {formatAmount(item.value)}원
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* 수입 카테고리 분석 */}
      {renderCategoryChart(
        categoryData.incomeData,
        '수입 카테고리 분석',
        categoryData.totalIncome,
        COLORS
      )}

      {/* 구분선 */}
      <hr className="border-gray-700" />

      {/* 지출 카테고리 분석 */}
      {renderCategoryChart(
        categoryData.expenseData,
        '지출 카테고리 분석',
        categoryData.totalExpense,
        COLORS
      )}
    </div>
  );
}; 