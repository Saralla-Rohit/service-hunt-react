import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5678'
    : 'https://service-hunt-react.onrender.com';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        UserId: '',
        UserName: '',
        Email: '',
        Password: '',
        Mobile: ''
    });
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error message when user starts typing
        if (name === 'UserId') {
            setError('');
        }
    };

    const checkUserId = async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/users/${userId}`);
            return response.data && response.data.length > 0;
        } catch (err) {
            console.error('Error checking user ID:', err);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Check if user ID exists
            const userExists = await checkUserId(formData.UserId);
            if (userExists) {
                setError('User ID already exists - try another');
                return;
            }

            // Proceed with registration
            await axios.post(`${API_URL}/register-user`, formData);
            navigate('/login');
        } catch (err) {
            console.error('Registration failed:', err);
            setError('Registration failed. Please try again.');
        }
    };

    const handleCancel = () => {
        navigate('/auth');
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Register Service Provider</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="txtRUserId" className="form-label">User ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtRUserId"
                                        name="UserId"
                                        value={formData.UserId}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {error && (
                                        <div className={`text-${error.includes('available') ? 'success' : 'danger'} mt-1`}>
                                            {error}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="txtRUserName" className="form-label">User Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtRUserName"
                                        name="UserName"
                                        value={formData.UserName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="txtREmail" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="txtREmail"
                                        name="Email"
                                        value={formData.Email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="txtRPassword" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="txtRPassword"
                                        name="Password"
                                        value={formData.Password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="txtRMobile" className="form-label">Mobile</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="txtRMobile"
                                        name="Mobile"
                                        value={formData.Mobile}
                                        onChange={handleInputChange}
                                        pattern="[0-9]{10}"
                                        required
                                    />
                                    <small className="text-muted">Enter 10-digit mobile number</small>
                                </div>

                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        id="btnRegister"
                                    >
                                        Register
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCancel}
                                        id="btnCancel"
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
    );
}

export default Register;
