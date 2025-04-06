const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const path = require("path");
require('dotenv').config();
const app = express();

// Basic CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'https://service-hunt-react-1.onrender.com'],
    credentials: true
}));

// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React build directory in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../build')));
}

// Serve static files from the public and src directories
app.use(express.static(path.join(__dirname, '../public')));
app.use('/src', express.static(path.join(__dirname, '../src')));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Handle HTML routes by serving files from public directory
app.get('/*.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', req.path));
});

const conString = process.env.MONGO_URL;
if (!conString) {
    console.error("MongoDB connection string not found in environment variables!");
    process.exit(1);
}

// MongoDB connection setup
let dbClient = null;
let db = null;

async function connectDB() {
    try {
        if (!dbClient) {
            dbClient = await mongoClient.connect(conString);
            db = dbClient.db("serviceHunt");
            console.log("Successfully connected to MongoDB database: serviceHunt");
        }
        return db;
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        throw err;
    }
}

// API Routes
app.get("/providersInfo", async (req, res) => {
    try {
        const db = await connectDB();
        const providersInfo = await db.collection("providersInfo").find({}).toArray();
        res.json(providersInfo);
    } catch (err) {
        console.error("Error fetching providers info:", err);
        res.status(500).json({ error: "Failed to fetch providers info" });
    }
});

// Register user
app.post("/register-user", async (req, res) => {
    try {
        const db = await connectDB();

        // Validate required fields
        const { userName, email, password, mobile } = req.body;
        
        if (!userName || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "Missing required fields. Name, email and password are required." 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                success: false,
                message: "Password must be at least 6 characters long" 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid email format" 
            });
        }

        // Check if email already exists (case insensitive)
        const existingUser = await db.collection("providers").findOne({ 
            email: { $regex: new RegExp('^' + email + '$', 'i') }
        });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: "Email already exists" 
            });
        }

        // Register new user
        const user = {
            userName,
            email,
            password,
            mobile: mobile ? parseInt(mobile) : null
        };
        
        await db.collection("providers").insertOne(user);
        console.log("User Registered:", { email });

        res.json({ 
            success: true,
            message: "Registration successful",
            user: {
                userName: user.userName,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ 
            success: false, 
            message: "Failed to register user" 
        });
    }
});

// Get all providers (for login verification)
app.get("/providers", async (req, res) => {
    try {
        const db = await connectDB();
        const providers = await db.collection("providers").find({}).toArray();
        
        res.json({ 
            success: true,
            providers: providers.map(p => ({
                userName: p.userName,
                email: p.email
            }))
        });
    } catch (err) {
        console.error("Error fetching providers:", err);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch providers" 
        });
    }
});

// Create provider profile
app.post("/create-profile", async (req, res) => {
    try {
        const db = await connectDB();
        const { email, userName, mobileNumber, yearsOfExperience, hourlyRate, service, location } = req.body;

        // Validate required fields
        if (!email || !userName || !service || !location) {
            return res.status(400).json({ 
                success: false,
                message: "Missing required fields" 
            });
        }

        // Check if profile with the email already exists
        const existingProfile = await db.collection("providersInfo").findOne({ 
            email: { $regex: new RegExp('^' + email + '$', 'i') }
        });
        if (existingProfile) {
            return res.status(400).json({ 
                success: false,
                message: "Profile with this email already exists" 
            });
        }

        // Create profile
        const profile = {
            email,
            userName,
            mobileNumber,
            yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : 0,
            hourlyRate: hourlyRate ? parseInt(hourlyRate) : 0,
            service,
            location
        };

        await db.collection("providersInfo").insertOne(profile);
        console.log("Profile Created:", { email });

        res.json({ 
            success: true,
            message: "Profile created successfully",
            profile
        });
    } catch (err) {
        console.error("Error creating profile:", err);
        res.status(500).json({ 
            success: false,
            message: "Failed to create profile" 
        });
    }
});

