import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { login, logout, getUser, clearAuth, type LoginResponse } from '../lib/api';

export interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  isActive: boolean;
  roles: string[];
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseStoredUser(): User | null {
  const stored = getUser();
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => parseStoredUser());

  const handleLogin = useCallback(async (username: string, password: string) => {
    const data = await login(username, password);
    // Normalize permission names: underscore → dot (backend uses underscores, frontend expects dots)
    const normalizedUser = {
      ...data.user,
      isActive: data.user.is_active,
      permissions: data.user.permissions.map((p: string) => p.replace(/_/g, '.')),
    };
    setUser(normalizedUser);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    setUser(null);
  }, []);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user?.permissions?.length) return false;
    // exact match
    if (user.permissions.includes(permission)) return true;
    // wildcard: berita matches berita.create, berita.read, etc.
    return user.permissions.some(p => p === permission || p.startsWith(permission + '.'));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout, isAuthenticated: !!user, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}