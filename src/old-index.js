// This file contains the old jQuery code for reference
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://service-hunt-react-1.onrender.com';

function loadView(url, callback) {
    $.ajax({
        method: "get",
        url: API_URL + url,  // Prepend API_URL to load HTML files from the correct server
        success: (resp) => {
            $("section").html(resp);
            if (callback) callback();
        },
        error: (err) => {
            console.error("Error loading view:", err);
        }
    });
}

// Get user ID from cookies to determine if logged in
const email = $.cookie("email");

// Profile HTML template
// Profile HTML template with added Location field
const profileTemplate = (profile) =>
    `<div class="card shadow-sm border-0 mb-4">
        <div class="card-header bg-primary text-white py-3">
            <h5 class="card-title mb-0">
                <i class="fas fa-user-circle me-2"></i>Profile Information
            </h5>
        </div>
        <div class="card-body bg-light">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-user text-primary me-2"></i>
                        <div>
                            <small class="text-muted">Name</small>
                            <p class="mb-0 fw-bold">${profile.UserName}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-envelope text-primary me-2"></i>
                        <div>
                            <small class="text-muted">Email</small>
                            <p class="mb-0 fw-bold">${profile.Email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

// Check if user is logged in
if (email) {
    loadView("/provider-dashboard.html", function () {
        // Fetch the profile data and render it immediately
        $.ajax({
            url: API_URL + "/api/getProfile/" + email,
            method: "get",
            success: function (profile) {
                $("#profileContainer").html(profileTemplate(profile));
            },
            error: function (err) {
                console.error("Error fetching profile:", err);
            }
        });
    });
} else {
    loadView("/home.html");
}

// Register handler
$(document).on("click", "#btnRegister", () => {
    // const email = $("#txtEmail").val();
    const password = $("#txtPassword").val();
    const email = $("#txtEmail").val();

    $.ajax({
        url: API_URL + "/api/register",
        method: "post",
        data: {
            password,
            email
        },
        success: function (response) {
            if (response.success) {
                alert("Registration successful!");
                loadView("/login.html");
            } else {
                alert("User ID already exists!");
            }
        },
        error: function () {
            alert("Error during registration");
        }
    });
});

// Login handler
$(document).on("click", "#btnLogin", () => {
    const email = $("#txtEmail").val();
    const password = $("#txtPassword").val();

    $.ajax({
        url: API_URL + "/api/login",
        method: "post",
        data: {
            email,
            password
        },
        success: function (users) {
            if (users.length > 0) {
                $.cookie("email", email);
                loadView("/provider-dashboard.html");
            } else {
                alert("Invalid credentials");
            }
        }
    });
});

// Signout handler
$(document).on("click", "#btnSignout", () => {
    $.removeCookie("email");
    loadView("/login.html");
});

$(document).on("click", "#btnEdit", (e) => {
    e.preventDefault();
    const Email = $.cookie("email");

    $.ajax({
        url: API_URL + "/api/getProfile/" + Email,
        method: "get",
        success: function (profile) {
            loadView("/edit-profile.html", () => {
                $("#txtEditName").val(profile.UserName);
                $("#txtEditEmail").val(profile.Email);
                $("#txtEditMobileNumber").val(profile.MobileNumber);
                $("#txtEditYearsOfExperience").val(profile.YearsOfExperience);
                $("#txtEditHourlyRate").val(profile.HourlyRate);
                $("#selServices").val(profile.Service);
                $("#editCityTextbox").val(profile.Location);
            });
        },
        error: function (err) {
            console.error("Error fetching profile:", err);
        }
    });
});

$(document).on("click", "#btnSave", () => {
    const email = $.cookie("email");
    const profile = {
        Email,
        UserName: $("#txtEditName").val(),
        // Email: $("#txtEditEmail").val(),
        MobileNumber: $("#txtEditMobileNumber").val(),
        YearsOfExperience: $("#txtEditYearsOfExperience").val(),
        HourlyRate: $("#txtEditHourlyRate").val(),
        Service: $("#selServices").val(),
        Location: $("#editCityTextbox").val()
    };

    $.ajax({
        url: API_URL + "/api/updateProfile",
        method: "post",
        data: profile,
        success: function (response) {
            if (response.success) {
                alert("Profile updated successfully!");
                loadView("/provider-dashboard.html", () => {
                    $.ajax({
                        url: API_URL + "/api/getProfile/" + Email,
                        method: "get",
                        success: function (updatedProfile) {
                            $("#profileContainer").html(profileTemplate(updatedProfile));
                        },
                        error: function (err) {
                            console.error("Error fetching updated profile:", err);
                        }
                    });
                });
            } else {
                alert("Error updating profile");
            }
        },
        error: function (err) {
            console.error("Error updating profile:", err);
            alert("Error updating profile");
        }
    });
});

$(document).on("click", "#btnCancelEdit", () => {
    loadView("/provider-dashboard.html", () => {
        const Email = $.cookie("email");
        if (Email) {
            $.ajax({
                url: API_URL + "/api/getProfile/" + Email,
                method: "get",
                success: function (profile) {
                    $("#profileContainer").html(profileTemplate(profile));
                },
                error: function (err) {
                    console.error("Error fetching profile:", err);
                }
            });
        }
    });
});

// Load providers on user dashboard
$(document).on("click", "#btnLoadProviders", () => {
    $.ajax({
        url: API_URL + "/api/getAllProvidersInfo",
        method: "get",
        success: function (providersInfo) {
            const providersHtml = providersInfo.map(provider => `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${provider.UserName}</h5>
                            <p class="card-text">
                                <strong>Service:</strong> ${provider.Service}<br>
                                <strong>Experience:</strong> ${provider.YearsOfExperience} years<br>
                                <strong>Rate:</strong> ₹${provider.HourlyRate}/hr<br>
                                <strong>Location:</strong> ${provider.Location}
                            </p>
                            <button class="btn btn-primary book-service" data-provider-id="${provider.Email}">
                                Book Service
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            $("#providersContainer").html(providersHtml);
        },
        error: function (err) {
            console.error("Error fetching providers:", err);
            alert("Error loading providers");
        }
    });
});

