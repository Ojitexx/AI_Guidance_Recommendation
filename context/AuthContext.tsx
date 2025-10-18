import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserTestResult, TestResult } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (user: Omit<User, 'id' | 'role'>) => Promise<{ success: boolean; message: string }>;
  testResults: UserTestResult[];
  saveTestResult: (result: TestResult) => Promise<void>;
  fetchTestResults: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'career_guidance_current_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [testResults, setTestResults] = useState<UserTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse stored user", error);
      localStorage.removeItem(CURRENT_USER_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login request failed:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const register = async (newUser: Omit<User, 'id' | 'role'>): Promise<{ success: boolean, message: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, message: 'Registration successful!' };
      }
      return { success: false, message: data.error || 'Registration failed.' };
    } catch (error) {
      console.error('Registration request failed:', error);
      return { success: false, message: 'An unexpected error occurred.' };
    }
  };

  const saveTestResult = async (result: TestResult) => {
    if (currentUser) {
      try {
        await fetch('/api/test-results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.id,
                recommendedCareer: result.recommendedCareer,
                dateTaken: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                fullResult: result, // Send the full result object
            }),
        });
        await fetchTestResults(); // Refresh results
      } catch (error) {
        console.error('Failed to save test result:', error);
      }
    }
  };

  const fetchTestResults = async () => {
    try {
      const response = await fetch('/api/test-results');
      if(response.ok) {
        const results = await response.json();
        setTestResults(results);
      }
    } catch (error) {
      console.error('Failed to fetch test results:', error);
    }
  };

  // Fetch test results when a user is logged in
  useEffect(() => {
    if(currentUser) {
        fetchTestResults();
    } else {
        setTestResults([]); // Clear results on logout
    }
  }, [currentUser]);


  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout, register, testResults, saveTestResult, fetchTestResults }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};