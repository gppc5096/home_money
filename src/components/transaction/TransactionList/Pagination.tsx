"use client";

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // 표시할 페이지 번호 계산
  const getVisiblePages = () => {
    const delta = 2; // 현재 페이지 기준 양쪽에 보여줄 페이지 수
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md bg-gray-800 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaChevronLeft size={14} />
      </button>
      
      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' ? onPageChange(page) : null}
          disabled={page === '...'}
          className={`
            min-w-[32px] h-8 px-3 rounded-md
            ${typeof page === 'number' && page === currentPage
              ? 'bg-blue-500 text-white'
              : page === '...'
              ? 'bg-transparent text-gray-400 cursor-default'
              : 'bg-gray-800 text-gray-400 hover:text-white'
            }
          `}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md bg-gray-800 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaChevronRight size={14} />
      </button>
    </div>
  );
};

export default Pagination; 