// Book service button handler
$(document).on("click", ".book-service", function() {
    const providerId = $(this).data("provider-id");
    const email = $.cookie("email");

    $.ajax({
        url: API_URL + "/api/bookService",
        method: "post",
        data: { providerId, email },
        success: function (users) {
            if (users.success) {
                alert("Service booked successfully!");
                // Optionally refresh the providers list
                $("#btnLoadProviders").click();
            } else {
                alert("Error booking service");
            }
        }
    });
});

function showProviderDetails(provider) {
    $("#providerModal .modal-title").text(provider.UserName);
    $("#providerModal .modal-body").html(`
        <p><strong>Service:</strong> ${provider.Service}</p>
        <p><strong>Experience:</strong> ${provider.YearsOfExperience} years</p>
        <p><strong>Rate:</strong> ₹${provider.HourlyRate}/hr</p>
        <p><strong>Location:</strong> ${provider.Location}</p>
        <p><strong>Contact:</strong> ${provider.MobileNumber}</p>
        <p><strong>Email:</strong> ${provider.Email}</p>
    `);
    $("#providerModal").modal("show");
}

let allProviders = [];
let currentProviders = [];

// Filter Handlers
$(document).on("input", "#serviceFilter, #locationFilter, #experienceFilter, #rateFilter", () => {
    applyFilters();
});

$(document).on("click", "#applyFilters", () => {
    $.ajax({
        url: API_URL + "/api/getAllProvidersInfo",
        method: "get",
        success: function (providers) {
            allProviders = providers;
            currentProviders = [...providers];
            applyFilters();
        },
        error: function (err) {
            console.error("Error fetching providers:", err);
            alert("Error loading providers");
        }
    });
});

// Reset filters
$(document).on("click", "#resetFilters", () => {
    $("#serviceFilter").val("");
    $("#locationFilter").val("");
    $("#experienceFilter").val("");
    $("#rateFilter").val("");
    
    currentProviders = [...allProviders];
    displayProviders(currentProviders);
});

function loadProviders() {
    $.ajax({
        url: API_URL + "/api/getAllProvidersInfo",
        method: "get",
        success: function(providers) {
            allProviders = providers;
            currentProviders = [...providers];
            displayProviders(providers);
            
            // Populate service filter dropdown
            const services = [...new Set(providers.map(p => p.Service))];
            const serviceOptions = services.map(service => 
                `<option value="${service}">${service}</option>`
            ).join("");
            $("#serviceFilter").html(`<option value="">All Services</option>${serviceOptions}`);
        }
    });
}

// Function to apply all filters
function applyFilters() {
    const serviceFilter = $("#serviceFilter").val().toLowerCase();
    const locationFilter = $("#locationFilter").val().toLowerCase();
    const experienceFilter = parseInt($("#experienceFilter").val()) || 0;
    const rateFilter = parseInt($("#rateFilter").val()) || 0;

    currentProviders = allProviders.filter(provider => {
        return (!serviceFilter || provider.Service.toLowerCase().includes(serviceFilter)) &&
               (!locationFilter || provider.Location.toLowerCase().includes(locationFilter)) &&
               (!experienceFilter || provider.YearsOfExperience >= experienceFilter) &&
               (!rateFilter || provider.HourlyRate <= rateFilter);
    });

    displayProviders(currentProviders);
}

function displayProviders(providers) {
    const providersHtml = providers.map(provider => `
        <div class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">${provider.UserName}</h5>
                    <p class="card-text">
                        <strong>Service:</strong> ${provider.Service}<br>
                        <strong>Experience:</strong> ${provider.YearsOfExperience} years<br>
                        <strong>Rate:</strong> ₹${provider.HourlyRate}/hr<br>
                        <strong>Location:</strong> ${provider.Location}
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-primary book-service" data-provider-id="${provider.Email}">
                            Book Service
                        </button>
                        <button class="btn btn-info view-details" onclick="showProviderDetails(${JSON.stringify(provider)})">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join("");

    $("#providersContainer").html(providersHtml);
}

// Initial load
$(document).ready(function() {
    loadProviders();
});
