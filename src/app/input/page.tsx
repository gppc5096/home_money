"use client";

import PageTitle from "@/components/PageTitle";
import { IoWallet } from "react-icons/io5";
import { IoAddCircle } from "react-icons/io5";
import TransactionList from "@/components/transaction/TransactionList";

export default function InputPage() {
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
    </div>
  );
} 