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
  const [email, setEmail] = React.useState(Cookies.get('email'));

  // Update email state when cookie changes
  React.useEffect(() => {
    const checkAuth = () => {
      const currentEmail = Cookies.get('email');
      if (currentEmail !== email) {
        setEmail(currentEmail);
      }
    };

    // Check every 100ms for cookie changes
    const interval = setInterval(checkAuth, 100);
    return () => clearInterval(interval);
  }, [email]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/provider-dashboard" element={
          email ? <ProviderDashboard /> : <Navigate to="/login" replace />
        } />
        <Route path="/create-profile" element={
          email ? <CreateProfile /> : <Navigate to="/login" replace />
        } />
        <Route path="/edit-profile" element={
          email ? <CreateProfile /> : <Navigate to="/login" replace />
        } />
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
