import { redirect } from 'next/navigation';
import PageTitle from "@/components/PageTitle";
import { FaMoneyBillWave } from "react-icons/fa";
import { IoAddCircle } from "react-icons/io5";
import { FaListAlt } from "react-icons/fa";

export default function Home() {
  redirect('/input');
}

export function TransactionInput() {
  return (
    <div className="flex flex-col gap-8">
      <PageTitle
        title="거래입력"
        description="일일 수입/지출 내역을 입력하고 관리하세요."
        icon={FaMoneyBillWave}
        iconColor="text-green-200"
      />
      
      <section>
        <div className="flex items-center gap-3 mb-4">
          <IoAddCircle className="h-6 w-6 text-blue-200" />
          <h2 className="text-xl font-semibold text-white">신규 거래 입력</h2>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          {/* 거래 입력 폼이 이곳에 추가될 예정입니다 */}
          <p className="text-gray-400">거래 입력 폼이 이곳에 위치합니다.</p>
        </div>
      </section>

      <div className="h-[1px] bg-purple-300/30" />

      <section>
        <div className="flex items-center gap-3 mb-4">
          <FaListAlt className="h-6 w-6 text-yellow-200" />
          <h2 className="text-xl font-semibold text-white">거래 목록 현황</h2>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          {/* 거래 목록 테이블이 이곳에 추가될 예정입니다 */}
          <p className="text-gray-400">거래 목록 테이블이 이곳에 위치합니다.</p>
        </div>
      </section>
    </div>
  );
}
