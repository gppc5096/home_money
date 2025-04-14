"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Menubar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link
            href="/transactions"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              pathname === '/transactions'
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            거래내역
          </Link>
          <Link
            href="/statistics"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              pathname === '/statistics'
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            통계
          </Link>
          <Link
            href="/settings"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              pathname === '/settings'
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            설정
          </Link>
        </div>
      </div>
    </nav>
  );
} 