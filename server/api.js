const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const path = require("path");
require('dotenv').config();
const app = express();

// CORS configuration
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://service-hunt-react.onrender.com",
        "https://service-hunt.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: true,
    exposedHeaders: ['Access-Control-Allow-Origin']
}));

// Enable pre-flight requests for all routes
app.options('*', cors());

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
        const user = {
            UserId: parseInt(req.body.UserId),
            UserName: req.body.UserName,
            Email: req.body.Email,
            Password: req.body.Password,
            Mobile: parseInt(req.body.Mobile)
        };
        await db.collection("providers").insertOne(user);
        console.log("User Registered");
        res.json(user);
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ error: "Failed to register user" });
    }
});

// Get all providers (for login verification)
app.get("/providers", async (req, res) => {
    try {
        const db = await connectDB();
        const providers = await db.collection("providers").find({}).toArray();
        console.log("Providers data:", providers);
        res.json(providers);
    } catch (err) {
        console.error("Error fetching providers:", err);
        res.status(500).json({ error: "Error fetching providers" });
    }
});

// Create provider profile
app.post("/create-profile", async (req, res) => {
    try {
        const db = await connectDB();
        const profile = {
            UserName: req.body.UserName,
            Email: req.body.Email,
            MobileNumber: req.body.MobileNumber,
            YearsOfExperience: parseInt(req.body.YearsOfExperience),
            HourlyRate: parseInt(req.body.HourlyRate),
            Service: req.body.Service,
            Location: req.body.Location,
            UserId: parseInt(req.body.UserId),
        };
        await db.collection("providersInfo").insertOne(profile);
        console.log("Profile Created");
        res.send(profile);
    } catch (err) {
        console.error("Error creating profile:", err);
        res.status(500).json({ error: "Failed to create profile" });
    }
});

// Get profile by UserId
app.get("/get-profile/:UserId", async (req, res) => {
    try {
        const db = await connectDB();
        const profile = await db.collection("providersInfo").findOne({ 
            UserId: parseInt(req.params.UserId) 
        });
        
        if (profile) {
            res.json(profile);
        } else {
            res.status(404).json({ message: "Profile not found" });
        }
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

// Edit provider profile by UserId
app.put("/edit-profile/:UserId", async (req, res) => {
    try {
        const db = await connectDB();
        const profile = {
            UserName: req.body.UserName,
            Email: req.body.Email,
            MobileNumber: req.body.MobileNumber,
            YearsOfExperience: parseInt(req.body.YearsOfExperience),
            HourlyRate: parseInt(req.body.HourlyRate),
            Service: req.body.Service,
            Location: req.body.Location,
            UserId: parseInt(req.params.UserId)
        };

        await db.collection("providersInfo").updateOne(
            { UserId: parseInt(req.params.UserId) },
            { $set: profile }
        );
        console.log("Profile Updated");
        res.json({ success: true, message: "Profile updated successfully", profile });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ success: false, message: "Error updating profile", error: err });
    }
});

// Get all provider profiles
app.get("/providersInfo", async (req, res) => {
    try {
        const db = await connectDB();
        const profiles = await db.collection("providersInfo").find({}).toArray();
        console.log("Found profiles:", profiles);
        res.json(profiles);
    } catch (err) {
        console.error("Error fetching profiles:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Get all service providers info for dashboard
app.get("/api/getAllProvidersInfo", async (req, res) => {
    try {
        const db = await connectDB();
        const providersInfo = await db.collection("providersInfo").find({}).toArray();
        console.log("Service providers info:", providersInfo);
        res.json(providersInfo);
    } catch (err) {
        console.error("Error getting providers info:", err);
        res.status(500).json({ error: "Failed to get providers info" });
    }
});

// Get profiles by location
app.get("/get-profiles/:Location", async (req, res) => {
    try {
        const db = await connectDB();
        const profiles = await db.collection("providersInfo")
            .find({ 
                Location: { 
                    $regex: req.params.Location, 
                    $options: 'i' 
                } 
            })
            .toArray();
        res.json(profiles);
        console.log(profiles);
    } catch (err) {
        console.error("Error fetching profiles by location:", err);
        res.status(500).json({ error: "Failed to fetch profiles by location" });
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
            filter.Service = service;
        }

        // Apply location filter if provided
        if (location) {
            filter.Location = location;
        }

        const providers = await db.collection("providersInfo")
            .find(filter)
            .toArray();
        res.json(providers);
    } catch (err) {
        console.error("Error fetching filtered providers:", err);
        res.status(500).json({ error: "Failed to fetch filtered providers" });
    }
});

// Check if user ID exists
app.get("/users/:userId", async (req, res) => {
    try {
        const db = await connectDB();
        const userId = parseInt(req.params.userId);
        const user = await db.collection("providers").find({ UserId: userId }).toArray();
        res.json(user);
    } catch (err) {
        console.error("Error checking user ID:", err);
        res.status(500).json({ error: "Failed to check user ID" });
    }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
    try {
        const db = await connectDB();
        const { userId, password } = req.body;
        
        // Find user in providers collection
        const user = await db.collection("providers").findOne({ 
            UserId: parseInt(userId),
            Password: password
        });

        if (user) {
            res.json({ 
                success: true, 
                message: "Login successful",
                user: {
                    userId: user.UserId,
                    userName: user.UserName,
                    email: user.Email
                }
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }
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
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log('Node environment:', process.env.NODE_ENV);
        console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);
    });
}).catch(err => {
    console.error("Failed to start server:", err);
    process.exit(1); // Exit on database connection failure
});
