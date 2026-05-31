// App.jsx — Main React app with routing and auth protection
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/common/Navbar.jsx';

import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import CourseDetailPage from './pages/CourseDetailPage.jsx';
import MyCoursesPage from './pages/MyCoursesPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

// Route guard for authenticated routes
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ marginTop: '40vh' }} />;
  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"           element={user ? <Navigate to="/dashboard" /> : <HomePage />} />
        <Route path="/login"      element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register"   element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route path="/courses"    element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/dashboard"  element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/my-courses" element={<PrivateRoute><MyCoursesPage /></PrivateRoute>} />
        <Route path="/profile"    element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="*"           element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
