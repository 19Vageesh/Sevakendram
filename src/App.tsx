import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import MessMenu from './pages/MessMenu';
import Chat from './pages/Chat';
import ComplaintForm from './pages/ComplaintForm';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import NoticePopup from './components/NoticePopup';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
          <Toaster position="top-right" />
          <Layout>
            <div className="min-h-screen bg-gradient-to-r from-red-900/5 via-black/50 to-red-900/5">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
                <Route path="/mess-menu" element={<ProtectedRoute><MessMenu /></ProtectedRoute>} />
                <Route path="/chat/:sellerId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                <Route path="/complaints" element={<ProtectedRoute><ComplaintForm /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Layout>
          <NoticePopup />
        </div>
      </Router>
    </AuthProvider>
  );
}