"use client";

import PageTitle from "@/components/common/PageTitle";
import { IoWallet } from "react-icons/io5";
import { FaListAlt } from "react-icons/fa";
import TransactionList from "@/components/transaction/TransactionList";
import { FaArrowUp } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useCategoryStore } from "@/store/categoryStore";
import { useTransactionStore } from "@/store/transactionStore";
import toast from "react-hot-toast";
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { IoAddCircle } from "react-icons/io5";
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface FormData {
  date: string;
  유형: "수입" | "지출";
  관: string;
  항: string;
  목: string;
  amount: string;
  memo: string;
}

const initialFormData: FormData = {
  date: format(new Date(), 'yyyy-MM-dd'),
  유형: "지출",
  관: "",
  항: "",
  목: "",
  amount: "",
  memo: ""
};

export default function InputPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const { categories, loadCategories } = useCategoryStore();
  const { addTransaction } = useTransactionStore();

  // 컴포넌트 마운트 시 카테고리 데이터 로드
  useEffect(() => {
    const initializeData = async () => {
      try {
        await loadCategories();
        setMounted(true);
      } catch (error) {
        console.error('카테고리 데이터 로드 실패:', error);
        toast.error('카테고리 데이터를 불러오는데 실패했습니다.');
      }
    };

    initializeData();
  }, [loadCategories]);

  // 카테고리 데이터가 변경될 때마다 선택된 값들 유효성 검사
  useEffect(() => {
    if (mounted && categories.length > 0) {
      const isValidCategory = categories.some(cat => 
        cat.유형 === formData.유형 && 
        cat.관 === formData.관 && 
        cat.항 === formData.항 && 
        cat.목 === formData.목
      );

      if (!isValidCategory && formData.관) {
        setFormData(prev => ({
          ...prev,
          관: "",
          항: "",
          목: ""
        }));
      }
    }
  }, [categories, mounted, formData.유형]);

  // 유형에 따른 관 목록
  const 관목록 = Array.from(new Set(
    categories
      .filter(cat => cat.유형 === formData.유형)
      .map(cat => cat.관)
  ));

  // 선택된 관에 따른 항 목록
  const 항목록 = Array.from(new Set(
    categories
      .filter(cat => cat.유형 === formData.유형 && cat.관 === formData.관)
      .map(cat => cat.항)
  ));

  // 선택된 항에 따른 목 목록
  const 목목록 = Array.from(new Set(
    categories
      .filter(cat => 
        cat.유형 === formData.유형 && 
        cat.관 === formData.관 && 
        cat.항 === formData.항
      )
      .map(cat => cat.목)
  ));

  // 입력값 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // 금액 입력 처리
    if (name === 'amount') {
      // 숫자가 아닌 문자 제거
      const numericValue = value.replace(/[^0-9]/g, '');
      // 천단위 콤마 추가
      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }

    // 유형 변경 시 관련 필드 초기화
    if (name === '유형') {
      setFormData(prev => ({
        ...prev,
        유형: value as "수입" | "지출",
        관: "",
        항: "",
        목: ""
      }));
      return;
    }

    // 관 변경 시 항, 목 초기화
    if (name === '관') {
      setFormData(prev => ({
        ...prev,
        관: value,
        항: "",
        목: ""
      }));
      return;
    }

    // 항 변경 시 목 초기화
    if (name === '항') {
      setFormData(prev => ({
        ...prev,
        항: value,
        목: ""
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.date) {
      newErrors.date = '날짜를 선택해주세요.';
    }

    if (!formData.관) {
      newErrors.관 = '관을 선택해주세요.';
    }

    if (!formData.항) {
      newErrors.항 = '항을 선택해주세요.';
    }

    if (!formData.목) {
      newErrors.목 = '목을 선택해주세요.';
    }

    if (!formData.amount) {
      newErrors.amount = '금액을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 거래 추가 처리
  const handleAddTransaction = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const newTransaction = {
        id: uuidv4(),
        날짜: formData.date,
        유형: formData.유형,
        관: formData.관,
        항: formData.항,
        목: formData.목,
        금액: parseInt(formData.amount.replace(/,/g, '')), // 콤마 제거 후 숫자로 변환
        메모: formData.memo
      };

      await addTransaction(newTransaction);
      toast.success('거래가 추가되었습니다.');
      setFormData(initialFormData);
    } catch (error) {
      console.error('거래 추가 실패:', error);
      toast.error('거래 추가에 실패했습니다.');
    }
  };

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
    <ProtectedRoute>
      <div className="flex flex-col gap-10 p-8">
        <PageTitle
          title="거래입력"
          description="수입과 지출 내역을 입력하고 관리하세요."
          icon={IoWallet}
          iconColor="text-green-200"
        />

        {/* 신규거래입력-1 섹션 */}
        <section className="bg-gray-900 rounded-lg p-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <IoAddCircle className="h-6 w-6 text-blue-200" />
              <h2 className="text-xl font-semibold text-white">신규 거래 입력</h2>
            </div>
            <div className="space-y-6">
              {/* 1단: 날짜, 유형, 금액 */}
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="bg-gray-700 text-white border-2 border-gray-400 rounded-[10px] p-2 w-full"
                />
                <select
                  name="유형"
                  value={formData.유형}
                  onChange={handleChange}
                  className="bg-gray-700 text-white border-2 border-gray-400 rounded-[10px] p-2 w-full"
                >
                  <option value="수입">수입</option>
                  <option value="지출">지출</option>
                </select>
                <input
                  type="text"
                  name="amount"
                  placeholder="금액"
                  value={formData.amount}
                  onChange={handleChange}
                  className="bg-gray-700 text-white border-2 border-gray-400 rounded-[10px] p-2 w-full text-right"
                />
              </div>

              {/* 2단: 관, 항, 목 */}
              <div className="grid grid-cols-3 gap-4">
                <select
                  name="관"
                  value={formData.관}
                  onChange={handleChange}
                  className="bg-gray-700 text-white border-2 border-gray-400 rounded-[10px] p-2 w-full"
                >
                  <option value="">관 선택</option>
                  {관목록.map(관 => (
                    <option key={관} value={관}>{관}</option>
                  ))}
                </select>
                <select
                  name="항"
                  value={formData.항}
                  onChange={handleChange}
                  className="bg-gray-700 text-white border-2 border-gray-400 rounded-[10px] p-2 w-full"
                >
                  <option value="">항 선택</option>
                  {항목록.map(항 => (
                    <option key={항} value={항}>{항}</option>
                  ))}
                </select>
                <select
                  name="목"
                  value={formData.목}
                  onChange={handleChange}
                  className="bg-gray-700 text-white border-2 border-gray-400 rounded-[10px] p-2 w-full"
                >
                  <option value="">목 선택</option>
                  {목목록.map(목 => (
                    <option key={목} value={목}>{목}</option>
                  ))}
                </select>
              </div>

              {/* 3단: 메모, 거래추가 버튼 */}
              <div className="grid grid-cols-4 gap-4">
                <input
                  type="text"
                  name="memo"
                  placeholder="메모"
                  value={formData.memo}
                  onChange={handleChange}
                  className="bg-gray-700 text-white border-2 border-gray-400 rounded-[10px] p-2 col-span-3"
                />
                <button
                  onClick={handleAddTransaction}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-[10px] p-2 transition-colors duration-200"
                >
                  거래추가
                </button>
              </div>
              {Object.entries(errors).map(([field, message]) => (
                <p key={field} className="text-red-500 text-sm">{message}</p>
              ))}
            </div>
          </div>

          <hr className="border-t-2 border-gray-400 my-8 rounded-[10px]" />

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FaListAlt className="h-6 w-6 text-yellow-200" />
              <h2 className="text-xl font-semibold text-white">거래 목록 현황</h2>
              <p className="text-gray-400 text-sm ml-2">최근 거래내역을 확인하고 관리할 수 있습니다.</p>
            </div>
            <TransactionList />
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
    </ProtectedRoute>
  );
} 