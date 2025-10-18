// Fix: Changed React import from namespace import to default import to fix JSX type errors.
import React from 'react';
import { AppRouter } from './routing/AppRouter';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-sans">
        <AppRouter />
      </div>
    </AuthProvider>
  );
}

export default App;