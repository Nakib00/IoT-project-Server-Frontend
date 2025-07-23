import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedToken = localStorage.getItem('iot_token');
    const storedUser = localStorage.getItem('iot_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simulate API call - replace with actual backend call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token: authToken, user: userData } = data;
        
        setToken(authToken);
        setUser(userData);
        localStorage.setItem('iot_token', authToken);
        localStorage.setItem('iot_user', JSON.stringify(userData));
        
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        
        return true;
      } else {
        // For demo purposes, allow any email/password combination
        if (email && password) {
          const mockUser = {
            id: '1',
            email,
            name: email.split('@')[0],
          };
          const mockToken = 'demo-jwt-token-' + Date.now();
          
          setToken(mockToken);
          setUser(mockUser);
          localStorage.setItem('iot_token', mockToken);
          localStorage.setItem('iot_user', JSON.stringify(mockUser));
          
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in (Demo mode).",
          });
          
          return true;
        }
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simulate API call - replace with actual backend call
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token: authToken, user: userData } = data;
        
        setToken(authToken);
        setUser(userData);
        localStorage.setItem('iot_token', authToken);
        localStorage.setItem('iot_user', JSON.stringify(userData));
        
        toast({
          title: "Account Created!",
          description: "Your account has been created successfully.",
        });
        
        return true;
      } else {
        // For demo purposes, allow any registration
        if (name && email && password) {
          const mockUser = {
            id: '1',
            email,
            name,
          };
          const mockToken = 'demo-jwt-token-' + Date.now();
          
          setToken(mockToken);
          setUser(mockUser);
          localStorage.setItem('iot_token', mockToken);
          localStorage.setItem('iot_user', JSON.stringify(mockUser));
          
          toast({
            title: "Account Created!",
            description: "Your account has been created successfully (Demo mode).",
          });
          
          return true;
        }
        throw new Error('Registration failed');
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again with valid information.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('iot_token');
    localStorage.removeItem('iot_user');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};