import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function EditProfile() {
    const navigate = useNavigate();
    const userId = Cookies.get('userid');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        UserName: '',
        Email: '',
        MobileNumber: '',
        YearsOfExperience: '',
        HourlyRate: '',
        Service: '',
        Location: '',
        UserId: userId
    });

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }
        loadProfile();
    }, [userId, navigate]);

    const loadProfile = async () => {
        try {
            const response = await axios.get(`/get-profile/${userId}`);
            if (response.data) {
                setFormData(response.data);
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
            setError('Failed to load profile data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;

        setSaving(true);
        setError('');

        try {
            const response = await axios.put(`/edit-profile/${userId}`, formData);
            if (response.data.success) {
                navigate('/provider-dashboard');
            } else {
                throw new Error(response.data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile. Please try again.');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-primary text-white py-3">
                                <h5 className="card-title mb-0">
                                    <i className="fas fa-user-edit me-2"></i>Edit Profile
                                </h5>
                            </div>
                            <div className="card-body">
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="UserName"
                                                value={formData.UserName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="Email"
                                                value={formData.Email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Mobile Number</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                name="MobileNumber"
                                                value={formData.MobileNumber}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Years of Experience</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="YearsOfExperience"
                                                value={formData.YearsOfExperience}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Hourly Rate (₹)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="HourlyRate"
                                                value={formData.HourlyRate}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Service</label>
                                            <select
                                                className="form-select"
                                                name="Service"
                                                value={formData.Service}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select a service</option>
                                                <option value="Electrician">Electrician</option>
                                                <option value="Plumber">Plumber</option>
                                                <option value="Carpenter">Carpenter</option>
                                                <option value="Painter">Painter</option>
                                                <option value="Cleaning">Cleaning</option>
                                                <option value="Gardening">Gardening</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Location</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="Location"
                                                value={formData.Location}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2 justify-content-center mt-4">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => navigate('/provider-dashboard')}
                                            disabled={saving}
                                        >
                                            <i className="fas fa-arrow-left me-2"></i>
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save me-2"></i>
                                                    Save Changes
                                                </>
                                            )}
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

export default EditProfile;
