import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart House Holder",
  description: "스마트한 가계부 관리 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} min-h-screen bg-gray-900 flex flex-col`}>
        <header>
          <nav className="max-w-5xl mx-auto px-4 py-4">
            <Link href="/input" className="text-xl font-bold text-green-400 hover:text-green-300 block text-center">
              Smart House Holder
            </Link>
            <div className="mt-4 flex justify-center gap-12">
              <Link href="/input" className="text-gray-300 hover:text-orange-500 transition-colors">
                거래입력
              </Link>
              <Link href="/statistics" className="text-gray-300 hover:text-orange-500 transition-colors">
                거래통계
              </Link>
              <Link href="/settings" className="text-gray-300 hover:text-orange-500 transition-colors">
                거래설정
              </Link>
            </div>
          </nav>
          <div className="h-[1px] bg-purple-300/30" />
        </header>
        <main className="flex-1 max-w-5xl mx-auto w-full">
          {children}
        </main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1F2937',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
