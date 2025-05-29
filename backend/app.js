const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health routes
app.get('/api/auth/health', (req, res) => {
    res.json({ message: 'Auth service is healthy' });
});

app.get('/api/shippers/health', (req, res) => {
    res.json({ message: 'Shipper service is healthy' });
});

app.get('/api/carriers/health', (req, res) => {
    res.json({ message: 'Carrier service is healthy' });
});

app.get('/api/loads/health', (req, res) => {
    res.json({ message: 'Load service is healthy' });
});

// Authentication endpoints
app.post('/api/auth/register', (req, res) => {
    const { email, password, userType } = req.body;
    
    // Basic validation
    if (!email || !password || !userType) {
        return res.status(400).json({
            error: 'Email, password, and userType are required'
        });
    }
    
    // Mock successful registration
    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: Math.floor(Math.random() * 1000000),
            email: email,
            userType: userType,
            createdAt: new Date().toISOString()
        }
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
        return res.status(400).json({
            error: 'Email and password are required'
        });
    }
    
    // Mock successful login
    res.json({
        message: 'User logged in successfully',
        token: 'mock_jwt_token_' + Date.now(),
        user: {
            id: Math.floor(Math.random() * 1000000),
            email: email,
            userType: 'shipper'
        }
    });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`LoadHive Backend Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/auth/health`);
});
