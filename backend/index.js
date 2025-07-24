const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const redisClient = require('./redis');

const admin = require('./routes/AdminRoutes');
const user = require('./routes/UserRoutes');
const logs = require('./routes/LogsRoutes');

const app = express();
const port = process.env.PORT || 8080;

// Ensure logs folder exists
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Helper: alert logger
function logAlert(message) {
    const date = new Date().toISOString().split('T')[0];
    const alertLogPath = path.join(logDir, `alert-${date}.log`);
    const entry = `${new Date().toISOString()} - ALERT: ${message}\n`;

    fs.appendFile(alertLogPath, entry, (err) => {
        if (err) console.error('Error writing to alert log:', err);
    });

    console.warn(entry.trim());
}

// Trust proxy
app.set('trust proxy', 1);

// Security headers
app.use(helmet({ crossOriginResourcePolicy: false }));

// CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400
}));

// Body parsing
app.use(bodyParser.json({ limit: '4mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Logging middleware: request + status only — no response body
app.use(async (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const timestamp = new Date().toISOString();
    const baseLog = `${timestamp} - ${req.method} ${req.url} - IP: ${ip}`;

    console.log(baseLog);

    try {
        const trackKey = `ip-track:${ip}`;
        await redisClient.incr(trackKey);
    } catch (err) {
        console.error('Redis track error:', err);
    }

    res.on('finish', () => {
        const status = res.statusCode;
        const finalLog = `${baseLog} - STATUS: ${status}\n`;

        const date = new Date().toISOString().split('T')[0];
        const logFilePath = path.join(logDir, `api-${date}.log`);
        fs.appendFile(logFilePath, finalLog, (err) => {
            if (err) console.error('Error writing to api log:', err);
        });

        console.log(finalLog.trim());
    });

    next();
});

// IP throttling middleware
app.use(async (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `ip-limit:${ip}`;
    const limit = 100;
    const windowSeconds = 15 * 60;

    try {
        const current = await redisClient.incr(key);
        if (current === 1) {
            await redisClient.expire(key, windowSeconds);
        }

        if (current > limit) {
            logAlert(`IP ${ip} exceeded rate limit with ${current} requests`);
            return res.status(429).json({
                error: true,
                message: 'Too many requests from this IP. Try again later.'
            });
        }
    } catch (err) {
        console.error('Redis rate limiter error:', err);
        logAlert(`Rate limiter Redis error for IP ${ip}: ${err.message}`);
        return res.status(500).json({ error: true, message: 'Internal server error' });
    }

    next();
});

// Additional security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Test route
app.get('/', (req, res) => {
    res.json({ status: true, message: 'API running with daily logs & alerts!' });
});

// Example test route for 401 / 500
app.get('/test/unauthorized', (req, res) => {
    res.status(401).json({ message: 'Unauthorized test' });
});
app.get('/test/error', (req, res) => {
    throw new Error('Server crash test');
});

// IP stats route
app.get('/api/stats/ips', async (req, res) => {
    try {
        const keys = await redisClient.keys('ip-track:*');
        const data = [];

        for (const key of keys) {
            const count = await redisClient.get(key);
            const ip = key.split(':')[1];
            data.push({ ip, count: parseInt(count, 10) });
        }

        res.json({ status: true, data, message: 'IP tracking data' });
    } catch (err) {
        console.error('Redis stats error:', err);
        logAlert(`Redis stats error: ${err.message}`);
        res.status(500).json({ error: true, message: 'Could not fetch IP stats' });
    }
});

// Routes
app.use('/api/log', logs);
app.use('/api/admin', admin);
app.use('/api/user', user);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: true, message: 'Route not found' });
});

// Generic error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    logAlert(`Server error on ${req.method} ${req.url} - ${err.message}`);
    res.status(500).json({ error: true, message: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
