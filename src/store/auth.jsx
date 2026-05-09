import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'wahat_auth';

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? safeParse(raw) : null;
    if (parsed?.user) setUser(parsed.user);
  }, []);

  const login = useCallback((payload) => {
    const nextUser = {
      name: payload?.name || 'ضيف',
      email: payload?.email || '',
    };
    setUser(nextUser);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser }));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthed: Boolean(user),
      login,
      logout,
    }),
    [login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
