import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CreateFormPage from './components/CreateFormPage';
import NotFoundPage from './components/NotFoundPage';
import PrivateRoute from './components/PrivateRoute';
import DashboardPage from './components/DashboardPage';
import FormPage from './components/Form/FormPage';
import FormCreatedPage from './components/Form/FormCreatedPage';
import Layout from './components/layout/Layout';
import ResponsesPage from './components/Response/ResponsesPage';
import { setupAxiosInterceptors } from './services/authService';
import { useAuth } from './context/AuthContext';

function App() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    setupAxiosInterceptors(navigate);  // Setting up interceptors to handle token logic
  }, [navigate]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route 
            path="/login" 
            element={auth ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={auth ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
          />
          <Route path="/form-created" element={<FormCreatedPage />} />
          <Route path="/responses/:formId" element={<ResponsesPage />} />

          {/* Private Routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/create-form" 
            element={
              <PrivateRoute>
                <CreateFormPage />
              </PrivateRoute>
            } 
          />
          <Route path="/form/:formId" element={<FormPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
