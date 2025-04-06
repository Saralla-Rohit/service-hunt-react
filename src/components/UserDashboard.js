import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

function UserDashboard() {
    const navigate = useNavigate();
    const [providers, setProviders] = useState([]);
    const [filteredProviders, setFilteredProviders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        service: '',
        location: '',
        yearsOfExperience: '',
        hourlyRate: 2000
    });
    const [showFilters, setShowFilters] = useState(false);

    const loadProviders = async () => {
        try {
            const response = await axios.get(`${API_URL}/providersInfo`, {
                withCredentials: true
            });
            if (response.data && Array.isArray(response.data)) {
                setProviders(response.data);
                setFilteredProviders(response.data);
            } else {
                throw new Error('Invalid data format received from server');
            }
        } catch (error) {
            console.error('Error loading providers:', error);
            setError('Unable to load service providers. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProviders();
    }, []);

    const applyFilters = (currentFilters = filters) => {
        let result = [...providers];

        if (currentFilters.service) {
            result = result.filter(provider => 
                provider.service && provider.service.toLowerCase() === currentFilters.service.toLowerCase()
            );
        }

        if (currentFilters.location) {
            result = result.filter(provider => 
                provider.location?.toLowerCase().includes(currentFilters.location.toLowerCase())
            );
        }

        if (currentFilters.yearsOfExperience) {
            result = result.filter(provider => 
                provider.yearsOfExperience >= parseInt(currentFilters.yearsOfExperience)
            );
        }

        if (currentFilters.hourlyRate) {
            result = result.filter(provider => 
                provider.hourlyRate <= parseInt(currentFilters.hourlyRate)
            );
        }

        setFilteredProviders(result);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        applyFilters(newFilters);
    };

    const resetFilters = () => {
        const defaultFilters = {
            service: '',
            location: '',
            yearsOfExperience: '',
            hourlyRate: 2000
        };
        setFilters(defaultFilters);
        setFilteredProviders(providers);
    };

    const getCityFromIP = async () => {
        try {
            const response = await axios.get('https://ipapi.co/json/', {
                withCredentials: false // Don't send credentials for external API
            });
            if (response.data && response.data.city) {
                const newFilters = { ...filters, location: response.data.city };
                setFilters(newFilters);
                applyFilters(newFilters);
            }
        } catch (error) {
            console.error('Location detection error:', error);
            // Don't show error to user as this is not critical
        }
    };

    return (
        <div className="min-vh-100 bg-light">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
                <div className="container-fluid">
                    <a 
                        href="/"
                        className="text-white text-decoration-none"
                    >
                        <i className="fas fa-arrow-left me-2"></i>
                        Back to Home
                    </a>
                    <span className="navbar-brand">Service Hunt</span>
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <i className="fas fa-filter"></i>
                    </button>
                </div>
            </nav>

            <div className="container-fluid py-4">
                <div className="row">
                    {/* Filter Sidebar */}
                    <div className={`col-lg-3 mb-4 ${showFilters ? 'show' : 'd-none d-lg-block'}`}>
                        <div className="position-sticky" style={{ top: '76px' }}>
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h5 className="card-title mb-0">Filters</h5>
                                        <button 
                                            className="btn btn-outline-secondary btn-sm d-lg-none"
                                            onClick={() => setShowFilters(false)}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Service Type</label>
                                        <select
                                            className="form-select"
                                            name="service"
                                            value={filters.service}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">All Services</option>
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

                                    <div className="mb-3">
                                        <label className="form-label">Location</label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="location"
                                                value={filters.location}
                                                onChange={handleFilterChange}
                                                placeholder="Enter location"
                                            />
                                            <button 
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={getCityFromIP}
                                                title="Use Current Location"
                                            >
                                                <i className="fas fa-map-marker-alt"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Minimum Years of Experience</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="yearsOfExperience"
                                            value={filters.yearsOfExperience}
                                            onChange={handleFilterChange}
                                            min="0"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">
                                            Maximum Hourly Rate: ₹{filters.hourlyRate}
                                        </label>
                                        <input
                                            type="range"
                                            className="form-range"
                                            name="hourlyRate"
                                            min="500"
                                            max="2000"
                                            step="100"
                                            value={filters.hourlyRate}
                                            onChange={handleFilterChange}
                                        />
                                        <div className="d-flex justify-content-between">
                                            <small>₹500</small>
                                            <small>₹2000</small>
                                        </div>
                                    </div>

                                    <button 
                                        className="btn btn-primary w-100 mb-2"
                                        onClick={() => applyFilters()}
                                    >
                                        Apply Filters
                                    </button>
                                    <button 
                                        className="btn btn-outline-secondary w-100"
                                        onClick={resetFilters}
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-lg-9">
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                {error}
                                <button type="button" className="btn-close" onClick={() => setError('')}></button>
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="row g-4">
                                {filteredProviders.map((provider, index) => (
                                    <div key={provider.email || index} className="col-md-6 col-xl-4">
                                        <div className="card h-100 shadow-sm hover-shadow">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h5 className="card-title mb-0">{provider.userName || 'Not Provided'}</h5>
                                                    <span className="badge bg-primary">{provider.service || 'Not Provided'}</span>
                                                </div>
                                                
                                                <div className="mb-3">
                                                    <p className="card-text mb-1">
                                                        <i className="fas fa-map-marker-alt text-secondary me-2"></i>
                                                        {provider.location || 'Location not provided'}
                                                    </p>
                                                    <p className="card-text mb-1">
                                                        <i className="fas fa-briefcase text-secondary me-2"></i>
                                                        {provider.yearsOfExperience ? `${provider.yearsOfExperience} years experience` : 'Experience not provided'}
                                                    </p>
                                                    <p className="card-text">
                                                        <i className="fas fa-rupee-sign text-secondary me-2"></i>
                                                        {provider.hourlyRate ? `₹${provider.hourlyRate}/hour` : 'Rate not provided'}
                                                    </p>
                                                </div>

                                                <button 
                                                    className="btn btn-outline-primary w-100"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#providerModal"
                                                    onClick={() => {
                                                        // Set provider details in modal
                                                        document.getElementById('providerName').textContent = provider.userName || 'Not Provided';
                                                        document.getElementById('providerService').textContent = provider.service || 'Not Provided';
                                                        document.getElementById('providerExperience').textContent = provider.yearsOfExperience || 'Not Provided';
                                                        document.getElementById('providerRate').textContent = provider.hourlyRate || 'Not Provided';
                                                        document.getElementById('providerLocation').textContent = provider.location || 'Not Provided';
                                                        document.getElementById('providerContact').textContent = provider.mobileNumber || 'Not Provided';
                                                        document.getElementById('providerEmail').textContent = provider.email || 'Not Provided';
                                                    }}
                                                >
                                                    Show Info
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Provider Details Modal */}
            <div className="modal fade" id="providerModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title">Provider Details</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <h4 id="providerName" className="mb-4"></h4>
                            
                            <div className="mb-3">
                                <i className="fas fa-tools text-primary me-2"></i>
                                <strong>Service:</strong> <span id="providerService"></span>
                            </div>
                            
                            <div className="mb-3">
                                <i className="fas fa-briefcase text-primary me-2"></i>
                                <strong>Experience:</strong> <span id="providerExperience"></span> years
                            </div>
                            
                            <div className="mb-3">
                                <i className="fas fa-rupee-sign text-primary me-2"></i>
                                <strong>Hourly Rate:</strong> ₹<span id="providerRate"></span>
                            </div>
                            
                            <div className="mb-3">
                                <i className="fas fa-map-marker-alt text-primary me-2"></i>
                                <strong>Location:</strong> <span id="providerLocation"></span>
                            </div>
                            
                            <div className="mb-3">
                                <i className="fas fa-phone text-primary me-2"></i>
                                <strong>Contact:</strong> <span id="providerContact"></span>
                            </div>
                            
                            <div className="mb-3">
                                <i className="fas fa-envelope text-primary me-2"></i>
                                <strong>Email:</strong> <span id="providerEmail"></span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
