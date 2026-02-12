import { createContext, useContext, useState, useEffect } from 'react';

const API_URL = '/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify stored token on app load (auto-login)
    const verifyToken = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const res = await fetch(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          const data = await res.json();
          if (data.success) {
            setUser(data.user);
            setToken(savedToken);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch {
          // If backend is unreachable, keep token for retry later
          const savedUser = localStorage.getItem('user');
          if (savedUser) setUser(JSON.parse(savedUser));
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: 'Unable to connect to server' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (error) {
      return { success: false, message: 'Unable to connect to server' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