// Get profile by Email
app.get("/get-profile/:email", async (req, res) => {
    try {
        const db = await connectDB();
        const email = req.params.email;

        const profile = await db.collection("providersInfo").findOne({ email });
        if (profile) {
            res.json({ 
                success: true,
                profile
            });
        } else {
            res.status(404).json({ 
                success: false,
                message: "Profile not found" 
            });
        }
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch profile" 
        });
    }
});
// Edit provider profile by Email
app.put("/edit-profile/:email", async (req, res) => {
    try {
        const db = await connectDB();
        const emailParam = req.params.email;
        const { userName, mobileNumber, yearsOfExperience, hourlyRate, service, location } = req.body;

        // Validate required fields
        if (!userName || !service || !location) {
            return res.status(400).json({ 
                success: false,
                message: "Missing required fields" 
            });
        }

        const profile = {
            userName,
            mobileNumber,
            yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : 0,
            hourlyRate: hourlyRate ? parseInt(hourlyRate) : 0,
            service,
            location
        };

        const result = await db.collection("providersInfo").updateOne(
            { email: emailParam },
            { $set: profile }
        );

        if (result.modifiedCount > 0) {
            res.json({ 
                success: true, 
                message: "Profile updated successfully", 
                profile: { ...profile, email: emailParam }
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: "Profile not found to update" 
            });
        }
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ 
            success: false, 
            message: "Error updating profile" 
        });
    }
});

// Get all provider profiles
app.get("/providersInfo", async (req, res) => {
    try {
        const db = await connectDB();
        const profiles = await db.collection("providersInfo").find({}).toArray();
        res.json({ 
            success: true,
            profiles
        });
    } catch (err) {
        console.error("Error fetching profiles:", err);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch profiles" 
        });
    }
});

// Get all service providers info for dashboard
app.get("/api/getAllProvidersInfo", async (req, res) => {
    try {
        const db = await connectDB();
        const providers = await db.collection("providersInfo").find({}).toArray();
        res.json({ 
            success: true,
            providers
        });
    } catch (err) {
        console.error("Error getting providers info:", err);
        res.status(500).json({ 
            success: false,
            message: "Failed to get providers info" 
        });
    }
});

// Get profiles by location
app.get("/get-profiles/:location", async (req, res) => {
    try {
        const db = await connectDB();
        const profiles = await db.collection("providersInfo")
            .find({ 
                location: { 
                    $regex: req.params.location, 
                    $options: 'i' 
                } 
            })
            .toArray();

        res.json({ 
            success: true,
            profiles
        });
    } catch (err) {
        console.error("Error fetching profiles by location:", err);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch profiles by location" 
        });
    }
});

// Get filtered providers based on service and location
app.get("/get-filtered-providers", async (req, res) => {
    try {
        const db = await connectDB();
        const { service, location } = req.query;

        let filter = {};

        // Apply service filter if provided
        if (service) {
            filter.service = service;
        }

        // Apply location filter if provided
        if (location) {
            filter.location = location;
        }

        const providers = await db.collection("providersInfo")
            .find(filter)
            .toArray();

        res.json({ 
            success: true,
            providers
        });
    } catch (err) {
        console.error("Error fetching filtered providers:", err);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch filtered providers" 
        });
    }
});

// Check if user ID exists
app.get("/users/:email", async (req, res) => {
    try {
        const db = await connectDB();
        const email = req.params.email;
        const users = await db.collection("providers").find({ email }).toArray();
        
        res.json({ 
            success: true,
            users,
            exists: users.length > 0
        });
    } catch (err) {
        console.error("Error checking user ID:", err);
        res.status(500).json({ 
            success: false,
            message: "Failed to check user ID" 
        });
    }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
    try {
        const db = await connectDB();
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "Email and password are required" 
            });
        }

        // Find user in providers collection (case insensitive email match)
        const user = await db.collection("providers").findOne({ 
            email: { $regex: new RegExp('^' + email + '$', 'i') }
        });

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Compare password (in a real app, use bcrypt or similar)
        if (user.password !== password) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        res.json({ 
            success: true, 
            message: "Login successful",
            user: {
                userName: user.userName,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Server error during login" 
        });
    }
});

// Handle React routing in production
app.get('*', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        res.sendFile(path.join(__dirname, '../build/index.html'));
    } else {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    }
});

// Catch-all route for serving index.html - MUST BE LAST
app.get("*", (req, res) => {
    // Only serve index.html for non-API routes
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    }
});

// Ensure database connection before starting the server
connectDB().then(() => {
    const PORT = process.env.PORT || 5678;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log('Node environment:', process.env.NODE_ENV);
        console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);
    });
}).catch(err => {
    console.error("Failed to start server:", err);
    process.exit(1); // Exit on database connection failure
});
