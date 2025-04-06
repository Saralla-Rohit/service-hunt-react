import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5678'
    : 'https://service-hunt-react-1.onrender.com';

function ProviderDashboard() {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const email = Cookies.get('email');
    const username = Cookies.get('username');

    useEffect(() => {
        if (!email) {
            navigate('/login');
            return;
        }
        loadProfile();
    }, [email, navigate]);

    const loadProfile = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-profile/${email}`, {
                withCredentials: true
            });
            
            if (response.data && response.data.success) {
                setProfile(response.data.profile);
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
            if (error.response) {
                if (error.response.status === 404) {
                    navigate('/create-profile');
                    return;
                }
            }
            setError('Failed to load profile. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = () => {
        Cookies.remove('email');
        Cookies.remove('username');
        navigate('/');
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    if (!email) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="alert alert-danger" role="alert">
                    {error}
                    <button 
                        className="btn btn-outline-danger ms-3"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="text-center">
                    <h3 className="text-danger mb-3">Profile Not Found</h3>
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/create-profile')}
                    >
                        Create Profile
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container">
                    <span className="navbar-brand">Welcome, {username || profile.userName}</span>
                    <button 
                        className="btn btn-outline-light"
                        onClick={handleSignOut}
                    >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Sign Out
                    </button>
                </div>
            </nav>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-header bg-primary text-white py-3">
                                <h5 className="card-title mb-0">
                                    <i className="fas fa-user-circle me-2"></i>Profile Information
                                </h5>
                            </div>
                            <div className="card-body bg-light">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-user text-primary me-2"></i>
                                            <div>
                                                <small className="text-muted">Name</small>
                                                <p className="mb-0 fw-bold">{profile.userName || 'Not Provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-envelope text-primary me-2"></i>
                                            <div>
                                                <small className="text-muted">Email</small>
                                                <p className="mb-0 fw-bold">{profile.email || 'Not Provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-phone text-primary me-2"></i>
                                            <div>
                                                <small className="text-muted">Mobile</small>
                                                <p className="mb-0 fw-bold">{profile.mobileNumber || 'Not Provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-briefcase text-primary me-2"></i>
                                            <div>
                                                <small className="text-muted">Experience</small>
                                                <p className="mb-0 fw-bold">{profile.yearsOfExperience ? `${profile.yearsOfExperience} years` : 'Not Provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-dollar-sign text-primary me-2"></i>
                                            <div>
                                                <small className="text-muted">Hourly Rate</small>
                                                <p className="mb-0 fw-bold">{profile.hourlyRate ? `₹${profile.hourlyRate}` : 'Not Provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-tools text-primary me-2"></i>
                                            <div>
                                                <small className="text-muted">Service</small>
                                                <p className="mb-0 fw-bold">{profile.service || 'Not Provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-map-marker-alt text-primary me-2"></i>
                                            <div>
                                                <small className="text-muted">Location</small>
                                                <p className="mb-0 fw-bold">{profile.location || 'Not Provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center mt-3">
                                    <button 
                                        className="btn btn-warning" 
                                        onClick={handleEditProfile}
                                    >
                                        <i className="fas fa-edit me-2"></i>
                                        Edit Profile
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

export default ProviderDashboard;
