"use client";

import PageTitle from "@/components/PageTitle";
import { IoWallet } from "react-icons/io5";
import { IoAddCircle } from "react-icons/io5";
import TransactionList from "@/components/transaction/TransactionList";
import { FaArrowUp } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function InputPage() {
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
    <div className="flex flex-col gap-10 p-8">
      <PageTitle
        title="거래입력"
        description="수입과 지출 내역을 입력하고 관리하세요."
        icon={IoWallet}
        iconColor="text-green-200"
      />

      {/* 신규 거래입력 섹션 */}
      <section className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <IoAddCircle className="h-6 w-6 text-blue-200" />
          <h2 className="text-xl font-semibold text-white">신규 거래 입력</h2>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-6">
          {/* 거래 입력 폼이 이곳에 추가될 예정입니다 */}
          <p className="text-gray-400">거래 입력 폼이 이곳에 위치합니다.</p>
        </div>
      </section>

      {/* 구분선 */}
      <div className="h-[1px] bg-purple-300/30" />

      {/* 거래목록현황 섹션 */}
      <section className="bg-gray-900 rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">거래목록현황</h2>
          <p className="text-gray-400 text-sm mt-1">
            최근 거래내역을 확인하고 관리할 수 있습니다.
          </p>
        </div>
        <TransactionList />
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