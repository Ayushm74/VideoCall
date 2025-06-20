import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { User } from '@shared/schema';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (phone: string) => {
      const response = await apiRequest('POST', '/api/auth/login', { phone });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentUser(data.user);
      localStorage.setItem('userId', data.user.id.toString());
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
  });

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('userId');
    queryClient.clear();
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId && !currentUser) {
      fetch(`/api/user/${userId}`)
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(user => setCurrentUser(user))
        .catch(() => localStorage.removeItem('userId'));
    }
  }, []);

  return {
    currentUser,
    login: loginMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
  };
}
