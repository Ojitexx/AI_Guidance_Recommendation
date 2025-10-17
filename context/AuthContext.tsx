import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserTestResult, TestResult, CareerPathName } from '../types';
import { MOCK_USERS, MOCK_TEST_RESULTS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (user: Omit<User, 'id' | 'role'>) => boolean;
  testResults: UserTestResult[];
  saveTestResult: (result: TestResult) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [testResults, setTestResults] = useState<UserTestResult[]>(MOCK_TEST_RESULTS);

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (newUser: Omit<User, 'id' | 'role'>): boolean => {
    if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
        return false; // User already exists
    }
    const userWithId: User = { 
        ...newUser,
        id: users.length + 1,
        role: 'student'
    };
    setUsers(prevUsers => [...prevUsers, userWithId]);
    setCurrentUser(userWithId);
    return true;
  }

  const saveTestResult = (result: TestResult) => {
    if (currentUser) {
      const newResult: UserTestResult = {
        id: testResults.length + 1,
        userId: currentUser.id,
        recommendedCareer: result.recommendedCareer,
        dateTaken: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      };
      setTestResults(prevResults => [newResult, ...prevResults]);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register, testResults, saveTestResult }}>
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