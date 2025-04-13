"use client";

import { MdSettings } from "react-icons/md";
import PageTitle from "@/components/common/PageTitle";
import CategoryManager from "@/components/category/CategoryManager";
import { IoSettings } from "react-icons/io5";
import { MdDataUsage, MdDelete, MdWarning } from "react-icons/md";
import { FaFileExport, FaFileImport, FaArrowUp } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useCategoryStore } from "@/store/categoryStore";
import { exportCategories, importCategories } from "@/utils/categoryUtils";

export default function SettingsPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { categories, setCategories } = useCategoryStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // 메시지 포트 에러 핸들링
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // 메시지 포트 관련 오류 처리
      if (
        event.message?.toLowerCase().includes('message port closed') ||
        event.message?.toLowerCase().includes('runtime.lasterror') ||
        event.message?.toLowerCase().includes('the message port closed') ||
        event.message?.toLowerCase().includes('extension context invalidated')
      ) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    // 크롬 확장프로그램 관련 오류 처리
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason?.message?.toLowerCase().includes('message port closed') ||
        event.reason?.message?.toLowerCase().includes('runtime.lasterror') ||
        event.reason?.message?.toLowerCase().includes('extension context invalidated')
      ) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    // 크롬 확장프로그램 연결 해제 처리
    const handleDisconnect = () => {
      return false;
    };

    window.addEventListener('error', handleError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);
    window.addEventListener('disconnect', handleDisconnect, true);
    
    return () => {
      window.removeEventListener('error', handleError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
      window.removeEventListener('disconnect', handleDisconnect, true);
    };
  }, []);

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
    <div className="flex flex-col gap-8 p-8">
      <PageTitle
        title="거래 설정"
        description="카테고리와 거래 관련 설정을 관리합니다."
        icon={MdSettings}
        iconColor="text-purple-200"
      />
      <CategoryManager />

      {/* 데이터 관리 섹션 */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <MdDataUsage className="h-6 w-6 text-green-200" />
          <h2 className="text-xl font-semibold text-white">데이터 관리</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 거래내역 관리 */}
          <div className="bg-gray-800 rounded-lg p-8">
            <h3 className="text-lg font-medium text-white mb-4">거래내역 관리</h3>
            <div className="flex justify-between items-center">
              <button className="flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition-colors px-4 py-2">
                <FaFileExport className="h-5 w-5" />
                <span>내보내기</span>
              </button>
              <button className="flex items-center gap-2 text-sky-300 hover:text-sky-200 transition-colors px-4 py-2">
                <FaFileImport className="h-5 w-5" />
                <span>가져오기</span>
              </button>
            </div>
          </div>
          
          {/* 카테고리 관리 */}
          <div className="bg-gray-800 rounded-lg p-8">
            <h3 className="text-lg font-medium text-white mb-4">카테고리 관리</h3>
            <div className="flex justify-between items-center">
              <button 
                onClick={() => exportCategories(categories)}
                className="flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition-colors px-4 py-2"
              >
                <FaFileExport className="h-5 w-5" />
                <span>내보내기</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const importedCategories = await importCategories(file);
                      setCategories(importedCategories);
                      alert('카테고리를 성공적으로 가져왔습니다.');
                    } catch (error) {
                      alert(error instanceof Error ? error.message : '카테고리를 가져오는 중 오류가 발생했습니다.');
                    }
                    e.target.value = ''; // Reset file input
                  }
                }}
                className="hidden"
                accept=".csv"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-sky-300 hover:text-sky-200 transition-colors px-4 py-2"
              >
                <FaFileImport className="h-5 w-5" />
                <span>가져오기</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 데이터 초기화 섹션 */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <MdDelete className="h-6 w-6 text-red-500" />
          <h2 className="text-xl font-semibold text-white">데이터 초기화</h2>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-red-500/50 hover:border-red-500 transition-colors">
          <div className="flex items-start gap-3">
            <MdWarning className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-base font-medium text-red-400 mb-2">
                모든 데이터가 영구적으로 삭제됩니다
              </h3>
              <div className="text-sm text-gray-400 mb-4 grid grid-cols-2 gap-2">
                <span>• 카테고리 데이터</span>
                <span>• 거래 내역</span>
                <span>• 사용자 설정</span>
                <span>• 통계 데이터</span>
              </div>
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
                >
                  <MdDelete className="h-4 w-4" />
                  <span>데이터 초기화</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-red-400 font-medium">
                    정말로 모든 데이터를 초기화하시겠습니까?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        try {
                          localStorage.clear();
                          setCategories([]);
                          setShowResetConfirm(false);
                          alert('모든 데이터가 성공적으로 초기화되었습니다.');
                        } catch (error) {
                          alert('데이터 초기화 중 오류가 발생했습니다.');
                          console.error('초기화 오류:', error);
                        }
                      }}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
                    >
                      확인
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-md text-sm transition-colors"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 위로가기 버튼 */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-purple-500 hover:bg-purple-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="위로 가기"
      >
        <FaArrowUp className="h-6 w-6" />
      </button>
    </div>
  );
} 