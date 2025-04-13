"use client";

import { MdQueryStats } from "react-icons/md";
import PageTitle from "@/components/common/PageTitle";
import { IoStatsChart } from "react-icons/io5";
import { FaChartPie, FaChartBar, FaFileAlt, FaArrowUp } from "react-icons/fa";
import { MdAttachMoney, MdAnalytics } from "react-icons/md";
import { useState, useEffect } from "react";
import TransactionList from '@/components/transaction/TransactionList';

export default function StatisticsPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 스크롤 이벤트 핸들링
  useEffect(() => {
    const handleScroll = () => {
      // 100px 이상 스크롤되면 버튼 표시
      setShowScrollTop(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle
        title="거래통계"
        description="거래 내역을 분석하고 통계를 확인합니다."
        icon={MdQueryStats}
        iconColor="text-blue-500"
      />
      <div className="mt-8">
        <TransactionList />
      </div>

      {/* 재무현황 섹션 */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <MdAttachMoney className="h-6 w-6 text-green-200" />
          <h2 className="text-xl font-semibold text-white">재무현황</h2>
        </div>
        <div className="bg-gray-800 rounded-lg p-8">
          <p className="text-gray-400">재무현황 대시보드가 이곳에 위치합니다.</p>
        </div>
      </section>

      {/* 분석 섹션 - 2단 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-17">
        <section>
          <div className="mb-6 flex items-center gap-3">
            <MdAnalytics className="h-6 w-6 text-blue-200" />
            <h2 className="text-xl font-semibold text-white">상세통계분석</h2>
          </div>
          <div className="bg-gray-800 rounded-lg p-8 h-full">
            <p className="text-gray-400">상세 통계 분석이 이곳에 위치합니다.</p>
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center gap-3">
            <FaChartBar className="h-6 w-6 text-yellow-200" />
            <h2 className="text-xl font-semibold text-white">기간별통계분석</h2>
          </div>
          <div className="bg-gray-800 rounded-lg p-8 h-full">
            <p className="text-gray-400">기간별 통계 분석이 이곳에 위치합니다.</p>
          </div>
        </section>
      </div>

      {/* 차트 섹션 - 2단 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-17">
        <section>
          <div className="mb-6 flex items-center gap-3">
            <FaChartBar className="h-6 w-6 text-purple-200" />
            <h2 className="text-xl font-semibold text-white">수입/지출챠트</h2>
          </div>
          <div className="bg-gray-800 rounded-lg p-8 h-full">
            <p className="text-gray-400">수입/지출 차트가 이곳에 위치합니다.</p>
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center gap-3">
            <FaChartPie className="h-6 w-6 text-orange-200" />
            <h2 className="text-xl font-semibold text-white">카테고리별챠트</h2>
          </div>
          <div className="bg-gray-800 rounded-lg p-8 h-full">
            <p className="text-gray-400">카테고리별 차트가 이곳에 위치합니다.</p>
          </div>
        </section>
      </div>

      {/* 보고서 섹션 */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <FaFileAlt className="h-6 w-6 text-cyan-200" />
          <h2 className="text-xl font-semibold text-white">보고서</h2>
        </div>
        <div className="bg-gray-800 rounded-lg p-8">
          <p className="text-gray-400">상세 보고서가 이곳에 위치합니다.</p>
        </div>
      </section>

      {/* 위로가기 버튼 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out"
          aria-label="위로 가기"
        >
          <FaArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
} 