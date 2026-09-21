import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import WorkerLayout from './layouts/WorkerLayout';
import AdminLayout from './layouts/AdminLayout';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Public Pages
import Landing from './pages/public/Landing';
import VerifyCertificate from './pages/public/VerifyCertificate';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Worker Pages
import WorkerDashboard from './pages/worker/WorkerDashboard';
import ModuleDetails from './pages/worker/ModuleDetails';
import Assessment from './pages/worker/Assessment';
import AssessmentResult from './pages/worker/AssessmentResult';
import MyCertificates from './pages/worker/MyCertificates';
import CertificateDetail from './pages/worker/CertificateDetail';
import Profile from './pages/worker/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Workers from './pages/admin/Workers';
import WorkerDetails from './pages/admin/WorkerDetails';
import Certificates from './pages/admin/Certificates';
import TrainingResults from './pages/admin/TrainingResults';

// Error Pages
import NotFound from './pages/errors/NotFound';
import Unauthorized from './pages/errors/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/verify" element={<VerifyCertificate />} />
            <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>

          {/* Worker Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<WorkerLayout />}>
              <Route path="/dashboard" element={<WorkerDashboard />} />
              <Route path="/modules/:moduleId" element={<ModuleDetails />} />
              <Route path="/assessment/:moduleId" element={<Assessment />} />
              <Route path="/assessment/result" element={<AssessmentResult />} />
              <Route path="/certificates" element={<MyCertificates />} />
              <Route path="/certificates/:certificateId" element={<CertificateDetail />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/workers" element={<Workers />} />
              <Route path="/admin/workers/:id" element={<WorkerDetails />} />
              <Route path="/admin/certificates" element={<Certificates />} />
              <Route path="/admin/results" element={<TrainingResults />} />
            </Route>
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
