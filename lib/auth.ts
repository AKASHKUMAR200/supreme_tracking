import { api } from './types';

export const login = async (mobileNumber: string, password: string) => {
  try {
    const response = await api.post('/auth/login', {
      mobile_number: mobileNumber,
      password,
    });

    if (!response.success) {
      return { success: false, error: response.error || 'Invalid credentials' };
    }

    // Store user session in localStorage
    if (typeof window !== 'undefined') {
      const user = {
        ...response.user,
        id: response.user._id || response.user.id,
      };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('lastActivity', Date.now().toString());
    }

    return { success: true, user: response.user };
  } catch (error) {
    return { success: false, error: 'Login failed' };
  }
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    localStorage.removeItem('lastActivity');
  }
};

export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
  }
  return null;
};

export const checkSession = () => {
  if (typeof window !== 'undefined') {
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity) {
      const now = Date.now();
      const diff = now - parseInt(lastActivity);
      // Auto logout after 30 minutes of inactivity
      if (diff > 30 * 60 * 1000) {
        logout();
        return false;
      }
      localStorage.setItem('lastActivity', now.toString());
      return true;
    }
  }
  return false;
};
