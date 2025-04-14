"use client";

import React, { useState } from 'react';
import { FaKey } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export const PasswordManager = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { password: storedPassword, setPassword, isInitialPassword } = useAuthStore();

  const validateNewPassword = (password: string) => {
    if (!/^\d{4,6}$/.test(password)) {
      toast.error('비밀번호는 4~6자리 숫자만 가능합니다.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 최초 비밀번호 설정
    if (!storedPassword || isInitialPassword) {
      if (newPassword !== confirmPassword) {
        toast.error('새 비밀번호가 일치하지 않습니다.');
        return;
      }

      if (!validateNewPassword(newPassword)) {
        return;
      }

      if (setPassword(newPassword)) {
        toast.success('비밀번호가 설정되었습니다.');
        setNewPassword('');
        setConfirmPassword('');
        // 홈 페이지로 리다이렉션
        router.push('/');
      }
      return;
    }

    // 비밀번호 변경
    if (currentPassword !== storedPassword) {
      toast.error('현재 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!validateNewPassword(newPassword)) {
      return;
    }

    if (setPassword(newPassword)) {
      toast.success('비밀번호가 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // 홈 페이지로 리다이렉션
      router.push('/');
    }
  };

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <FaKey className="h-6 w-6 text-yellow-500" />
        <h2 className="text-xl font-semibold text-white">비밀번호 관리</h2>
      </div>
      <div className="bg-gray-800 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isInitialPassword && storedPassword && (
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                현재 비밀번호
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
              {!isInitialPassword && storedPassword ? '새 비밀번호' : '비밀번호'}
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              placeholder="4~6자리 숫자"
              maxLength={6}
            />
            <p className="text-sm text-gray-400 mt-1">
              비밀번호는 4~6자리 숫자만 가능합니다.
            </p>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              {!isInitialPassword && storedPassword ? '새 비밀번호 확인' : '비밀번호 확인'}
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              placeholder="4~6자리 숫자"
              maxLength={6}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {!isInitialPassword && storedPassword ? '비밀번호 변경' : '비밀번호 설정'}
          </button>
        </form>
      </div>
    </section>
  );
}; 