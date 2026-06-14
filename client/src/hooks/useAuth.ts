import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { 'Content-Type': 'application/json' },
          // credentials: 'include' gửi kèm HttpOnly cookies
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          setCurrentUser(null);
          localStorage.removeItem('user');
        }
      } catch (e) {
        console.error('Session check failed:', e);
        // Fallback to cache if offline or error
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
          try {
            setCurrentUser(JSON.parse(cachedUser));
          } catch {
            localStorage.removeItem('user');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleAuthSuccess = (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.error('Logout request failed:', e);
    } finally {
      localStorage.removeItem('user');
      setCurrentUser(null);
    }
  };

  return { currentUser, loading, handleAuthSuccess, handleLogout };
}
