import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  password: string;
  isInitialPassword: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  setPassword: (newPassword: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      password: '',
      isInitialPassword: true,
      login: (inputPassword: string) => {
        const { password, isInitialPassword } = get();
        
        // 최초 로그인 시
        if (isInitialPassword && (!password || password === '')) {
          if (inputPassword.length >= 1) {
            set({ isAuthenticated: true, password: inputPassword });
            return true;
          }
          return false;
        }
        
        // 이후 로그인 시
        if (password && inputPassword === password) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false });
      },
      setPassword: (newPassword: string) => {
        // 새 비밀번호는 4~6자리 숫자만 허용
        if (!/^\d{4,6}$/.test(newPassword)) {
          return false;
        }
        set({ password: newPassword, isInitialPassword: false });
        return true;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
); 