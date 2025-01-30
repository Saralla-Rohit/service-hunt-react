import React from 'react';
import { useNavigate } from 'react-router-dom';

function Auth() {
    const navigate = useNavigate();

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow-lg border-0 rounded-4 p-4 bg-white bg-opacity-95">
                            <div className="card-body text-center">
                                <h2 className="text-primary fw-bold mb-4">Service Provider Access</h2>
                                
                                <div className="d-grid gap-3">
                                    <button 
                                        className="btn btn-primary btn-lg rounded-pill py-3"
                                        onClick={() => navigate('/login')}
                                    >
                                        <i className="fas fa-sign-in-alt me-2"></i>
                                        Login
                                    </button>

                                    <button 
                                        className="btn btn-outline-primary btn-lg rounded-pill py-3"
                                        onClick={() => navigate('/register')}
                                    >
                                        <i className="fas fa-user-plus me-2"></i>
                                        Sign Up
                                    </button>

                                    <button 
                                        className="btn btn-link text-secondary"
                                        onClick={() => navigate('/')}
                                    >
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Back to Home
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;
