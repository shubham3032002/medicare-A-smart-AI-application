import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';

import Profile from './components/Profile.jsx';
import Register from './components/register.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register/>} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/" element={<Login />} />
  </Routes>
);

export default AppRoutes;