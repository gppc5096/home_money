"use client";

import React from 'react';
import { FaChartPie } from 'react-icons/fa';
import { useTransactionStore } from '@/store/transactionStore';
import { BiTrendingUp, BiTrendingDown } from 'react-icons/bi';
import { FaLightbulb } from 'react-icons/fa';

interface InsightCardProps {
  type: 'warning' | 'success' | 'info';
  icon: React.ReactNode;
  title: string;
  description: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ type, icon, title, description }) => {
  const bgColorClass = {
    warning: 'bg-amber-500/10',
    success: 'bg-green-500/10',
    info: 'bg-blue-500/10'
  }[type];

  const borderColorClass = {
    warning: 'border-amber-500/20',
    success: 'border-green-500/20',
    info: 'border-blue-500/20'
  }[type];

  return (
    <div className={`p-4 rounded-lg border ${borderColorClass} ${bgColorClass}`}>
      <div className="flex items-start gap-3">
        <div className="mt-1">{icon}</div>
        <div>
          <h4 className="font-medium text-white mb-1">{title}</h4>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
};

export const SpendingPatternAnalysis = () => {
  const { transactions } = useTransactionStore();

  const calculateInsights = () => {
    // 최근 달의 데이터만 필터링
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);

    const currentMonthTransactions = transactions.filter(t => new Date(t.날짜) >= lastMonth);
    const previousMonthTransactions = transactions.filter(
      t => new Date(t.날짜) >= twoMonthsAgo && new Date(t.날짜) < lastMonth
    );

    // 카테고리별 지출 계산
    const currentMonthByCategory = currentMonthTransactions.reduce((acc, t) => {
      const category = t.관 || '미분류';
      acc[category] = (acc[category] || 0) + (t.금액 || 0);
      return acc;
    }, {} as Record<string, number>);

    const previousMonthByCategory = previousMonthTransactions.reduce((acc, t) => {
      const category = t.관 || '미분류';
      acc[category] = (acc[category] || 0) + (t.금액 || 0);
      return acc;
    }, {} as Record<string, number>);

    // 가장 큰 증가를 보인 카테고리 찾기
    let maxIncrease = { category: '', percentage: 0 };
    Object.entries(currentMonthByCategory).forEach(([category, amount]) => {
      const prevAmount = previousMonthByCategory[category] || 0;
      if (prevAmount > 0) {
        const increase = ((amount - prevAmount) / prevAmount) * 100;
        if (increase > maxIncrease.percentage) {
          maxIncrease = { category, percentage: increase };
        }
      }
    });

    // 총 지출 계산
    const currentTotal = Object.values(currentMonthByCategory).reduce((a, b) => a + b, 0);
    const previousTotal = Object.values(previousMonthByCategory).reduce((a, b) => a + b, 0);
    const totalChange = ((currentTotal - previousTotal) / previousTotal) * 100;

    return {
      maxIncrease,
      totalChange,
      currentTotal,
      previousTotal
    };
  };

  const insights = calculateInsights();

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10">
          <FaChartPie className="w-6 h-6 text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">지출패턴분석</h3>
      </div>
      <div className="space-y-3">
        {insights.maxIncrease.percentage > 20 && (
          <InsightCard
            type="warning"
            icon={<BiTrendingUp className="w-5 h-5 text-amber-400" />}
            title={`${insights.maxIncrease.category} 지출 증가`}
            description={`전월 대비 ${Math.round(insights.maxIncrease.percentage)}% 증가했습니다.`}
          />
        )}
        
        <InsightCard
          type={insights.totalChange > 0 ? 'warning' : 'success'}
          icon={
            insights.totalChange > 0 
              ? <BiTrendingUp className="w-5 h-5 text-amber-400" />
              : <BiTrendingDown className="w-5 h-5 text-green-400" />
          }
          title="전체 지출 변화"
          description={`전월 대비 ${Math.abs(Math.round(insights.totalChange))}% ${
            insights.totalChange > 0 ? '증가' : '감소'
          }했습니다.`}
        />

        <InsightCard
          type="info"
          icon={<FaLightbulb className="w-5 h-5 text-blue-400" />}
          title="이번 달 예상 지출"
          description={`약 ${Math.round(insights.currentTotal * 1.1).toLocaleString()}원으로 예상됩니다.`}
        />
      </div>
    </div>
  );
}; 