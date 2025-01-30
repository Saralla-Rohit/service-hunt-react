import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow-lg border-0 rounded-4 p-4 bg-white bg-opacity-95">
                            <div className="card-body text-center">
                                <h1 className="text-primary fw-bold mb-4">Service Hunt</h1>
                                
                                <div className="d-grid gap-3">
                                    <button 
                                        className="btn btn-primary btn-lg rounded-pill py-3"
                                        onClick={() => navigate('/user-dashboard')}
                                    >
                                        <i className="fas fa-user me-2"></i>
                                        Continue as Guest
                                    </button>
                                    
                                    <button 
                                        className="btn btn-outline-primary btn-lg rounded-pill py-3"
                                        onClick={() => navigate('/auth')}
                                    >
                                        <i className="fas fa-tools me-2"></i>
                                        Service Provider
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

export default Home;
