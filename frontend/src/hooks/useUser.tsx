import { useState, createContext, useContext, ReactNode, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from '../types';
import { userApi } from '../api';

const USER_ID_KEY = 'quiz_user_id';

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => void;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  refreshUser: () => {},
  isLoggedIn: false,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem(USER_ID_KEY));
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.getById(userId as string),
    enabled: !!userId,
    retry: 1,
    onError: () => {
      localStorage.removeItem(USER_ID_KEY);
      setUserId(null);
    },
  });

  const login = (u: User) => {
    localStorage.setItem(USER_ID_KEY, u.id);
    setUserId(u.id);
    queryClient.setQueryData(['user', u.id], u);
  };

  const logout = () => {
    localStorage.removeItem(USER_ID_KEY);
    setUserId(null);
    queryClient.removeQueries({ queryKey: ['user'] });
  };

  const refreshUser = () => {
    if (!userId) return;
    queryClient.invalidateQueries({ queryKey: ['user', userId] });
  };

  const value = useMemo(
    () => ({ user: user ?? null, loading: isLoading, login, logout, refreshUser, isLoggedIn: !!user }),
    [user, isLoading, login, logout, refreshUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
