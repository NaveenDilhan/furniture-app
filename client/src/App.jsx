import React from 'react';
import { Routes, Route } from 'react-router-dom';
import IntroPage from './pages/IntroPage';  
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Routes>
      {/* 1. The Landing/Intro Page is the first thing users see */}
      <Route path="/" element={<IntroPage />} />
      
      {/* 2. The Login Page needs its own unique path so IntroPage can navigate to it */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* 3. The Dashboard for when they are successfully authenticated */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}