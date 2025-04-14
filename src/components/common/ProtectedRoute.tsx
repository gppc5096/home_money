"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // 인증이 필요한 페이지에서 비인증 상태일 때
    if (requireAuth && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // 로그인 페이지에서 이미 인증된 상태일 때
    if (!requireAuth && isAuthenticated) {
      router.push('/input');
      return;
    }
  }, [isAuthenticated, requireAuth, router]);

  // 인증이 필요한 페이지에서 비인증 상태이거나,
  // 로그인 페이지에서 이미 인증된 상태일 때는 아무것도 렌더링하지 않음
  if ((requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated)) {
    return null;
  }

  return <>{children}</>;
}; 