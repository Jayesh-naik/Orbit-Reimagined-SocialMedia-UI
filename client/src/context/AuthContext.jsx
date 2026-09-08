import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { socket } from '../services/socket';
import { mockStorage } from '../services/mockStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    let token = localStorage.getItem('accessToken');
    
    // Auto-seed demo token in frontend-only mode if missing
    if (!token) {
      token = 'demo_access_token_jayesh';
      localStorage.setItem('accessToken', token);
    }

    try {
      const { data } = await api.get('/auth/me');
      if (data?.user) {
        setUser(data.user);
      } else {
        const demoUser = mockStorage.getCurrentUser();
        setUser(demoUser);
      }
      socket.connect();
    } catch (err) {
      console.warn('[AuthContext] Backend load failed, serving local demo user session.', err);
      const demoUser = mockStorage.getCurrentUser();
      setUser(demoUser);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken || `token_${data.user._id}`);
    setUser(data.user);
    socket.connect();
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('accessToken', data.accessToken || `token_${data.user._id}`);
    setUser(data.user);
    socket.connect();
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    localStorage.removeItem('accessToken');
    setUser(null);
    socket.disconnect();
  };

  useEffect(() => {
    if (!user) return;
    const handleConnect = () => {
      socket.emit('joinUser', user.id || user._id);
    };

    if (socket.connected) {
      handleConnect();
    }

    socket.on('connect', handleConnect);
    return () => {
      socket.off('connect', handleConnect);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
