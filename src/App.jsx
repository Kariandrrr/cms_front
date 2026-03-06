import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import Posts from './pages/admin/Posts';
import EditPost from './pages/admin/EditPost';
import CreatePost from './pages/admin/CreatePost';



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Публичные роуты */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Защищенные роуты */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={['admin', 'editor', 'user']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
          path="/admin/posts"
          element={
            <ProtectedRoute roles={['admin', 'editor', 'user']}>
              <Posts />
            </ProtectedRoute>
          }
          />

          <Route
            path="/admin/posts/:id/edit"
            element={
              <ProtectedRoute roles={['admin', 'editor', 'user']}>
                <EditPost />
              </ProtectedRoute>
            }
/>
            <Route
            path="/admin/posts/new"
            element={
              <ProtectedRoute roles={['admin', 'editor', 'user']}>
                <CreatePost />
              </ProtectedRoute>
            }
          />

          {/* Редиректы */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;