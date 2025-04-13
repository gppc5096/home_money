"use client";

import { MdQueryStats } from "react-icons/md";
import PageTitle from "@/components/common/PageTitle";
import { MdAttachMoney, MdTrendingUp, MdTrendingDown, MdAccountBalance } from "react-icons/md";
import { FaWallet, FaMoneyBillWave, FaChartLine, FaRegMoneyBillAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useTransactionStore } from "@/store/transactionStore";
import { formatAmount } from "@/utils/formatters";

// 카드 스타일 상수 정의
const CARD_STYLES = {
  income: {
    wrapper: "rounded-xl py-6 pr-6 pl-8 border-2 border-white/30 shadow-sm",
    iconWrapper: "flex items-center justify-center w-12 h-12 rounded-full bg-[#f5cc51]/10 mb-4",
    icon: "h-6 w-6 text-[#f5cc51]",
    label: "text-blue-400 text-sm font-medium",
    amount: "text-2xl font-bold text-gray-100 mb-2",
    description: "text-blue-300/70 text-sm"
  },
  expense: {
    wrapper: "rounded-xl py-6 pr-6 pl-8 border-2 border-white/30 shadow-sm",
    iconWrapper: "flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-4",
    icon: "h-6 w-6 text-green-400",
    label: "text-blue-400 text-sm font-medium",
    amount: "text-2xl font-bold text-gray-100 mb-2",
    description: "text-blue-300/70 text-sm"
  },
  balance: {
    positive: {
      wrapper: "rounded-xl py-6 pr-6 pl-8 border-2 border-white/30 shadow-sm",
      iconWrapper: "flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mb-4",
      icon: "h-6 w-6 text-blue-400",
      label: "text-blue-400 text-sm font-medium",
      amount: "text-2xl font-bold text-gray-100 mb-2",
      description: "text-blue-300/70 text-sm"
    },
    negative: {
      wrapper: "rounded-xl py-6 pr-6 pl-8 border-2 border-white/30 shadow-sm",
      iconWrapper: "flex items-center justify-center w-12 h-12 rounded-full bg-rose-500/10 mb-4",
      icon: "h-6 w-6 text-rose-400",
      label: "text-rose-400 text-sm font-medium",
      amount: "text-2xl font-bold text-rose-300 mb-2",
      description: "text-rose-300/70 text-sm"
    }
  }
};

export default function StatisticsPage() {
  const transactions = useTransactionStore((state) => state.transactions);
  const [financials, setFinancials] = useState({ totalIncome: 0, totalExpense: 0, currentBalance: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted) return;

    const calculated = transactions.reduce((acc, transaction) => {
      const amountStr = typeof transaction.금액 === 'string' 
        ? transaction.금액.replace(/,/g, '')
        : String(transaction.금액);
      
      const amount = Number(amountStr) || 0;

      if (transaction.유형 === '수입') {
        acc.totalIncome += amount;
      } else if (transaction.유형 === '지출') {
        acc.totalExpense += amount;
      }
      return acc;
    }, { totalIncome: 0, totalExpense: 0 });

    const currentBalance = calculated.totalIncome - calculated.totalExpense;
    setFinancials({ ...calculated, currentBalance });
  }, [transactions, mounted]);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle
        title="거래통계"
        description="거래 내역을 분석하고 통계를 확인합니다."
        icon={MdQueryStats}
        iconColor="text-blue-500"
      />

      {/* 재무현황 섹션 */}
      <section className="mt-12">
        <div className="mb-8 flex items-center gap-3">
          <MdAccountBalance className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-100">재무현황</h2>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {/* 총수입 */}
          <div className={CARD_STYLES.income.wrapper}>
            <div className={CARD_STYLES.income.iconWrapper}>
              <FaMoneyBillWave className={CARD_STYLES.income.icon} />
            </div>
            <div className="flex flex-col">
              <span className={CARD_STYLES.income.label}>총수입</span>
              <div className={CARD_STYLES.income.amount}>
                <span>{formatAmount(financials.totalIncome)}</span>
                <span className="ml-1">원</span>
              </div>
              <div className={CARD_STYLES.income.description}>
                전체 수입 금액
              </div>
            </div>
          </div>

          {/* 총지출 */}
          <div className={CARD_STYLES.expense.wrapper}>
            <div className={CARD_STYLES.expense.iconWrapper}>
              <FaRegMoneyBillAlt className={CARD_STYLES.expense.icon} />
            </div>
            <div className="flex flex-col">
              <span className={CARD_STYLES.expense.label}>총지출</span>
              <div className={CARD_STYLES.expense.amount}>
                <span>{formatAmount(financials.totalExpense)}</span>
                <span className="ml-1">원</span>
              </div>
              <div className={CARD_STYLES.expense.description}>
                전체 지출 금액
              </div>
            </div>
          </div>

          {/* 현잔액 */}
          <div className={financials.currentBalance >= 0 ? CARD_STYLES.balance.positive.wrapper : CARD_STYLES.balance.negative.wrapper}>
            <div className={financials.currentBalance >= 0 ? CARD_STYLES.balance.positive.iconWrapper : CARD_STYLES.balance.negative.iconWrapper}>
              <FaChartLine className={financials.currentBalance >= 0 ? CARD_STYLES.balance.positive.icon : CARD_STYLES.balance.negative.icon} />
            </div>
            <div className="flex flex-col">
              <span className={financials.currentBalance >= 0 ? CARD_STYLES.balance.positive.label : CARD_STYLES.balance.negative.label}>현잔액</span>
              <div className={financials.currentBalance >= 0 ? CARD_STYLES.balance.positive.amount : CARD_STYLES.balance.negative.amount}>
                <span>{financials.currentBalance < 0 && '-'}{formatAmount(Math.abs(financials.currentBalance))}</span>
                <span className="ml-1">원</span>
              </div>
              <div className={financials.currentBalance >= 0 ? CARD_STYLES.balance.positive.description : CARD_STYLES.balance.negative.description}>
                현재 보유 잔액
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 