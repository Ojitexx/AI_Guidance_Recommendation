// Fix: Changed React import from namespace import to default import to fix JSX type errors.
import React, { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Chatbot } from '../components/Chatbot';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Lazy load all page components to enable code-splitting
const Home = lazy(() => import('../pages/Home').then(module => ({ default: module.Home })));
const CareerTest = lazy(() => import('../pages/CareerTest').then(module => ({ default: module.CareerTest })));
const QuickTest = lazy(() => import('../pages/QuickTest').then(module => ({ default: module.QuickTest })));
const TestResultPage = lazy(() => import('../pages/TestResultPage').then(module => ({ default: module.TestResultPage })));
const Library = lazy(() => import('../pages/Library').then(module => ({ default: module.Library })));
const JobOpportunities = lazy(() => import('../pages/JobOpportunities').then(module => ({ default: module.JobOpportunities })));
const CareerPaths = lazy(() => import('../pages/CareerPaths').then(module => ({ default: module.CareerPaths })));
const About = lazy(() => import('../pages/About').then(module => ({ default: module.About })));
const Contact = lazy(() => import('../pages/Contact').then(module => ({ default: module.Contact })));
const Login = lazy(() => import('../pages/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('../pages/Register').then(module => ({ default: module.Register })));
const Profile = lazy(() => import('../pages/Profile').then(module => ({ default: module.Profile })));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword').then(module => ({ default: module.ForgotPassword })));
const ResetPassword = lazy(() => import('../pages/ResetPassword').then(module => ({ default: module.ResetPassword })));


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
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quick-test" element={<QuickTest />} />
            <Route path="/test-result" element={<TestResultPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
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
        </Suspense>
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