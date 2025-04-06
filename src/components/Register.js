import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Configure axios
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5678'
    : 'https://service-hunt-react-1.onrender.com';

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

function Register() {
    const navigate = useNavigate();
    const initialFormState = {
        userName: '',
        email: '',
        password: '',
        mobile: ''
    };

    // Clear any previous error state when component mounts
    React.useEffect(() => {
        setError('');
    }, []);
    const [formData, setFormData] = useState(initialFormState);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value || ''
        }));

        // Clear error message when user starts typing
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setError('');
        
        try {
            // Validate password
            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters long');
                setLoading(false);
                return;
            }

            // Validate email format
           

            // Validate required fields
           

            // Clean up form data
            const cleanedData = {
                userName: formData.userName.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                mobile: formData.mobile.trim()
            };
            
            console.log('Sending registration data:', cleanedData);
            const response = await axios.post('/register-user', cleanedData);
            
            if (response.data.success) {
                navigate('/login');
            } else {
                setError(response.data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration failed:', err.response?.data || err);
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialFormState);
        setError('');
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
                                {/* <div className="mb-3">
                                    <label htmlFor="txtREmail" className="form-label">User ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtREmail"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {error && (
                                        <div className={`text-${error.includes('available') ? 'success' : 'danger'} mt-1`}>
                                            {error}
                                        </div>
                                    )}
                                </div> */}

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label htmlFor="txtRUserName" className="form-label">User Name</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        id="txtRUserName"
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="txtREmail" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        id="txtREmail"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="txtRPassword" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        id="txtRPassword"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="txtRMobile" className="form-label">Mobile</label>
                                    <input
                                        type="tel"
                                        className="form-control form-control-lg"
                                        id="txtRMobile"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        pattern="[0-9]{10}"
                                        disabled={loading}
                                    />
                                    <small className="text-muted">Enter 10-digit mobile number (optional)</small>
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
                                                Registering...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-user-plus me-2"></i>
                                                Register
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-lg rounded-pill py-3"
                                        onClick={handleCancel}
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
    );
}

export default Register;
