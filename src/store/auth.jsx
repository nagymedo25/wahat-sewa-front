import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { publicApi as api, setApiAuthToken } from '@/services/api.js';

const AuthContext = createContext(null);

const STORAGE_KEY = 'wahat_auth';

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function persistSession({ user, accessToken, refreshToken }) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ user, accessToken, refreshToken })
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function hydrateSession() {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? safeParse(raw) : null;

      if (parsed?.user && parsed?.accessToken) {
        setUser(parsed.user);
        setAccessToken(parsed.accessToken);
        setApiAuthToken(parsed.accessToken);

        try {
          const response = await api.get('/auth/me');
          if (!isMounted) return;

          const nextUser = response.data.user;
          setUser(nextUser);

          // Get the latest tokens from localStorage in case they were refreshed during the request
          const latestRaw = window.localStorage.getItem(STORAGE_KEY);
          const latestParsed = latestRaw ? safeParse(latestRaw) : parsed;

          persistSession({
            user: nextUser,
            accessToken: latestParsed?.accessToken || parsed.accessToken,
            refreshToken: latestParsed?.refreshToken || parsed.refreshToken,
          });
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
          setApiAuthToken(null);
          if (!isMounted) return;
          setUser(null);
          setAccessToken(null);
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    }

    hydrateSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data;
      
      setUser(user);
      setAccessToken(accessToken);
      persistSession({ user, accessToken, refreshToken });

      setApiAuthToken(accessToken);

      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { user, accessToken, refreshToken } = response.data;
      
      setUser(user);
      setAccessToken(accessToken);
      persistSession({ user, accessToken, refreshToken });

      setApiAuthToken(accessToken);

      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (accessToken) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
      window.localStorage.removeItem(STORAGE_KEY);
      setApiAuthToken(null);
    }
  }, [accessToken]);

  const refreshAccessToken = useCallback(async () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? safeParse(raw) : null;
      
      if (!parsed?.refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await api.post('/auth/refresh', { 
        refreshToken: parsed.refreshToken 
      });
      
      const { accessToken: newAccessToken } = response.data;
      setAccessToken(newAccessToken);
      
      const updatedStorage = { ...parsed, accessToken: newAccessToken };
      persistSession(updatedStorage);

      setApiAuthToken(newAccessToken);
      
      return newAccessToken;
    } catch (error) {
      // If refresh fails, logout
      logout();
      throw error;
    }
  }, [logout]);

  // Add interceptor for automatic token refresh
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const newToken = await refreshAccessToken();
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [refreshAccessToken]);


  const updateProfile = useCallback(async ({ name, email }) => {
    try {
      const response = await api.put('/auth/me', { name, email });
      const nextUser = response.data.user;

      setUser(nextUser);

      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? safeParse(raw) : null;
      persistSession({
        user: nextUser,
        accessToken: parsed?.accessToken || accessToken,
        refreshToken: parsed?.refreshToken || null,
      });

      return { success: true, user: nextUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'تعذر تحديث الحساب',
      };
    }
  }, [accessToken]);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'تعذر تحديث كلمة المرور',
      };
    }
  }, []);
  const value = useMemo(
    () => ({
      user,
      isAuthed: Boolean(user),
      isAdmin: user?.role === 'admin',
      loading,
      accessToken,
      login,
      register,
      updateProfile,
      changePassword,
      logout,
      api,
    }),
    [login, register, updateProfile, changePassword, logout, user, loading, accessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
