import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

// Configure axios
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5678'
    : 'https://service-hunt-react-1.onrender.com';

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Email: '',
        Password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Check if already logged in
    useEffect(() => {
        const email = Cookies.get('email');
        if (email) {
            navigate('/provider-dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form submission
        if (loading) return;
        
        setLoading(true);
        setError('');

        try {
            // Trim whitespace from email
            const email = formData.Email.trim();
            const password = formData.Password;

            // Basic validation
            if (!email || !password) {
                setError('Please enter both email and password');
                setLoading(false);
                return;
            }

            const response = await axios.post('/api/login', { email, password });
            
            if (response.data.success) {
                const { user, hasProfile } = response.data;
                
                // Set cookies first
                const cookieOptions = {
                    secure: window.location.protocol === 'https:', // Only use secure flag on HTTPS
                    sameSite: 'strict', // Protect against CSRF
                    expires: 7, // Expire in 7 days
                    path: '/' // Ensure cookie is available across all paths
                };
                
                Cookies.set('email', user.email, cookieOptions);
                Cookies.set('username', user.userName, cookieOptions);
                
                // Force a small delay to ensure cookies are set
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Then navigate
                const targetPath = hasProfile ? '/provider-dashboard' : '/create-profile';
                navigate(targetPath, { replace: true }); // Use replace to prevent back button issues
            } else {
                setError(response.data.message || 'Invalid credentials. Please check your email and password.');
            }
        } catch (error) {
            console.error('Login error:', error);
            console.log('Error response:', error.response?.data);
            
            if (error.response?.status === 401) {
                setError('Invalid credentials. Please check your email and password.');
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Server error. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/auth');
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow-lg border-0 rounded-4 p-4 bg-white bg-opacity-95">
                            <div className="card-body">
                                <h2 className="text-primary fw-bold text-center mb-4">Provider Login</h2>
                                
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            value={formData.Email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, Email: e.target.value }))}
                                            required
                                            disabled={loading}
                                            placeholder='Email'
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control form-control-lg"
                                            value={formData.Password}
                                            onChange={(e) => setFormData(prev => ({ ...prev, Password: e.target.value }))}
                                            required
                                            disabled={loading}
                                            placeholder='Password'
                                        />
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary btn-lg rounded-pill py-3"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Signing in...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-sign-in-alt me-2"></i>
                                                    Sign In
                                                </>
                                            )}
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary btn-lg rounded-pill py-3"
                                            onClick={handleBack}
                                            disabled={loading}
                                        >
                                            <i className="fas fa-arrow-left me-2"></i>
                                            Back
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
