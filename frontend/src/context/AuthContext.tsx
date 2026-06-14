import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'designer' | 'admin';
}

interface AuthContextType {
  user: UserPayload | null;
  token: string | null;
  loading: boolean;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; role?: string; error?: string }>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Re-verify session identity validation loop on boot up
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('stylora_auth_token');
      const savedUser = localStorage.getItem('stylora_user_payload');

      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          // Optional: Verify token with backend /auth/verify here if needed
        } catch (e) {
          logoutUser();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const loginUser = async (email: string, password: string) => {
    try {
      // Connects directly to your backend auth route endpoint payload
      const response = await API.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem('stylora_auth_token', receivedToken);
      localStorage.setItem('stylora_user_payload', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);

      return { success: true, role: receivedUser.role };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid entry credentials';
      return { success: false, error: errorMessage };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('stylora_auth_token');
    localStorage.removeItem('stylora_user_payload');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, logoutUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be wrapped within an AuthProvider structural layer');
  return context;
};