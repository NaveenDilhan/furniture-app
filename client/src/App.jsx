import React from 'react';
import { Routes, Route } from 'react-router-dom';
import IntroPage from './pages/IntroPage';  
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<IntroPage />} />
      

      <Route path="/login" element={<LoginPage />} />
      

      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}