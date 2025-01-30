import React from 'react';

function ProfileTemplate({ profile }) {
    return (
        <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-5">
                <div className="text-center mb-5">
                    <div className="display-1 text-primary mb-3">
                        <i className="fas fa-user-circle"></i>
                    </div>
                    <h2 className="card-title mb-0">{profile.UserName}</h2>
                    <p className="text-muted">{profile.Service} Service Provider</p>
                </div>

                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="p-4 rounded-4 bg-light">
                            <h4 className="mb-3">Contact Information</h4>
                            <div className="mb-3">
                                <i className="fas fa-envelope text-primary me-2"></i>
                                <strong>Email:</strong>
                                <p className="ms-4 mb-0">{profile.Email}</p>
                            </div>
                            <div className="mb-3">
                                <i className="fas fa-phone text-primary me-2"></i>
                                <strong>Mobile:</strong>
                                <p className="ms-4 mb-0">{profile.MobileNumber}</p>
                            </div>
                            <div className="mb-0">
                                <i className="fas fa-map-marker-alt text-primary me-2"></i>
                                <strong>Location:</strong>
                                <p className="ms-4 mb-0">{profile.Location || "Not Provided"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="p-4 rounded-4 bg-light">
                            <h4 className="mb-3">Service Details</h4>
                            <div className="mb-3">
                                <i className="fas fa-tools text-primary me-2"></i>
                                <strong>Service Type:</strong>
                                <p className="ms-4 mb-0">{profile.Service}</p>
                            </div>
                            <div className="mb-3">
                                <i className="fas fa-briefcase text-primary me-2"></i>
                                <strong>Experience:</strong>
                                <p className="ms-4 mb-0">{profile.YearsOfExperience} years</p>
                            </div>
                            <div className="mb-0">
                                <i className="fas fa-rupee-sign text-primary me-2"></i>
                                <strong>Hourly Rate:</strong>
                                <p className="ms-4 mb-0">₹{profile.HourlyRate}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileTemplate;
