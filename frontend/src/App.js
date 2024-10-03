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
import { useAuth } from './context/AuthContext'; // To get auth context

function App() {
  const navigate = useNavigate(); // Get the navigate function from react-router
  const { auth } = useAuth(); // Access the authentication state

  useEffect(() => {
    // Setup Axios interceptors to handle token expiration and redirection
    setupAxiosInterceptors(navigate);
  }, [navigate]); // Pass navigate as a dependency

  return (
    <div>
      <Routes>
        {/* Public routes wrapped inside Layout for consistent structure */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          
          {/* Redirect to dashboard if user is logged in */}
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

          {/* Private routes (Protected with PrivateRoute component) */}
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

          {/* Catch-all route for unknown paths */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
