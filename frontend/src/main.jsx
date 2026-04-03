import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// Set up Axios default URL based on environment
axios.defaults.baseURL = 'http://localhost:5000';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
