const express = require('express');
const logs = require('../controllers/WatchLogs/logs');
const alerts = require('../controllers/WatchLogs/alerts');

const router = express.Router();

// ✅ Optional: Add your auth middleware if needed
// const authMiddleware = require('../auth/authToken/authToken');

// ✅ Simple test
router.get('/', (req, res) => {
    res.json({
        status: true,
        message: '✅ Log router working!'
    });
});

// ----------------------
// 📁 LOGS ROUTES
// ----------------------

router.get('/all', logs.allLogs);
router.get('/recent', logs.recentLogs);
router.get('/view/:filename', logs.viewLog);

// ----------------------
// 📁 ALERTS ROUTES
// ----------------------

router.get('/alerts/all', alerts.allAlerts);
router.get('/alerts/recent', alerts.recentAlerts);
router.get('/alerts/view/:filename', alerts.viewAlert);

module.exports = router;
