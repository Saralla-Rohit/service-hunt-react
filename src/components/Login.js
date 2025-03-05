import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userId: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        
        setLoading(true);
        setError('');

        try {
            const response = await axios.get('/providers');
            const user = response.data.find(provider => 
                provider.UserId === parseInt(formData.userId) && 
                provider.Password === formData.password
            );
            
            if (user) {
                Cookies.set('userid', user.UserId);
                Cookies.set('username', user.UserName);
                navigate('/provider-dashboard');
            } else {
                setError('Invalid credentials. Please check your User ID and Password.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Server error. Please try again later.');
        }
        
        setLoading(false);
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
                                        <label className="form-label">Provider ID</label>
                                        <input
                                            type="number"
                                            className="form-control form-control-lg"
                                            value={formData.userId}
                                            onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                                            required
                                            disabled={loading}
                                            placeholder='eg: 1'
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control form-control-lg"
                                            value={formData.password}
                                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                            required
                                            disabled={loading}
                                            placeholder='eg: rohit'
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
