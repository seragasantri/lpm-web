import { createContext, useContext, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as api from '../lib/api';
import type { User } from '../lib/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('lpm_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (username: string, password: string) => {
    const response = await api.login(username, password);
    // Simpan normalized user
    const normalizedUser: User = {
      id: String(response.user.id),
      username: response.user.username,
      email: response.user.email,
      isActive: response.user.is_active ?? true,
      roleIds: (response.user.roles || []) as string[],
      permissions: (response.user.permissions || []).map((p: string) => p.replace(/_/g, '.')),
      createdAt: (response.user as Record<string, unknown>).created_at as string || new Date().toISOString(),
    };
    localStorage.setItem('lpm_user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    queryClient.invalidateQueries({ queryKey: ['me'] });
  }, [queryClient]);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;

    // Super Admin has access to everything
    if (user.roleIds?.some(r => ['Super Admin', 'super_admin', 'admin', 'r1'].includes(r))) {
      return true;
    }

    if (!user.permissions?.length) return false;
    // Support wildcard matching (e.g., 'spme' matches 'spme.akreditasi.read', 'spme.iso.read', etc.)
    if (permission.includes('.')) {
      // Exact or wildcard match
      if (user.permissions.includes(permission)) return true;
      const prefix = permission.split('.').slice(0, -1).join('.');
      return user.permissions.some(p => p.startsWith(prefix + '.'));
    }
    // Simple permission key - check if user has any permission starting with this prefix
    return user.permissions.some(p => p === permission || p.startsWith(permission + '.'));
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
