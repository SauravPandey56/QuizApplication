import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import CandidateAttempt from './pages/CandidateAttempt';
import AttemptResult from './pages/AttemptResult';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="animate-pulse text-indigo-500 font-semibold text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/NARATY-secure-admin" element={user && user.role === 'admin' ? <Navigate to="/" /> : <AdminLogin />} />
        
        {/* Protected Routes inside Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/attempt/:attemptId" element={<CandidateAttempt />} />
          <Route path="/attempt/:attemptId/result" element={<AttemptResult />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
