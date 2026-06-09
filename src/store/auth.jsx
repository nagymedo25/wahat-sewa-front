import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { publicApi as api, setApiAuthToken } from '@/services/api.js';
import i18n from '@/i18n.js';

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

  const login = useCallback(async (whatsapp, password) => {
    try {
      const response = await api.post('/auth/login', { whatsapp, password });
      const { user, accessToken, refreshToken } = response.data;
      
      setUser(user);
      setAccessToken(accessToken);
      persistSession({ user, accessToken, refreshToken });

      setApiAuthToken(accessToken);

      return { success: true, user };
    } catch (error) {
      const responseData = error.response?.data;
      let errorMsg = 'Login failed';
      let errorCode = 'unknown';

      if (responseData) {
        if (responseData.error) {
          errorCode = responseData.error;
          errorMsg = responseData.message || responseData.error;
        } else if (responseData.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
          errorCode = 'validation_error';
          errorMsg = responseData.errors[0].msg;
        }
      } else if (error.request) {
        errorCode = 'network_error';
        errorMsg = 'network_error';
      }

      return { 
        success: false, 
        error: errorMsg,
        errorCode
      };
    }
  }, []);

  const adminLogin = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/admin-login', { email, password });
      const { user, accessToken, refreshToken } = response.data;
      
      setUser(user);
      setAccessToken(accessToken);
      persistSession({ user, accessToken, refreshToken });

      setApiAuthToken(accessToken);

      return { success: true, user };
    } catch (error) {
      const responseData = error.response?.data;
      let errorMsg = 'Admin login failed';
      let errorCode = 'unknown';

      if (responseData) {
        if (responseData.error) {
          errorCode = responseData.error;
          errorMsg = responseData.message || responseData.error;
        } else if (responseData.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
          errorCode = 'validation_error';
          errorMsg = responseData.errors[0].msg;
        }
      } else if (error.request) {
        errorCode = 'network_error';
        errorMsg = 'network_error';
      }

      return { 
        success: false, 
        error: errorMsg,
        errorCode
      };
    }
  }, []);

  const register = useCallback(async (name, whatsapp, password) => {
    try {
      const response = await api.post('/auth/register', { name, whatsapp, password });
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


  const updateProfile = useCallback(async ({ name, email, whatsapp }) => {
    try {
      const response = await api.put('/auth/me', { name, email, whatsapp });
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
        error: error.response?.data?.error || i18n.t('account.update_failed', 'تعذر تحديث الحساب'),
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
        error: error.response?.data?.error || i18n.t('account.password_update_failed', 'تعذر تحديث كلمة المرور'),
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
      adminLogin,
      register,
      updateProfile,
      changePassword,
      logout,
      api,
    }),
    [login, adminLogin, register, updateProfile, changePassword, logout, user, loading, accessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
