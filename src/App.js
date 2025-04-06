import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Login from './components/Login';
import Register from './components/Register';
import ProviderDashboard from './components/ProviderDashboard';
import UserDashboard from './components/UserDashboard';
import CreateProfile from './components/CreateProfile';
import Home from './components/Home';
import Cookies from 'js-cookie';

function App() {
  const email = Cookies.get('email');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/provider-dashboard" element={
          email ? <ProviderDashboard /> : <Navigate to="/login" />
        } />
        <Route path="/create-profile" element={
          email ? <CreateProfile /> : <Navigate to="/login" />
        } />
        <Route path="/edit-profile" element={
          email ? <CreateProfile /> : <Navigate to="/login" />
        } />
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
