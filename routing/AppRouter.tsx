import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home';
import { CareerTest } from '../pages/CareerTest';
import { QuickTest } from '../pages/QuickTest';
import { TestResultPage } from '../pages/TestResultPage';
import { Library } from '../pages/Library';
import { JobOpportunities } from '../pages/JobOpportunities';
import { CareerPaths } from '../pages/CareerPaths';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Profile } from '../pages/Profile';
import { AdminDashboard } from '../pages/AdminDashboard';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Chatbot } from '../components/Chatbot';
import { useAuth } from '../context/AuthContext';


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    if (!currentUser || currentUser.role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

const AppLayout = () => {
  const { currentUser } = useAuth();
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-200px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quick-test" element={<QuickTest />} />
          <Route path="/test-result" element={<TestResultPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/career-test" element={<ProtectedRoute><CareerTest /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/job-opportunities" element={<ProtectedRoute><JobOpportunities /></ProtectedRoute>} />
          <Route path="/career-paths" element={<ProtectedRoute><CareerPaths /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Admin Route */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Routes>
      </main>
      <Footer />
      {currentUser && currentUser.role === 'student' && <Chatbot />}
    </>
  );
}

export const AppRouter = () => {
  return (
    <HashRouter>
      <AppLayout />
    </HashRouter>
  );
};
