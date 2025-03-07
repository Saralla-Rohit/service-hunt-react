import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5678'
    : 'https://service-hunt-react-1.onrender.com';

function CreateProfile() {
    const [formData, setFormData] = useState({
        UserName: '',
        Email: '',
        MobileNumber: '',
        YearsOfExperience: '',
        HourlyRate: '',
        Service: '',
        Location: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const userId = Cookies.get('userid');
    const isEditing = window.location.pathname === '/edit-profile';

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }

        if (isEditing) {
            fetchExistingProfile();
        } else {
            getCityFromIP();
        }
    }, [userId, navigate, isEditing]);

    const fetchExistingProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/get-profile/${userId}`);
            if (response.data) {
                setFormData(response.data);
                if (!response.data.Location) {
                    getCityFromIP();
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            alert('Failed to load profile data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getCityFromIP = async () => {
        try {
            const response = await axios.get('https://ipapi.co/json/');
            if (response.data && response.data.city) {
                setFormData(prev => ({
                    ...prev,
                    Location: response.data.city
                }));
            }
        } catch (error) {
            console.error('Error fetching city:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = {
                ...formData,
                UserId: parseInt(userId),
                YearsOfExperience: parseInt(formData.YearsOfExperience),
                HourlyRate: parseInt(formData.HourlyRate)
            };

            if (isEditing) {
                await axios.put(`${API_URL}/edit-profile/${userId}`, data);
                alert('Profile updated successfully!');
            } else {
                await axios.post(`${API_URL}/create-profile`, data);
                alert('Profile created successfully!');
            }
            navigate('/provider-dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/provider-dashboard');
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow-lg border-0 rounded-4 p-4 bg-white bg-opacity-95">
                            <div className="card-body">
                                <h2 className="text-center mb-4 text-primary fw-bold">{isEditing ? 'Edit Profile' : 'Create Profile'}</h2>
                                
                                {error && (
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        {error}
                                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg rounded-3"
                                                value={formData.UserName}
                                                onChange={(e) => setFormData({...formData, UserName: e.target.value})}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control form-control-lg rounded-3"
                                                value={formData.Email}
                                                onChange={(e) => setFormData({...formData, Email: e.target.value})}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Service Type</label>
                                            <select
                                                className="form-select form-select-lg rounded-3"
                                                value={formData.Service}
                                                onChange={(e) => setFormData({...formData, Service: e.target.value})}
                                                required
                                            >
                                                <option value="">Select Service</option>
                                                <option value="Electrician">Electrician</option>
                                                <option value="Plumber">Plumber</option>
                                                <option value="Tutor">Tutor</option>
                                                <option value="Mechanic">Mechanic</option>
                                                <option value="Chef">Chef</option>
                                                <option value="Nurse">Nurse</option>
                                                <option value="Hairdresser">Hairdresser</option>
                                                <option value="Carpenter">Carpenter</option>
                                                <option value="Vet">Vet</option>
                                                <option value="Photographer">Photographer</option>
                                            </select>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Years of Experience</label>
                                            <input
                                                type="number"
                                                className="form-control form-control-lg rounded-3"
                                                value={formData.YearsOfExperience}
                                                onChange={(e) => setFormData({...formData, YearsOfExperience: e.target.value})}
                                                required
                                                min="0"
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Hourly Rate (₹)</label>
                                            <input
                                                type="number"
                                                className="form-control form-control-lg rounded-3"
                                                value={formData.HourlyRate}
                                                onChange={(e) => setFormData({...formData, HourlyRate: e.target.value})}
                                                required
                                                min="500"
                                                max="2000"
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Mobile Number</label>
                                            <input
                                                type="tel"
                                                className="form-control form-control-lg rounded-3"
                                                value={formData.MobileNumber}
                                                onChange={(e) => setFormData({...formData, MobileNumber: e.target.value})}
                                                required
                                                pattern="[0-9]{10}"
                                            />
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label">Location</label>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg rounded-3"
                                                    value={formData.Location}
                                                    onChange={(e) => setFormData({...formData, Location: e.target.value})}
                                                    required
                                                />
                                                <button 
                                                    className="btn btn-outline-secondary" 
                                                    type="button"
                                                    onClick={getCityFromIP}
                                                    id="btnGetLocation"
                                                >
                                                    Get Location
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-grid gap-2 mt-4">
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary btn-lg rounded-pill py-3"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    {isEditing ? 'Updating...' : 'Creating...'}
                                                </>
                                            ) : (
                                                isEditing ? 'Save Changes' : 'Create Profile'
                                            )}
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary btn-lg rounded-pill py-3"
                                            onClick={handleCancel}
                                            id={isEditing ? "btnCancelEdit" : "btnCancelCreate"}
                                            disabled={loading}
                                        >
                                            Cancel
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

export default CreateProfile;
