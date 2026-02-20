import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const savedId = localStorage.getItem(USER_ID_KEY);
    if (!savedId) { setLoading(false); return; }
    try {
      const u = await userApi.getById(savedId);
      setUser(u);
    } catch {
      localStorage.removeItem(USER_ID_KEY);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUser(); }, []);

  const login = (u: User) => {
    localStorage.setItem(USER_ID_KEY, u.id);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(USER_ID_KEY);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, refreshUser: fetchUser, isLoggedIn: !!user }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
