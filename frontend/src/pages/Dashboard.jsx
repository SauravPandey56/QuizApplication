import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import ExaminerDashboard from './ExaminerDashboard';
import CandidateDashboard from './CandidateDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'examiner') return <ExaminerDashboard />;
  return <CandidateDashboard />;
};

export default Dashboard;
