import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { dbAuth } from '../services/db';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<UserProfile>;
  register: (email: string, password: string, fullName: string, role?: UserRole, city?: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
  switchDemoRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const current = dbAuth.getCurrentUser();
    setUser(current);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    const loggedIn = await dbAuth.login(email, password || 'password');
    setUser(loggedIn);
    return loggedIn;
  };

  const register = async (email: string, password: string, fullName: string, role: UserRole = 'customer', city?: string) => {
    const newUser = await dbAuth.register(email, password, fullName, role, city);
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    await dbAuth.logout();
    setUser(null);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    const updated = await dbAuth.updateProfile(data);
    setUser(updated);
    return updated;
  };

  const switchDemoRole = async (role: UserRole) => {
    if (role === 'admin') {
      await login('admin@hunzaheritage.com', 'admin123');
    } else if (role === 'seller') {
      await login('seller@hunzaheritage.com', 'seller123');
    } else {
      await login('customer@hunzaheritage.com', 'customer123');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile, switchDemoRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
