import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
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
import { setupAxiosInterceptors } from './apiServices';

function App() {
  const navigate = useNavigate(); // Get the navigate function from react-router

  useEffect(() => {
    // Setup Axios interceptors to handle token expiration and redirection
    setupAxiosInterceptors(navigate);
  }, [navigate]); // Pass navigate as a dependency

  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/form-created" element={<FormCreatedPage />} />
        <Route path="/responses/:formId" element={<ResponsesPage />} />

        {/* Private routes */}
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

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
